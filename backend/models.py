from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    role: str # "customer" or "hustler"
    kyc_tier: int = 1
    kyc_status: str = "pending"
    wallet_balance: float = 0.0
    language_preference: str = "english" # english, french, arabic
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HustlerProfile(BaseModel):
    user_id: str
    trust_score: int = 500
    completed_jobs: int = 0
    completion_rate: float = 0.0
    repeat_hire_ratio: float = 0.0
    dispute_rate: float = 0.0
    service_areas: List[str] = []
    categories: List[str] = []
    active_loan_id: Optional[str] = None

class Task(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    customer_id: str
    category: str
    description: str
    budget: float
    neighbourhood: str
    status: str = "open" # open, matched, active, completed, disputed
    voice_payload_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
