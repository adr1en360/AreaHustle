from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    hashed_password: str
    role: str  # "customer" or "hustler"
    name: str = ""
    kyc_tier: int = 1
    kyc_status: str = "pending"
    wallet_balance: float = 0.0
    language_preference: str = "english"  # english, french, arabic
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    name: str = ""
    language_preference: str = "english"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    role: str
    name: str
    wallet_balance: float
    language_preference: str

class HustlerProfile(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    trust_score: int = 500
    completed_jobs: int = 0
    completion_rate: float = 0.0
    repeat_hire_ratio: float = 0.0
    dispute_rate: float = 0.0
    service_areas: List[str] = []
    categories: List[str] = []
    active_loan_id: Optional[str] = None

class HustlerProfileCreate(BaseModel):
    service_areas: List[str] = []
    categories: List[str] = []

class Task(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    customer_id: str
    category: str
    description: str
    budget: float
    neighbourhood: str
    status: str = "open"  # open, matched, active, completed, disputed
    matched_hustler_id: Optional[str] = None
    voice_payload_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class TaskCreate(BaseModel):
    category: str
    description: str
    budget: float
    neighbourhood: str

class Loan(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    hustler_id: str
    mfb_partner_id: str = "mock_mfb_partner"
    principal: float
    outstanding_balance: float
    sweep_percentage: float = 0.20  # 20% by default
    status: str = "active"  # active, settled, defaulted
    issued_at: datetime = Field(default_factory=datetime.utcnow)

class LoanCreate(BaseModel):
    principal: float
    sweep_percentage: float = 0.20

class Transaction(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    task_id: Optional[str] = None
    loan_id: Optional[str] = None
    type: str  # escrow_hold, payout, loan_sweep, topup, withdrawal
    amount: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TransactionCreate(BaseModel):
    user_id: str
    task_id: Optional[str] = None
    loan_id: Optional[str] = None
    type: str
    amount: float
