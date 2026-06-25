import { Annotation } from "@langchain/langgraph";
import type { TechPlan } from "../agents/planner/tech.schema";

export const StackPilotTechState = Annotation.Root({
  prompt: Annotation<string>(),

  techPlan: Annotation<TechPlan>(),

  architecture: Annotation<any>(),

  generatedFiles: Annotation<any[]>(),

  messages: Annotation<any[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),
});