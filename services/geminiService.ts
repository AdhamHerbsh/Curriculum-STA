import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const modelName = "gemini-2.5-flash"; // Recommended model for text tasks

export const generateSpecializationData = async (jobDescription: string): Promise<{ suggestedNames: string[], generalSummary: string }> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const prompt = `Based on the following detailed job description for a three-year vocational technician role, propose five concise and professional specialization names in Arabic (e.g., فني صيانة أنظمة...) and provide a single, short paragraph (2-3 sentences max) general summary of the role in Arabic.

Job Description:
---
${jobDescription}
---`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedNames: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 proposed names for the vocational specialization in Arabic."
            },
            generalSummary: {
              type: Type.STRING,
              description: "A concise, 2-3 sentence general job summary."
            }
          },
          required: ["suggestedNames", "generalSummary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Specialization Data):", error);
    throw error;
  }
};

export const generateActivitiesList = async (jobDescription: string): Promise<string[]> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const prompt = `Based on the following detailed job description for a three-year vocational technician role, generate exactly 15 distinct, sequential, and professionally phrased professional activities (tasks) that a person in this role must perform. The activities should reflect a typical workflow starting from planning/analysis to execution and reporting.

Job Description:
---
${jobDescription}
---`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Array of exactly 15 sequential professional activities (tasks) in Arabic."
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Activities):", error);
    throw error;
  }
};

// Define the schema for the competency response
const competencyResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      activityIndex: { type: Type.INTEGER, description: "The index of the activity in the provided list (0-based)." },
      competencies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the competency/unit." },
            knowledge: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of theoretical knowledge points." 
            },
            skill: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of practical, measurable skills." 
            },
            unitDescription: { type: Type.STRING, description: "Brief description of the competency unit." },
            criteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 performance criteria." }
          },
          required: ["name", "knowledge", "skill", "unitDescription", "criteria"]
        }
      }
    },
    required: ["activityIndex", "competencies"]
  }
};

export const generateCompetenciesForActivities = async (selectedActivities: string[]): Promise<any[]> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const activitiesListString = selectedActivities.map((act, index) => `${index}. ${act}`).join("\n");

  const prompt = `You are an expert vocational curriculum designer. 
  For each of the following Selected Vocational Activities, identify AT LEAST 5 core Competencies (Jadarat) required to perform them.
  
  For each Competency, you MUST define:
  1. **Knowledge (المعارف):** Provide a list of AT LEAST 7 theoretical concepts/points the student must know.
  2. **Skills (المهارات):** CRITICAL: Provide a list of practical, measurable actions (verbs) that correspond to the knowledge. 
     - The number of practical skills MUST BE GREATER than the number of knowledge points.
     - Use measurable verbs like "Install", "Calibrate", "Weld", "Program", "Measure".
     - Do NOT use vague terms like "understand" or "know".
  3. **Unit Description:** A brief summary.
  4. **Performance Criteria:** 3 specific criteria to judge the performance.

  Output in Arabic.

  Selected Activities:
  ${activitiesListString}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: competencyResponseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Competencies):", error);
    throw error;
  }
};