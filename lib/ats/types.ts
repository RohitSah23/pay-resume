export interface Section {
  name: "Skills" | "Experience" | "Education" | "Projects";
  present: boolean;
  content: string; // Extracted content for this section (simplified)
}

export interface ATSFeedback {
  missingKeywords: string[];
  formattingIssues: string[];
  sectionOrderSuggestions: string[];
  missingSections: string[];
}

export interface ATSResult {
  score: number;
  breakdown: {
    sectionPresence: number; // Max 30
    keywordMatching: number; // Max 40
    formatting: number; // Max 20
    readability: number; // Max 10
  };
  details: {
    sections: Section[];
    feedback: ATSFeedback;
  };
}

export interface ResumeData {
  fileName: string;
  text: string;
}
