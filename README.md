# AreaHustle

**"Your Area. Your Hustle. Your Proof."**

AreaHustle is a voice-first hyper-local gig marketplace that turns informal work into bankable creditworthiness proof. It leverages **Voice-first AI** to bridge the digital literacy gap, allowing middle-class households and small businesses to post tasks, and informal workers (Hustlers) to build a verified financial identity that unlocks credit access.

---

## 🚀 Key Features (The Three Pillars)

- **🎙️ Pillar 1: Voice-to-Intent Task Posting:** Post jobs like "Car Wash" or "Generator Repair" just by speaking. Powered by **Aethex Speech-to-Text** and **Google Gemini Flash** for structured JSON intent extraction.
- **📞 Pillar 2: AI Agent Outbound Calling & Auto-Booking:** Matched premium providers receive direct voice calls from an Aethex Outbound AI Agent to accept gigs. Upon acceptance, the agent immediately claims and books the job on their behalf to prevent others in the queue from taking it.
- **💳 Pillar 3: Financial Passport & Creditworthiness Proof Card:** Hustlers track their standings via a premium visual dashboard and generate a shareable, glassmorphic holographic Creditworthiness Proof Card containing verified 30/60/90d earnings, consistency indicators, and a verification hash.

---

## 🛠️ Tech Stack

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Package Manager:** [uv](https://github.com/astral-sh/uv)
- **Database:** [MongoDB](https://www.mongodb.com/) (Async with Motor Driver)
- **Voice AI Platform:** [Aethex API](https://developers.aethexai.com/)
- **Large Language Model:** [Google Gemini Flash](https://ai.google.dev/)
- **Frontend:** React, Vite, TypeScript, TailwindCSS/Vanilla CSS, Lucide Icons

---

## 🚦 Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/)
- [uv](https://github.com/astral-sh/uv) installed
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Node.js & npm](https://nodejs.org/) (for Frontend)

### Backend Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adr1en360/AreaHustle.git
   cd areahustle
   ```

2. **Initialize and sync the virtual environment:**
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

4. **Seed the Database for the Demo:**
   Initialize MongoDB with high-fidelity demo users, profiles, and tasks:
   ```bash
   uv run python seed_demo.py
   ```
   This seeds:
   - **Customer:** `customer@areahustle.com` (Password: `password123`) loaded with `₦150,000` wallet balance.
   - **Hustler (Emeka):** `hustler@areahustle.com` (Password: `password123`) loaded with `₦82,000`, trust score `850`, 30/60/90d alternative credit indicators, past completed payouts, and pre-matched tasks.

5. **Start the API server:**
   ```bash
   uv run uvicorn main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000`. Documentation at `/docs`.*

### Frontend Installation & Setup

1. **Initialize and run Vite app:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The dev server will run at `http://localhost:5173`.*

---

## 📖 API Usage Highlights

### Post Task via Voice Intent Extraction
`POST /api/v1/tasks/voice-to-intent/upload`
- Accepts multipart form uploads of customer voice recordings, transcribes them using Aethex Kora, and extracts structured fields using Google Gemini.

### Mutual Complete & Escrow Release
`POST /api/v1/tasks/{task_id}/complete`
- Moves task to `"awaiting_confirmation"` when clicked by the assigned Hustler. Releasing the escrow payment updates user wallet balances and increments Hustler alternative credit metrics in the database only when confirmed by the Customer.

### Generate Creditworthiness Proof Card
`GET /api/v1/passport/proof-card`
- Computes verified 30/60/90-day earnings velocity, consistency index, and returns a secure verification hash.

---

## 🧪 Testing

Run backend tests using pytest:
```bash
cd backend
uv run pytest
```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built for the **YPIT (Young People in Tech) Hackathon 2026**.
