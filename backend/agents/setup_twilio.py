"""
setup_twilio.py
================
Registers your Twilio account and phone number with Aethex so the
AreaHustle Job Dispatcher agent can place outbound calls.

Run ONCE from the backend directory:
    python agents/setup_twilio.py

Steps:
  1. POST /twilio-accounts  — links your Twilio account to Aethex
  2. POST /phone-numbers     — registers the number + ties it to the agent
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AETHEX_API_KEY      = os.environ.get("AETHEX_API_KEY", "")
AGENT_ID            = os.environ.get("AETHEX_NOTIFIER_AGENT_ID", "")
TWILIO_ACCOUNT_SID  = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN   = os.environ.get("TWILIO_AUTH_TOKEN", "")
AETHEX_FROM_NUMBER  = os.environ.get("AETHEX_FROM_NUMBER", "")
BASE_URL            = "https://api.aethexai.com/api/v1"

HEADERS = {"X-API-Key": AETHEX_API_KEY, "Content-Type": "application/json"}


def check_env():
    required = {
        "AETHEX_API_KEY":     AETHEX_API_KEY,
        "AETHEX_NOTIFIER_AGENT_ID": AGENT_ID,
        "TWILIO_ACCOUNT_SID": TWILIO_ACCOUNT_SID,
        "TWILIO_AUTH_TOKEN":  TWILIO_AUTH_TOKEN,
        "AETHEX_FROM_NUMBER": AETHEX_FROM_NUMBER,
    }
    missing = [k for k, v in required.items() if not v]
    if missing:
        print(f"[ERROR] Missing env vars: {', '.join(missing)}")
        sys.exit(1)


def register_twilio_account() -> str:
    """POST /twilio-accounts — returns the Aethex twilio_account_id UUID."""
    print("[1/2] Registering Twilio account with Aethex...")
    resp = requests.post(
        f"{BASE_URL}/twilio-accounts",
        headers=HEADERS,
        json={
            "account_sid":   TWILIO_ACCOUNT_SID,
            "auth_token":    TWILIO_AUTH_TOKEN,
            "friendly_name": "AreaHustle Twilio Account",
        },
    )

    if resp.status_code == 409:
        # Already registered — extract the id from the list endpoint
        print("  Already registered. Fetching existing record...")
        list_resp = requests.get(f"{BASE_URL}/twilio-accounts", headers=HEADERS)
        list_resp.raise_for_status()
        data = list_resp.json()
        accounts = data if isinstance(data, list) else data.get("data", [])
        for acc in accounts:
            if acc.get("account_sid", "").lower() == TWILIO_ACCOUNT_SID.lower():
                twilio_account_id = acc["id"]
                print(f"  [OK] Found existing: twilio_account_id={twilio_account_id}")
                return twilio_account_id
        print("[ERROR] Could not find existing Twilio account. Try deleting it first.")
        sys.exit(1)

    if resp.status_code not in (200, 201):
        print(f"[ERROR] {resp.status_code}: {resp.text}")
        sys.exit(1)

    account = resp.json()
    twilio_account_id = account["id"]
    print(f"  [OK] Registered: twilio_account_id={twilio_account_id}")
    return twilio_account_id


def register_phone_number(twilio_account_id: str):
    """POST /phone-numbers/twilio/register — registers the number and links it to the notifier agent."""
    print(f"[2/2] Registering phone number {AETHEX_FROM_NUMBER}...")

    # Endpoint follows /phone-numbers/{provider}/register pattern
    resp = requests.post(
        f"{BASE_URL}/phone-numbers/twilio/register",
        headers=HEADERS,
        json={
            "phone_number":       AETHEX_FROM_NUMBER,
            "twilio_account_id":  twilio_account_id,
            "agent_id":           AGENT_ID,
            "friendly_name":      "AreaHustle Dispatcher Line",
        },
    )

    if resp.status_code == 409:
        print(f"  Number already registered with Aethex. Skipping.")
        return

    if resp.status_code not in (200, 201):
        print(f"[ERROR] {resp.status_code}: {resp.text}")
        sys.exit(1)

    phone = resp.json()
    print(f"  [OK] Number registered: {phone.get('number')} | status={phone.get('status')}")
    print(f"       Linked to agent: {AGENT_ID}")
    print()
    print(json.dumps(phone, indent=2))


def main():
    check_env()
    twilio_account_id = register_twilio_account()
    register_phone_number(twilio_account_id)

    print()
    print("=" * 60)
    print("SUCCESS - Twilio is wired to Aethex.")
    print("The agent can now place outbound calls from", AETHEX_FROM_NUMBER)
    print("=" * 60)


if __name__ == "__main__":
    main()
