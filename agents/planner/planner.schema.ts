import { z } from "zod";

export const PlannerSchema = z.object({
  projectType: z.string(),
  platform: z.string(),
  domain: z.string(),
  appType: z.string(),

  features: z.array(z.string()),

  modules: z.array(
    z.object({
      name: z.string(),
      contains: z.array(z.string()),
    })
  ),

  screens: z.array(z.string()),

  userStories: z.array(z.string()),

  apiEndpoints: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
    })
  ),

  databaseEntities: z.array(
    z.object({
      name: z.string(),
      fields: z.array(z.string()),
    })
  ),

  nonFunctionalRequirements: z.object({
    performance: z.string(),
    availability: z.string(),
    security: z.array(z.string()),
  }),

  scalability: z.object({
    horizontalScaling: z.string(),
    verticalScaling: z.string(),
    loadBalancing: z.string(),
    caching: z.string(),
  }),

  mvpFeatures: z.array(z.string()),

  futureFeatures: z.array(z.string()),
});

export type PlannerOutput = z.infer<typeof PlannerSchema>;
