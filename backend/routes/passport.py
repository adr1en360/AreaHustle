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
    # 1. Fetch Hustler data to inject into context (or use Aethex Dynamic Variables)
    profile = await db.hustler_profiles.find_one({"user_id": hustler_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Hustler profile not found")
    
    # 2. Call Aethex /conversation/connect
    async with httpx.AsyncClient() as client:
        headers = {"X-API-Key": settings.AETHEX_API_KEY, "Content-Type": "application/json"}
        payload = {
            "agent_id": settings.AETHEX_PASSPORT_AGENT_ID,
            # We can use metadata to pass hustler context to the agent
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
