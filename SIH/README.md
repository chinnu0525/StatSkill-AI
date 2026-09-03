# StatSkill AI — AI-Powered Competency & Learning Platform for Official Statistics

> **Tagline**: *"Building a Future-Ready Statistical Workforce"*  
> **Agency**: Ministry of Statistics and Programme Implementation (MoSPI) / National Statistical Systems Training Academy (NSSTA)

---

## 1. Overview & Core Mission

**StatSkill AI** is a state-of-the-art, secure, scalable, AI-enabled competency intelligence and capacity-building platform designed specifically for the **National Statistical System (NSS)** of India. 

The platform integrates directly with the **iGOT Karmayogi** learning ecosystem, **NSSTA** training programmes, and **TPAC** recommendations, creating a measurable 360° capacity building loop:

$$\text{Competency Profiling} \longrightarrow \text{Skill Gap Identification} \longrightarrow \text{Explainable AI Recommendations} \longrightarrow \text{Learning Pathways} \longrightarrow \text{AI MCQ Generation} \longrightarrow \text{Assessment Player} \longrightarrow \text{+6\% Competency Gain} \longrightarrow \text{Workforce Analytics}$$

---

## 2. Key Modules & Architectural Highlights

### A. Role-Based Experiences & Persona Access
- **Learner Experience**: Personalized dashboard for **Ananya Sharma (Statistical Officer, NSO)** with real-time competency delta tracking, 5 KPI cards, Competency Radar chart, prioritized skill gaps list, and active learning roadmaps.
- **Trainer / Faculty Console**: Question bank QA pipeline for **Dr. Rajesh Verma (NSSTA Faculty)** with source verification, draft approval queues, and cohort weak-topic diagnostics.
- **Administrator Hub**: Enterprise workforce intelligence for **Smt. Priya Menon (Capacity Building Director, MoSPI)** with Departmental Competency Heatmaps and 3-Year Future Skills Forecasting.
- **Super Administrator**: System configuration, iGOT API Gateway sync monitor, and compliance auditing.

### B. Transparent AI Learning Advisor & Recommendation Engine
Uses an explainable multi-attribute decision model with transparent formula scoring:
$$\text{Recommendation Score} = 30\% \text{ Gap} + 20\% \text{ Role} + 15\% \text{ Career} + 15\% \text{ Dept} + 10\% \text{ Prior} + 10\% \text{ Demand}$$
Every recommendation provides an interactive **"Why this course?"** breakdown modal displaying individual sub-scores.

### C. Grounded AI Assessment & MCQ Generator
- Uploads or selects approved training manuals (e.g., *NSSO 78th Round Sampling Design Manual*, *Data Quality Framework for Official Statistics*).
- Multi-step QA Pipeline: Semantic Chunking $\rightarrow$ Topic Extraction $\rightarrow$ Bloom's Taxonomy Alignment $\rightarrow$ Hallucination Verification $\rightarrow$ Source Grounding.
- Interactive **"View Source"** modal displaying exact page and ground-truth text snippets.

### D. Timed Quiz Player & Competency Delta Boost
- Full exam mode with question status palette, timer, auto-save, and mark for review.
- Instant submission score with **+6% Competency Score Boost**, personalized strength vs weakness feedback, and automated loop back to learning paths.

### E. Floating StatSkill AI Virtual Assistant (RAG Chatbot)
- Floating assistant with quick prompts, RAG citations to official statistical guidelines, and compliance disclaimers.

### F. Accessibility & Digital India Design Language
- High-contrast mode toggle, font size adjusters (A-, A, A+), WCAG 2.1 AA compliant color ratios, and multilingual support (English, हिन्दी, తెలుగు).

---

## 3. How to Run Locally

### Start Server
Run the built-in server from the project directory:

```bash
python3 server.py
```

### Access URL
Open your web browser and navigate to:
```
http://localhost:8000
```

---

## 4. REST API Endpoints

- `GET /api/state` — Full reactive state for demo session.
- `GET /api/competencies` — Official statistics competency definitions and 5-level criteria.
- `GET /api/learning-path` — Phased learning roadmap items.
- `GET /api/igot/status` — iGOT Karmayogi bidirectional sync telemetry.
- `POST /api/assessments/submit` — Submit quiz, calculate score, apply +6% competency gain.
- `POST /api/ai/generate-questions` — Grounded question generation with Bloom's taxonomy.
- `POST /api/ai/chat` — RAG-backed statistical assistant chat.
