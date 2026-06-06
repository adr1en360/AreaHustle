import os
import httpx
from dotenv import load_dotenv
from aethexai import Kora
from google import genai
from pydantic import BaseModel
import sys

# Reconfigure stdout to use UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

AETHEX_API_KEY = os.getenv("AETHEX_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class TaskEntities(BaseModel):
    category: str
    neighbourhood: str
    description: str

async def download_sample_speech():
    # standard telecom speech wav file
    url = "https://raw.githubusercontent.com/voxserv/audio_quality_testing_samples/refs/heads/master/testaudio/8000/test01_20s.wav"
    print(f"Downloading sample speech WAV from {url}...")
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content

async def extract_intent(text: str):
    print("Sending text to Gemini for structured entity extraction...")
    client = genai.Client(api_key=GEMINI_API_KEY)
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

def test_pipeline():
    if not AETHEX_API_KEY:
        print("Error: AETHEX_API_KEY is missing in .env")
        return
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY is missing in .env")
        return

    # 1. Download
    import asyncio
    wav_bytes = asyncio.run(download_sample_speech())
    print(f"Downloaded {len(wav_bytes)} bytes of audio data.")

    # 2. Transcribe via Aethex
    print("Sending audio to Aethex for Speech-to-Text transcription...")
    kora = Kora(api_key=AETHEX_API_KEY)
    transcription_result = kora.transcribe(
        file=wav_bytes,
        file_name="clean_speech.wav",
        mime_type="audio/wav",
        language="english"
    )
    
    stt_text = transcription_result.text
    print(f"\n--- Aethex Transcription Output ---")
    print(stt_text.encode('ascii', errors='replace').decode('ascii'))
    print("------------------------------------\n")

    # 3. Process with Gemini
    entities = asyncio.run(extract_intent(stt_text))
    print("\n--- Gemini Structuring Results ---")
    if entities:
        print(f"Extracted Category: {entities.category}")
        print(f"Extracted Neighbourhood: {entities.neighbourhood}")
        print(f"Extracted Description: {entities.description}")
    else:
        print("Failed to parse entities.")
    print("----------------------------------\n")

if __name__ == "__main__":
    test_pipeline()
