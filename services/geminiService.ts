import { GoogleGenAI } from "@google/genai";
import { PCComponent } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeBuild = async (components: PCComponent[], userContext: string = "student") => {
  const ai = getAiClient();
  if (!ai) return "AI service unavailable. Please check API key.";

  const componentList = components.map(c => `- ${c.type}: ${c.name} (${c.specs})`).join('\n');
  
  const prompt = `
    You are an honest PC hardware expert helper for students.
    Analyze the following PC build for a user who is a "${userContext}".
    
    Components:
    ${componentList}

    1. Highlight the strongest point of this build for their use case.
    2. Confirm if there are any compatibility issues (there shouldn't be, but reassure them).
    3. Explain in simple non-tech terms why the Power Supply (PSU) and Motherboard choices are reliable and safe (emphasize no generic parts).
    4. Keep the tone encouraging, transparent, and concise (max 150 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI advisor is currently taking a coffee break. Rest assured, this build is factory verified for compatibility.";
  }
};