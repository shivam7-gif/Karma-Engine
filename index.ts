import { app } from "./graph/graph.js";
import PromptSync from "prompt-sync";
import chalk from "chalk";
const prompt = PromptSync();
const userPrompt = prompt(chalk.blue("Enter your prompt : "));

const result = await app.invoke({
  userPrompt,
});

console.log(chalk.green.bold("Final output"));

console.log(JSON.stringify(result, null, 2));
