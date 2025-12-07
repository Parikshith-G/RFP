import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const processRfpText = async (rawText) => {
  const systemInstruction = `You are a procurement data extraction engine. Analyze the following text and extract all required procurement details into a single JSON object that strictly follows this schema: {title: string, category: string, budget: number, delivery_days: number, quantity: number, structuredRfp: object, mailMessage:string}.`;

  const prompt = `Analyze this user request: "${rawText}. Return the JSON object and a message i can send to vendor email which ill decide u dont care about it. it must be in html format so that i must not format it before sending with all details. I need the structuredRfp to contain all relevant details from the user text in a nested JSON format. Ensure the JSON is properly formatted without any extra text or explanation. If any field is missing in the input text, set its value to null also dont have any values which must be filled like [Your Company Name/Procurement Team] or [Insert Date Here] kinda stuff. "`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", response.text);
    throw new Error("AI returned unparsable data.");
  }
};

export const processProposalText = async (rawProposalText, rfpId) => {
  const systemInstruction = `You are a procurement data extraction engine. Analyze the following vendor proposal text submitted in response to RFP ID ${rfpId}. Extract the core commercial details into a single JSON object that STRICTLY adheres to the following schema: {total_price: number, delivery_days: number, quantity: number, warranty_years: number, payment_terms: string, parsed_details: object}. The 'parsed_details' field should contain all other relevant product information. Only return the final JSON object.`;

  const prompt = `Analyze this vendor's reply: "${rawProposalText}"`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
    },
  });

  try {
    const jsonText = response.text.trim().replace(/^```json|```$/g, "");
    return JSON.parse(jsonText);
  } catch (e) {
    console.error(
      "Failed to parse AI Proposal response as JSON:",
      response.text
    );
    throw new Error("AI returned unparsable proposal data.");
  }
};

export const generateRecommendation = async (
  rfpConstraints,
  scoredProposals
) => {
  const analysisData = {
    rfp_constraints: rfpConstraints,
    top_proposals: scoredProposals.map((p) => ({
      id: p.id,
      vendorName: p.Vendor.name,
      score: p.score,
      totalPrice: p.totalPrice,
      deliveryDays: p.deliveryDays,
      parsed: p.parsed,
    })),
  };

  const prompt = `
        Analyze the following ranked proposals against the RFP requirements. 
        Provide a concise, professional recommendation for the procurement manager.
        
        The recommendation must:
        1. State the name of the top-scoring vendor.
        2. Give a 3-sentence summary of WHY that vendor is recommended.
        3. Reference key comparison points (e.g., price difference, compliance with warranty).
        
        Data for Analysis:
        ${JSON.stringify(analysisData, null, 2)}
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (e) {
    console.error("AI Recommendation generation failed:", e);
    return "System failed to generate an AI recommendation summary.";
  }
};
