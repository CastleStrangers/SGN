import OpenAI from "openai";

export const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
});

export const AI_MODEL = "gpt-5.5";
export const AI_MODEL_FAST = "gpt-5.4-mini";
