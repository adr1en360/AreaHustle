import asyncio
import os
from test_aethex_connection import test_connect
from test_gemini_extraction import test_intent_extraction
from test_backend import run_all as run_backend_tests

async def run_all_tests():
    print("=========================================")
    print("AreaHustle Full Integration Tests")
    print("=========================================\n")

    # Backend API tests (requires server running)
    await run_backend_tests()

    # AI stack tests (can run standalone)
    if os.getenv("AETHEX_API_KEY") and os.getenv("AETHEX_PASSPORT_AGENT_ID"):
        print("\n--- Test: Aethex Voice Agent Connection ---")
        await test_connect()
    else:
        print("\n--- Skipping Aethex (no keys) ---")

    if os.getenv("GEMINI_API_KEY"):
        print("\n--- Test: Gemini Voice-to-Intent Extraction ---")
        await test_intent_extraction()
    else:
        print("\n--- Skipping Gemini (no key) ---")

    print("\n=========================================")
    print("All Tests Completed.")
    print("=========================================")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
