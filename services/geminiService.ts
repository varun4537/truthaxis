
import { GoogleGenAI, Type } from "@google/genai";
import { GraphAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    chartType: { type: Type.STRING, enum: ["bar", "line", "area"] },
    data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.NUMBER }
        },
        required: ["label", "value"]
      }
    },
    isMisleading: { type: Type.BOOLEAN },
    reasoning: { type: Type.STRING },
    detectedYAxisStart: { type: Type.NUMBER },
    detectedYAxisEnd: { type: Type.NUMBER },
    xAxisLabel: { type: Type.STRING },
    yAxisLabel: { type: Type.STRING },
    style: {
      type: Type.OBJECT,
      properties: {
        primaryColor: { type: Type.STRING, description: "HEX code of the main data series color" },
        secondaryColor: { type: Type.STRING, description: "HEX code of a secondary color if present" },
        backgroundColor: { type: Type.STRING, description: "HEX code of the chart area background" },
        gridColor: { type: Type.STRING, description: "HEX code of grid lines if present" },
        fontFamily: { type: Type.STRING, enum: ["sans-serif", "serif", "mono"] }
      },
      required: ["primaryColor", "backgroundColor", "fontFamily"]
    },
    deceptionScore: { type: Type.NUMBER, description: "Score from 0-100 indicating how misleading the visual is" }
  },
  required: ["title", "chartType", "data", "isMisleading", "reasoning", "detectedYAxisStart", "detectedYAxisEnd", "style", "deceptionScore"]
};

export async function analyzeGraphImage(base64Image: string): Promise<GraphAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: `Act as a data forensic expert. Analyze this chart image. 
            1. Extract all data points (labels and numeric values) as accurately as possible. 
            2. Identify the EXACT colors used for the bars/lines and background. Use HEX codes.
            3. Detect if the Y-axis is truncated (not starting at zero).
            4. Calculate a 'deceptionScore' from 0-100 where 100 is highly misleading (e.g. a 2% change looking like 500% change).
            5. Provide a clear reasoning on how the visual perception differs from the numerical reality.`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1]
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    }
  });

  if (!response.text) {
    throw new Error("No analysis returned from Gemini");
  }

  return JSON.parse(response.text) as GraphAnalysis;
}
