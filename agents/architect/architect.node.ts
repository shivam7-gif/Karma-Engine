import { PlannerAgent } from "./architect.agent";
import chalk from "chalk";
import promptSync from "prompt-sync";
export async function architectNode() {
  const error = chalk.bold.red;
  const warning = chalk.hex("#FFA500");
  const planner = new PlannerAgent();
  const prompt = promptSync();
  const input: string = prompt(chalk.blue("Enter your prompt : "));
  const result = await planner.execute(input);
  console.log(JSON.stringify(result, null, 2));
}
