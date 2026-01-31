import { GoogleGenerativeAI } from "@google/generative-ai";
import { ATSResult } from "./types";

// Force the use of the stable 'v1' API version instead of 'v1beta'
// which can occasionally cause 404s for newer models in certain regions/accounts.
const genAI = new GoogleGenerativeAI(
  (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim()
);

// We define a helper to get the model with the correct configuration.
// We'll use the default SDK behavior but handle fallbacks in the main function.
const getModel = (name: string) => genAI.getGenerativeModel({ 
  model: name,
  generationConfig: { responseMimeType: "application/json" }
});

export async function analyzeResumeWithAI(text: string): Promise<ATSResult> {
  // Prioritize 2.5-flash-lite as it has higher RPM (10) in your dashboard
  let modelName = "gemini-2.5-flash-lite";
  let model = getModel(modelName);

  const prompt = `
    You are an expert ATS (Applicant Tracking System) and HR professional. 
    Analyze the following resume text and provide a detailed ATS compatibility report in JSON format.
    
    The JSON structure must match this exactly:
    {
      "score": number, // 0-100
      "breakdown": {
        "sectionPresence": number, // Max 30
        "keywordMatching": number, // Max 40
        "formatting": number, // Max 20
        "readability": number // Max 10
      },
      "details": {
        "sections": [
          { "name": "Skills", "present": boolean, "content": "string" },
          { "name": "Experience", "present": boolean, "content": "string" },
          { "name": "Education", "present": boolean, "content": "string" },
          { "name": "Projects", "present": boolean, "content": "string" }
        ],
        "feedback": {
          "missingKeywords": string[],
          "formattingIssues": string[],
          "sectionOrderSuggestions": string[],
          "missingSections": string[]
        }
      }
    }

    Resume Text:
    """
    ${text}
    """

    Rules:
    - Score according to standard ATS best practices.
    - Be critical but fair.
    - If a section is missing, explain why it's important in the feedback.
    - Return ONLY the JSON. No markdown code blocks, no intro, no outro.
  `;

  try {
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (error: any) {
      // If primary fails (either 429 quota or 404 not found)
      console.warn(`AI Model ${modelName} failed with status ${error.status}. Trying fallback...`);
      
      // Multi-step fallback logic based on your dashboard availability
      if (modelName === "gemini-2.5-flash-lite") {
        modelName = "gemini-2.5-flash";
        model = getModel(modelName);
        result = await model.generateContent(prompt);
      } else if (modelName === "gemini-2.5-flash") {
        modelName = "gemini-3-flash";
        model = getModel(modelName);
        result = await model.generateContent(prompt);
      } else if (modelName === "gemini-3-flash") {
        modelName = "gemini-2.0-flash";
        model = getModel(modelName);
        result = await model.generateContent(prompt);
      } else if (modelName === "gemini-2.0-flash") {
        modelName = "gemini-1.5-flash";
        model = getModel(modelName);
        result = await model.generateContent(prompt);
      } else {
        throw error;
      }
    }
    
    const response = await result.response;
    
    if (!response || !response.text) {
      throw new Error("Empty response from AI");
    }

    let jsonText = response.text().trim();
    
    // Cleanup JSON if Gemini wrapped it in backticks
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json|```/g, "").trim();
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```/g, "").trim();
    }

    // Secondary cleanup: remove any non-JSON characters if they persist
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
      // console.log("Raw AI Response:", jsonText);
      
      try {
        return JSON.parse(jsonText) as ATSResult;
      } catch (parseError) {
        console.error("JSON Parse Error. Raw Text:", jsonText);
        throw new Error("AI returned an invalid format. Please try again.");
      }
    }

    // If no valid JSON start/end found after cleanup, it's an error
    console.error("JSON Parse Error: Could not find valid JSON structure. Raw Text:", jsonText);
    throw new Error("AI returned an invalid format. Please try again.");

  } catch (error: any) {
    // Log the FULL error for debugging
    console.error("Detailed AI Analysis Error:", {
      message: error.message,
      status: error.status,
      details: error.response?.data || error.details,
    });

    if (error.status === 401 || error.status === 403) {
      throw new Error("Invalid API Key. Please check your .env file and ensure the key is correct in Google AI Studio.");
    }
    
    if (error.status === 429) {
      throw new Error("API Limit Reached. Please wait a moment before trying again.");
    }

    throw new Error(`AI Analysis Error: ${error.message || 'Check your API key and network.'}`);
  }
}
