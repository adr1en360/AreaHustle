# AreaHustle — Product Requirements Document v2.0

**Version:** 2.0 | **Date:** June 5, 2026 | **Market:** Nigeria
**Tagline:** *"Your Area. Your Hustle. Your Proof."*

---

## 1. Executive Summary

AreaHustle is a voice-first hyper-local gig marketplace that turns everyday hustle into bankable proof.

The platform connects Nigerian households and small businesses with verified local service providers (Hustlers) for everyday tasks — car washing, generator servicing, cleaning, minor repairs, and errands. But the marketplace is not the product. The product is the **Verified Work Data Package** that every completed job generates.

Nigeria has ~3 million gig workers and a ~$5.17 billion informal economy. These workers are financially invisible — no payslips, no formal transaction history, no path to credit. Banks and MFBs cannot underwrite them because the data doesn't exist.

**AreaHustle fixes the data problem, not the lending problem.**

Every completed job produces verified income data, reliability signals, and behavioral metrics. This data is packaged into a format that Nigerian credit bureaus (CRC Credit Bureau, CreditRegistry) already accept as alternative data inputs under the Credit Reporting Act of 2017. Banks score it. Hustlers get loans they couldn't get before.

### What Changed from v1.0

| v1.0 (Old) | v2.0 (Current) |
|:--|:--|
| Direct micro-lending via MFB partner | AreaHustle generates creditworthiness proof — does NOT lend |
| Escrow sweep loan repayment | Removed entirely |
| Text-based task posting | Voice-to-Intent job posting (Aethex + Gemini) |
| Push notifications to hustlers | AI Agent voice calls to hustlers (Aethex outbound) |
| Static trust score display | Visual Financial Passport with shareable Creditworthiness Proof Card |
| 14+ features | 3 core pillars |
| PostgreSQL (Supabase RLS) + MongoDB confusion | MongoDB (Motor) — single database, no contradiction |

---

## 2. Problem Statement

### 2.1 Customer Side
- Middle-class estate residents in Lagos cannot reliably source verified help for routine tasks.
- WhatsApp group referrals are inconsistent, unsafe, and unprotected.
- Cash-only transactions create payment disputes with no recourse.

### 2.2 Hustler (Service Provider) Side
- Informal workers waste productive hours waiting for sporadic jobs.
- No protection against non-payment, no receipts, no financial history.
- Digital lenders (FairMoney, Carbon, Branch, Tala) cannot underwrite them: no payslips, no formal transaction history, no collateral.

### 2.3 The Credit Data Gap
Nigerian credit bureaus (CRC, CreditRegistry) are actively seeking alternative data sources for informal workers under the Credit Reporting Act of 2017. They accept data from telecoms, utilities, and digital platforms — but no gig platform in Nigeria currently generates structured creditworthiness data for its workers.

**AreaHustle closes this gap.**

---

## 3. Target Users

### 3.1 Customer (Task Poster)
- Middle-class households in gated estates and urban neighbourhoods (Lagos initially).
- Small business owners needing recurring light maintenance or errands.
- Device: Android mid-range (Tecno, Infinix), intermittent 4G.
- Primary need: reliable, safe, fairly priced help without coordination friction.

### 3.2 Hustler (Service Provider)
- Verified Nigerian adults, 18+, skilled or semi-skilled informal workers.
- Device: Android entry-range, data-cost sensitive, WhatsApp-native.
- Primary need: consistent gigs and instant payment.
- Secondary need: a verifiable income record that unlocks credit access.

### 3.3 Institution (Lender / Credit Bureau) — Future B2B Customer
- Licensed MFBs, fintechs, or credit bureaus seeking behavioral underwriting data for informal borrowers.
- Receives anonymised Verified Work Data Packages via API with hustler consent.

---

## 4. Product Objectives (Hackathon MVP)

| Objective | Success Metric | Target |
|:--|:--|:--|
| Voice posting works end-to-end | Customer speaks → task card appears | Live demo |
| AI notification reaches hustler | AI agent calls hustler and job is accepted via voice | Live demo |
| Passport shows verified data | Hustler views income, metrics, and creditworthiness card | Live demo |
| Creditworthiness proof is shareable | Hustler can generate/view a structured data card | Live demo |

---

## 5. The Three Pillars

### Pillar 1: Voice-to-Intent Job Posting

**Flow:**
1. Customer taps "Speak Task" button.
2. Browser `MediaRecorder` API captures audio (or `SpeechRecognition` API for direct transcript).
3. Audio/transcript sent to backend.
4. If audio: Aethex STT transcribes to text. If direct transcript: skip.
5. Transcript passed to **Gemini Flash** with structured extraction schema.
6. Gemini returns: `{ category, neighbourhood, budget, description }`.
7. Structured task card displayed to customer for review.
8. Customer confirms → escrow locked (mocked) → task published.
9. Task visible to matched hustlers.

**AI Role:** Gemini is the structured extraction engine. It converts natural language ("I need someone to service my generator in Lekki, about 8k") into machine-readable task entities. This is NOT possible without AI — the alternative is a multi-field form that creates friction for low-literacy users.

**Categories:** Car Wash, Generator Service, Cleaning, Minor Repairs, Errands, Laundry, Tutoring, Other.

**Neighbourhoods:** Lekki Phase 1, Lekki Phase 2, Ajah, Sangotedo, Victoria Island, Ikoyi, Yaba, Surulere, Ikeja GRA, Magodo, Gbagada, Festac.

---

### Pillar 2: AI Agent Notifications (Queue + Timeout Matching)

**Flow:**
1. Task is published.
2. Platform queries eligible hustlers: service area includes task neighbourhood + active status.
3. Results ranked by: trust metrics (weighted composite) × proximity × availability.
4. AI Agent initiates a premium outbound voice call to Hustler #1 via Aethex.
5. AI speaks: *"Hi [name], there's a [category] job in [neighbourhood] for [budget] naira. Would you like to accept?"*
6. Hustler responds via voice: "Yes" / "No" / no answer.
7. If accepted via voice, the AI Agent immediately matches and books the job on their behalf in the backend, locking it instantly to prevent other hustlers in the queue/line from taking it.
8. If declined or no answer (2 minute timeout) → AI calls Hustler #2.
9. Maximum 5 attempts. If no hustler accepts → job stays open for manual browse in feed.

**AI Role:** The AI Agent acts as an active booking agent. It replaces standard notifications with direct phone calls. On voice approval, it performs the transaction/match on the user's behalf immediately to resolve race conditions in the matching queue.

**Fallback:** If Aethex outbound calling is unavailable, standard SMS or push notifications are sent to direct them to the in-app job feed.

---

### Pillar 3: Financial Passport

**Components:**

#### A. Dashboard (Visual)
- **Verified Income:** 30-day, 60-day, 90-day earnings from completed jobs.
- **Work Metrics:** Jobs completed, completion rate, repeat hire ratio, average response time.
- **Creditworthiness Indicators:** Income consistency index, platform tenure, dispute rate.
- **KYC Tier:** BVN/NIN/Liveness verification level.

#### B. Creditworthiness Proof Card (Shareable)
A structured visual card the hustler can screenshot and share via WhatsApp to any lender. Contains:

| Field | Description |
|:--|:--|
| Hustler Name | From KYC verification |
| Platform Tenure | Months since first completed job |
| Verified Income (90d) | Total verified earnings, last 90 days |
| Income Consistency | Low / Medium / High (derived from weekly earnings variance) |
| Jobs Completed | Lifetime count |
| Completion Rate | % of accepted jobs completed |
| Repeat Hire Ratio | % of customers who hired again |
| Dispute Rate | Upheld disputes per 100 jobs |
| KYC Level | Tier 1 / Tier 2 / Tier 3 |
| Verification Hash | Unique code lender can verify via AreaHustle API |

---

## 6. Credit Data Model (CRC-Aligned)

AreaHustle does NOT produce a credit score. It produces a **Verified Work Data Package** — structured data that credit bureaus and MFBs can feed into their own scoring models.

### Why This Alignment Matters
Under the Credit Reporting Act of 2017, Nigerian credit bureaus (CRC Credit Bureau score range: 300-850) can aggregate data from digital platforms, telecoms, and utilities. CRC is actively expanding alternative data integration for informal workers. AreaHustle generates exactly the data types they need.

### Data Package Schema

```json
{
  "hustler_id": "anonymised_hash",
  "kyc_tier": 2,
  "platform_tenure_months": 8,
  "verified_income_30d": 45000,
  "verified_income_60d": 82000,
  "verified_income_90d": 135000,
  "income_consistency_index": 0.72,
  "total_jobs_completed": 47,
  "completion_rate": 0.94,
  "repeat_hire_ratio": 0.66,
  "dispute_rate": 0.02,
  "avg_response_time_minutes": 4.2,
  "categories": ["Generator Service", "Car Wash"],
  "service_areas": ["Lekki Phase 1", "Ajah"],
  "generated_at": "2026-06-05T18:00:00Z",
  "verification_hash": "ah_v2_abc123def456"
}
```

### Consent Model
- Hustler explicitly grants permission before any data is shared.
- Consent is time-limited (30-day expiry) and revocable.
- Shared via Consent Token (opaque URL) or QR code on the Proof Card.

---

## 7. Location Model: Filter, Not Fence

- Hustlers select up to 5 named neighbourhoods during onboarding.
- Customers tag tasks with a neighbourhood.
- System matches on overlap, sorts by trust metrics and estimated distance.
- No real-time GPS tracking between jobs.
- Location access requested only at job acceptance for navigation.

---

## 8. Edge Case Resolutions

### 8.1 Multiple Hustlers for One Job
**Solution: Queue + Timeout** (see Pillar 2). AI calls ranked hustlers sequentially. First to accept wins. Maximum 5 calls. After that, job stays in open feed.

### 8.2 Cold Start — Acquiring Initial Hustlers
1. **WhatsApp community seeding** in Lekki/Ajah + Magodo/Ketu estate corridors.
2. **Category-first launch:** 2 categories only — Car Wash + Generator Service (highest frequency, clearest pricing).
3. **Target:** 15-20 hustlers per category before customer launch.
4. **Hackathon demo:** 3-5 rich seeded profiles with full work history.

### 8.3 Disintermediation (Hustler/Customer Go Direct)
After 3-4 successful jobs, the customer has the hustler's WhatsApp. They transact directly.

**Retention mechanism:** The Financial Passport only updates with on-platform jobs. Off-platform jobs don't count. If the hustler wants credit access, they need fresh verified data. "You keep using AreaHustle not because we force you, but because every job here makes you more lendable."

---

## 9. Revenue Model

| Stream | Mechanism | Priority |
|:--|:--|:--|
| Creditworthiness Data API | MFBs/lenders pay per-query for verified data packages | Primary (Year 1+) |
| Transaction Commission | 3-5% on escrow transactions | Secondary (Day 1) |
| Premium Hustler Badge | ₦2,500/month for priority matching + verified badge | Tertiary |
| B2B Lead Generation | Estate management companies pay for verified hustler recommendations | Future |

---

## 10. Technical Architecture

### 10.1 Stack

| Layer | Technology | Justification |
|:--|:--|:--|
| Frontend | Vite + React + TanStack Router | Fast, modern, file-based routing |
| Backend | FastAPI (Python 3.12) | Async, AI/ML native, rapid development |
| Package Manager | uv | Fast Python package management |
| Database | MongoDB (Motor async driver) | Flexible schemas, fast iteration for hackathon |
| Voice/STT/TTS | Aethex API | Localised voice AI, WebRTC, outbound calling |
| LLM Extraction | Google Gemini Flash | Structured JSON output with Pydantic schema |
| Payments | Paystack (mocked for demo) | Nigerian market leader |
| Auth | JWT (bcrypt + python-jose) | Simple, stateless |

### 10.2 Data Models

**User**
- `_id`, `email`, `hashed_password`, `role` (customer/hustler), `name`, `kyc_tier`, `kyc_status`, `wallet_balance`, `language_preference`, `created_at`

**Hustler Profile**
- `_id`, `user_id`, `trust_score` (0-1000 internal), `completed_jobs`, `completion_rate`, `on_time_rate`, `repeat_hire_ratio`, `dispute_rate`, `avg_response_time`, `income_30d`, `income_60d`, `income_90d`, `income_consistency_index`, `platform_tenure_months`, `service_areas[]`, `categories[]`

**Task**
- `_id`, `customer_id`, `category`, `description`, `budget`, `neighbourhood`, `status` (open/matching/matched/active/completed/disputed), `matched_hustler_id`, `match_attempts`, `voice_transcript`, `created_at`, `completed_at`

**Transaction** (append-only, immutable)
- `_id`, `user_id`, `task_id`, `type` (escrow_hold/payout/commission), `amount`, `timestamp`

**Consent Token**
- `_id`, `hustler_id`, `institution_id`, `scopes[]`, `expires_at`, `status` (active/revoked/expired)

### 10.3 Key API Endpoints

| Method | Endpoint | Description |
|:--|:--|:--|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login (JWT) |
| GET | `/api/v1/auth/me` | Current user profile |
| POST | `/api/v1/tasks/` | Create task |
| POST | `/api/v1/tasks/voice-extract` | Send transcript → Gemini extraction |
| GET | `/api/v1/tasks/` | List tasks (filtered by neighbourhood/category/status) |
| POST | `/api/v1/tasks/{id}/match` | Hustler accepts task |
| POST | `/api/v1/tasks/{id}/complete` | Mark task completed |
| POST | `/api/v1/tasks/notify-hustlers/{task_id}` | Trigger AI agent queue for task |
| GET | `/api/v1/passport/me` | Hustler financial passport data |
| GET | `/api/v1/passport/proof-card` | Generate creditworthiness proof card data |
| POST | `/api/v1/users/hustler-profile` | Create hustler profile |
| GET | `/api/v1/users/hustler-profile` | Get own hustler profile |

---

## 11. Competitive Landscape

| Platform | What They Do | What They Don't Do |
|:--|:--|:--|
| **Wrkman** | Artisan verification, trust profiles | No credit data generation, no voice |
| **Gotwork** | NIN/selfie verification, Paystack escrow | No behavioral data packaging, no AI matching |
| **Tuse** | Home repairs, auto services | No financial identity product, no voice |
| **CitiTasker** | General task marketplace | No credit data, no voice, no AI notifications |
| **Tasker4U** | Verified talent, escrow, naira wallet | No creditworthiness proof, no voice AI |

**AreaHustle's differentiation:**
1. **Voice-first** — no competitor offers voice job posting or AI voice notifications.
2. **Creditworthiness data as the product** — every competitor treats the transaction as the end. We treat it as input to a financial identity system.
3. **AI Agent matching** — direct voice calls to hustlers instead of push notifications.

---

## 12. MVP Scope (Hackathon)

### In Scope
- Voice-to-Intent task posting (live)
- Creditworthiness Proof Card (visual, shareable)
- Task lifecycle (post → match → complete)
- Seeded demo data (3-5 hustler profiles with full history)

### Mocked / Out of Scope
- AI Agent outbound calling queue
- KYC verification ("Verified ✓")
- Paystack escrow (UI state change)
- Full neighbourhood geodata
- Consent Token API for lenders

### Out of Scope
- Direct lending / loan repayment
- USSD fallback
- Insurance products
- Real payment processing
- Multi-language support beyond English

---

## 13. Demo Flow (2-Minute Pitch)

**[0:00-0:15] THE HOOK**
"Last week, a generator mechanic in Lekki earned ₦180,000. No bank will give him a ₦30,000 loan. Why? His income doesn't exist on paper."

**[0:15-0:40] THE INSIGHT**
"We don't lend. We prove you're lendable. AreaHustle is a voice-first gig marketplace that generates the exact credit data Nigerian banks need — but can't get — from informal workers."

**[0:40-1:05] DEMO: VOICE POST + AI NOTIFICATION**
Customer speaks task. Gemini extracts. Card appears. Escrow locks. AI Agent calls Emeka: "There's a generator servicing job in Lekki Phase 1 for eight thousand naira. Do you want to accept?" Emeka says yes. Job matched in 40 seconds.

**[1:05-1:35] DEMO: THE PASSPORT**
Open Emeka's Financial Passport. Trust Score 820. 47 jobs. 94% completion. 31 repeat hires. ₦135,000 verified income over 90 days. "No bank built this profile. Emeka built it, one job at a time."

**[1:35-1:55] DEMO: THE PROOF CARD**
Generate Creditworthiness Proof Card. Show the CRC-aligned data package. "This card contains the exact data points CRC Credit Bureau uses for alternative credit scoring. Emeka can share it with any lender via WhatsApp."

**[1:55-2:00] CLOSE**
"Emeka doesn't have a bank statement. He has something better — a verified record of showing up."

---

*End of Document*
