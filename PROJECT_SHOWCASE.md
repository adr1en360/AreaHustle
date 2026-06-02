# AreaHustle: Bridging the Financial Gap with Voice-First AI
**A YPIT Hackathon 2026 Submission (Finance Track + Aethex Voice AI Track)**

---

## 1. What is AreaHustle?
AreaHustle is a hyper-local gig marketplace and behavioral credit engine designed to bring Nigeria's massive informal economy into the formal financial system. It connects verified local service providers (Hustlers) with middle-class households and small businesses, while simultaneously building a **Hustler Financial Passport**
—a data-driven alternative to traditional credit history.

## 2. How it Works (The Technology)

### 🎙️ Aethex Voice-First Architecture
To serve the millions of Nigerians who are WhatsApp-native but may struggle with complex UI forms, AreaHustle implements a **Voice-First** entry point:
- **Voice-to-Intent Task Posting:** Customers simply "speak" their task. We use **Aethex API** for low-latency speech-to-text (STT) that understands local accents. The transcript is then processed by **Gemini 1.5 Flash** to extract structured data (Category, Neighbourhood, Budget).
- **Conversational Financial Passport:** Hustlers can query their Trust Score, earnings, and loan eligibility through a real-time **WebRTC-based voice session**. This allows for "hands-free" financial education and status checks.

### 📍 Hyper-Local Discovery Engine
AreaHustle utilizes a "Filter, Not Fence" location model. Instead of battery-draining real-time GPS tracking, we use **MongoDB geospatial and text indexes** to match users based on neighbourhood tags (e.g., Lekki Phase 1, Ajah, Magodo). This respects the infrastructure constraints of entry-range Android devices common in the Nigeria market.

### 🛡️ Behavioral Trust Scoring (The AI Core)
We use a composite AI model to compute a **Trust Score (0-1000)** based on:
- Job completion rates.
- On-time arrival timestamps.
- Repeat hire ratios (Loyalty).
- Dispute history.
This score serves as the underwriting data for our micro-credit engine.

## 3. The Core Financial Mechanics (Explained Simply)

### 🔒 Escrow (The Lockbox)
Imagine a lockbox. A customer wants their car washed. Before the Hustler shows up, the customer puts ₦8,000 into the lockbox. Neither party can touch it. AreaHustle holds the key. Once the job is confirmed done, AreaHustle opens the lockbox and pays the Hustler. If the Hustler doesn't show up, the customer gets their money back. **Escrow protects the customer's money until the job is done.**

### 💸 Loan Sweep (The Intercept)
A Hustler has a ₦40,000 loan for a pressure washer. Instead of sending him a monthly bill (which he might not pay), AreaHustle intercepts his earnings automatically. 
If a job pays ₦5,000:
- **₦1,000 goes to loan repayment** → **₦4,000 goes to the Hustler.**
He never had the ₦1,000 in his hand, so he can't spend it elsewhere. The loan pays itself from his work. **The sweep protects the loan repayment before the Hustler can spend it.**

### ⚠️ What if the Hustler disappears?
If jobs reduce, the sweep reduces (no fixed bill to miss). But if a Hustler vanishes completely for months, we are protected by three things:
1. **The MFB Partner holds the debt:** AreaHustle is the tech provider. The actual capital risk sits with a licensed Microfinance Bank.
2. **The Asset is the Collateral:** We don't lend cash; we lend income-generating equipment (like a pressure washer) registered to the loan.
3. **Data-Driven Sizing:** Credit limits are strictly sized to actual historical income velocity.

## 4. Why AreaHustle? (The Impact)

### Financial Inclusion for the "Un-underwritable"
Traditional banks (and even most digital lenders) cannot serve informal workers because they lack payslips and formal collateral. AreaHustle unlocks this data by treating **consistent "hustle" as collateral**. Every job completed is a verified income signal that powers a micro-loan pipeline via our MFB partners.

### Local Language & Cultural Nuance
By integrating Aethex, we move beyond the "Western" UI paradigm. We meet the African user where they are—using speech, local dialects (English, French, and upcoming Arabic/Pidgin support), and a mobile-first, data-cost-sensitive approach.

### Scalable Unit Economics
While traditional task marketplaces struggle with commission-dependent models on small tasks, AreaHustle’s primary revenue driver is **Net Interest Margin (NIM)** on equipment micro-loans. This allows us to scale even on sub-₦5,000 micro-tasks, making the platform viable for the "trader in Balogun Market" or the "artisan in Kano."

---
**Built for the future of Africa. Built for the Hustle.**
