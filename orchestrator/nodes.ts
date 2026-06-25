// orchestrator/nodes.ts

import type { StackPilotStateType } from "./state";

export async function plannerNode(
  state: StackPilotStateType
) {
  console.log("Planner running");

  return {
    requirements:
      "Authentication, Dashboard, Projects",
  };
}

export async function architectNode(
  state: StackPilotStateType
) {
  console.log("Architect running");

  return {
    architecture:
      "Next.js + Express + PostgreSQL",
  };
}

export async function contextNode(
  state: StackPilotStateType
) {
  console.log("Context retrieval");

  return {
    retrievedContext: [
      "project context",
      "documentation context",
    ],
  };
}

export async function generatorNode(
  state: StackPilotStateType
) {
  console.log("Code generation");

  return {
    generatedCode:
      "console.log('hello world');",
  };
}

export async function testerNode(
  state: StackPilotStateType
) {
  console.log("Testing");

  return {
    testResults: "passed",
  };
}

export async function fixerNode(
  state: StackPilotStateType
) {
  console.log("Fixing");

  return {
    fixes: "bug fixed",
  };
}