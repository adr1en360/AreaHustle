import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

AETHEX_API_KEY = os.getenv("AETHEX_API_KEY")
AETHEX_BASE_URL = "https://api.aethexai.com/api/v1"
AGENT_ID = os.getenv("AETHEX_NOTIFIER_AGENT_ID")


async def test_connect():
    """
    Smoke test: verify the notifier agent exists and is reachable on Aethex.
    Calls GET /agents/{id} — does NOT place a real call.
    """
    print(f"Testing Aethex notifier agent: {AGENT_ID}")
    async with httpx.AsyncClient() as client:
        headers = {
            "X-API-Key": AETHEX_API_KEY,
            "Content-Type": "application/json",
        }
        try:
            response = await client.get(
                f"{AETHEX_BASE_URL}/agents/{AGENT_ID}",
                headers=headers,
            )
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print("[OK] Notifier agent reachable")
                print(f"  name:     {data.get('name')}")
                print(f"  language: {data.get('language')}")
                print(f"  voice_id: {data.get('voice_id')}")
            else:
                print(f"[FAIL] Failed: {response.text}")
        except Exception as e:
            print(f"[ERROR] Error: {str(e)}")


if __name__ == "__main__":
    if not AETHEX_API_KEY or not AGENT_ID:
        print("Error: AETHEX_API_KEY or AETHEX_NOTIFIER_AGENT_ID missing in .env")
        print("Run: python agents/setup_notifier_agent.py to create the agent first.")
    else:
        asyncio.run(test_connect())
