import chalk from "chalk";
import { PlannerAgent } from "./planner.agent.js";
import { PlannerState } from "./planner.state.js";

const planner = new PlannerAgent();

export async function plannerNode(state: typeof PlannerState.State) {
  console.log(chalk.yellow.bold("[PLANNER] Running..."));

  const plannerOutput = await planner.execute(state.userPrompt);

  console.log(chalk.green.bold("[PLANNER] Completed"));

  return {
    plannerOutput,
  };
}
