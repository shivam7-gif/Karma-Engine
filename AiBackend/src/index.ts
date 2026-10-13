import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

// ── Paths ────────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// stackpilotAiEngine root is two levels up from AiBackend/src/
const ENGINE_ROOT = path.resolve(__dirname, "..", "..");

const app = express();
const PORT = Number(process.env.AI_BACKEND_PORT) || 8000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));

// ── Zod Schemas ──────────────────────────────────────────────────────────────
const GenerateRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
  model: z.string().optional(),
  effort: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

// ── Types ────────────────────────────────────────────────────────────────────
interface GenerateResponse {
  success: boolean;
  message: string;
  data?: {
    projectName: string;
    files: Array<{
      path: string;
      code?: string;
      purpose?: string;
      action?: string;
    }>;
    architecture?: unknown;
    planner?: unknown;
  };
  error?: string;
}

interface StreamEvent {
  type: "log" | "step" | "result" | "error" | "done";
  data: unknown;
  timestamp: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Run the StackPilot LangGraph engine as a child process.
 * Returns { projectName, files } parsed from the STACKPILOT_RESULT line the
 * engine writes to stdout, plus the raw log lines.
 */
function runEngine(
  prompt: string,
  onLog?: (line: string) => void
): Promise<{
  projectName: string;
  files: any[];
  architecture?: any;
  planner?: any;
  logs: string[];
}> {
  return new Promise((resolve, reject) => {
    const logs: string[] = [];
    let resultPayload: {
      projectName: string;
      files: any[];
      architecture?: any;
      planner?: any;
    } | null = null;

    // Spawn `npx tsx index.ts` inside the engine root, passing the prompt as
    // the first CLI argument so the engine doesn't try to read stdin.
    const child: ChildProcess = spawn("npx", ["tsx", "index.ts", prompt], {
      cwd: ENGINE_ROOT,
      env: { ...process.env },
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const processLine = (line: string) => {
      // The engine emits `STACKPILOT_RESULT:{json}` on completion.
      if (line.startsWith("STACKPILOT_RESULT:")) {
        try {
          resultPayload = JSON.parse(line.slice("STACKPILOT_RESULT:".length));
        } catch {
          /* ignore parse failures – we still have the raw log */
        }
      } else {
        logs.push(line);
        onLog?.(line);
      }
    };

    child.stdout?.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf-8");
      text
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach(processLine);
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf-8");
      text
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => {
          logs.push(`[stderr] ${line}`);
          onLog?.(`[stderr] ${line}`);
        });
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to start engine: ${err.message}`));
    });

    child.on("close", (code) => {
      if (resultPayload) {
        resolve({ ...resultPayload, logs });
      } else if (code === 0) {
        resolve({ projectName: "stackpilot-project", files: [], logs });
      } else {
        reject(
          new Error(
            `Engine exited with code ${code}. Last logs:\n${logs.slice(-10).join("\n")}`
          )
        );
      }
    });
  });
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Health-check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "StackPilot AI Backend is running",
    engine: ENGINE_ROOT,
  });
});

// ── POST /api/generate  (request → response) ────────────────────────────────
app.post(
  "/api/generate",
  async (
    req: Request,
    res: Response<GenerateResponse>
  ): Promise<void> => {
    const validation = GenerateRequestSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
        error: validation.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
      return;
    }

    const { prompt } = validation.data;

    try {
      console.log(`[generate] Starting engine for prompt: "${prompt.slice(0, 80)}…"`);
      const result = await runEngine(prompt);
      console.log(
        `[generate] Done – project: ${result.projectName}, files: ${result.files.length}`
      );

      res.status(200).json({
        success: true,
        message: "Generation complete",
        data: {
          projectName: result.projectName,
          files: result.files,
          architecture: result.architecture,
          planner: result.planner,
        },
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("[generate] Engine failed:", msg);

      res.status(500).json({
        success: false,
        message: "Generation failed",
        error: msg,
      });
    }
  }
);

// ── POST /api/generate/stream  (SSE real-time progress) ─────────────────────
app.post("/api/generate/stream", async (req: Request, res: Response): Promise<void> => {
  const validation = GenerateRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request",
      error: validation.error.issues.map((i) => i.message).join(", "),
    });
    return;
  }

  const { prompt } = validation.data;

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const sendEvent = (event: StreamEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  sendEvent({
    type: "step",
    data: { step: "started", prompt: prompt.slice(0, 120) },
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await runEngine(prompt, (line) => {
      sendEvent({
        type: "log",
        data: { line },
        timestamp: new Date().toISOString(),
      });
    });

    sendEvent({
      type: "result",
      data: {
        projectName: result.projectName,
        files: result.files,
        architecture: result.architecture,
        planner: result.planner,
      },
      timestamp: new Date().toISOString(),
    });

    sendEvent({
      type: "done",
      data: { status: "complete" },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    sendEvent({
      type: "error",
      data: { error: msg },
      timestamp: new Date().toISOString(),
    });
  } finally {
    res.end();
  }
});

// ── GET /api/models  (list available models for the frontend) ────────────────
app.get("/api/models", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    models: [
      {
        id: "qwen/qwen3.8-27b",
        name: "Qwen 3.8 27B",
        provider: "groq",
        tag: "Vision",
      },
    ],
  });
});

// ── GET /api/status/:jobId  (placeholder for future job tracking) ────────────
app.get("/api/status/:jobId", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    jobId: req.params["jobId"],
    status: "unknown",
    message: "Job tracking not yet implemented",
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`StackPilot AI Backend running on http://localhost:${PORT}`);
  console.log(`Engine root: ${ENGINE_ROOT}`);
});
