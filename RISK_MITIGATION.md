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

## 3. The Business/Credit Risk (Scoring Validity)
**Risk:** Uncertainty whether high platform ratings and job reliability (being a "Good Plumber") actually correlate with financial reliability (being a "Good Borrower").

### 🛡️ Mitigation Strategy
- **Behavioral Correlation Tiers:**
    - Our model doesn't just look at "Stars." It prioritizes **"Skin in the Game"** signals:
        - **Consistency over Volume:** A Hustler who works 3 days a week every week is scored higher than one who works 15 days once and disappears.
        - **Repeat Hire Ratio:** This is our strongest signal. If customers hire the same Hustler again, it indicates professional integrity—the most consistent predictor of repayment.
- **Micro-Sweep Mechanism:**
    - We mitigate repayment risk through **Automated Escrow Sweeps**. Instead of asking for a monthly payment, we deduct a fixed percentage (e.g., 20%) from *every* completed job payout. This aligns the loan repayment with the Hustler's actual cash flow.
- **Progressive Credit Limits:**
    - Loans start small (₦15,000) for "Equipment Advances." We only increase limits after 3 successful automated repayment cycles, ensuring the data confirms the behavior before increasing exposure.

---
**AreaHustle: Building resilience into the hustle.**
