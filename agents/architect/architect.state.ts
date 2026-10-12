import { Annotation } from "@langchain/langgraph";
export const StackPilotTechState = Annotation.Root({
  prompt: Annotation<string>(),

  techPlan: Annotation<any>(),

  architecture: Annotation<any>(),

  generatedFiles: Annotation<any[]>(),

  messages: Annotation<any[]>({
    reducer: (x, y) => [...x, ...y],
    default: () => [],
  }),
});