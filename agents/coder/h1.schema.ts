import { z } from "zod";

export const FileOperationSchema = z.object({
  path: z
    .string()
    .describe("Relative file path from project root (e.g. src/index.tsx)"),
  code: z.string().describe("Full, complete source code for this file"),
  action: z.enum(["CREATE", "UPDATE"]).default("CREATE"),
});

export const H1OutputSchema = z.object({
  projectName: z.string().describe("Slug-safe project name (kebab-case)"),
  files: z.array(FileOperationSchema),
});

export type H1Output = z.infer<typeof H1OutputSchema>;
export type FileOperation = z.infer<typeof FileOperationSchema>;
