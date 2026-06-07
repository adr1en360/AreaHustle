"""
test_call.py
============
One-shot script to fire a live test call to a specific number.
Uses the notifier agent directly — no DB, no task queue.

Run from the backend directory:
    python agents/test_call.py
"""
import requests
import os
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

key      = os.environ["AETHEX_API_KEY"]
agent_id = os.environ["AETHEX_NOTIFIER_AGENT_ID"]
from_num = os.environ["AETHEX_FROM_NUMBER"]
to_num   = "+2349030310062"
base     = "https://api.aethexai.com/api/v1"
headers  = {"X-API-Key": key, "Content-Type": "application/json"}

# 1. Patch the agent with a live test script
print("[1/2] Setting test first_message on agent...")
patch = requests.patch(
    f"{base}/agents/{agent_id}",
    headers=headers,
    json={
        "first_message": (
            "Hi, this is Segun calling from AreaHustle. "
            "There is a Car Wash job available in Lekki Phase 1 for eight thousand naira. "
            "Would you like to accept this job?"
        )
    },
)
print(f"  Patch status: {patch.status_code}")
if patch.status_code not in (200, 201):
    print(f"  [WARN] Could not patch first_message: {patch.text}")

# 2. Trigger the outbound call
print(f"[2/2] Triggering call to {to_num}...")
resp = requests.post(
    f"{base}/calls/trigger",
    headers=headers,
    json={
        "agent_id":    agent_id,
        "to_number":   to_num,
        "from_number": from_num,
        "metadata":    {
            "test":       True,
            "task_id":    "test-001",
            "hustler_id": "test-hustler",
        },
    },
)

print(f"  Status: {resp.status_code}")
data = resp.json()
print(json.dumps(data, indent=2))

if resp.status_code == 202:
    call_id = data.get("id", "unknown")
    print()
    print("==> Call is QUEUED. Your phone will ring shortly.")
    print(f"    Call ID : {call_id}")
    print(f"    From    : {from_num}")
    print(f"    To      : {to_num}")
else:
    print()
    print("[ERROR] Call was not accepted by Aethex. See response above.")
