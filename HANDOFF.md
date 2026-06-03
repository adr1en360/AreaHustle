# AreaHustle: Developer Handoff Guide

This guide defines the clear separation of duties for the **Backend** and **Frontend** teams following the completion of the AI Engineering phase.

---

## 🤖 Completed AI Engineering (Done)
- **Aethex WebRTC Bridge:** Endpoints for session creation and SDP proxying are live. Tested and verified.
- **Gemini Intent Extraction:** Schema-based extraction using Gemini 3 Flash is integrated into the task posting flow.
- **AI Infrastructure:** All API keys and model configurations are set up in `.env`.
- **Validation:** Run `uv run python test_all.py` in the `backend` folder to verify the AI stack.

---

## ⚙️ Backend Developer: Remaining Tasks
The backend is currently an AI-powered engine. You need to build the "gears" around it:

1. **Loan & Transaction Logic:**
    - Implement the actual logic to decrement the `outstanding_balance` in the `Loan` collection when the `/demo/complete-job-sweep` is called.
    - Create a persistent `Transaction` record for every sweep.
2. **Task Lifecycle:**
    - Build the endpoints to transition a task from `open` -> `matched` -> `active` -> `completed`.
3. **Trust Score Aggregator:**
    - (Optional for demo) Create a background task or endpoint that recalculates the `trust_score` based on the weights defined in `TECHNICAL_PRD.md`.
4. **Authentication:**
    - Implement basic JWT-based auth so the frontend can securely identify the `hustler_id`.

---

## 🎨 Frontend Developer: Remaining Tasks
The frontend needs to bring the "Wow Moment" to life using the PWA philosophy:

1. **The Voice Experience:**
    - Build the **"Speak Task"** interface. Use the browser's `MediaRecorder` API to capture audio and hit the `/voice-to-intent` endpoint.
    - Implement the **Aethex Call UI**. Use the `frontend/index.html` logic as a reference to build the real-time audio connection in your framework.
2. **The "Money Shot" Animation:**
    - Create a high-fidelity animation for the **Wallet Sweep**. When the "Complete Job" action is triggered, visually show the gross earnings being split into "Repayment" and "Net Payout."
3. **PWA Compliance:**
    - Set up the `manifest.json` and a Service Worker for offline/cached performance. your call
4. **Hustler Dashboard:**
    - Design a high-contrast **Financial Passport** screen showing the Trust Score breakdown and credit eligibility.

---
**AI Engineer Status: COMPLETE.**  
The stack is green. Refer to `INDEX.md` for blueprint details.
