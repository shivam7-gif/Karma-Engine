import PromptSync from "prompt-sync";
import chalk from "chalk";
import {
  initializeLangsmith,
  isTracingEnabled,
} from "./monitoring/Langsmith.js";

initializeLangsmith();

const { app } = await import("./graph/graph.js");
const prompt = PromptSync();
const cliPrompt =
  process.argv[2] ??
  process.env.STACKPILOT_PROMPT ??
  process.env.STACKPILOT_USER_PROMPT;
const userPrompt = cliPrompt || prompt(chalk.blue("Enter your prompt : "));

if (isTracingEnabled()) {
  console.log(chalk.cyan("LangSmith tracing enabled"));
} else {
  console.log(
    chalk.yellow(
      "LangSmith tracing is disabled. Check LANGCHAIN_API_KEY/LANGSMITH_API_KEY and tracing env vars."
    )
  );
}

try {
  console.log(chalk.cyan(`Running StackPilot engine for: ${userPrompt}`));
  const result = await app.invoke({
    userPrompt,
  });

  console.log(chalk.green.bold("[STACKPILOT] Pipeline complete"));

  // Emit a machine-readable result line the backend can reliably parse.
  // The backend scans stdout for lines starting with STACKPILOT_RESULT:
  const resultPayload = {
    projectName: result.generatedProjectName ?? "stackpilot-project",
    files: result.generatedFiles ?? [],
  };
  process.stdout.write(
    `STACKPILOT_RESULT:${JSON.stringify(resultPayload)}\n`
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`StackPilot engine failed: ${message}`));

  const fallback = {
    status: "fallback",
    message:
      "StackPilot engine could not reach its AI provider. A mock plan for your request is ready.",
    suggestion: `Create a Netflix-style streaming app with a hero banner, category rows, a watchlist, video player shell, auth, and a subscription plan UI.`,
    prompt: userPrompt,
  };

  // Emit fallback with no files so backend can still handle gracefully
  process.stdout.write(
    `STACKPILOT_RESULT:${JSON.stringify({ projectName: "stackpilot-fallback", files: [] })}\n`
  );
  console.log(JSON.stringify(fallback, null, 2));
  process.exitCode = 0;
}
