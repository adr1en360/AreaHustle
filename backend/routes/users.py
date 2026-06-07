from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import HustlerProfile, HustlerProfileCreate
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from bson import ObjectId

router = APIRouter()


@router.post("/hustler-profile", status_code=status.HTTP_201_CREATED)
async def create_hustler_profile(
    profile: HustlerProfileCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "hustler":
        raise HTTPException(status_code=403, detail="Only hustlers can create a hustler profile")

    user_id = str(current_user.get("_id"))
    existing = await db.hustler_profiles.find_one({"user_id": user_id})
    if existing:
        raise HTTPException(status_code=400, detail="Hustler profile already exists")

    new_profile = HustlerProfile(
        user_id=user_id,
        service_areas=profile.service_areas,
        categories=profile.categories,
    )
    result = await db.hustler_profiles.insert_one(new_profile.dict(by_alias=True, exclude={"id"}))
    return {"id": str(result.inserted_id)}


@router.get("/hustler-profile")
async def get_my_hustler_profile(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    profile = await db.hustler_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Hustler profile not found")
    profile["_id"] = str(profile["_id"])
    return profile


@router.put("/hustler-profile")
async def update_hustler_profile(
    updates: HustlerProfileCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    result = await db.hustler_profiles.update_one(
        {"user_id": user_id},
        {"$set": {
            "service_areas": updates.service_areas,
            "categories": updates.categories,
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Hustler profile not found")
    return {"message": "Profile updated"}


@router.get("/nearby-hustlers")
async def list_nearby_hustlers(
    neighbourhood: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cursor = db.hustler_profiles.find({"service_areas": neighbourhood}).sort("trust_score", -1)
    profiles = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        profiles.append(doc)
    return profiles


@router.post("/wallet/update")
async def update_wallet(
    payload: dict,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    amount = float(payload.get("amount", 0.0))
    user_id = str(current_user.get("_id"))
    
    # Update balance
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"wallet_balance": amount}}
    )
    
    # Record transaction log
    from datetime import datetime
    tx_type = "topup" if amount > 0 else "withdrawal"
    await db.transactions.insert_one({
        "user_id": user_id,
        "type": tx_type,
        "amount": abs(amount),
        "desc": f"Demo {tx_type.capitalize()}",
        "location": "Lekki Phase 1",
        "timestamp": datetime.utcnow()
    })
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return {"wallet_balance": updated_user.get("wallet_balance", 0.0)}
