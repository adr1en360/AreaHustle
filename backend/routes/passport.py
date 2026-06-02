from fastapi import APIRouter, Depends
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/me")
async def get_my_passport(hustler_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Conversational voice interface via Aethex
    # Returns trust score and financial standing
    profile = await db.hustler_profiles.find_one({"user_id": hustler_id})
    return profile
