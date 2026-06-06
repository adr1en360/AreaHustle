import asyncio
import os
from google import genai
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class TaskEntities(BaseModel):
    category: str
    neighbourhood: str
    description: str

async def test_intent_extraction():
    # Upgrading to Gemini 3 Flash for 2026 production
    print("Testing Gemini Intent Extraction with gemini-3-flash-preview...")
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY missing in .env")
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    
    test_transcript = "I need someone to come wash my car at Lekki Phase 1 tomorrow morning. It's an SUV."

    try:
        # Using gemini-3-flash-preview as the recommended model in 2026
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=test_transcript,
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
        
        # In the modern SDK, response.parsed contains the Pydantic-validated object
        entities = response.parsed
        
        print("\n--- Extraction Results ---")
        print(f"Original Transcript: {test_transcript}")
        
        if entities:
            print(f"Extracted Category: {entities.category}")
            print(f"Extracted Neighbourhood: {entities.neighbourhood}")
            print(f"Extracted Description: {entities.description}")
            print("--------------------------\n")
            
            if entities.category == "Car Wash" and entities.neighbourhood == "Lekki Phase 1":
                print("Extraction test PASSED!")
            else:
                print("Extraction test FAILED (Unexpected entities).")
        else:
            print("Extraction test FAILED (No entities returned).")
            print(f"Raw Response Text: {response.text}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Provide more context for debugging
        if 'response' in locals() and hasattr(response, 'text'):
            print(f"Raw Response: {response.text}")

if __name__ == "__main__":
    asyncio.run(test_intent_extraction())
