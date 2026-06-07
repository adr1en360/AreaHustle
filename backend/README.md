# AreaHustle Backend

FastAPI backend for the AreaHustle hyper-local gig marketplace.

## Tech Stack

- **Framework:** FastAPI
- **Database:** MongoDB (via Motor async driver)
- **Auth:** JWT + bcrypt (OAuth2PasswordBearer)
- **AI:** Google Gemini (intent extraction) + Aethex (voice/WebRTC)
- **Package Manager:** `uv` (recommended) or `pip`

## Setup

### 1. Install dependencies

```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt
```

### 2. Environment variables

Create a `.env` file:

```env
MONGODB_URL=mongodb://localhost:27017
AETHEX_API_KEY=your_aethex_key
AETHEX_NOTIFIER_AGENT_ID=your_notifier_agent_id  # from: python agents/setup_notifier_agent.py
GEMINI_API_KEY=your_gemini_key
```

### 3. Run the server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Overview

| Prefix             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `/api/v1/auth`     | Register, login, JWT tokens                                 |
| `/api/v1/tasks`    | Post tasks, match, activate, complete, voice-to-intent      |
| `/api/v1/users`    | Hustler profiles, nearby hustlers                           |
| `/api/v1/passport` | Financial passport, voice session, demo sweep, transactions |
| `/api/v1/loans`    | Active loans, transaction history                           |

## Quick Test

```bash
python test_all.py
```
