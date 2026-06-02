import asyncio
import os
from google import genai
from dotenv import load_dotenv
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

async def test_intent_extraction():
    print("Testing Gemini Intent Extraction with gemini-1.5-flash...")
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY missing in .env")
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    
    test_transcript = "I need someone to come wash my car at Lekki Phase 1 tomorrow morning. It's an SUV."

    prompt = f"""
    Extract task entities from the following text: "{test_transcript}"
    Categories: Car Wash, Generator Service, Cleaning, Minor Repairs, Errands, Laundry, Tutoring, Other.
    Neighbourhoods: Lekki Phase 1, Ajah, Sangotedo, Magodo, Ketu.
    
    Return ONLY JSON:
    {{
        "category": "...",
        "neighbourhood": "...",
        "description": "..."
    }}
    """

    try:
        # Switching to 1.5 Flash
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        
        content = response.text.strip().replace('```json', '').replace('```', '')
        entities = json.loads(content)
        
        print("\n--- Extraction Results ---")
        print(f"Original Transcript: {test_transcript}")
        print(f"Extracted Category: {entities.get('category')}")
        print(f"Extracted Neighbourhood: {entities.get('neighbourhood')}")
        print(f"Extracted Description: {entities.get('description')}")
        print("--------------------------\n")
        
        if entities.get('category') == "Car Wash" and entities.get('neighbourhood') == "Lekki Phase 1":
            print("Extraction test PASSED!")
        else:
            print("Extraction test FAILED (Unexpected entities).")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_intent_extraction())
