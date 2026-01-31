import { ATSResult, Section } from "./types";
import { KEYWORDS, SECTION_KEYWORDS, REQUIRED_SECTIONS } from "./keywords";

/**
 * Normalizes text for analysis
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Detects sections in the resume text
 */
function detectSections(text: string): Section[] {
  const lowerText = text.toLowerCase();
  
  return REQUIRED_SECTIONS.map((sectionName) => {
    const keywords = SECTION_KEYWORDS[sectionName];
    // Check if any of the section keywords exist in the text
    // We are looking for headers, so we might check for newlines or just presence for MVP
    // For MVP, simple presence in the first part of a line or surrounded by newlines is a good heurestic,
    // but the prompt says "Detect sections using keyword matching".
    // We'll search for the keyword presence.
    
    // A simple robust check: does the text contain the keyword followed by newline or colon?
    // Or just simple inclusion for MVP as requested "keyword matching".
    const present = keywords.some((k) => lowerText.includes(k));
    
    return {
      name: sectionName,
      present,
      content: "", // Content extraction is complex without NLP, keeping empty for MVP logic unless we implement a simple splitter
    };
  });
}

/**
 * Calculates keyword match percentage
 */
function calculateKeywordMatch(text: string): { matches: string[]; score: number } {
  const lowerText = text.toLowerCase();
  const matches = KEYWORDS.filter((k) => lowerText.includes(k));
  const percentage = matches.length / KEYWORDS.length;
  // Cap at 100% logic is handled by just taking the ratio.
  // The max score for this component is 40.
  // But we want to return the raw matches and a normalized score later.
  return { matches, score: percentage };
}

/**
 * Checks formatting rules
 */
function checkFormatting(text: string): { issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 20;

  // Check 1: Bullet points
  // Heuristic: check for characters like •, -, *, or similar used as list markers
  const bulletPoints = (text.match(/[\u2022\u2023\u25E6\u2043\u2219\*\-] /g) || []).length;
  if (bulletPoints < 5) {
    issues.push("Few or no bullet points detected. Use bullet points to list achievements.");
    score -= 10;
  }

  // Check 2: Excessive special characters (heuristic)
  // Calculate ratio of non-alphanumeric to total length
  const specialChars = (text.match(/[^a-zA-Z0-9\s.,;:\-()]/g) || []).length;
  if (specialChars > text.length * 0.05) { // > 5% special chars
    issues.push("Excessive use of special characters or symbols detected.");
    score -= 5;
  }

  // Check 3: Very long lines (readability/parsing friendly)
  // We can check line splits
  const lines = text.split('\n');
  const longLines = lines.filter(l => l.length > 200).length; // 200 chars as a heuristic limit
  if (longLines > 3) {
    issues.push("Several lines are very long. Consider wrapping text or using shorter sentences.");
    score -= 5;
  }

  return { issues, score: Math.max(0, score) };
}

/**
 * Checks readability heuristics
 */
function checkReadability(text: string): { issues: string[]; score: number } {
  // Simple heuristic: Sentence length, word complexity (not implementing full Coleman-Liau for MVP)
  // For MVP: Check strict sentence casing or structure? 
  // Let's rely on line density.
  
  // If text is extremely short or extremely long?
  const wordCount = text.split(/\s+/).length;
  let score = 10;
  
  if (wordCount < 100) {
    score = 0; // Too short to be a valid resume likely
    return { issues: ["Resume is too short to evaluate readability properly."], score };
  } else if (wordCount > 2000) {
    score = 5;
    return { issues: ["Resume seems very long. Aim for 400-800 words for standard resumes."], score };
  }

  return { issues: [], score };
}

/**
 * Main analysis function
 */
export function analyzeResume(text: string): ATSResult {
  const sections = detectSections(text);
  
  // 1. Section Presence (Max 30)
  const sectionsFound = sections.filter(s => s.present).length;
  const sectionScore = (sectionsFound / REQUIRED_SECTIONS.length) * 30;

  // 2. Keyword Matching (Max 40)
  const { matches, score: rawKeywordRatio } = calculateKeywordMatch(text);
  // We don't expect 100% of ALL keywords, but let's say 20% match is full marks for this specific list?
  // Or simply mapping: match percentage of the predefined list.
  // The predefined list has ~30 words. Matching 10-15 is good.
  // Let's say if you match 15+ keywords you get full points.
  const keywordScore = Math.min(40, (matches.length / 10) * 40); 

  // 3. Formatting (Max 20)
  const { issues: formattingIssues, score: formattingScore } = checkFormatting(text);

  // 4. Readability (Max 10)
  const { issues: readabilityIssues, score: readabilityScore } = checkReadability(text);

  // Total Score
  const totalScore = Math.round(sectionScore + keywordScore + formattingScore + readabilityScore);

  // Generate Feedback
  const missingSections = sections.filter(s => !s.present).map(s => s.name);
  const missingKeywords = KEYWORDS.filter(k => !matches.includes(k)).slice(0, 5); // Suggest top 5 missing

  const sectionOrderSuggestions: string[] = [];
  if (missingSections.length > 0) {
    sectionOrderSuggestions.push(`Add missing sections: ${missingSections.join(", ")}`);
  }
  // MVP simplistic order check not easily possible without position tracking, ignoring order check for now other than presence.

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      sectionPresence: sectionScore,
      keywordMatching: keywordScore,
      formatting: formattingScore,
      readability: readabilityScore,
    },
    details: {
      sections,
      feedback: {
        missingKeywords,
        formattingIssues: [...formattingIssues, ...readabilityIssues],
        sectionOrderSuggestions,
        missingSections,
      },
    },
  };
}
