# ATS Resume Analyzer – FRD (MVP)

## Version
v0.1 – MVP

---

## 1. System Overview

The system consists of:
- Resume file uploader
- Resume text scraper
- Rule-based ATS scoring engine
- Results & feedback renderer

---

## 2. Functional Requirements

### 2.1 Resume Upload

- FR-1: The system SHALL accept PDF files
- FR-2: The system SHALL accept DOCX files
- FR-3: The system SHALL reject unsupported file formats

---

### 2.2 Resume Scraping (Text Extraction)

- FR-4: The system SHALL extract plain text from resumes
- FR-5: The system SHALL normalize text (lowercase, spacing)
- FR-6: The system SHALL preserve bullet points where possible

---

### 2.3 Resume Preview

- FR-7: The system SHALL display extracted resume text
- FR-8: The system SHALL highlight detected sections

---

### 2.4 Section Detection

The system SHALL detect sections using keyword rules:

| Section     | Keywords |
|------------|----------|
| Skills     | skills, technical skills |
| Experience | experience, work experience |
| Education  | education, academics |
| Projects   | projects |

- FR-9: The system SHALL mark missing sections

---

### 2.5 ATS Scoring Engine (Rule-Based)

#### Section Presence
- FR-10: The system SHALL award points for detected sections

#### Keyword Matching
- FR-11: The system SHALL compare resume text with predefined keywords
- FR-12: The system SHALL calculate keyword match percentage

#### Formatting Rules
- FR-13: The system SHALL detect formatting issues:
  - Missing bullet points
  - Excessive special characters
  - Very long lines

---

### 2.6 ATS Score Calculation

- FR-14: The system SHALL calculate an ATS score between 0–100

#### Score Weights

| Component         | Weight |
|------------------|--------|
| Section Presence | 30     |
| Keyword Matching | 40     |
| Formatting       | 20     |
| Readability      | 10     |
| Total            | 100    |

---

### 2.7 Feedback Output

- FR-15: The system SHALL display missing keywords
- FR-16: The system SHALL display formatting warnings
- FR-17: The system SHALL suggest section order improvements
- FR-18: Feedback SHALL be short and bullet-based

---

## 3. Non-Functional Requirements

- Analysis response time < 1 second
- No external AI dependency
- Deterministic results
- Works without backend database

---

## 4. Constraints

- MVP scope only
- Small team
- Hackathon-friendly implementation

---

## 5. Future Enhancements (Not MVP)

- Job description input
- Resume editing
- AI rewrite suggestions
- Pay-per-minute sessions
- Payments integration
