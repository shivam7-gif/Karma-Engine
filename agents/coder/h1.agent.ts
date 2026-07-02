import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();
import { connectionToGroq } from "../../llm/providers/groq.js";
import { H1_SYSTEM_PROMPT } from "./h1.prompt.js";
import { H1OutputSchema } from "./h1.schema.js";
import type { H1Output } from "./h1.schema.js";

const llm = connectionToGroq();

export class KarmaH1Agent {
  async execute(
    plannerOutput: unknown,
    architectOutput: unknown
  ): Promise<H1Output> {
    console.log(chalk.magenta.bold("[KARMA H1] Generating code..."));

    const userMessage = `
## Planner Analysis
${JSON.stringify(plannerOutput, null, 2)}

## Architecture Decisions
${JSON.stringify(architectOutput, null, 2)}

Based on the above plan and architecture, generate the complete project files.
Return ONLY valid JSON that matches the output format — no markdown, no explanations.
`.trim();

    const response = await llm.invoke([
      { role: "system", content: H1_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ]);

    const raw = String(response.content);

    // Strip markdown code fences if the LLM wraps the JSON
    const cleaned = raw
      .replace(/^```(?:json)?/m, "")
      .replace(/```$/m, "")
      .trim();

    // Extract the JSON object (handle leading/trailing text)
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("[KARMA H1] Could not locate JSON in LLM response");
    }

    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
    const validated = H1OutputSchema.parse(parsed);

    console.log(
      chalk.green.bold(
        `[KARMA H1] Generated ${validated.files.length} files for project "${validated.projectName}"`
      )
    );

    return validated;
  }
}
