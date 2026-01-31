# ATS Resume Analyzer – PRD (MVP)

## Version
v0.1 – MVP

---

## 1. Problem Statement

Job seekers struggle to understand whether their resumes are ATS-friendly.
Most existing tools are:
- Overcomplicated
- Paid or subscription-based
- Not transparent in scoring

Users need a simple way to check ATS compatibility quickly.

---

## 2. Product Vision

A lightweight ATS Resume Analyzer that:
- Accepts a resume file
- Scrapes and analyzes text
- Displays an ATS compatibility score
- Provides clear, actionable feedback

No accounts. No payments. No AI overkill.

---

## 3. Target Users

- Students
- Job seekers
- Professionals updating resumes

---

## 4. Goals

### Primary Goals
- Upload and parse resumes reliably
- Generate ATS score within seconds
- Clearly explain score breakdown

### Non-Goals
- Resume generation
- Job scraping
- Payments or subscriptions
- AI-powered rewriting

---

## 5. Scope

### In Scope
- Resume upload (PDF / DOCX)
- Resume text extraction
- Section detection
- Rule-based ATS scoring
- Feedback display

### Out of Scope
- User accounts
- Payments
- Job description input
- Resume editing
- Advanced AI features

---

## 6. User Flow

1. Upload resume
2. Resume text is extracted
3. Resume preview is shown
4. ATS score is calculated
5. Feedback is displayed

---

## 7. Success Criteria

- Resume upload → ATS score in < 3 seconds
- Deterministic scoring
- Easy-to-understand feedback

---

## 8. MVP Summary

Upload a resume → scrape text → analyze with rules → show ATS score.
