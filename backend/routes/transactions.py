from fastapi import APIRouter, Depends
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_my_transactions(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    cursor = db.transactions.find({"user_id": user_id}).sort("timestamp", -1).limit(100)
    txs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        txs.append(doc)
    return txs
