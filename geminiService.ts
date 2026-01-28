
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateEnhancedBio = async (keywords: string, role: string): Promise<string> => {
  if (!API_KEY) return "Bio enhancement unavailable. (API Key missing)";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a sleek, professional, and punchy 2-sentence bio for a ${role} based on these keywords: ${keywords}. Make it sound modern and innovative. Return ONLY the bio text.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text.trim() || "Creative professional pushing the boundaries of digital experiences.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Innovator and digital enthusiast dedicated to building high-impact solutions.";
  }
};
