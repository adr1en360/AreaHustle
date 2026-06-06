import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

AETHEX_API_KEY = os.getenv("AETHEX_API_KEY")
AETHEX_BASE_URL = "https://api.aethexai.com/api/v1"
AGENT_ID = os.getenv("AETHEX_PASSPORT_AGENT_ID")

async def test_connect():
    print(f"Testing Aethex Connection with Agent ID: {AGENT_ID}")
    async with httpx.AsyncClient() as client:
        headers = {
            "X-API-Key": AETHEX_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "agent_id": AGENT_ID,
            "metadata": {
                "hustler_id": "test_hustler_123",
                "trust_score": 850,
                "completed_jobs": 15
            }
        }
        try:
            response = await client.post(
                f"{AETHEX_BASE_URL}/conversation/connect", 
                json=payload, 
                headers=headers
            )
            print(f"Status Code: {response.status_code}")
            if response.status_code == 201:
                data = response.json()
                print("Successfully connected to Aethex!")
                print(f"Session ID: {data.get('session_id')}")
                print(f"ICE Config: {data.get('ice_config') is not None}")
            else:
                print(f"Failed: {response.text}")
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    if not AETHEX_API_KEY or not AGENT_ID:
        print("Error: AETHEX_API_KEY or AETHEX_PASSPORT_AGENT_ID missing in .env")
    else:
        asyncio.run(test_connect())
