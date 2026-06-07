import requests, os, time, json
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

key = os.environ["AETHEX_API_KEY"]
call_id = "36a55ab7-2af3-466e-9ceb-5c56287138f6"
headers = {"X-API-Key": key}
terminal = {"completed", "failed", "no-answer", "busy", "canceled"}

print(f"Watching call {call_id}...")
for i in range(36):
    r = requests.get(f"https://api.aethexai.com/api/v1/calls/{call_id}", headers=headers)
    data = r.json()
    status   = data.get("status", "?")
    dur      = data.get("duration_seconds") or "--"
    call_sid = data.get("call_sid") or "none"
    print(f"  [{i*5:>3}s] status={status:<12} call_sid={call_sid}  duration={dur}s")
    if status in terminal:
        print()
        if status == "completed":
            print("SUCCESS - call completed!")
        else:
            print(f"Call ended: {status}")
            print(json.dumps(data, indent=2))
        break
    time.sleep(5)
