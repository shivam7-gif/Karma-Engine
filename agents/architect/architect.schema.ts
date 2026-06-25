import { z } from "zod";

export const TechPlanSchema = z.object({
  projectType: z.string(),

  frontend: z.object({
    framework: z.string(),
    language: z.string(),
    styling: z.string(),
    stateManagement: z.string().optional(),
  }),

  backend: z.object({
    framework: z.string(),
    language: z.string(),
    database: z.string(),
    orm: z.string().optional(),
    authentication: z.string().optional(),
  }),

  services: z.array(z.string()),

  deployment: z.object({
    containerization: z.string().optional(),
  }),
});

export type TechPlan =
  z.infer<typeof TechPlanSchema>;