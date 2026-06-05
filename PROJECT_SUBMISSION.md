# YPIT Hackathon 2026: Project Submission Brief
**Team Name:** Syntax Terrors  
**Track:** Finance  

---

## SECTION A: TEAM DETAILS

### Team Members
1. **Makanjuola Emmanuel** | Software Engineer | makanjuolaiseoluwa1@gmail.com
2. **Joshua Onyeka** | Software Engineer | joshuaonyeka2020@gmail.com
3. **Oke Adrien** | AI Engineer | adrienoke@gmail.com
4. **Ituma Chidi** | Software Engineer | chidimathayas@gmail.com

---

## SECTION B: PROJECT BRIEF

### The Problem
Nigeria's informal economy is valued at $5.17 billion and employs ~3 million gig workers (mechanics, cleaners, plumbers). These workers are completely invisible to the formal financial sector. Traditional banks and digital micro-lenders cannot underwrite them because they lack formal payslips, bank statements, or collateral. At the same time, urban middle-class households struggle to find reliable, verified local service providers.

### Your Target User
Our primary user is the informal service provider (Hustler), such as a generator mechanic or car washer in Lagos. They are WhatsApp-native, use entry-level Android devices, and are data-cost sensitive. They currently struggle to secure loans to buy tools because their income history is unrecorded. 
Our secondary user is the customer—middle-class households in Lagos estate corridors who value reliable, verified service and convenient payment.

### Your Proposed Solution
AreaHustle is a voice-first, hyper-local gig marketplace that turns everyday work into bankable creditworthiness proof. It connects local task-posters with verified service providers. When a task is completed, it updates the Hustler's Financial Passport. AreaHustle then generates a structured **Verified Work Data Package** and a shareable **Creditworthiness Proof Card** aligned with alternate data requirements under the Nigerian Credit Reporting Act of 2017. Lenders use this data to confidently extend credit.

### The AI Component
AI is the core bridge that makes the platform accessible and friction-free for informal workers:
1. **Voice-to-Intent Task Posting:** Aethex STT and Google Gemini Flash extract structured job parameters (budget, category, location) directly from plain speech, bypassing complex web forms.
2. **AI Agent Outbound Match Call & Auto-Booking:** Rather than letting push notifications get closed by battery optimizations, our Aethex Outbound Agent calls the matched premium provider's phone. If they accept via voice ("Yes"), the AI Agent immediately books the job on their behalf in the backend to lock it in and prevent other hustlers in the queue from taking it.
3. **Financial Passport Dashboard:** Hustlers view their verified earnings (30d/60d/90d), consistency index, completion rate, and platform metrics, generating a shareable creditworthiness card.

### Definition of Done
On Demo Day, we will showcase:
1. A customer posting a task using their voice, which Gemini extracts into a structured card.
2. The platform ranking eligible providers and triggering a premium Aethex AI Agent call to the matched Hustler.
3. The Hustler accepting the job via voice, and the AI Agent immediately booking the task on their behalf to prevent other hustlers in queue from claiming it.
4. The Hustler completing the job, updating their Financial Passport, and generating a verified, shareable Creditworthiness Proof Card.

---

## SECTION C: SUPPORT NEEDED

### Biggest unknown or risk right now
Our primary technical risk is ensuring low-latency Aethex voice match calls on congested Nigerian 3G/4G networks, particularly for entry-level Android devices. Our business-side challenge is defining the exact threshold for the alternative data parameters (e.g. income consistency indexes) to ensure the packages we generate are instantly digestible by local digital lenders.

### What mentor support would be most useful this week
Mentorship from credit risk analysts or product leads at Nigerian fintech lenders (e.g., FairMoney, Carbon, Branch) would be highly valuable. Their insight will help validate that our metrics (completion rate, earnings consistency index) map directly into viable inputs for their underwriting models.

### Tools, data, or resources you need
1. **Aethex API Access:** For real-time WebRTC and outbound voice call signaling.
2. **Google Gemini Flash API:** For structured entity extraction from speech transcripts.
3. **Paystack Sandbox Access:** For testing escrow transaction notifications.

---

## ACKNOWLEDGEMENT
**Team Lead Signature:** Oke Adrien  
**Date Submitted:** Monday, June 1, 2026
