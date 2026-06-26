import { StateGraph, START, END } from "@langchain/langgraph";

import { PlannerState } from "./planner.state.js";
import { plannerNode } from "./planner.node.js";

const graph = new StateGraph(PlannerState);

graph.addNode("planner", plannerNode);

graph.addEdge(START, "planner");

graph.addEdge("planner", END);

export const plannerWorkflow = graph.compile();
