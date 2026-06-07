"""
fix_tool_url.py
================
One-shot script to fix the accept_job tool URL on the existing agent.

The tool was registered with a doubled URL because AH_CALLBACK_URL had a path
in it. This script:
  1. Lists all tools on the agent
  2. Deletes the broken one
  3. Re-registers it with the correct URL

Run once from the backend directory:
    python agents/fix_tool_url.py
"""

import os
import sys
import requests
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AETHEX_API_KEY = os.environ.get("AETHEX_API_KEY", "")
AGENT_ID       = os.environ.get("AETHEX_NOTIFIER_AGENT_ID", "")
AH_CALLBACK_URL = os.environ.get("AH_CALLBACK_URL", "").rstrip("/")
BASE_URL       = "https://api.aethexai.com/api/v1"

HEADERS = {"X-API-Key": AETHEX_API_KEY, "Content-Type": "application/json"}


def base_only(url: str) -> str:
    """Strip any path — keep only scheme + netloc."""
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def main():
    if not all([AETHEX_API_KEY, AGENT_ID, AH_CALLBACK_URL]):
        print("[ERROR] Missing AETHEX_API_KEY, AETHEX_NOTIFIER_AGENT_ID, or AH_CALLBACK_URL in .env")
        sys.exit(1)

    # Build correct callback URL from the base domain only
    correct_url = f"{base_only(AH_CALLBACK_URL)}/api/v1/tasks/agent-callback"
    print(f"Correct tool URL will be: {correct_url}")

    # 1. List tools
    print("\n[1/3] Listing tools on agent...")
    resp = requests.get(f"{BASE_URL}/agents/{AGENT_ID}/tools", headers=HEADERS)
    if resp.status_code != 200:
        print(f"[ERROR] Could not list tools: {resp.status_code} {resp.text}")
        sys.exit(1)

    tools = resp.json()
    # Handle both list response and paginated { data: [...] }
    if isinstance(tools, dict):
        tools = tools.get("data", [])

    print(f"  Found {len(tools)} tool(s)")
    for t in tools:
        print(f"  - {t.get('name')} | url={t.get('endpoint_url')} | id={t.get('id')}")

    # 2. Delete broken tools named accept_job
    print("\n[2/3] Removing bad accept_job tool(s)...")
    removed = 0
    for tool in tools:
        if tool.get("name") == "accept_job":
            tool_id = tool.get("id")
            del_resp = requests.delete(
                f"{BASE_URL}/agents/{AGENT_ID}/tools/{tool_id}",
                headers=HEADERS,
            )
            if del_resp.status_code in (200, 204):
                print(f"  [OK] Deleted tool {tool_id}")
                removed += 1
            else:
                print(f"  [WARN] Delete returned {del_resp.status_code}: {del_resp.text}")

    if removed == 0:
        print("  No accept_job tools found to delete — continuing anyway.")

    # 3. Re-register with correct URL
    print("\n[3/3] Re-registering accept_job with correct URL...")
    payload = {
        "name": "accept_job",
        "description": (
            "Call this tool ONLY when the hustler clearly says yes, "
            "agrees, or confirms they want to accept the job. "
            "Do NOT call it for uncertain or partial responses."
        ),
        "parameters_schema": {"type": "object", "properties": {}, "required": []},
        "endpoint_url": correct_url,
    }
    resp = requests.post(
        f"{BASE_URL}/agents/{AGENT_ID}/tools",
        headers=HEADERS,
        json=payload,
    )
    if resp.status_code not in (200, 201):
        print(f"[ERROR] Failed to register tool: {resp.status_code} {resp.text}")
        sys.exit(1)

    tool = resp.json()
    print(f"  [OK] Tool registered: {tool.get('name')} -> {tool.get('endpoint_url')}")
    print("\n[DONE] Tool URL is now correct.")


if __name__ == "__main__":
    main()
