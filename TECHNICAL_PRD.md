# AreaHustle V3.0: Technical Product Requirements Document (Hackathon MVP)

## 1. Executive Summary
AreaHustle is a hyper-local gig marketplace and behavioral credit engine. Version 3.0 introduces **Aethex-powered voice interfaces** to lower the barrier to entry for users in the Nigerian market, offering Voice-to-Intent task generation and a Voice-Assisted Financial Passport. By offloading voice infrastructure to Aethex, AreaHustle achieves rapid deployment of multi-lingual (EN, FR, AR) AI capabilities.

## 2. Technical Stack
- **Backend:** FastAPI (Python 3.12+)
- **Package Manager:** `uv`
- **Database:** MongoDB (Motor driver)
- **Voice AI:** Aethex API (Agents, WebRTC, STT/TTS)
- **Intent Extraction:** Google Gemini 1.5 Flash
- **Deployment:** Railway / Render (Phase 1)

## 3. Core Features & Functional Requirements (Voice Integrated)

### 3.1 Voice-to-Intent Task Generation
- **Requirement:** Customers must be able to bypass manual forms via a "Speak Task" button.
- **Flow:**
    1. Customer records/streams audio.
    2. Audio is processed by **Aethex API** for Speech-to-Text (STT).
    3. The resulting transcript is passed to **Gemini 1.5 Flash**.
    4. Gemini extracts: `category`, `neighbourhood`, and `description`.
    5. A draft task is presented to the user for confirmation.

### 3.2 Voice-Assisted Financial Passport
- **Requirement:** Hustlers can query their financial standing and Trust Score via a natural conversation.
- **Flow:**
    1. Hustler initiates a session via the app.
    2. Backend requests a session from **Aethex WebRTC API** with specific Hustler metadata (Trust Score, Job History).
    3. The **Aethex Agent** handles real-time dialogue, providing supportive feedback on the Hustler's progress.

### 3.3 Hyper-Local Discovery
- **Requirement:** Task filtering based on neighbourhood tags rather than rigid geofencing.
- **Implementation:** MongoDB geospatial/text indexes on `neighbourhood` and `service_areas`.

## 4. Data Models (MongoDB)

### User
- `auth_id` (Unique ID)
- `role` (customer/hustler)
- `language_preference` (english/french/arabic)
- `wallet_balance`

### Hustler Profile
- `trust_score` (0-1000)
- `service_areas` (List of neighbourhood slugs)
- `completed_jobs`
- `completion_rate`

### Task
- `customer_id`
- `category`
- `neighbourhood`
- `status` (open/matched/active/completed/disputed)

## 5. Security & Compliance
- **Credential Management:** All API keys (Aethex, Gemini, MongoDB) stored in `.env` and excluded from version control.
- **PII Protection:** Only anonymized hashes passed to AI inference pipelines.

## 6. MVP Scope (Hackathon)
- **In-Scope:** 
    - Hustler/Customer onboarding with language selection.
    - Voice-to-Intent task posting.
    - Real-time voice interaction for Financial Passport.
    - Basic Trust Score computation.
- **Out-of-Scope:**
    - USSD fallback (Phase 2).
    - Insurance products.
    - Live MFB partner integration.
