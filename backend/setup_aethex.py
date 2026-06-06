import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("AETHEX_API_KEY")
BASE_URL = "https://api.aethexai.com/api/v1"
headers = {"X-API-Key": API_KEY, "Content-Type": "application/json"}

def create_passport_agent():
    # Pick the first non-cloned English voice
    voices_resp = requests.get(f"{BASE_URL}/voices?language=english", headers=headers)
    voices_resp.raise_for_status()
    voices = [v for v in voices_resp.json() if not v.get("is_cloned")]
    if not voices:
        print("No voices found.")
        return None
    voice_id = voices[0]["id"]

    SYSTEM_PROMPT = """You are the AreaHustle Financial Passport Assistant. 
    You help Hustlers understand their Trust Score and financial standing.
    
    Access the Hustler's metadata (trust_score, completed_jobs) to provide personalized answers.
    Speak in short, clear sentences. Be supportive and professional.
    
    If they ask 'What is my trust score?', use the trust_score from metadata.
    If they ask about their performance, mention their completed_jobs.
    
    Always encourage them to complete more jobs to improve their score.
    """

    agent_resp = requests.post(f"{BASE_URL}/agents", headers=headers, json={
        "name": "AreaHustle Passport Assistant",
        "system_prompt": SYSTEM_PROMPT,
        "first_message": "Hello! I am your Financial Passport assistant. How can I help you today?",
        "voice_id": voice_id,
        "language": "english",
        "llm_model": "aethex-default"
    })
    agent_resp.raise_for_status()
    agent = agent_resp.json()
    agent_id = agent['id']
    print(f"Agent created: {agent_id}")
    
    # Register the booking tool
    callback_url = os.getenv("AH_CALLBACK_URL", "https://your-ngrok-tunnel.ngrok-free.app/api/v1/tasks/call-callback")
    print(f"Registering tool book_job pointing to {callback_url}...")
    try:
        tool_resp = requests.post(
            f"{BASE_URL}/agents/{agent_id}/tools",
            headers=headers,
            json={
                "name": "book_job",
                "description": "Book and lock the task under the current hustler's profile. Use this immediately when the caller verbally accepts the job offer.",
                "parameters_schema": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "string", "description": "The UUID of the task to book."},
                        "hustler_id": {"type": "string", "description": "The UUID of the matched hustler."}
                    },
                    "required": ["task_id", "hustler_id"]
                },
                "endpoint_url": callback_url
            }
        )
        tool_resp.raise_for_status()
        print("Tool book_job registered successfully!")
    except Exception as e:
        print(f"Failed to register tool: {e}")
        
    return agent_id

if __name__ == "__main__":
    if not API_KEY:
        print("AETHEX_API_KEY not found in .env")
    else:
        create_passport_agent()
