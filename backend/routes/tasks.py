from fastapi import APIRouter, Depends, HTTPException
from models import Task
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
import requests
from database import settings

router = APIRouter()

@router.post("/")
async def create_task(task: Task, db: AsyncIOMotorDatabase = Depends(get_database)):
    new_task = await db.tasks.insert_one(task.dict(by_alias=True, exclude={"id"}))
    return {"id": str(new_task.inserted_id)}

@router.post("/voice-to-intent")
async def voice_to_intent(audio_url: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    # 1. Audio is routed to Aethex API (managed via their Agents/Sessions)
    # For MVP, we'll simulate the flow where we get STT from Aethex
    # and then pass to Gemini for intent extraction.
    
    # Placeholder for Aethex STT integration
    # stt_response = requests.post(f"{settings.AETHEX_BASE_URL}/stt", ...)
    stt_text = "I need a car wash at Lekki Phase 1" # Mocked for now
    
    # 2. Pass stt_text to Gemini for entity extraction (Category, Neighbourhood)
    # Extraction logic here...
    
    return {"text": stt_text, "entities": {"category": "Car Wash", "neighbourhood": "Lekki Phase 1"}}
