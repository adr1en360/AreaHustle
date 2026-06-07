"""
hustler_notifier.py
====================
AI Agent: Outbound Hustler Notification Queue

PRD Reference: Pillar 2 — AI Agent Notifications (Queue + Timeout Matching)
Endpoint triggered by: POST /api/v1/tasks/notify-hustlers/{task_id}
Accept callback at:    POST /api/v1/tasks/agent-callback  (called by Aethex tool)

Flow (per PRD_V2.md §5, Pillar 2):
1. Task published → this module is called.
2. Query eligible hustlers: service_area includes task.neighbourhood, ranked by trust_score.
3. AI makes an outbound voice call to Hustler #1 via Aethex POST /calls/trigger.
4. Agent speaks: "Hi [name], there's a [category] job in [neighbourhood] for [budget] naira.
   Would you like to accept?"
5. If hustler says YES → Aethex fires the accept_job tool → our /agent-callback endpoint
   matches the task immediately, preventing race conditions.
6. If NO / no answer (2-min timeout) → try Hustler #2.
7. Max 5 attempts. If none accept → restore task to "open".

Required .env vars:
  AETHEX_API_KEY
  AETHEX_NOTIFIER_AGENT_ID   (from agents/setup_notifier_agent.py)
  AETHEX_FROM_NUMBER         (registered Twilio number in E.164)
  AH_CALLBACK_URL            (public backend URL for the accept_job tool webhook)
"""

import asyncio
import logging
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from database import settings

logger = logging.getLogger(__name__)

AETHEX_BASE = "https://api.aethexai.com/api/v1"
POLL_INTERVAL_SECONDS = 5
CALL_TIMEOUT_SECONDS = 120  # 2-minute timeout per hustler per PRD
MAX_ATTEMPTS = 5

TERMINAL_STATUSES = {"completed", "failed", "no-answer", "busy", "canceled"}


def _headers() -> dict:
    return {
        "X-API-Key": settings.AETHEX_API_KEY,
        "Content-Type": "application/json",
    }


# ---------------------------------------------------------------------------
# Aethex API helpers
# ---------------------------------------------------------------------------

async def _trigger_call(to_number: str, task_id: str, hustler_id: str) -> dict:
    """
    POST /calls/trigger — returns the queued call record (202 Accepted).
    Stores task_id and hustler_id in metadata so the callback can look them up.
    """
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{AETHEX_BASE}/calls/trigger",
            headers=_headers(),
            json={
                "agent_id": settings.AETHEX_NOTIFIER_AGENT_ID,
                "to_number": to_number,
                "from_number": settings.AETHEX_FROM_NUMBER,
                "metadata": {
                    "task_id": task_id,
                    "hustler_id": hustler_id,
                },
            },
        )
        resp.raise_for_status()
        return resp.json()


async def _poll_call_status(call_id: str) -> str:
    """
    GET /calls/{id}/status — polls every POLL_INTERVAL_SECONDS until a
    terminal status is reached or CALL_TIMEOUT_SECONDS elapses.
    Returns the final status string (or "timeout").
    """
    elapsed = 0
    async with httpx.AsyncClient(timeout=15) as client:
        while elapsed < CALL_TIMEOUT_SECONDS:
            try:
                resp = await client.get(
                    f"{AETHEX_BASE}/calls/{call_id}/status",
                    headers=_headers(),
                )
                data = resp.json()
                status = data.get("status", "")
                logger.debug("Call %s status: %s (elapsed %ds)", call_id, status, elapsed)
                if status in TERMINAL_STATUSES:
                    return status
            except Exception as e:
                logger.warning("Status poll error for %s: %s", call_id, e)

            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            elapsed += POLL_INTERVAL_SECONDS

    return "timeout"


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------

async def _store_pending_call(
    db: AsyncIOMotorDatabase, call_id: str, task_id: str, hustler_id: str
):
    """
    Persist the in-flight call so the /agent-callback endpoint can resolve
    task_id + hustler_id from the call_id Aethex sends in the tool payload.
    """
    await db.pending_calls.insert_one(
        {
            "call_id": call_id,
            "task_id": task_id,
            "hustler_id": hustler_id,
            "status": "waiting",
            "created_at": datetime.now(timezone.utc),
        }
    )


async def _mark_pending_call_done(db: AsyncIOMotorDatabase, call_id: str):
    await db.pending_calls.update_one(
        {"call_id": call_id}, {"$set": {"status": "done"}}
    )


async def _task_already_matched(db: AsyncIOMotorDatabase, task_id: str) -> bool:
    """Return True if the accept_job callback already matched this task."""
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    return task is not None and task.get("status") == "matched"


async def _get_eligible_hustlers(db: AsyncIOMotorDatabase, task: dict) -> list:
    """
    Query hustler_profiles whose service_areas include the task neighbourhood,
    then join with users to get phone numbers. Returns list of user dicts
    sorted by trust_score descending, limited to MAX_ATTEMPTS.
    """
    neighbourhood = task.get("neighbourhood", "")
    cursor = (
        db.hustler_profiles.find({"service_areas": neighbourhood})
        .sort("trust_score", -1)
        .limit(MAX_ATTEMPTS)
    )
    profiles = await cursor.to_list(length=MAX_ATTEMPTS)

    hustlers = []
    for profile in profiles:
        user = await db.users.find_one({"_id": ObjectId(profile["user_id"])})
        if user and user.get("phone_number"):
            user["_profile"] = profile  # attach profile for logging
            hustlers.append(user)

    return hustlers


# ---------------------------------------------------------------------------
# Main queue runner
# ---------------------------------------------------------------------------

async def run_notification_queue(task_id: str, db: AsyncIOMotorDatabase):
    """
    Entry point called by POST /api/v1/tasks/notify-hustlers/{task_id}.
    Runs the full call queue in the background (use asyncio.create_task).
    """
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        logger.error("Notification queue: task %s not found", task_id)
        return

    if task.get("status") != "open":
        logger.info("Notification queue: task %s not open (status=%s), skipping",
                    task_id, task.get("status"))
        return

    hustlers = await _get_eligible_hustlers(db, task)
    if not hustlers:
        logger.info("Notification queue: no eligible hustlers for task %s", task_id)
        return

    logger.info(
        "Notification queue: task=%s neighbourhood=%s — %d eligible hustler(s)",
        task_id, task.get("neighbourhood"), len(hustlers),
    )

    # Mark as "matching" so customers see progress and manual accepts are blocked
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "matching", "match_attempts": 0}},
    )

    matched = False

    for attempt, hustler in enumerate(hustlers, start=1):
        hustler_id = str(hustler["_id"])
        hustler_name = hustler.get("name", "there")
        phone = hustler.get("phone_number")
        profile = hustler.get("_profile", {})

        logger.info(
            "[Attempt %d/%d] Calling hustler %s (%s) for task %s",
            attempt, MAX_ATTEMPTS, hustler_name, phone, task_id,
        )

        # Build the per-call first_message dynamically
        # Aethex reads this as the agent's opening line
        first_message = (
            f"Hi {hustler_name}, this is Hustle AI calling from AreaHustle. "
            f"There's a {task.get('category', 'job')} job in "
            f"{task.get('neighbourhood', 'your area')} "
            f"for {int(task.get('budget', 0)):,} naira. "
            f"Would you like to accept it?"
        )

        # Patch the agent's first_message before placing the call so it's personalised.
        # This is a fast PATCH that takes effect immediately for the next call.
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                await client.patch(
                    f"{AETHEX_BASE}/agents/{settings.AETHEX_NOTIFIER_AGENT_ID}",
                    headers=_headers(),
                    json={"first_message": first_message},
                )
        except Exception as e:
            logger.warning("Could not patch agent first_message: %s", e)

        # Trigger the call
        try:
            call_record = await _trigger_call(phone, task_id, hustler_id)
        except httpx.HTTPStatusError as e:
            logger.error("Failed to trigger call for hustler %s: %s", hustler_id, e)
            continue

        call_id = call_record["id"]
        await _store_pending_call(db, call_id, task_id, hustler_id)

        # Increment attempt counter on task
        await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$inc": {"match_attempts": 1}},
        )

        # Poll until terminal state or timeout
        final_status = await _poll_call_status(call_id)
        logger.info(
            "Call %s finished with status=%s for hustler %s",
            call_id, final_status, hustler_id,
        )
        await _mark_pending_call_done(db, call_id)

        # Check if the accept_job tool callback already matched the task
        if await _task_already_matched(db, task_id):
            logger.info("Task %s matched via agent callback on attempt %d", task_id, attempt)
            matched = True
            break

    # If nobody accepted, restore task to open for manual feed browsing
    if not matched:
        logger.info(
            "Notification queue exhausted for task %s — restoring to open", task_id
        )
        await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "open"}},
        )
