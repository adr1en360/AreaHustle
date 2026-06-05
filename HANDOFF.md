# AreaHustle: Developer Handoff Guide
**Version:** 2.0 | **Focus:** Alternative Creditworthiness Proof & Voice AI MVP

This guide defines the clear separation of duties for the **Backend** and **Frontend** teams to successfully build and deliver the AreaHustle v2.0 MVP by Sunday.

---

## 🤖 Completed AI Engineering & Base Infrastructure

- **Aethex STT/TTS & Outbound Voice Match Infrastructure:** Baseline outbound calling session endpoints are integrated.
- **Gemini Intent Extraction:** Schema-based entity extraction (Category, Neighborhood, Budget) is functional via FastAPI.
- **Database:** MongoDB (using Motor async driver) initialized.
- **Environment:** System keys and configurations mapped in `.env`.

---

## ⚙️ Backend Developer: Task Breakdown (Sprint Plan B1-B8)

The backend team is responsible for implementing the following API endpoints and database logic:

1. **B1: User Registration & Authentication (JWT)**
   - Endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
   - Setup JWT validation middleware for secure routes.
2. **B2: Hustler Profile Creation & CRUD**
   - Endpoints: `POST /api/v1/users/hustler-profile`, `GET /api/v1/users/hustler-profile`, `PUT /api/v1/users/hustler-profile`.
3. **B3: Task Creation & Voice-to-Intent Extraction**
   - Endpoint: `POST /api/v1/tasks/voice-extract`.
   - Integrates the browser audio stream/transcript with Gemini Flash for entity extraction.
4. **B4: Task Lifecycle API**
   - Endpoints: `POST /api/v1/tasks/` (publish task), `GET /api/v1/tasks/` (fetch feed filtered by neighborhood/category/status).
5. **B5: AI Match Outbound Calling Queue**
   - Endpoint: `POST /api/v1/tasks/notify-hustlers/{task_id}`.
   - Core matchmaking logic: Rank eligible hustlers in the task neighborhood, dial them via Aethex sequentially, and handle responses (with a 2-minute timeout per attempt).
6. **B6: Aethex Outbound Call Trigger & Booking Handler**
   - Endpoint: `POST /api/v1/tasks/call-hustler`.
   - Initiates premium outbound voice session. If matched hustler accepts, the backend immediately books the task on their behalf (matches task status to `matched` and assigns to hustler) to lock it in.
7. **B7: Task Completion & Escrow Release**
   - Endpoints: `POST /api/v1/tasks/{id}/match` (accept task), `POST /api/v1/tasks/{id}/complete` (complete task, release mocked escrow, update hustler metrics).
8. **B8: Financial Passport Metrics & Proof Card**
   - Endpoints: `GET /api/v1/passport/me` (dashboard numbers), `GET /api/v1/passport/proof-card` (bureau data package + cryptographic hash).

---

## 🎨 Frontend Developer: Task Breakdown (Sprint Plan F1-F8)

The frontend team is responsible for coding the screens, wiring them to the API, and implementing the voice interface:

1. **F1: Layout & Core Design System**
   - High-fidelity visual styles (`index.css`) with premium dark modes, harmonious colors, and smooth micro-animations.
2. **F2: Authentication Flow UI**
   - User registration/login modal.
3. **F3: Voice-to-Intent Task Poster UI (Pillar 1)**
   - The "Speak Task" button, browser SpeechRecognition capture, progress indicators, and the structured draft review card.
4. **F4: Active Escrow & Task Management UI**
   - Customer view of published tasks, active matches, and the "Complete Task" trigger.
5. **F5: Job Feed UI**
   - Interactive list of open gigs filtered by neighborhood/category, with manual accept fallback.
6. **F6: Outbound Voice Match Notification UI (Pillar 2)**
   - Visual indicator showing match queue attempts. Outbound call ringing or in-app voice message playback overlay.
7. **F7: Premium Match Acceptance & Auto-Booking Lock UI (Pillar 2)**
   - Booking feedback overlay. Upon voice call acceptance, display: "Booking task on your behalf... Locked!" while the agent executes the matches to prevent others in queue from claiming it.
8. **F8: Shareable Creditworthiness Proof Card UI (Pillar 3)**
   - The structured data card summarizing bureau metrics, complete with verification hash and WhatsApp "Share" button.

---

## 🔌 API Wiring Details

* All frontend-to-backend API calls must go to `/api/v1/...`.
* Include the JWT token in headers as `Authorization: Bearer <token>` for all protected endpoints.
* Ensure CORS is configured properly in backend `main.py`.
