import chalk from "chalk";
import { StackPilotState } from "../../stackpilot.state.js";
import { KarmaH1Agent } from "./h1.agent.js";

const h1 = new KarmaH1Agent();

export async function h1CoderNode(state: typeof StackPilotState.State) {
  console.log(chalk.magenta.bold("[KARMA H1] Node running..."));

  const output = await h1.execute(state.plannerOutput, state.architectOutput);

  console.log(chalk.green.bold("[KARMA H1] Node completed"));

  return {
    generatedFiles: output.files,
    generatedProjectName: output.projectName,
  };
}
