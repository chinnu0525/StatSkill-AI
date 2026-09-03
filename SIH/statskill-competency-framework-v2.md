# StatSkill AI — Role-Based Competency Framework
### Built on the 4 problem-statement domains: Statistical | Technical | Digital Governance | Behavioural & Managerial

---

## 1. Roles & Their Routine Activities

| Role | Grade/Service | Routine Activities |
|---|---|---|
| **R1 – JSO** (Junior Statistical Officer) | SSS, Group B non-gaz. | Household/enterprise field visits; CAPI questionnaire administration; first-level scrutiny of collected forms; resolving basic field queries; submitting data upstream to SSO |
| **R2 – SSO** (Senior Statistical Officer) | SSS, Group B gaz. | Supervising JSO field teams; verifying sample selection; second-level data scrutiny; consolidating district-level data; liaising with local administration; basic report/summary generation |
| **R3 – ISS JTS** (entry-level, posted to a division) | ISS, Group A entry | Data cleaning & tabulation for their division's survey (NAS/CPI/IIP/PLFS etc.); running standard estimation scripts; drafting technical notes; assisting STS in methodology checks; responding to inter-division data queries |
| **R4 – ISS STS** (mid-level, division) | ISS, Group A | Designing/revising sampling frames or index methodology; conducting quality audits; training & mentoring JTS/field staff; cross-division data reconciliation; metadata documentation; SDG indicator compilation |
| **R5 – Director/DDG** (division head) | ISS, Group A senior | Approving methodology changes; presenting data to inter-ministerial committees; coordinating base-year revisions; managing division projects/budget; ensuring cybersecurity & privacy compliance for division systems; international review participation (UNSD/ESCAP) |
| **R6 – ADG/DG** (top leadership) | ISS, top mgmt | Setting national statistical policy; cadre management; approving data dissemination policy; representing India at UN Statistical Commission; overseeing digital transformation (cloud/DPI) across MoSPI; leading major reforms/restructuring |

> Note: R3–R5 competency levels below assume the officer is **posted to the relevant division** for that specific subject (e.g. National Accounts competency only applies at high level to someone in NAD). For divisions they're *not* posted to, only a general-awareness level (L1–L2) is expected — this posting-dependence is what lets the same matrix serve every division if you swap which "division-specific" row applies.

---

## 2. Proficiency Scale (used in every table below)
`— ` = Not required · `L1` Aware · `L2` Working (independent, routine) · `L3` Practitioner (adapts to complexity, guides others) · `L4` Advanced (designs methods/standards) · `L5` Master/Strategic (sets national policy/doctrine)

---

## 3. Domain A — Statistical Competencies

| Competency | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Survey Design | L1 | L2 | L3 | L4 | L3 | L2 |
| Sampling | L1 | L2 | L3 | L4 | L3 | L2 |
| National Accounts *(if posted NAD)* | — | — | L3 | L4 | L4 | L3 |
| Price Statistics *(if posted CPI/WPI)* | — | — | L3 | L4 | L4 | L2 |
| Labour Statistics *(if posted PLFS)* | — | — | L3 | L4 | L4 | L2 |
| Agricultural Statistics *(if posted)* | — | — | L3 | L4 | L4 | L2 |
| Industrial Statistics *(if posted IIP/ASI)* | — | — | L3 | L4 | L4 | L2 |
| SDG Indicators | — | L1 | L2 | L3 | L4 | L4 |
| Metadata Standards (NIC/NCO/NMDS) | — | L2 | L3 | L4 | L3 | L2 |
| Data Quality Frameworks (SQAF) | L1 | L3 | L3 | L4 | L4 | L3 |

---

## 4. Domain B — Technical Competencies

| Competency | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Python | — | L1 | L3 | L3 | L2 | L1 |
| R (language) | — | — | L3 | L3 | L2 | L1 |
| SQL | — | L1 | L3 | L3 | L2 | L1 |
| Stata | — | — | L2 | L3 | L2 | — |
| SPSS | — | L1 | L2 | L2 | L1 | — |
| SAS | — | — | L1 | L2 | L2 | — |
| GIS | L1 | L2 | L2 | L2 | L1 | — |
| Data Visualization | — | L1 | L3 | L3 | L3 | L2 |
| AI/ML | — | — | L2 | L3 | L2 | L2 |
| Cloud Computing | — | — | L1 | L2 | L3 | L3 |
| APIs | — | — | L2 | L2 | L2 | L1 |
| Open Data (publishing) | — | L1 | L2 | L3 | L3 | L3 |

---

## 5. Domain C — Digital Governance

| Competency | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Cybersecurity | L1 | L2 | L2 | L3 | L4 | L4 |
| Data Privacy | L2 | L2 | L3 | L3 | L4 | L4 |
| Digital Signatures | — | L1 | L2 | L2 | L3 | L2 |
| Government Cloud | — | — | L1 | L2 | L3 | L3 |
| Digital Public Infrastructure (DPI) | — | — | L1 | L2 | L3 | L4 |

---

## 6. Domain D — Behavioural & Managerial

| Competency | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|
| Leadership | L1 | L2 | L2 | L3 | L4 | L5 |
| Communication | L2 | L3 | L3 | L3 | L4 | L4 |
| Project Management | — | L2 | L2 | L3 | L4 | L4 |
| Ethics | L3 | L3 | L3 | L3 | L4 | L4 |
| Decision Making | L1 | L2 | L2 | L3 | L4 | L5 |
| Change Management | — | L1 | L1 | L2 | L3 | L4 |

---

## 7. How to use this in StatSkill AI

1. **Officer profile = Role (R1–R6) + Division posting.** The system auto-fills their required-level vector from the 4 tables above (33 competencies total), substituting the correct division-specific row in Domain A.
2. **Assessment engine** scores current level (1–5) per competency.
3. **Gap = Required − Current**, computed per domain and overall — this gives you 4 sub-scores (Statistical/Technical/Digital-Gov/Behavioural) plus one composite, which is a clean dashboard visual for judges.
4. **Content tagging**: tag every learning module (yours or existing iGOT CBPs) with one row from these tables — gap-to-content becomes a direct lookup, not a black-box recommendation.
5. **MVP scope suggestion**: build the assessment + recommendation flow fully for **one role** (e.g. R3 – ISS JTS) across all 4 domains, and show the matrix is data-driven/extensible to R1–R6 rather than hardcoding all six for the demo.
