import { StateGraph, START, END } from "@langchain/langgraph";

import { StackPilotState } from "../stackpilot.state.js";
import { plannerNode } from "../agents/planner/planner.node.js";
import { architectNode } from "../agents/architect/architect.node.js";
import { h1CoderNode } from "../agents/coder/h1.node.js";

const graph = new StateGraph(StackPilotState);
graph.addNode("planner", plannerNode);
graph.addNode("architect", architectNode);
graph.addNode("h1_coder", h1CoderNode);

graph.addEdge(START, "planner");
graph.addEdge("planner", "architect");
graph.addEdge("architect", "h1_coder");
graph.addEdge("h1_coder", END);

export const app = graph.compile();
