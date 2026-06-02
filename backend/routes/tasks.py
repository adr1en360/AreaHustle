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

import google.generativeai as genai
import json

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

async def extract_intent(text: str):
    prompt = f"""
    Extract task entities from the following text: "{text}"
    Categories: Car Wash, Generator Service, Cleaning, Minor Repairs, Errands, Laundry, Tutoring, Other.
    Neighbourhoods: Lekki Phase 1, Ajah, Sangotedo, Magodo, Ketu.
    
    Return ONLY JSON:
    {{
        "category": "...",
        "neighbourhood": "...",
        "description": "..."
    }}
    """
    response = await model.generate_content_async(prompt)
    # Basic cleaning of response text to handle potential markdown
    content = response.text.strip().replace('```json', '').replace('```', '')
    return json.loads(content)

@router.post("/voice-to-intent")
async def voice_to_intent(audio_url: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    # 1. Simulate Aethex STT (Mocked since exact STT endpoint wasn't in provided docs, 
    # but PRD confirms its usage)
    stt_text = "I need a car wash at Lekki Phase 1 because my car is very dirty"
    
    # 2. Pass stt_text to Gemini for entity extraction
    try:
        entities = await extract_intent(stt_text)
        return {"text": stt_text, "entities": entities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
