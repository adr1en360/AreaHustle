# AreaHustle

**"Your Area, Your Hustle, Your Trust."**

AreaHustle is a hyper-local gig marketplace and behavioral credit engine designed for the Nigerian market. Version 3.0 leverages **Voice-first AI** to bridge the digital literacy gap, allowing households to post tasks and workers to manage their financial identity through natural voice conversations.

---

## 🚀 Key Features

- **🎙️ Voice-to-Intent Task Posting:** Post jobs like "Car Wash" or "Generator Repair" just by speaking. Powered by **Aethex STT** and **Gemini 1.5 Flash**.
- **🛡️ Voice-Assisted Financial Passport:** A real-time conversational interface for Hustlers to query their Trust Score and loan eligibility.
- **📍 Hyper-Local Filtering:** Smart neighbourhood-based discovery (Lekki, Ajah, Magodo, etc.) without the battery drain of real-time GPS tracking.
- **🌍 Multi-lingual Support:** Native support for English, French, and Arabic.

## 🛠️ Tech Stack

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- **Package Manager:** [uv](https://github.com/astral-sh/uv)
- **Database:** [MongoDB](https://www.mongodb.com/) (Async with Motor)
- **Voice Infrastructure:** [Aethex API](https://developers.aethexai.com/)
- **LLM/Extraction:** [Google Gemini 1.5 Flash](https://ai.google.dev/)

---

## 🚦 Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/)
- [uv](https://github.com/astral-sh/uv) installed
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Docker](https://www.docker.com/) (Optional, for Atlas Local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adr1en360/AreaHustle.git
   cd areahustle
   ```

2. **Initialize the backend:**
   ```bash
   cd backend
   uv venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   uv sync
   ```

3. **Configure Environment Variables:**
   Create a `backend/.env` file:
   ```env
   MONGODB_URL="mongodb://localhost:27017"
   AETHEX_API_KEY="your_aethex_key"
   GEMINI_API_KEY="your_gemini_key"
   ```

### 🏃 Running the MVP

1. **Setup the Aethex Voice Agent:**
   ```bash
   uv run python setup_aethex.py
   ```
   *This script will output an `AGENT_ID`. Add it to your `.env` as `AETHEX_PASSPORT_AGENT_ID`.*

2. **Start the API server:**
   ```bash
   uv run uvicorn main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000`. Documentation at `/docs`.*

---

## 📖 API Usage Highlights

### Post Task via Voice (Draft)
`POST /api/v1/tasks/voice-to-intent`
- Extracts category and neighbourhood from audio transcripts using Gemini.

### Start Financial Passport Conversation
`POST /api/v1/passport/voice-session`
- Returns a **WebRTC session** from Aethex to initiate a real-time voice call.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built for the **YPIT (Young People in Tech) Hackathon 2026**.
