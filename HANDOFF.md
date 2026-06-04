# AreaHustle: Developer Handoff Guide

This guide defines the clear separation of duties for the **Backend** and **Frontend** teams following the completion of the AI Engineering phase.

---

## 🤖 Completed AI Engineering (Done)

- **Aethex WebRTC Bridge:** Endpoints for session creation and SDP proxying are live. Tested and verified.
- **Gemini Intent Extraction:** Schema-based extraction using Gemini 3 Flash is integrated into the task posting flow.
- **AI Infrastructure:** All API keys and model configurations are set up in `.env`.
- **Validation:** Run `python test_all.py` in the `backend` folder to verify the full stack.

---

## ⚙️ Backend Developer: Completed Tasks

All core backend "gears" have been built:

1. **Authentication (JWT):**
   - `POST /api/v1/auth/register` and `POST /api/v1/auth/login` with bcrypt + JWT.
   - All endpoints now require Bearer tokens via `OAuth2PasswordBearer`.
2. **Task Lifecycle:**
   - `POST /api/v1/tasks/` — create task (customer only)
   - `GET /api/v1/tasks/` — list with neighbourhood/category/status filters
   - `POST /api/v1/tasks/{id}/match` — hustler accepts task
   - `POST /api/v1/tasks/{id}/activate` — transition to active
   - `POST /api/v1/tasks/{id}/complete` — transition to completed
3. **Loan & Transaction Persistence:**
   - `POST /api/v1/loans/` — create active loan
   - `POST /api/v1/passport/demo/complete-job-sweep` — now persists sweep, decrements loan balance, logs transactions, and updates wallet/completed_jobs/trust_score.
4. **Hustler Profile CRUD:**
   - `POST /api/v1/users/hustler-profile`
   - `GET /api/v1/users/hustler-profile`
   - `PUT /api/v1/users/hustler-profile`
   - `GET /api/v1/users/nearby-hustlers`
5. **Passport & Financial Data:**
   - `GET /api/v1/passport/me` — returns wallet, trust score, job stats
   - `GET /api/v1/passport/transactions` — full ledger
   - `GET /api/v1/loans/transactions` — same via loans prefix
6. **Tests & Docs:**
   - `test_backend.py` — end-to-end integration tests for all new flows.
   - `AreaHustle_API_Postman_Collection.json` — full Postman collection.

---

## 🔌 Next Step: Wire Frontend to Backend APIs

The frontend is currently 100% client-side mocked (see `auth-context.tsx`, `jobs.tsx`, `passport.tsx`).
The next major effort is replacing hardcoded data with `fetch()` calls to the live backend endpoints.
Key integration points:

- Replace `login()` in `auth-context.tsx` with calls to `/api/v1/auth/login` and store JWT token.
- Replace `triggerPayout()` with a real call to `/api/v1/passport/demo/complete-job-sweep`.
- Wire `/api/v1/tasks` for the job feed.
- Wire `/api/v1/passport/me` for the Financial Passport data.

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
