export function repairPlannerOutput(data: any) {
  // modules
  if (Array.isArray(data.modules)) {
    data.modules = data.modules.map((m: any) =>
      typeof m === "string"
        ? {
            name: m,
            contains: [],
          }
        : m
    );
  }

  // non functional requirements
  if (data.nonFunctionalRequirements) {
    data.nonFunctionalRequirements = {
      performance:
        data.nonFunctionalRequirements.performance ??
        data.nonFunctionalRequirements.Performance ??
        "",

      availability:
        data.nonFunctionalRequirements.availability ??
        data.nonFunctionalRequirements.Availability ??
        "",

      security: Array.isArray(data.nonFunctionalRequirements.security)
        ? data.nonFunctionalRequirements.security
        : [data.nonFunctionalRequirements.Security ?? "Basic Security"],
    };
  }

  // scalability
  if (data.scalability) {
    data.scalability = {
      horizontalScaling:
        data.scalability.horizontalScaling ??
        data.scalability["Horizontal Scaling"] ??
        "",

      verticalScaling:
        data.scalability.verticalScaling ??
        data.scalability["Vertical Scaling"] ??
        "",

      loadBalancing:
        data.scalability.loadBalancing ??
        data.scalability["Load Balancing"] ??
        "",

      caching: data.scalability.caching ?? data.scalability["Caching"] ?? "",
    };
  }

  return data;
}
