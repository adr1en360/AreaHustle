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
Middle-class households and small businesses in Nigerian cities struggle to find safe, verified local artisans for routine household tasks.
 Meanwhile, informal workers waste productive hours waiting for sporadic jobs and lack the formal income history required to access credit. Existing gig platforms fail to solve this because they rely on unscalable transaction commissions for micro-tasks rather than addressing the core financial exclusion of the workers.

### Your Target User
We are building for skilled informal workers, like a generator mechanic in Lagos using an entry-level Android phone. Currently, they rely on unpredictable jobs, leaving them with no verifiable financial history to secure micro-loans for new tools. If our solution works, every job they complete will automatically build a behavioral credit profile, allowing them to use a hands-free voice interface to check their updated credit metrics and access working capital.

### Your Proposed Solution
We are building a mobile-first, hyper-local gig marketplace with an integrated behavioral credit engine. For this week, we are building a functional flow where a customer posts a task using their voice, and a Hustler accepts it. Once completed, the job instantly updates the Hustler's Financial Passport, allowing them to use a hands-free voice interface to check their updated credit metrics.

### The AI Component
AI removes the severe friction of text-based interfaces for our low-literacy users. Aethex's localized Speech-to-Text and Text-to-Speech infrastructure allows users to post tasks and query complex financial metrics entirely by voice in English, French, or Arabic. Additionally, Gemini extracts structured entities (like budget and location) from these voice transcripts, while a machine learning model computes behavioral trust scores to underwrite the micro-credit.

### Definition of Done
On Demo Day, we will show a working mobile app where a customer dictates a task using the Aethex voice API, which automatically fills the submission form. We will then demonstrate the data-to-credit loop by having the Hustler use a conversational voice command to check their updated trust score and loan eligibility after completing that job.

---

## SECTION C: SUPPORT NEEDED

### Biggest unknown or risk right now
Our biggest technical risk is ensuring low-latency, accurate voice interactions for informal workers using entry-level Android devices on congested 3G/4G networks. Specifically, we are uncertain how well the Aethex Speech-to-Text models will handle heavy Nigerian accents or local dialects in real-time without frustrating the user. While we plan to mitigate this using prompt engineering and Gemini 1.5 Flash as a semantic "correction layer," validating this flow in the wild is our biggest hurdle this week.

### What mentor support would be most useful this week
We need a mentor with experience in Voice AI and WebRTC to help us optimize our audio streaming constraints for low-bandwidth African networks. Additionally, someone with domain expertise in African fintech or micro-lending would be invaluable to help us refine our behavioral trust scoring model—ensuring that our platform signals (like "repeat hire ratios") translate robustly into a viable credit score that a microfinance bank would actually accept.

### Tools, data, or resources you need
1. **Aethex API Access:** Full access to Agents, WebRTC, and STT/TTS documentation/keys.
2. **Gemini 1.5 Flash API:** For real-time intent extraction and transcript correction.
3. **Cloud Hosting Credits:** To deploy our FastAPI backend and MongoDB database (e.g., Railway, Render, or GCP).

---

## ACKNOWLEDGEMENT
**Team Lead Signature:** Oke Adrien  
**Date Submitted:** Monday, June 1, 2026
