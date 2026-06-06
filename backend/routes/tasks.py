from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from models import Task, TaskCreate
from database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import settings
from bson import ObjectId
from routes.auth import get_current_user

router = APIRouter()

# --- Gemini client ---
from google import genai
from pydantic import BaseModel
import json

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class TaskEntities(BaseModel):
    category: str
    neighbourhood: str
    description: str
    budget: int


async def extract_intent(text: str):
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=text,
        config={
            'response_mime_type': 'application/json',
            'response_schema': TaskEntities,
            'system_instruction': """
            You are a task extractor for the AreaHustle app.
            Extract task entities from the user's transcript.
            Categories: Car Wash, Generator Service, Cleaning, Minor Repairs, Errands, Laundry, Tutoring, Other.
            Neighbourhoods: Lekki Phase 1, Ajah, Sangotedo, Magodo, Ketu.
            """
        }
    )
    return response.parsed


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None


# --- Task CRUD + lifecycle ---

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "customer":
        raise HTTPException(status_code=403, detail="Only customers can post tasks")

    new_task = Task(
        customer_id=str(current_user.get("_id")),
        title=task.title or task.category,
        category=task.category,
        description=task.description,
        budget=task.budget,
        neighbourhood=task.neighbourhood,
        voice_transcript=task.voice_transcript,
    )
    result = await db.tasks.insert_one(new_task.dict(by_alias=True, exclude={"id"}))
    return {"id": str(result.inserted_id)}


@router.put("/{task_id}")
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "customer":
        raise HTTPException(status_code=403, detail="Only customers can update tasks")

    existing_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if existing_task.get("customer_id") != str(current_user.get("_id")):
        raise HTTPException(status_code=403, detail="You do not own this task")

    update_data = {}
    if task_update.title is not None:
        update_data["title"] = task_update.title
    if task_update.description is not None:
        update_data["description"] = task_update.description
    if task_update.budget is not None:
        update_data["budget"] = task_update.budget

    if update_data:
        await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})

    return {"message": "Task updated successfully", "task_id": task_id}


@router.get("/")
async def list_tasks(
    neighbourhood: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query("open", alias="status"),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    if neighbourhood:
        query["neighbourhood"] = neighbourhood
    if category:
        query["category"] = category

    cursor = db.tasks.find(query).sort("created_at", -1)
    tasks = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        
        # Join Customer details
        cust_id = doc.get("customer_id")
        if cust_id:
            cust = await db.users.find_one({"_id": ObjectId(cust_id)})
            if cust:
                doc["customer_name"] = cust.get("name", "")
                doc["customer_phone"] = cust.get("phone_number", "")
                
        # Join Hustler details
        hust_id = doc.get("matched_hustler_id")
        if hust_id:
            hust = await db.users.find_one({"_id": ObjectId(hust_id)})
            if hust:
                doc["hustler_name"] = hust.get("name", "")
                doc["hustler_phone"] = hust.get("phone_number", "")
                
        tasks.append(doc)
    return tasks


@router.get("/my-tasks")
async def my_tasks(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    role = current_user.get("role")
    query = {"customer_id": user_id} if role == "customer" else {"matched_hustler_id": user_id}
    cursor = db.tasks.find(query).sort("created_at", -1)
    tasks = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        
        # Join Customer details
        cust_id = doc.get("customer_id")
        if cust_id:
            cust = await db.users.find_one({"_id": ObjectId(cust_id)})
            if cust:
                doc["customer_name"] = cust.get("name", "")
                doc["customer_phone"] = cust.get("phone_number", "")
                
        # Join Hustler details
        hust_id = doc.get("matched_hustler_id")
        if hust_id:
            hust = await db.users.find_one({"_id": ObjectId(hust_id)})
            if hust:
                doc["hustler_name"] = hust.get("name", "")
                doc["hustler_phone"] = hust.get("phone_number", "")
                
        tasks.append(doc)
    return tasks


@router.post("/{task_id}/match")
async def match_task(
    task_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "hustler":
        raise HTTPException(status_code=403, detail="Only hustlers can accept tasks")

    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.get("status") != "open":
        raise HTTPException(status_code=400, detail="Task is not open")

    hustler_id = str(current_user.get("_id"))
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "matched", "matched_hustler_id": hustler_id}},
    )
    return {"message": "Task matched", "task_id": task_id, "hustler_id": hustler_id}


@router.post("/{task_id}/activate")
async def activate_task(
    task_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.get("status") != "matched":
        raise HTTPException(status_code=400, detail="Task must be matched before activation")

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "active"}},
    )
    return {"message": "Task activated", "task_id": task_id}


@router.post("/{task_id}/complete")
async def complete_task(
    task_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    role = current_user.get("role")
    user_id = str(current_user.get("_id"))
    status_val = task.get("status")

    if role == "hustler":
        if status_val != "active":
            raise HTTPException(status_code=400, detail="Task must be active to complete")

        if task.get("matched_hustler_id") != user_id:
            raise HTTPException(status_code=403, detail="You are not assigned to this task")

        await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "awaiting_confirmation"}}
        )
        return {"message": "Awaiting customer confirmation", "status": "awaiting_confirmation", "task_id": task_id}

    elif role == "customer":
        from datetime import datetime
        budget = task.get("budget", 0.0)

        # Enforce check constraints to prevent negative customer balance
        if current_user.get("wallet_balance", 0.0) < budget:
            raise HTTPException(status_code=400, detail="Insufficient wallet balance to release payment")

        if status_val != "awaiting_confirmation" and status_val != "active":
            raise HTTPException(status_code=400, detail="Task is not ready for escrow release")

        if task.get("customer_id") != user_id:
            raise HTTPException(status_code=403, detail="You do not own this task")

        hustler_id = task.get("matched_hustler_id")

        if hustler_id:
            await db.transactions.insert_one({
                "user_id": hustler_id,
                "task_id": task_id,
                "type": "payout",
                "amount": budget,
                "desc": task.get("title") or task.get("category", "Payout"),
                "location": task.get("neighbourhood", "Local"),
                "timestamp": datetime.utcnow()
            })
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"wallet_balance": -budget}}
            )
            await db.users.update_one(
                {"_id": ObjectId(hustler_id)},
                {"$inc": {"wallet_balance": budget}}
            )

            profile = await db.hustler_profiles.find_one({"user_id": hustler_id})
            inc_30 = (profile.get("income_30d", 45000.0) if profile else 45000.0) + budget
            inc_60 = (profile.get("income_60d", 82000.0) if profile else 82000.0) + budget
            inc_90 = (profile.get("income_90d", 135000.0) if profile else 135000.0) + budget
            consistency = min(1.0, (profile.get("income_consistency_index", 0.72) if profile else 0.72) + 0.02)
            tenure = profile.get("platform_tenure_months", 8) if profile else 8

            await db.hustler_profiles.update_one(
                {"user_id": hustler_id},
                {
                    "$inc": {"completed_jobs": 1, "trust_score": 15},
                    "$set": {
                        "completion_rate": 98.0,
                        "income_30d": inc_30,
                        "income_60d": inc_60,
                        "income_90d": inc_90,
                        "income_consistency_index": consistency,
                        "platform_tenure_months": tenure
                    }
                },
                upsert=True
            )

        await db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
        )
        return {"message": "Payment released and task completed", "status": "completed", "task_id": task_id}

    else:
        raise HTTPException(status_code=400, detail="Invalid role")


# --- Voice-to-intent ---
from fastapi import UploadFile, File

@router.post("/voice-to-intent")
async def voice_to_intent(
    audio_url: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    # For hackathon demo, accept the transcript directly from the frontend
    # or use a hardcoded sample for testing.
    stt_text = "I need a car wash at Lekki Phase 1 because my car is very dirty"

    try:
        entities = await extract_intent(stt_text)
        return {"text": stt_text, "entities": entities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


import io

def convert_audio_to_wav(in_bytes: bytes) -> bytes:
    import av
    input_io = io.BytesIO(in_bytes)
    output_io = io.BytesIO()
    
    with av.open(input_io) as in_container:
        in_stream = next((s for s in in_container.streams if s.type == 'audio'), None)
        if not in_stream:
            raise ValueError("No audio stream found in input file")
            
        with av.open(output_io, mode='w', format='wav') as out_container:
            out_stream = out_container.add_stream('pcm_s16le', rate=24000)
            out_stream.layout = 'mono'
            
            resampler = av.AudioResampler(
                format='s16',
                layout='mono',
                rate=24000
            )
            
            for frame in in_container.decode(in_stream):
                resampled_frames = resampler.resample(frame)
                for f in resampled_frames:
                    for packet in out_stream.encode(f):
                        out_container.mux(packet)
            
            for packet in out_stream.encode(None):
                out_container.mux(packet)
                
    return output_io.getvalue()


@router.post("/voice-to-intent/upload")
async def voice_to_intent_upload(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    try:
        print("[Voice Upload] Reading file...")
        audio_bytes = await file.read()
        print(f"[Voice Upload] Read {len(audio_bytes)} bytes. MIME: {file.content_type}")
        
        # Convert non-WAV formats to standard WAV before sending to Aethex
        filename = file.filename or "audio.wav"
        content_type = file.content_type or "audio/wav"
        
        if not (content_type.startswith("audio/wav") or filename.endswith(".wav")):
            try:
                print("[Voice Upload] Converting input audio to standard WAV format using PyAV...")
                audio_bytes = convert_audio_to_wav(audio_bytes)
                print(f"[Voice Upload] Successfully converted to WAV. New size: {len(audio_bytes)} bytes.")
                filename = "converted.wav"
                content_type = "audio/wav"
            except Exception as conv_err:
                print(f"[Voice Upload] Conversion failed (falling back to original): {str(conv_err)}")
        
        from aethexai import Kora
        kora = Kora('https://api.aethexai.com', settings.AETHEX_API_KEY)
        
        print("[Voice Upload] Calling Aethex Kora transcribe...")
        transcription_result = kora.transcribe(
            file=audio_bytes,
            file_name=filename,
            mime_type=content_type,
            language="english"
        )
        stt_text = transcription_result.text
        print(f"[Voice Upload] Transcription result: '{stt_text}'")
        
        print("[Voice Upload] Extracting intent via Gemini...")
        entities = await extract_intent(stt_text)
        print("[Voice Upload] Successfully extracted entities.")
        
        return {"text": stt_text, "entities": entities}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")



from fastapi import Response

@router.post("/text-to-speech")
async def text_to_speech(
    text: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user),
):
    try:
        from aethexai import Kora
        kora = Kora('https://api.aethexai.com', settings.AETHEX_API_KEY)
        
        voices = kora.list_voices()
        english_voices = [v for v in voices if v.get("language") == "english" and not v.get("is_cloned")]
        if not english_voices:
            english_voices = [v for v in voices if not v.get("is_cloned")]
        
        if not english_voices:
            raise HTTPException(status_code=404, detail="No voices found on Aethex")
            
        voice_id = english_voices[0]["id"]
        
        audio_bytes = kora.synthesize_speech(
            text=text,
            voice_id=voice_id,
            language="english"
        )
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-speech synthesis failed: {str(e)}")


