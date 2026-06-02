import asyncio
from test_aethex_connection import test_connect
from test_gemini_extraction import test_intent_extraction

async def run_all_tests():
    print("=========================================")
    print("Starting AreaHustle AI Integration Tests")
    print("=========================================\n")
    
    print("--- Test 1: Aethex Voice Agent Connection ---")
    await test_connect()
    
    print("\n--- Test 2: Gemini Voice-to-Intent Extraction ---")
    await test_intent_extraction()
    
    print("\n=========================================")
    print("All Tests Completed.")
    print("=========================================")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
