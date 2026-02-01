# ATS Resume Analyzer (MVP)

A lightweight, rule-based ATS (Applicant Tracking System) resume analyzer that allows users to upload a resume, extract its content, and receive an ATS compatibility score with clear, explainable feedback.

This MVP focuses on **speed, transparency, and simplicity** — no accounts, no payments, and no AI overkill.

---

## 🚀 Features

- Upload resumes in **PDF** or **DOCX** format
- Scrape and extract resume text
- Detect standard resume sections:
  - Skills
  - Experience
  - Education
  - Projects
- Generate a **rule-based ATS score (0–100)**
- Show actionable feedback:
  - Missing keywords
  - Formatting issues
  - Section order suggestions
- Deterministic results (same resume → same score)

---

## 🎯 Why Rule-Based ATS?

Most real-world ATS systems rely on:
- Keyword matching
- Section detection
- Basic formatting checks

This project mirrors that behavior to provide:
- Instant feedback
- Explainable scoring
- Predictable results

No external AI models are used.

---

## 🧱 Tech Stack

- **Frontend:** React / Next.js
- **Resume Parsing:**
  - `pdf-parse` for PDF files
  - `mammoth` for DOCX files
- **Logic:** Plain JavaScript / TypeScript (rule-based)
- **State:** Local state only
- **Backend:** Not required for MVP

---

## 🧠 ATS Scoring Logic

The ATS score is calculated out of **100 points**:

| Component         | Weight |
|------------------|--------|
| Section Presence | 30     |
| Keyword Matching | 40     |
| Formatting       | 20     |
| Readability      | 10     |
| **Total**        | **100** |

### Scoring Breakdown

- **Section Presence:** Points awarded for detecting standard sections
- **Keyword Matching:** Match resume text against a predefined keyword list
- **Formatting:** Penalties for ATS-unfriendly patterns (e.g. no bullets)
- **Readability:** Simple heuristics such as line length and text structure

All rules are deterministic and transparent.

---

## 📁 Project Structure (Example)

```txt
src/
├── components/
│   ├── UploadResume.tsx
│   ├── ResumePreview.tsx
│   ├── AtsScore.tsx
│   └── FeedbackPanel.tsx
├── utils/
│   ├── parseResume.ts
│   ├── detectSections.ts
│   ├── atsRules.ts
│   └── keywords.ts
├── pages/
│   └── index.tsx
└── styles/
