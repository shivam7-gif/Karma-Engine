export type ArchitectScope = "frontend" | "backend" | "shared";
import { DEFAULT_STACK, type StackConfig } from "../planner/planner.prompt.js";

export const TECH_PLANNER_PROMPT = `
You are a Principal Software Architect.

Return ONLY valid JSON.

Schema:

{
  "projectType":"string",

  "frontend":{
    "framework":"string",
    "language":"string",
    "styling":"string",
    "stateManagement":"string"
  },

  "backend":{
    "framework":"string",
    "language":"string",
    "database":"string",
    "orm":"string",
    "authentication":"string"
  },

  "infrastructure":{
    "caching":"string",
    "queue":"string",
    "storage":"string",
    "search":"string"
  },

  "services":["string"],

  "deployment":{
    "containerization":"string",
    "hosting":"string",
    "ciCd":"string"
  },

  "scalability":{
    "architectureStyle":"string",
    "loadBalancer":"string",
    "expectedUsers":1000000
  }
}
`;

export const ARCHITECT_PROMPT = (
  plan: object,
  scope: ArchitectScope,
  stack: StackConfig = DEFAULT_STACK
) => `
You are StackPilot Architect Agent, a Senior Software Architect.
Design the ${scope.toUpperCase()} part of the project from the approved plan.

PLAN:
${JSON.stringify(plan)}

TECH STACK (use exactly this):
- Frontend: ${stack.frontend}
- 3D: ${stack.threeD}
- Backend: ${stack.backend}
- Database: ${stack.database}
- Auth: ${stack.auth}
- Realtime: ${stack.realtime}

SCOPE RULES:
${
  scope === "frontend"
    ? `- Root folder: client/. Vite + React + TS project.
- Include: src/main.tsx, src/App.tsx, router, one page file per plan screen (src/pages/),
  components/, components/3d/ (Canvas, MenuModel, Scene), hooks/, store/ (Zustand),
  api/ (typed fetch client + TanStack Query hooks), types/, public/models/ for .glb assets,
  tailwind/vite/tsconfig configs.
- Max 30 files.`
    : scope === "backend"
      ? `- Root folder: server/. Express + TS project.
- Include: src/index.ts, src/app.ts, routes/, controllers/, services/, middleware/ (auth, error, validate),
  validators/ (Zod), prisma/schema.prisma, sockets/, config/, utils/.
- One route file per resource in the plan's apiEndpoints. Max 30 files.`
      : `- Root-level files only: package.json (npm workspaces), .env.example, .gitignore, README.md,
  docker-compose.yml (postgres), shared/types.ts. Max 10 files.`
}

OUTPUT RULES:
- Return ONLY one JSON object. No markdown, no commentary. Start with { and end with }.
- "path" uses forward slashes. "purpose" is at most 6 words.
- "dependencies" and "devDependencies" list npm package names only, no versions.
- All keys are REQUIRED.

{
  "projectName": "",
  "scope": "${scope}",
  "files": [{"path": "", "purpose": ""}],
  "dependencies": [],
  "devDependencies": [],
  "envVars": []
}
`;