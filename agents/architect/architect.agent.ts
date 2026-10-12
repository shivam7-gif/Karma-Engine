import { ArchitectureSchema } from "./architect.schema.js";
import { jsonrepair } from "jsonrepair";

import type { ArchitectureOutput } from "./architect.schema.js";
import type { PlannerOutput } from "../planner/planner.schema.js";
import { TECH_PLANNER_PROMPT } from "./architect.js";
import dotenv from "dotenv";
dotenv.config();
import { connectionToGroq } from "../../llm/providers/groq.js";
const llm = connectionToGroq();
export class ArchitectAgent {
  async execute(plannerOutput: PlannerOutput): Promise<ArchitectureOutput> {
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
        content: JSON.stringify(plannerOutput, null, 2),
      },
    ]);
    const raw = String(response.content);
    console.log("raw : ");
    console.log(raw);
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(jsonrepair(cleaned));
    return ArchitectureSchema.parse(parsed);
  }
}
