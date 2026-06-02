from fastapi import APIRouter, Depends
from models import User
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/onboarding")
async def onboard_user(user: User, db: AsyncIOMotorDatabase = Depends(get_database)):
    new_user = await db.users.insert_one(user.dict(by_alias=True, exclude={"id"}))
    return {"id": str(new_user.inserted_id)}
