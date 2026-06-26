import PromptSync from "prompt-sync";
import chalk from "chalk";

import { PlannerAgent } from "./planner.agent.js";

const prompt = PromptSync();

export async function PlannerTesting() {
  const planner = new PlannerAgent();

  const input = prompt(chalk.cyan.bold("Enter your prompt: "));

  console.log(chalk.yellow("Generating Product Plan..."));

  const result = await planner.execute(input);

  console.log(chalk.green.bold("Planner Output:"));

  console.log(chalk.green(JSON.stringify(result, null, 2)));
}

// PlannerTesting().catch((err) => {
//   console.log(chalk.red.bold("Planner Failed"));

//   console.error(err);
// });
