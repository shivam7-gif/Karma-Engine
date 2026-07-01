import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { PlannerSchema } from "./planner.schema.js";
import type { PlannerOutput } from "./planner.schema.js";
import { PLANNER_PROMPT } from "./planner.prompt.js";
import { repairPlannerOutput } from "../../utils/repairPlannerOutput.js";
dotenv.config();
import { connectionToGroq } from "../../llm/providers/groq.js";

const llm = connectionToGroq();

export class PlannerAgent {
  async execute(userPrompt: string) {
    const response = await llm.invoke([
      {
        role: "system",
        content: PLANNER_PROMPT,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    const cleaned = (response.content as string)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    console.log("raw content : ");
    console.log(response.content);
    const parsed = JSON.parse(cleaned);
    console.log("Parsed:");
    console.dir(parsed, {
      depth: null,
      colors: true,
    });
    const repaired = repairPlannerOutput(parsed);
    console.dir(repaired, {
      depth: null,
      colors: true,
    });
    const result = PlannerSchema.safeParse(repaired);
    console.log("Repaired:");
    return result;
  }
}
