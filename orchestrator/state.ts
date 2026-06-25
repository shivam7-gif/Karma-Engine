import {Annotation} from "@langchain/langgraph";

export const StackPilotState = Annotation.Root({
  prompt : Annotation<string>(),
  requirements : Annotation<string>(),
  architecture : Annotation<string>(),
  retrievedContext : Annotation<string>(),
  generatedCode : Annotation<string>(),
  testResults : Annotation<string>(),
  fixes : Annotation<string>(),

  messages : Annotation<any[]>({
    reducer : (current , update) =>[...current , ...update],
    default: ()=>[],
  }),
});

export type StackPilotStateType = typeof StackPilotState.State;