from fastapi import APIRouter, Depends, HTTPException
from database import get_database, settings
from motor.motor_asyncio import AsyncIOMotorDatabase
import httpx

router = APIRouter()

@router.get("/me")
async def get_my_passport(hustler_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    profile = await db.hustler_profiles.find_one({"user_id": hustler_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Hustler profile not found")
    return profile

@router.post("/voice-session")
async def start_voice_session(hustler_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Fetch Hustler data
    profile = await db.hustler_profiles.find_one({"user_id": hustler_id})
    # For demo purposes, create a profile if not found
    if not profile:
        profile = {"trust_score": 820, "completed_jobs": 15}
    
    # Call Aethex /conversation/connect
    async with httpx.AsyncClient() as client:
        headers = {"X-API-Key": settings.AETHEX_API_KEY, "Content-Type": "application/json"}
        payload = {
            "agent_id": settings.AETHEX_PASSPORT_AGENT_ID,
            "metadata": {
                "hustler_id": hustler_id,
                "trust_score": profile.get("trust_score"),
                "completed_jobs": profile.get("completed_jobs")
            }
        }
        response = await client.post(f"{settings.AETHEX_BASE_URL}/conversation/connect", json=payload, headers=headers)
        
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
            headers=headers
        )
        return response.json()

@router.post("/demo/complete-job-sweep")
async def demo_complete_job_sweep(hustler_id: str, job_amount: float = 5000.0, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    SPECIAL DEMO ENDPOINT: Simulates the Phase 3 'Wow Moment'.
    Returns the breakdown for the wallet sweep animation.
    """
    # 1. Mock the calculation
    sweep_percentage = 0.20 # 20%
    sweep_amount = job_amount * sweep_percentage
    final_payout = job_amount - sweep_amount
    
    # 2. In a real app, we would update the Loan balance and Transaction log here.
    # For the demo, we return the structured data the frontend needs for the animation.
    return {
        "hustler_id": hustler_id,
        "event": "JOB_COMPLETED_ESCROW_RELEASED",
        "breakdown": {
            "gross_received": job_amount,
            "loan_sweep_deduction": sweep_amount,
            "net_credited_to_wallet": final_payout
        },
        "animation_sequence": [
            {"label": "Escrow Released", "value": job_amount, "color": "green"},
            {"label": "Loan Sweep (20%)", "value": -sweep_amount, "color": "red"},
            {"label": "Final Wallet Credit", "value": final_payout, "color": "blue"}
        ],
        "new_loan_balance_mock": 39000.0 # From the PRD narrative
    }
