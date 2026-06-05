# AreaHustle — 2-Day Sprint Plan (June 6-7, 2026)
## Backend & Frontend Developer Task Breakdown

**Deadline:** Sunday June 7, end of day
**Demo recording:** Sunday evening or Monday morning

---

## Current State (What Already Works)

| Component | Status | Notes |
|:--|:--|:--|
| FastAPI backend with JWT auth | ✅ Running | Register, login, /me endpoint |
| Task CRUD + lifecycle | ✅ Running | Create, list, match, activate, complete |
| Gemini intent extraction | ✅ Working | `extract_intent()` in tasks.py — structured JSON output |
| Aethex voice session proxy | ✅ Wired | WebRTC session creation + SDP proxying |
| Hustler profile CRUD | ✅ Working | Create, read, update, nearby query |
| Passport endpoint | ✅ Working | Returns wallet, trust score, job stats |
| Demo sweep endpoint | ⚠️ Old concept | Needs refactoring — remove loan sweep, keep payout |
| Frontend landing page | ✅ Polished | Hero, bento, stats, CTA |
| Frontend auth modal | ✅ Working | Login/register with API fallback |
| Frontend onboarding | ✅ Working | Language + neighbourhood selection |
| Frontend post-task | ⚠️ Simulated | Uses setTimeout, not real voice |
| Frontend jobs feed | ✅ Working | Market/My-Gigs tabs |
| Frontend passport | ⚠️ Old concept | Shows wallet + trust score, needs creditworthiness card |

---

## 🔧 BACKEND DEVELOPER TASKS

### Priority 1: Voice-to-Intent (MUST HAVE — Friday)

#### Task B1: Real transcript extraction endpoint
**File:** `backend/routes/tasks.py`
**What:** Create/update `POST /api/v1/tasks/voice-extract` to accept a raw text transcript (from browser SpeechRecognition) and return Gemini-extracted entities.

```python
@router.post("/voice-extract")
async def voice_extract(
    body: dict,  # { "transcript": "I need someone to..." }
    current_user: dict = Depends(get_current_user),
):
    transcript = body.get("transcript", "")
    entities = await extract_intent(transcript)
    return {"transcript": transcript, "entities": entities}
```

**Already exists:** `extract_intent()` function works. Just need a proper endpoint that accepts the transcript from the frontend instead of using a hardcoded string.

**Time estimate:** 30 minutes

---

#### Task B2: Update task creation to store voice transcript
**File:** `backend/routes/tasks.py`, `backend/models.py`
**What:** Add `voice_transcript` field to Task model. Update `create_task` to optionally accept and store the original voice transcript.

**Time estimate:** 20 minutes

---

### Priority 2: Creditworthiness Proof Card (MUST HAVE — Friday)

#### Task B3: Proof card data endpoint
**File:** `backend/routes/passport.py`
**What:** Create `GET /api/v1/passport/proof-card` that returns the full CRC-aligned data package.

```python
@router.get("/proof-card")
async def get_proof_card(
    db = Depends(get_database),
    current_user = Depends(get_current_user),
):
    user_id = str(current_user.get("_id"))
    profile = await db.hustler_profiles.find_one({"user_id": user_id})
    
    # Compute from transactions
    # ... aggregate income_30d, income_60d, income_90d
    # ... compute income_consistency_index
    
    return {
        "hustler_name": current_user.get("name"),
        "kyc_tier": current_user.get("kyc_tier", 1),
        "platform_tenure_months": ...,
        "verified_income_30d": ...,
        "verified_income_90d": ...,
        "income_consistency_index": ...,
        "total_jobs_completed": profile.get("completed_jobs", 0),
        "completion_rate": profile.get("completion_rate", 0),
        "repeat_hire_ratio": profile.get("repeat_hire_ratio", 0),
        "dispute_rate": profile.get("dispute_rate", 0),
        "avg_response_time_minutes": ...,
        "categories": profile.get("categories", []),
        "service_areas": profile.get("service_areas", []),
        "verification_hash": f"ah_v2_{user_id[:12]}",
        "generated_at": datetime.utcnow().isoformat(),
    }
```

**For demo:** Use seeded/hardcoded values for income fields if real aggregation is too complex. The UI is what matters.

**Time estimate:** 1 hour

---

#### Task B4: Update Hustler Profile model with new fields
**File:** `backend/models.py`
**What:** Add fields to HustlerProfile:
- `on_time_rate: float = 0.0`
- `avg_response_time: float = 0.0`
- `income_30d: float = 0.0`
- `income_60d: float = 0.0`
- `income_90d: float = 0.0`
- `income_consistency_index: float = 0.0`
- `platform_tenure_months: int = 0`

**Time estimate:** 20 minutes

---

### Priority 3: AI Agent Notification System (MUST HAVE — Saturday)

#### Task B5: Hustler notification queue endpoint
**File:** `backend/routes/tasks.py` (new endpoint)
**What:** Create `POST /api/v1/tasks/notify-hustlers/{task_id}` that:
1. Finds the task by ID.
2. Queries eligible hustlers (service_areas includes task.neighbourhood).
3. Ranks them by trust_score descending.
4. Returns the ranked list for the frontend to process.

```python
@router.post("/notify-hustlers/{task_id}")
async def notify_hustlers(
    task_id: str,
    db = Depends(get_database),
    current_user = Depends(get_current_user),
):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(404, "Task not found")
    
    # Find eligible hustlers
    cursor = db.hustler_profiles.find(
        {"service_areas": task["neighbourhood"]}
    ).sort("trust_score", -1).limit(5)
    
    hustlers = []
    async for profile in cursor:
        user = await db.users.find_one({"_id": ObjectId(profile["user_id"])})
        hustlers.append({
            "user_id": profile["user_id"],
            "name": user.get("name", ""),
            "trust_score": profile.get("trust_score", 500),
            "completed_jobs": profile.get("completed_jobs", 0),
        })
    
    # Update task status
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "matching", "match_attempts": 0}}
    )
    
    return {"task_id": task_id, "queue": hustlers}
```

**Time estimate:** 1 hour

---

#### Task B6: Aethex outbound call trigger & booking handler
**File:** `backend/routes/tasks.py` (new endpoint / logic)
**What:** Create `POST /api/v1/tasks/call-hustler` that triggers a premium outbound call to a hustler. 
When the hustler accepts via the call, the backend must immediately trigger the match sequence, updating the task status to `matched` and assigning it to the hustler to prevent others in the queue from claiming it.

**If Aethex supports outbound:** Call the API to initiate an outbound voice session with job metadata.

**If Aethex doesn't support outbound (likely for hackathon):** Create a TTS message endpoint that returns audio data the frontend can play, simulating the AI calling the hustler. On voice confirmation or acceptance, trigger matching.

```python
@router.post("/call-hustler")
async def call_hustler(body: dict):
    # body: { "hustler_id": ..., "task_id": ..., "task_summary": "..." }
    # For demo: return a structured notification payload simulating the call
    return {
        "notification_type": "premium_voice_job_offer",
        "message": f"Hi, there's a {body['category']} job in {body['neighbourhood']} for {body['budget']} naira. Do you want to accept?",
        "hustler_id": body["hustler_id"],
        "task_id": body["task_id"],
        "action": "agent_auto_book_on_behalf"
    }
```

**Time estimate:** 1-2 hours (depending on Aethex outbound capability)

---

### Priority 4: Seed Data Script (MUST HAVE — Saturday)

#### Task B7: Create demo seed script
**File:** `backend/seed_demo.py` (NEW)
**What:** Script that populates MongoDB with rich demo data:

- **Hustler "Emeka O.":** Trust score 820, 47 completed jobs, 94% completion, 66% repeat hire, income_90d = ₦135,000, 8 months tenure, categories: Generator Service + Car Wash, areas: Lekki Phase 1 + Ajah.
- **Hustler "Tunde A.":** Trust score 710, 31 jobs, 88% completion, income_90d = ₦95,000.
- **Hustler "Blessing N.":** Trust score 680, 22 jobs, 91% completion, income_90d = ₦68,000.
- **Customer "Sarah O.":** Wallet ₦50,000.
- **3-5 completed jobs** with transactions to populate history.

**Time estimate:** 1 hour

---

### Priority 5: Cleanup (Saturday Evening)

#### Task B8: Remove old loan/sweep code
**What:** Remove or deprecate:
- `POST /api/v1/passport/demo/complete-job-sweep` (old concept)
- Loan creation endpoint (keep model for reference but not featured in demo)
- Update `complete_task` to trigger payout + wallet update + profile stats update WITHOUT loan sweep

**Time estimate:** 30 minutes

---

## 🎨 FRONTEND DEVELOPER TASKS

### Priority 1: Wire Real Voice-to-Intent (MUST HAVE — Friday)

#### Task F1: Add browser speech recognition to post-task page
**File:** `frontend/src/routes/post-task.tsx`
**What:** Replace the `setTimeout()` simulation with real `SpeechRecognition` Web API:

```typescript
const startListening = () => {
  setPhase("recording");
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-NG";
  recognition.interimResults = false;
  
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    setPhase("processing");
    
    // Call backend Gemini extraction
    const res = await fetch("http://localhost:8000/api/v1/tasks/voice-extract", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
      body: JSON.stringify({ transcript }),
    });
    const data = await res.json();
    setExtractedEntities(data.entities);
    setTranscript(transcript);
    setPhase("result");
  };
  
  recognition.onerror = () => {
    setPhase("idle");
    toast.error("Voice recognition failed. Try again.");
  };
  
  recognition.start();
};
```

**Key:** The entities (category, neighbourhood, budget) should now come from the Gemini response, not hardcoded values.

**Fallback:** If `SpeechRecognition` is unavailable (some browsers), show a text input field where user can type their request instead. Gemini extraction still runs.

**Time estimate:** 2-3 hours

---

### Priority 2: Creditworthiness Proof Card UI (MUST HAVE — Friday)

#### Task F2: Build the Proof Card component
**File:** `frontend/src/components/ProofCard.tsx` (NEW)
**What:** A beautiful, shareable card component showing the CRC-aligned data package. This is "the slide judges will photograph."

**Design spec:**
- Dark card background (the deep green from the trust score card: `#183620`)
- AreaHustle logo watermark
- Grid of data fields with labels and values
- Verification hash at bottom
- "Share via WhatsApp" button (opens WhatsApp share URL with text summary)
- "Download as Image" button (use `html2canvas` or similar)

**Data source:** `GET /api/v1/passport/proof-card` endpoint

**Time estimate:** 3-4 hours

---

#### Task F3: Update Passport page with new sections
**File:** `frontend/src/routes/passport.tsx`
**What:** Restructure the passport page:

1. **Top:** Work Metrics overview (jobs, completion rate, repeat hire ratio, response time)
2. **Middle:** Income Verification section (30d/60d/90d verified income with visual bars)
3. **Bottom:** Creditworthiness Proof Card (the shareable card from F2)
4. **Remove:** Old loan module (Active Micro-Loan section)
5. **Keep:** Wallet balance, transaction history

**Time estimate:** 2-3 hours

---

### Priority 3: AI Notification Visualization (MUST HAVE — Saturday)

#### Task F4: Build the Matching Flow UI
**File:** `frontend/src/routes/post-task.tsx` or new `frontend/src/components/MatchingFlow.tsx`
**What:** After the customer locks escrow, show a real-time visualization of the AI calling hustlers:

```
Phase 1: "Finding best match..."
  → Show ranked hustler cards (name, trust score, completed jobs)

Phase 2: "Calling Emeka O. (Trust Score: 820)..."
  → Show calling animation with Aethex voice waveform
  → Play AI agent voice: "Hi Emeka, there's a generator servicing job..."

Phase 3: "Emeka accepted! ✅"
  → Show match confirmation
  → Transition to job active state
```

**For demo:** This can be simulated with timed phases, but should pull real hustler data from `POST /api/v1/tasks/notify-hustlers/{task_id}`. The calling UI should feel real even if the actual Aethex outbound call isn't connected.

**Time estimate:** 3-4 hours

---

#### Task F5: Hustler notification receive UI
**File:** `frontend/src/routes/jobs.tsx` or new component
**What:** When a hustler is logged in and a matching job appears, show an incoming call-style notification:

- Full-screen overlay with ringing animation
- Shows: job category, neighbourhood, budget
- Two buttons: "Accept" (green) and "Decline" (red)
- Voice plays (Aethex TTS or browser TTS): "You have a new job offer..."
- Timer counting down from 2:00

**Time estimate:** 2-3 hours

---

### Priority 4: Agent Auto-Booking & Lock UI (MUST HAVE — Saturday/Sunday)

#### Task F6: Implement premium match acceptance and auto-booking UI
**File:** `frontend/src/routes/jobs.tsx` or new matching status indicator
**What:** Build the frontend handling for the premium outbound AI call. When the hustler accepts the call (or clicks "Accept" in the incoming call notification overlay), the system must immediately show an agent booking status: "Agent booking task on your behalf... Locked!" while executing the `/match` endpoint to lock the task and prevent any other hustler in the matching queue from taking it.

**Time estimate:** 2 hours

---

### Priority 5: Polish & Cleanup (Sunday)

#### Task F7: Update landing page copy
**File:** `frontend/src/routes/index.tsx`
**What:**
- Change tagline to "Your Area. Your Hustle. Your Proof."
- Update "How it works" section to reflect 3 pillars (Voice Post → AI Match → Build Proof)
- Remove any "micro-loan" or "escrow sweep" references
- Update stats section

**Time estimate:** 1 hour

---

#### Task F8: Clean up dead code
**Files:** `frontend/src/components/VoiceTerminal.tsx`, `frontend/src/components/JobSlideOver.tsx`, `frontend/src/lib/auth-context.tsx`
**What:**
- Remove or update `VoiceTerminal.tsx` — references `voiceOpen`, `addJob` which don't exist in current auth context
- Remove or update `JobSlideOver.tsx` — references `triggerPayout`, `PostedJob` which don't exist
- Remove loan-related state from auth-context
- Compress `logo-bg.png` if still 6MB

**Time estimate:** 1 hour

---

#### Task F9: Record demo video
**What:** Screen-record the full demo flow following the 2-minute pitch script from PRD v2 Section 13. Use OBS or browser screen recording. Narrate live or add voiceover.

**Time estimate:** 1-2 hours (multiple takes)

---

## 📅 Day-by-Day Schedule

### Friday June 6

| Time | Backend | Frontend |
|:--|:--|:--|
| Morning | B1: Voice extract endpoint (30m) | F1: Wire SpeechRecognition (2-3h) |
| Morning | B2: Store voice transcript (20m) | F1 continued |
| Midday | B3: Proof card endpoint (1h) | F2: Build ProofCard component (3-4h) |
| Afternoon | B4: Update models (20m) | F3: Restructure Passport page (2-3h) |
| Evening | B7: Seed demo data script (1h) | F7: Update landing page copy (1h) |

### Saturday June 7

| Time | Backend | Frontend |
|:--|:--|:--|
| Morning | B5: Notification queue endpoint (1h) | F4: Matching Flow UI (3-4h) |
| Morning | B6: Aethex call trigger / fallback (1-2h) | F4 continued |
| Afternoon | B8: Remove old loan code (30m) | F5: Hustler notification UI (2-3h) |
| Afternoon | Integration testing | F6: Agent Auto-Booking & Lock UI (2h) |
| Evening | Fix bugs, test end-to-end | F8: Clean dead code (1h) |

### Sunday June 8 (Buffer / Polish)

| Time | Everyone |
|:--|:--|
| Morning | Final integration testing, bug fixes |
| Afternoon | F9: Record demo video (1-2h) |
| Evening | Submit |

---

## ⚡ Quick Reference: What's Live vs What to Mock

| Feature | Build Live | Mock |
|:--|:--|:--|
| Voice-to-Intent (SpeechRecognition → Gemini) | ✅ | |
| AI Agent calling hustler | ✅ (in-app) / ⚠️ (real phone call) | Phone call if Aethex can't |
| Agent Auto-Booking & Queue Lock | ✅ | |
| Creditworthiness Proof Card | ✅ | |
| Matching flow visualization | ✅ | |
| KYC verification | | ✅ "Verified ✓" |
| Paystack escrow | | ✅ UI state change |
| WhatsApp share from Proof Card | ✅ (share URL) | |
| Real payment processing | | ✅ |
