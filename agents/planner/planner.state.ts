import { Annotation } from "@langchain/langgraph";
import type { PlannerOutput } from "./planner.schema.js";
export const PlannerState = Annotation.Root({
  userPrompt: Annotation<string>(),
  plannerOutput: Annotation<PlannerOutput | null>(),
  errors: Annotation<string>(),
});
