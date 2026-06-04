from fastapi import APIRouter, Depends, HTTPException
from database import get_database, settings
from motor.motor_asyncio import AsyncIOMotorDatabase
import httpx
from routes.auth import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.get("/me")
async def get_my_passport(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    profile = await db.hustler_profiles.find_one({"user_id": user_id})

    if not profile:
        # Seed fallback for demo if profile missing
        profile = {"trust_score": 820, "completed_jobs": 15}

    return {
        "user_id": user_id,
        "name": user.get("name", ""),
        "wallet_balance": user.get("wallet_balance", 0.0),
        "trust_score": profile.get("trust_score", 500),
        "completed_jobs": profile.get("completed_jobs", 0),
        "completion_rate": profile.get("completion_rate", 0.0),
        "service_areas": profile.get("service_areas", []),
        "categories": profile.get("categories", []),
    }


@router.post("/voice-session")
async def start_voice_session(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    profile = await db.hustler_profiles.find_one({"user_id": user_id})
    if not profile:
        profile = {"trust_score": 820, "completed_jobs": 15}

    async with httpx.AsyncClient() as client:
        headers = {"X-API-Key": settings.AETHEX_API_KEY, "Content-Type": "application/json"}
        payload = {
            "agent_id": settings.AETHEX_PASSPORT_AGENT_ID,
            "metadata": {
                "hustler_id": user_id,
                "trust_score": profile.get("trust_score"),
                "completed_jobs": profile.get("completed_jobs"),
            },
        }
        response = await client.post(
            f"{settings.AETHEX_BASE_URL}/conversation/connect",
            json=payload,
            headers=headers,
        )

        if response.status_code != 201:
            raise HTTPException(status_code=response.status_code, detail=f"Aethex connection failed: {response.text}")

        return response.json()


@router.post("/voice-session/{session_id}/offer")
async def proxy_offer(session_id: str, sdp_data: dict):
    """
    Proxies the WebRTC SDP offer from the browser to Aethex API.
    """
    async with httpx.AsyncClient() as client:
        headers = {"X-API-Key": settings.AETHEX_API_KEY, "Content-Type": "application/json"}
        response = await client.post(
            f"{settings.AETHEX_BASE_URL}/conversation/{session_id}/offer",
            json=sdp_data,
            headers=headers,
        )
        return response.json()


@router.post("/demo/complete-job-sweep")
async def demo_complete_job_sweep(
    job_amount: float = 5000.0,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    """
    SPECIAL DEMO ENDPOINT: Simulates the Phase 3 'Wow Moment'.
    Now persists the loan sweep and transaction to the database.
    """
    user_id = str(current_user.get("_id"))
    sweep_percentage = 0.20
    sweep_amount = job_amount * sweep_percentage
    final_payout = job_amount - sweep_amount

    # 1. Update or create a mock loan for the hustler
    loan = await db.loans.find_one({"hustler_id": user_id, "status": "active"})
    if loan:
        new_balance = max(0.0, loan["outstanding_balance"] - sweep_amount)
        await db.loans.update_one(
            {"_id": loan["_id"]},
            {"$set": {"outstanding_balance": new_balance}},
        )
        loan_id = str(loan["_id"])
    else:
        # Seed a loan if none exists so the demo works end-to-end
        loan_doc = {
            "hustler_id": user_id,
            "mfb_partner_id": "mock_mfb_partner",
            "principal": 50000.0,
            "outstanding_balance": 39000.0,
            "sweep_percentage": sweep_percentage,
            "status": "active",
            "issued_at": datetime.utcnow(),
        }
        result = await db.loans.insert_one(loan_doc)
        loan_id = str(result.inserted_id)
        new_balance = 39000.0

    # 2. Record transactions
    transactions = [
        {
            "user_id": user_id,
            "type": "payout",
            "amount": final_payout,
            "timestamp": datetime.utcnow(),
        },
        {
            "user_id": user_id,
            "loan_id": loan_id,
            "type": "loan_sweep",
            "amount": -sweep_amount,
            "timestamp": datetime.utcnow(),
        },
    ]
    await db.transactions.insert_many(transactions)

    # 3. Update user wallet
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"wallet_balance": final_payout}},
    )

    # 4. Update hustler stats
    await db.hustler_profiles.update_one(
        {"user_id": user_id},
        {
            "$inc": {"completed_jobs": 1, "trust_score": 5},
            "$set": {"completion_rate": 0.98},
        },
        upsert=True,
    )

    return {
        "hustler_id": user_id,
        "event": "JOB_COMPLETED_ESCROW_RELEASED",
        "breakdown": {
            "gross_received": job_amount,
            "loan_sweep_deduction": sweep_amount,
            "net_credited_to_wallet": final_payout,
        },
        "animation_sequence": [
            {"label": "Escrow Released", "value": job_amount, "color": "green"},
            {"label": "Loan Sweep (20%)", "value": -sweep_amount, "color": "red"},
            {"label": "Final Wallet Credit", "value": final_payout, "color": "blue"},
        ],
        "new_loan_balance": new_balance,
    }


@router.get("/transactions")
async def list_transactions(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    cursor = db.transactions.find({"user_id": user_id}).sort("timestamp", -1).limit(50)
    txs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        txs.append(doc)
    return txs
