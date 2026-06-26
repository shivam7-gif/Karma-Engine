import chalk from "chalk";
import { ArchitectAgent } from "./architect.agent.js";
import { StackPilotState } from "../../stackpilot.state.js";

export async function architectNode(state: typeof StackPilotState.State) {
  console.log(chalk.cyan.bold("[ARCHITECT] Running..."));

  const architect = new ArchitectAgent();

  const architectOutput = await architect.execute(state.plannerOutput);

  console.log(chalk.green.bold("[ARCHITECT] Completed"));

  return {
    architectOutput,
  };
}
