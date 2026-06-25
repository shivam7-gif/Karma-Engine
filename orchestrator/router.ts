import type {StackPilotStateType} from "./state";

export function testRouter(state : StackPilotStateType){
  if(!state.testResults){
    return "__end__";
  }
  const failed = state.testResults.toLowerCase().includes("failed");

  return failed ? "fixed" : "__end__";
}