import {Annotation} from "@langchain/langgraph";

export const StackPilotState = Annotation.Root({
  userPrompt : Annotation<string>(),
  plannerOutput : Annotation<string>(),
  architectOutput : Annotation<string>(),
  frontendPlan : Annotation<string>(),
  backendPlan : Annotation<string>(),
  databasePlan : Annotation<string>(),
  devopsPlan : Annotation<string>(),
  metrics : Annotation<ExecutionMetrics>(),
});