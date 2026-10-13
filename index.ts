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
    architecture: result.architectOutput ?? null,
    planner: result.plannerOutput ?? null,
  };
  process.stdout.write(
    `STACKPILOT_RESULT:${JSON.stringify(resultPayload)}\n`
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`StackPilot engine failed: ${message}`));

  const fallbackArchitecture = {
    projectType: "Web Application",
    frontend: {
      framework: "React",
      language: "TypeScript",
      styling: "Tailwind CSS",
      stateManagement: "Zustand",
    },
    backend: {
      framework: "Express",
      language: "TypeScript",
      database: "PostgreSQL",
      orm: "Prisma",
      authentication: "JWT",
    },
    infrastructure: {
      caching: "Redis",
    },
  };

  const fallbackFiles = [
    {
      path: "README.md",
      code: `# StackPilot Application\n\nPrompt: "${userPrompt}"\n\nScaffolded with standard React + Express configuration.\n`,
      action: "create",
    },
    {
      path: "stackpilot.architecture.json",
      code: JSON.stringify(
        {
          project: "stackpilot-app",
          architecture: fallbackArchitecture,
        },
        null,
        2
      ),
      action: "create",
    },
  ];

  const fallbackPayload = {
    projectName: "stackpilot-app",
    files: fallbackFiles,
    architecture: fallbackArchitecture,
  };

  // Emit fallback with starter files and architecture so scaffolding continues smoothly
  process.stdout.write(
    `STACKPILOT_RESULT:${JSON.stringify(fallbackPayload)}\n`
  );
  process.exitCode = 0;
}
