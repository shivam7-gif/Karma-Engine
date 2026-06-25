import { ChatOpenAI } from "@langchain/openai";
import { TechPlanSchema } from "./architect.schema.js";
import { TECH_PLANNER_PROMPT } from "./architect.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const llm = new ChatOpenAI({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
});

export class PlannerAgent {
  async execute(userPrompt: string) {
    const response = await llm.invoke([
      {
        role: "system",
        content: `
${TECH_PLANNER_PROMPT}

Return ONLY valid JSON.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ]);
    console.log(response.content);
    const raw = response.content as string;

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("RAW RESPONSE:\n", cleaned);

    const parsed = JSON.parse(cleaned);
    return TechPlanSchema.parse(parsed);
  }
}
