# AreaHustle: Hackathon Demo Strategy & Findings
**Focus: Delivering the "Wow Moment" on Demo Day**

---

## 1. The Core Findings (Why AreaHustle Works)
Our competitive advantage is understanding that the true risk in gig economy lending isn't character (willingness to repay)—it's **income volatility** (ability to repay during slow periods). 

By implementing an **Escrow Sweep Mechanism** (deducting a percentage at source per job, modeled after Moove), we eliminate the concept of "missing a monthly payment." If a Hustler has a slow month, the repayment simply stretches. The loan (e.g., a pressure washer) is an income-generating asset that accelerates their ability to repay. This structural insight is what we pitch to mentors and judges.

---

## 2. The "Wow Moment"
The climax of the product is **Phase 3 of the demo flow**. It is not the task posting or the matching. 

It is the moment a Hustler completes a ₦5,000 job and watches the wallet update in real-time:
> **₦5,000 received → ₦1,000 swept to loan → ₦4,000 credited. Loan balance: ₦39,000.**

That single screen proves the entire thesis: A worker without a bank history just serviced a loan exclusively through their "hustle" and verified performance. No collateral, no forms.

---

## 3. Execution Focus: What to Mock vs. What to Build Live

To ensure a flawless 3-minute pitch, we must ruthlessy prioritize engineering effort.

### 🚫 What to MOCK (Do not build backend logic for these)
These features require real-world infrastructure, money, or extensive time. We fake them perfectly for the demo:
- **KYC Verification:** Show a hardcoded "Verification Successful ✓" screen. (Do not integrate Smile Identity).
- **MFB Partner Approval:** The credit offer screen uses seeded data. Do not build a live underwriting engine.
- **Paystack Escrow:** Fake the payment state change via UI state or a simple DB toggle.
- **Trust Score Computation:** Pre-calculate the 820 score from seeded job history. Do not make the judges wait for live aggregation.
- **Neighbourhood Filter:** Show the UI dropdowns, but do not wire them up to real Nigerian LGA geodata.
- **Profiles:** Only build 1-2 rich seeded accounts (e.g., "Emeka").

### 🟢 What to DEMO LIVE (Must work flawlessly)
These features prove the technical competence and the emotional core of the product:
- **Voice-to-Intent Task Posting:** The customer speaks -> Gemini extracts Category + Neighbourhood + Budget -> Structured card appears. **This is the Aethex track wow moment.**
- **The Wallet Sweep Animation:** The visual confirmation of the micro-sweep mechanism. The numbers must update dynamically on screen.
- **Hustler Dashboard (Trust Score Breakdown):** Show the *weights* of the signals (consistency, completion rate), not just a raw number, to prove the validity of the behavioral model.
- **Financial Passport View:** One clean screen showing verified income, trust score, credit limit, and loan status. This is the slide the judges will photograph.
