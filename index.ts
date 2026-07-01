import PromptSync from "prompt-sync";
import chalk from "chalk";
import {
  initializeLangsmith,
  isTracingEnabled,
} from "./monitoring/Langsmith.js";

initializeLangsmith();

const { app } = await import("./graph/graph.js");
const prompt = PromptSync();
const userPrompt = prompt(chalk.blue("Enter your prompt : "));

if (isTracingEnabled()) {
  console.log(chalk.cyan("LangSmith tracing enabled"));
} else {
  console.log(
    chalk.yellow(
      "LangSmith tracing is disabled. Check LANGCHAIN_API_KEY/LANGSMITH_API_KEY and tracing env vars."
    )
  );
}

const result = await app.invoke({
  userPrompt,
});

console.log(chalk.green.bold("Final output"));

console.log(JSON.stringify(result, null, 2));
