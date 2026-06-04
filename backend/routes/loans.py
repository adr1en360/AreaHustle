from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from bson import ObjectId
from datetime import datetime
from models import LoanCreate

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_loan(
    loan: LoanCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "hustler":
        raise HTTPException(status_code=403, detail="Only hustlers can take loans")

    user_id = str(current_user.get("_id"))
    existing = await db.loans.find_one({"hustler_id": user_id, "status": "active"})
    if existing:
        raise HTTPException(status_code=400, detail="Active loan already exists")

    loan_doc = {
        "hustler_id": user_id,
        "mfb_partner_id": "mock_mfb_partner",
        "principal": loan.principal,
        "outstanding_balance": loan.principal,
        "sweep_percentage": loan.sweep_percentage,
        "status": "active",
        "issued_at": datetime.utcnow(),
    }
    result = await db.loans.insert_one(loan_doc)
    return {"id": str(result.inserted_id)}


@router.get("/")
async def list_my_loans(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    cursor = db.loans.find({"hustler_id": user_id}).sort("issued_at", -1)
    loans = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        loans.append(doc)
    return loans


@router.get("/active")
async def get_active_loan(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    loan = await db.loans.find_one({"hustler_id": user_id, "status": "active"})
    if not loan:
        raise HTTPException(status_code=404, detail="No active loan found")
    loan["_id"] = str(loan["_id"])
    return loan


@router.get("/transactions")
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
