# AreaHustle: Risk Assessment & Mitigation Strategy
**YPIT Hackathon 2026 | Technical & Business Resilience Plan**

As we build for the Nigerian informal economy, we recognize three critical risks that could impact the scale and sustainability of AreaHustle. Below are our documented mitigations based on current industry standards and technical workarounds.

---

## 1. The Network Risk (Technical Latency)
**Risk:** Poor 4G/3G network performance in dense urban areas leading to high latency in voice interactions, causing user abandonment.

### 🛡️ Mitigation Strategy
- **WebRTC Optimization:**
    - **Local Relay (TURN):** We will prioritize using TURN servers located in Lagos or Nairobi to keep Round-Trip Time (RTT) below 100ms.
    - **Adaptive Bitrate:** Implement aggressive media constraints (Opus Narrowband at 6-12 kbps) which are resilient to packet loss on congested towers.
- **Architectural Fallbacks:**
    - **Asynchronous STT:** For non-real-time task posting (Voice-to-Intent), we use a "Record-then-Upload" flow with a background progress bar, ensuring the user isn't stuck waiting for a synchronous response on a weak link.
    - **Offline Queueing:** The app will support local storage of voice notes, uploading them automatically once a stable connection is detected.

---

## 2. The Accent & Language Risk (AI Accuracy)
**Risk:** Current STT models (Aethex/Whisper) may struggle with heavy Nigerian accents, Pidgin English, or regional code-switching, leading to failed task extractions.

### 🛡️ Mitigation Strategy
- **Prompt Engineering (Priming):**
    - We "prime" the Aethex/STT engine by providing a context-heavy prompt including common Nigerian landmarks, currency terms (Naira, Kobo), and category-specific jargon (e.g., "generator servicing," "rewire," "vulcanizer").
- **LLM Post-Processing (The Correction Layer):**
    - Instead of relying on raw STT, we pass the "noisy" transcript through **Gemini 1.5 Flash**. Gemini acts as a semantic corrector, trained to recognize phonetic patterns common in West African accents (e.g., "p/b" or "l/r" shifts) and map them back to the intended meaning.
- **Human-in-the-Loop Confirmation:**
    - The UI will always present a structured "draft" of the extracted intent. Users can tap to correct the category or neighbourhood, providing a feedback loop that trains our local synonym mapping.

---

## 3. The Business/Credit Risk (Income Volatility)
**Risk:** Our biggest credit risk is income volatility, not borrower character. A reliable Hustler with a high rating can still have a slow month due to demand patterns. A fixed loan repayment during a slow period will lead to default, breaking the credit loop.

### 🛡️ Mitigation Strategy
Three structural mechanics protect us from the "good Hustler, bad borrower" failure:

1. **Income Velocity Weighting:**
    - Our Trust Score weights transaction consistency (frequency + regularity) heavily. A Hustler with 3 jobs/week consistently beats one with 15 jobs one month and 2 the next. The credit limit engine sizes loans to sustainable income velocity, not peak earnings.
2. **Variable Sweep Percentage (Not Fixed):**
    - We design the sweep as a % of each payout (e.g., 20% per job) rather than a fixed monthly amount. The repayment scales down automatically when the Hustler has a slow month. No income, no sweep — but no default either, just an extended term.
3. **Income-Generating Asset Loans:**
    - Unlike consumption loans, our equipment loans (e.g., a ₦40,000 pressure washer) directly increase the Hustler's job capacity and earning rate. The loan actively improves the income required to repay it.


---
**AreaHustle: Building resilience into the hustle.**
