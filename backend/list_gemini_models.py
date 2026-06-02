import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def list_models():
    print("Listing available Gemini models...")
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    try:
        # Note: In some versions of the SDK, this might be client.models.list()
        for model in client.models.list():
            print(f"- {model.name} (DisplayName: {model.display_name})")
    except Exception as e:
        print(f"Failed to list models: {str(e)}")

if __name__ == "__main__":
    list_models()
