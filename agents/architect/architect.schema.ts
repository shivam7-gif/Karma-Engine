import { z } from "zod";

export const ArchitectureSchema = z.object({
  projectType: z.string(),

  frontend: z.object({
    framework: z.string(),
    language: z.string(),
    styling: z.string(),
    stateManagement: z.string(),
  }),

  backend: z.object({
    framework: z.string(),
    language: z.string(),
    database: z.string(),
    orm: z.string(),
    authentication: z.string(),
  }),

  infrastructure: z.object({
    caching: z.string(),
    queue: z.string(),
    storage: z.string(),
    search: z.string().optional(),
  }),

  services: z.array(z.string()),

  deployment: z.object({
    containerization: z.string(),
    hosting: z.string(),
    ciCd: z.string(),
  }),

  scalability: z.object({
    architectureStyle: z.string(),
    loadBalancer: z.string(),
    expectedUsers: z.number(),
  }),
});

export type ArchitectureOutput =
  z.infer<typeof ArchitectureSchema>;