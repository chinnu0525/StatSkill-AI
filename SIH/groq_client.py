"""
Groq API Wrapper for StatSkill AI — Ministry Competency Quiz Generation
Supports ultra-fast LPU inference (llama-3.3-70b-versatile / llama-3.1-8b-instant),
role-calibrated question generation across 10 Ministries and 44 Departments,
and graceful offline fallback.
"""

import os
import json
import re
import time
import urllib.request
import urllib.error

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
DEFAULT_MODEL = "llama-3.3-70b-versatile"
FAST_MODEL = "llama-3.1-8b-instant"

# Ministry-specific curated questions for instant offline fallback or zero-latency testing
DEPARTMENTAL_FALLBACK_QUESTIONS = {
    "Water Resources": [
        {
            "id": "q_water_1",
            "question": "In the Minor Irrigation (MI) Census and Census of Water Bodies conducted under Ministry of Jal Shakti, which criterion defines a 'Water Body' for official statistical enumeration?",
            "options": [
                "All natural or man-made units bounded on all sides with some or no masonry work used for storing water for irrigation or other purposes.",
                "Only natural lakes and perennial rivers having a surface catchment area exceeding 100 hectares.",
                "Structures purely used for temporary rainwater collection without any permanent water retention capability.",
                "Piped overhead municipal water reservoirs and swimming pools in commercial complexes."
            ],
            "correctAnswerIndex": 0,
            "competency": "Water Resources Statistics",
            "bloomLevel": "Understand",
            "difficulty": "Medium",
            "explanation": "Under the Ministry of Jal Shakti guidelines, water bodies are natural or man-made units bounded on all sides with masonry or earthen bunds used for irrigation, drinking, or recreation. Flowing rivers, swimming pools, and domestic overhead tanks are explicitly excluded.",
            "sourceReference": "Ministry of Jal Shakti — 6th MI Census & 1st Water Bodies Census Manual, Section 2.1",
            "confidenceScore": 99
        },
        {
            "id": "q_water_2",
            "question": "When assessing groundwater extraction in Minor Irrigation schemes, what constitutes the defining threshold between 'Dugwell' and 'Deep Tubewell' in official schematics?",
            "options": [
                "A deep tubewell operates at depths typically exceeding 60-70 metres with high-capacity submersible discharge (>15-20 HP), whereas a dugwell is an open masonry excavation tapping unconfined aquifers.",
                "There is no depth differentiation; the classification is based solely on whether water is used for rabi or kharif crops.",
                "Dugwells are exclusively energized by solar panels while deep tubewells must use diesel generators.",
                "Deep tubewells are only enumerated in coastal saline tracts."
            ],
            "correctAnswerIndex": 0,
            "competency": "Minor Irrigation Census Methodology",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "Dugwells tap shallow unconfined water tables through open excavation, while deep tubewells penetrate deeper confined aquifer strata using mechanized drilling and heavy submersible pumps.",
            "sourceReference": "Central Ground Water Board (CGWB) & MI Census Classification Standards",
            "confidenceScore": 98
        },
        {
            "id": "q_water_3",
            "question": "Under the National Hydrology Project (NHP), what digital quality assurance protocol is mandatory before ingesting real-time automated telemetry data into the National Water Informatics Centre (NWIC) database?",
            "options": [
                "Automated range checks, persistence tests, and spatial neighbor consensus checks to flag sensor drift and telemetry dropouts.",
                "Manual physical verification by a field engineer at every gauge station every 2 hours.",
                "Rounding all stage-discharge hydrographs to the nearest integer metre.",
                "Discarding all monsoon period flood discharge telemetry as statistical outliers."
            ],
            "correctAnswerIndex": 0,
            "competency": "Water Body Enumeration Standards",
            "bloomLevel": "Analyze",
            "difficulty": "Medium",
            "explanation": "Automated data validation for hydrometric networks requires real-time range bounds, rate-of-change thresholds, and spatial cross-station consistency to detect faulty transducers without interrupting real-time dissemination.",
            "sourceReference": "NWIC / NHP Data Dissemination & Telemetry Standards Manual",
            "confidenceScore": 99
        }
    ],
    "National Accounts": [
        {
            "id": "q_nad_1",
            "question": "In the System of National Accounts (SNA 2008) followed by MoSPI NAD, how is Gross Value Added (GVA) at basic prices derived from Gross Output and Intermediate Consumption?",
            "options": [
                "GVA at basic prices = Gross Output at basic prices minus Intermediate Consumption at purchasers' prices.",
                "GVA at basic prices = Gross Output at market prices plus Product Subsidies minus Net Taxes.",
                "GVA at basic prices = Total Wages and Salaries plus Depreciation only.",
                "GVA at basic prices = Gross Domestic Product minus Exports."
            ],
            "correctAnswerIndex": 0,
            "competency": "National Accounts",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "SNA 2008 defines GVA at basic prices as the value of output measured at basic prices less the value of intermediate inputs evaluated at purchasers' prices.",
            "sourceReference": "MoSPI National Accounts Statistics (NAS) Sources & Methods 2015, Chapter 2",
            "confidenceScore": 99
        },
        {
            "id": "q_nad_2",
            "question": "When transitioning from GVA at basic prices to GDP at market prices under India's national accounting framework, which adjustment is made?",
            "options": [
                "GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies.",
                "GDP at market prices = GVA at basic prices - Production Taxes + Production Subsidies.",
                "GDP at market prices = GVA at basic prices + Net Factor Income from Abroad.",
                "GDP at market prices = GVA at factor cost / Wholesale Price Index."
            ],
            "correctAnswerIndex": 0,
            "competency": "SNA 2008 & GVA Compilation",
            "bloomLevel": "Understand",
            "difficulty": "Medium",
            "explanation": "GDP at market prices reflects consumer acquisition prices, requiring addition of product taxes (like GST, excise, customs) and deduction of product subsidies (like food, fertilizer, petroleum subsidies).",
            "sourceReference": "Advisory Committee on National Accounts (ACNA) — Base Year Revision Guidelines",
            "confidenceScore": 99
        }
    ],
    "Education": [
        {
            "id": "q_edu_1",
            "question": "In the Unified District Information System for Education Plus (UDISE+), how is the Adjusted Net Enrolment Rate (ANER) for upper primary education computed?",
            "options": [
                "Total number of children of upper primary school age (11-13 yrs) enrolled in upper primary or higher grades, expressed as a percentage of the corresponding official age population.",
                "Total children enrolled in Class 6 to 8 regardless of age divided by the total district population.",
                "Ratio of female students to male students enrolled in government primary schools.",
                "Number of students passing Class 8 board examination divided by total enrolled in Class 1."
            ],
            "correctAnswerIndex": 0,
            "competency": "Educational Statistics (UDISE+/AISHE)",
            "bloomLevel": "Analyze",
            "difficulty": "Medium",
            "explanation": "ANER accounts for official age-group children enrolled in either the target stage or a higher educational stage, avoiding penalization for early progression.",
            "sourceReference": "Department of School Education & Literacy, UDISE+ Indicator Formulation Manual",
            "confidenceScore": 98
        }
    ],
    "Labour & Employment": [
        {
            "id": "q_labour_1",
            "question": "In the Periodic Labour Force Survey (PLFS) conducted by NSO, what is the activity status criterion for classifying an individual as 'Employed' under the Usual Status (ps+ss) approach?",
            "options": [
                "The individual spent a major time (>= 183 days) in economic activity during the 365-day reference period, or at least 30 days in subsidiary economic activity.",
                "The individual worked for at least 1 hour on each day of the preceding 7 days.",
                "The individual worked in an enterprise registered under the Factories Act with formal EPF contributions.",
                "The individual completed vocational apprenticeship under National Skill Development Corporation."
            ],
            "correctAnswerIndex": 0,
            "competency": "Labour Force & Employment Statistics",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "Usual Principal Activity Status (ps) determines the majority time engagement in the reference year; Usual Status (ps+ss) additionally includes persons whose principal status was non-worker but who engaged in subsidiary economic work for 30+ days.",
            "sourceReference": "NSO PLFS Annual Report Methodology & Survey Design Chapter",
            "confidenceScore": 99
        }
    ],
    "Agriculture": [
        {
            "id": "q_agri_1",
            "question": "Under the General Crop Estimation Survey (GCES) conducted across States, how are sample crop cutting experiment (CCE) plots of standard size (e.g. 5m x 5m) objectively laid inside a selected survey field?",
            "options": [
                "By measuring length and breadth in paces, using random number tables to fix the southwest corner coordinates, and laying the equilateral rectangle.",
                "By choosing the visibly highest-yielding corner of the field to maximize crop estimates.",
                "By taking an ocular visual inspection without physical harvesting.",
                "By harvesting the entire farm parcel and dividing by total land revenue tax."
            ],
            "correctAnswerIndex": 0,
            "competency": "Agricultural Statistics & Crop Cutting",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "GCES protocol mandates objective random selection of the experimental plot using random number pairs matched to field dimensions to prevent observer bias.",
            "sourceReference": "Directorate of Economics & Statistics (DES-Agri) GCES Field Protocol Manual",
            "confidenceScore": 99
        }
    ],
    "Health": [
        {
            "id": "q_health_1",
            "question": "In the National Family Health Survey (NFHS), what two-stage stratified sampling protocol is utilized to select rural primary sampling units (PSUs)?",
            "options": [
                "Selection of villages as PSUs with Probability Proportional to Size (PPS) from Census lists, followed by complete household listing and systematic random sampling of households.",
                "Purposive sampling of district hospitals followed by quota sampling of outpatient records.",
                "Simple random sampling of individual citizens directly from electoral rolls.",
                "Voluntary self-reporting at Anganwadi centers."
            ],
            "correctAnswerIndex": 0,
            "competency": "Health Systems Analytics & NFHS",
            "bloomLevel": "Understand",
            "difficulty": "Medium",
            "explanation": "NFHS applies a rigorous two-stage stratified design where rural villages or urban Census Enumeration Blocks (CEBs) are sampled via PPS in the first stage.",
            "sourceReference": "International Institute for Population Sciences (IIPS) & MoHFW NFHS Survey Design Manual",
            "confidenceScore": 99
        }
    ],
    "Rural Development": [
        {
            "id": "q_rural_1",
            "question": "Under the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) real-time MIS, what statistical verification protocol ensures genuine person-day generation audits?",
            "options": [
                "National Mobile Monitoring System (NMMS) geo-tagged, time-stamped attendance verification with two-factor biometric e-muster reconciliation.",
                "Quarterly paper affidavits signed by local contractors without physical attendance logs.",
                "Ocular headcount estimation at the end of each financial year.",
                "Telephone voice sample surveys conducted on a 0.1% sample size."
            ],
            "correctAnswerIndex": 0,
            "competency": "Rural Development Survey Design & MIS",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "NMMS requires real-time capturing of geo-referenced photographs of workgroups twice a day, synchronized with NREGASoft central database to prevent ghost workdays.",
            "sourceReference": "Ministry of Rural Development — MGNREGA Real-Time MIS Operational Circular",
            "confidenceScore": 99
        }
    ],
    "Finance": [
        {
            "id": "q_finance_1",
            "question": "When computing the fiscal deficit under the Indian Government financial reporting standards, which component is explicitly excluded from 'Total Revenue & Non-Debt Capital Receipts'?",
            "options": [
                "Borrowings and other liabilities incurred to bridge the fiscal gap.",
                "Net tax revenue collected via GST, direct taxes, and customs duties.",
                "Recovery of loans disbursed to State Governments and Union Territories.",
                "Dividends and profits remitted by Public Sector Undertakings (PSUs) and the RBI."
            ],
            "correctAnswerIndex": 0,
            "competency": "Fiscal Statistics & Public Finance",
            "bloomLevel": "Analyze",
            "difficulty": "Medium",
            "explanation": "Fiscal Deficit is defined as Total Budget Expenditure minus (Revenue Receipts + Non-debt Capital Receipts). Market borrowings and other liabilities are the financing items, not receipts.",
            "sourceReference": "Ministry of Finance — Budget at a Glance & Fiscal Responsibility Framework (FRBM)",
            "confidenceScore": 99
        }
    ],
    "Commerce": [
        {
            "id": "q_commerce_1",
            "question": "In the compilation of the Index of Industrial Production (IIP) by MoSPI ESD in coordination with DPIIT, what base-weighting system is used?",
            "options": [
                "Laspeyres formula with fixed base-year gross value added (GVA) weights derived from the Annual Survey of Industries (ASI).",
                "Paasche index where item weights change every calendar month according to retail sales.",
                "Simple unweighted geometric mean of factory production quantities.",
                "Fischer ideal index requiring simultaneous quarterly consumer price surveys."
            ],
            "correctAnswerIndex": 0,
            "competency": "Industrial Statistics & IIP Compilation",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "The IIP in India is compiled as a Laspeyres weighted average of quantity relatives, where weights reflect the sector's contribution to industrial GVA in the base year (ASI data).",
            "sourceReference": "Technical Advisory Committee on Index of Industrial Production (IIP) Guidelines",
            "confidenceScore": 99
        }
    ],
    "Consumer Affairs": [
        {
            "id": "q_consumer_1",
            "question": "Under the Price Monitoring Cell (PMC) of the Department of Consumer Affairs, what frequency and methodology govern the monitoring of retail and wholesale prices for essential commodities?",
            "options": [
                "Daily price reporting across designated reporting centres covering 22 essential commodities through a digital mobile web portal with automated outlier detection.",
                "Monthly paper circulars collected from APMC grain mandis only.",
                "Annual sample surveys conducted by university researchers.",
                "Voluntary crowd-sourced social media feedback."
            ],
            "correctAnswerIndex": 0,
            "competency": "Price Statistics & Commodity Price Monitoring",
            "bloomLevel": "Apply",
            "difficulty": "Medium",
            "explanation": "PMC monitors daily retail and wholesale prices of 22 essential food commodities from over 550 reporting centres nationwide via an online portal with automated modal price computation.",
            "sourceReference": "Department of Consumer Affairs — Daily Price Reporting System Protocol",
            "confidenceScore": 99
        }
    ]
}


class GroqQuizClient:
    """
    Wrapper for Groq Cloud API LPU endpoints.
    Handles authentication, prompt composition, JSON-mode structured response,
    cadre-grade calibration, and offline fallbacks.
    """

    def __init__(self, api_key=None, model=DEFAULT_MODEL):
        self.api_key = api_key or os.environ.get("GROQ_API_KEY", "").strip()
        self.model = model
        self.last_latency_ms = None
        self.last_error = None

    def is_configured(self):
        return bool(self.api_key and len(self.api_key) > 10)

    def set_api_key(self, api_key):
        self.api_key = (api_key or "").strip()
        os.environ["GROQ_API_KEY"] = self.api_key

    def get_status(self):
        return {
            "configured": self.is_configured(),
            "hasKey": bool(self.api_key),
            "model": self.model,
            "provider": "Groq Cloud LPU™",
            "lastLatencyMs": self.last_latency_ms,
            "lastError": self.last_error,
            "supportedModels": [DEFAULT_MODEL, FAST_MODEL, "mixtral-8x7b-32768"]
        }

    def generate_quiz(self, ministry="Ministry of Statistics & Programme Implementation",
                      department="National Statistical Office (NSO - NAD)",
                      sector_tag="Official Statistics",
                      d6_competencies=None,
                      role_grade="R3",
                      num_questions=5,
                      difficulty="Medium",
                      bloom_level="Apply",
                      topic=None,
                      language="English"):
        """
        Generate ministry-specific quiz questions using Groq API.
        If API key is missing or call fails, gracefully returns high-quality fallback questions.
        """
        if d6_competencies is None:
            d6_competencies = ["Survey Design", "National Statistical Standards"]
        elif isinstance(d6_competencies, str):
            d6_competencies = [c.strip() for c in d6_competencies.split(",") if c.strip()]

        num_q = max(3, min(30, int(num_questions or 5)))

        # If no key, immediately provide curated fallback
        if not self.is_configured():
            return self._build_fallback_response(
                ministry, department, sector_tag, d6_competencies,
                role_grade, num_q, difficulty, bloom_level, topic,
                reason="Groq API key not configured. Using pre-curated Ministry Cadre Questions."
            )

        system_prompt = (
            "You are a Senior Statistical Board Examiner for the Government of India (MoSPI / National Statistical Systems). "
            "Your task is to generate high-rigour, official, accurate multiple-choice assessment questions (MCQs) for government statistical officers.\n\n"
            "CRITICAL RULES:\n"
            "1. Ground every question strictly in the specified Indian Ministry, Department, and Sectoral Competencies.\n"
            "2. CALIBRATION BY ROLE GRADE:\n"
            "   - R1 (Field Enumerator / JSO): Level 1-2 difficulty. Focus on field protocols, schedule filling, definitions, and data capture.\n"
            "   - R2 (Statistical Supervisor / SSO): Level 2-3 difficulty. Focus on supervision, data inspection, SQAF, and cross-checks.\n"
            "   - R3 (Assistant Director / ISS JTS): Level 3 difficulty AT MOST. Focus on applied methodology, multiplier weights, tabulation, and standard analysis. DO NOT generate Level 5 strategic policy questions.\n"
            "   - R4 (Deputy Director / ISS STS): Level 4 difficulty. Focus on survey methodology design, sampling frames, and standards.\n"
            "   - R5 (Director / DDG): Level 4-5 difficulty. Focus on division-wide methodology, quality audits, and administrative data.\n"
            "   - R6 (ADG / DG): Level 5 difficulty. Focus on national statistical doctrine, inter-agency coordination, and UN FP-OS.\n"
            "3. Every question must have exactly 4 options (A, B, C, D).\n"
            "4. Exactly one option must be the correct answer. Provide the 0-indexed integer `correctAnswerIndex` (0 for A, 1 for B, 2 for C, 3 for D).\n"
            "5. Provide an authoritative explanation referencing official Government of India manual/guidelines/circulars.\n"
            "6. Output MUST be valid JSON only matching the schema: { \"questions\": [ ... ] }"
        )

        user_prompt = (
            f"Generate {num_q} official MCQs with the following configuration:\n"
            f"- Ministry: {ministry}\n"
            f"- Department: {department}\n"
            f"- Sector Tag: {sector_tag}\n"
            f"- Sectoral (D6) Competencies: {', '.join(d6_competencies)}\n"
            f"- Officer Role Cadre: {role_grade}\n"
            f"- Target Difficulty: {difficulty}\n"
            f"- Bloom's Taxonomy: {bloom_level}\n"
            f"- Topic Focus: {topic if topic else 'Department core duties, estimation methods, and official standards'}\n"
            f"- Language: {language}\n\n"
            "JSON Format required:\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "id": "q_1",\n'
            '      "question": "Question text...",\n'
            '      "options": ["Option A", "Option B", "Option C", "Option D"],\n'
            '      "correctAnswerIndex": 0,\n'
            f'      "competency": "{d6_competencies[0] if d6_competencies else sector_tag}",\n'
            f'      "bloomLevel": "{bloom_level}",\n'
            f'      "difficulty": "{difficulty}",\n'
            '      "explanation": "Detailed explanation...",\n'
            f'      "sourceReference": "{ministry} Official Operational Guidelines",\n'
            '      "confidenceScore": 99\n'
            "    }\n"
            "  ]\n"
            "}"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        start_time = time.time()
        try:
            req = urllib.request.Request(
                GROQ_API_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                raw_data = response.read().decode("utf-8")
                self.last_latency_ms = round((time.time() - start_time) * 1000)
                self.last_error = None

                res_json = json.loads(raw_data)
                content = res_json["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                questions = parsed.get("questions") or []

                if not questions:
                    raise ValueError("Empty questions array returned by Groq")

                # Sanitize questions to guarantee required fields
                cleaned_questions = []
                for idx, q in enumerate(questions):
                    cleaned_questions.append({
                        "id": q.get("id") or f"groq_q_{idx+1}",
                        "question": q.get("question", "Official Statistical Question"),
                        "options": q.get("options") if (isinstance(q.get("options"), list) and len(q.get("options")) == 4) else [
                            "Option A", "Option B", "Option C", "Option D"
                        ],
                        "correctAnswerIndex": max(0, min(3, int(q.get("correctAnswerIndex", 0)))),
                        "competency": q.get("competency") or sector_tag,
                        "bloomLevel": q.get("bloomLevel") or bloom_level,
                        "difficulty": q.get("difficulty") or difficulty,
                        "explanation": q.get("explanation", "Verified against official GoI statistical standards."),
                        "sourceReference": q.get("sourceReference", f"{ministry} Circular & Guidelines"),
                        "confidenceScore": int(q.get("confidenceScore", 98))
                    })

                return {
                    "success": True,
                    "poweredBy": f"Groq LPU ({self.model})",
                    "latencyMs": self.last_latency_ms,
                    "isLiveAI": True,
                    "ministry": ministry,
                    "department": department,
                    "roleGrade": role_grade,
                    "sectorTag": sector_tag,
                    "count": len(cleaned_questions),
                    "questions": cleaned_questions
                }

        except Exception as e:
            self.last_error = str(e)
            print(f"[Groq Client Warning] API call failed ({e}). Falling back to curated departmental dataset.")
            return self._build_fallback_response(
                ministry, department, sector_tag, d6_competencies,
                role_grade, num_q, difficulty, bloom_level, topic,
                reason=f"Groq API connection unavailable ({str(e)}). Serving pre-curated Ministry Cadre questions."
            )

    def _build_fallback_response(self, ministry, department, sector_tag, d6_competencies,
                                role_grade, count, difficulty, bloom_level, topic, reason=""):
        """Generate high-quality role-bounded fallback questions from the curated knowledge base."""
        # Find matching questions by sector tag, ministry, department or competencies
        matched = []
        search_blob = f"{ministry} {department} {sector_tag} {' '.join(d6_competencies or [])}".lower()

        for tag, qlist in DEPARTMENTAL_FALLBACK_QUESTIONS.items():
            if tag.lower() in search_blob:
                matched = qlist
                break

        if not matched:
            matched = DEPARTMENTAL_FALLBACK_QUESTIONS.get("National Accounts") or DEPARTMENTAL_FALLBACK_QUESTIONS["Water Resources"]

        questions = []
        for i in range(count):
            base_q = matched[i % len(matched)]
            comp_name = d6_competencies[i % len(d6_competencies)] if d6_competencies else sector_tag
            questions.append({
                "id": f"gov_q_{i+1}",
                "question": base_q["question"] if i < len(matched) else f"Under {department} ({ministry}), which standard protocol governs the quality audit of {comp_name} for {role_grade} officers?",
                "options": base_q["options"] if i < len(matched) else [
                    f"Applying Indian Statistical Quality Assurance Framework (SQAF) with microdata verification.",
                    f"Informal sample estimation without secondary audit trails.",
                    f"Immediate public release without anonymization or disclosure checks.",
                    f"Ad-hoc manual aggregation using unverified spreadsheets."
                ],
                "correctAnswerIndex": base_q["correctAnswerIndex"] if i < len(matched) else 0,
                "competency": comp_name,
                "bloomLevel": bloom_level,
                "difficulty": difficulty,
                "explanation": base_q["explanation"] if i < len(matched) else f"All official data products under {ministry} must comply with SQAF validation and cadre guidelines.",
                "sourceReference": base_q["sourceReference"] if i < len(matched) else f"{ministry} Operational Guidelines ({department})",
                "confidenceScore": 99
            })

        return {
            "success": True,
            "poweredBy": "StatSkill AI Departmental Knowledge Base (Groq Fallback)",
            "isLiveAI": False,
            "note": reason,
            "ministry": ministry,
            "department": department,
            "roleGrade": role_grade,
            "sectorTag": sector_tag,
            "count": len(questions),
            "questions": questions
        }


# Global Singleton Client
groq_quiz_client = GroqQuizClient()
