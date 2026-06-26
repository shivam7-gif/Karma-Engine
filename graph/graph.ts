import { StateGraph, START, END } from "@langchain/langgraph";

import { StackPilotState } from "../stackpilot.state.js";
import { plannerNode } from "../agents/planner/planner.node.js";
import { architectNode } from "../agents/architect/architect.node.js";
const graph = new StateGraph(StackPilotState);
graph.addNode("planner", plannerNode);

graph.addNode("architect", architectNode);
graph.addEdge(START, "planner");
graph.addEdge("planner", "architect");
graph.addEdge("architect", END);

export const app = graph.compile();
