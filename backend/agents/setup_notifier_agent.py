"""
setup_notifier_agent.py
========================
One-time script to create a fresh Aethex agent for the AreaHustle
hustler notification queue.

Run this ONCE from the backend directory:

    python agents/setup_notifier_agent.py

It will:
  1. Create a new Aethex agent (hustler notification voice agent)
  2. Register the `accept_job` tool on it pointing at your callback URL
  3. Print the new agent ID

Copy the printed ID into your .env as AETHEX_NOTIFIER_AGENT_ID.

Prerequisites (set in .env before running):
  - AETHEX_API_KEY
  - AETHEX_FROM_NUMBER   (your registered Twilio number in E.164 format)
  - AH_CALLBACK_URL      (your public backend URL, e.g. https://xyz.ngrok.io)
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load .env from the backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AETHEX_API_KEY = os.environ.get("AETHEX_API_KEY", "")
_raw_callback  = os.environ.get("AH_CALLBACK_URL", "").rstrip("/")
BASE_URL = "https://api.aethexai.com/api/v1"

# Always use only scheme + netloc — ignore any path the user put in AH_CALLBACK_URL
def _base_url(url: str) -> str:
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}" if p.netloc else url

AH_CALLBACK_BASE = _base_url(_raw_callback)  # e.g. https://xyz.ngrok.io

HEADERS = {
    "X-API-Key": AETHEX_API_KEY,
    "Content-Type": "application/json",
}


def check_env():
    missing = []
    if not AETHEX_API_KEY:
        missing.append("AETHEX_API_KEY")
    if not _raw_callback:
        missing.append("AH_CALLBACK_URL")
    if missing:
        print(f"[ERROR] Missing required env vars: {', '.join(missing)}")
        print("Set them in backend/.env and retry.")
        sys.exit(1)


def create_agent() -> dict:
    print("[1/2] Creating Aethex hustler-notification agent...")

    # Nigerian voice UUIDs (from GET /voices — use UUID, NOT the display name)
    # Male   | Standard   : Segun   93c0d2e1-61b2-51d5-8d92-a8adfef1a4ea
    # Male   | Standard   : Femi    5c34046a-ac9b-57d5-8c70-5a61e694be3f
    # Male   | Standard   : Sunday  6cdade1e-41d3-52cd-bf99-7e6822758b10
    # Male   | Standard   : Chinedu fdf12da6-fc5c-56d3-bdc5-9f3da0b65453
    # Female | Standard   : Kemi    8466fb57-9f6b-53ad-ba5a-9729617f761c
    # Female | Standard   : Tolu    96b20f06-536a-55ef-82c3-4882b6547858
    # Female | Standard   : Deborah cb4ea7ea-027b-532a-b7de-356c6887a5f3
    # Female | Standard   : Fatima  37449a6f-a93c-583d-80da-d005cb0b542b
    # Male   | Pidgin     : Femi    b0290b0f-85fd-5cae-aec8-f795135d6aa9
    # Female | Pidgin     : Tolu    0d1ec49c-5ea6-5eb1-938b-5aff67ada4ad
    VOICE_ID = "93c0d2e1-61b2-51d5-8d92-a8adfef1a4ea"  # Segun — Nigerian male, standard

    system_prompt = """
You are Hustle AI, a smart job dispatcher for the AreaHustle gig platform in Lagos.

Your job is to call a service provider (called a Hustler) and offer them a job.
Be friendly, brief, and clear. Speak naturally in conversational Nigerian English.

When you connect:
1. Greet the Hustler by name if you have it, then state the job offer clearly:
   - Job type (e.g. Car Wash, Generator Service)
   - Location / neighbourhood
   - Budget in naira
2. Ask: "Would you like to accept this job?"
3. If they say YES, agree, or confirm → immediately call the accept_job tool.
4. If they say NO, decline, or don't respond clearly → politely say goodbye and end the call.
5. Keep the whole call under 90 seconds. Do not discuss anything outside the job offer.
6. Do NOT make up job details. Use only what is in your first_message context.
""".strip()

    payload = {
        "name": "AreaHustle Job Dispatcher",
        "system_prompt": system_prompt,
        "voice_id": VOICE_ID,
        "language": "english",
        "temperature": 0.4,
        "max_tokens": 150,
        "max_duration_seconds": 120,
    }

    resp = requests.post(f"{BASE_URL}/agents", headers=HEADERS, json=payload)

    if resp.status_code not in (200, 201):
        print(f"[ERROR] Failed to create agent: {resp.status_code}")
        print(resp.text)
        sys.exit(1)

    agent = resp.json()
    print(f"  ✓ Agent created: id={agent['id']}")
    return agent


def register_accept_job_tool(agent_id: str) -> dict:
    print("[2/2] Registering accept_job tool on the agent...")

    # Build callback URL from base domain only — never from AH_CALLBACK_URL directly
    # (AH_CALLBACK_URL may contain a path; we only want the scheme+host)
    callback_url = f"{AH_CALLBACK_BASE}/api/v1/tasks/agent-callback"
    print(f"  → Callback URL: {callback_url}")

    payload = {
        "name": "accept_job",
        "description": (
            "Call this tool ONLY when the hustler clearly says yes, "
            "agrees, or confirms they want to accept the job. "
            "Do NOT call it for uncertain or partial responses."
        ),
        "parameters_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
        "endpoint_url": callback_url,
    }

    resp = requests.post(
        f"{BASE_URL}/agents/{agent_id}/tools",
        headers=HEADERS,
        json=payload,
    )

    if resp.status_code not in (200, 201):
        print(f"[ERROR] Failed to register tool: {resp.status_code}")
        print(resp.text)
        sys.exit(1)

    tool = resp.json()
    print(f"  ✓ Tool registered: name=accept_job → {callback_url}")
    return tool


def main():
    check_env()

    agent = create_agent()
    register_accept_job_tool(agent["id"])

    print()
    print("=" * 60)
    print("SUCCESS — add this to your backend/.env:")
    print()
    print(f'AETHEX_NOTIFIER_AGENT_ID="{agent["id"]}"')
    print("=" * 60)
    print()
    print("Full agent record:")
    print(json.dumps(agent, indent=2))


if __name__ == "__main__":
    main()
