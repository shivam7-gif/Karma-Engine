import { addUsage, createMetrics, type ExecutionMetrics } from "./metrics.js";

class MetricsService {
  private metricsByAgent = new Map<string, ExecutionMetrics>();

  addMetrics(payload: {
    agentName: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens?: number;
    estimatedCostUSD?: number;
  }) {
    const metrics = createMetrics();
    addUsage(metrics, {
      promptTokens: payload.promptTokens,
      completionTokens: payload.completionTokens,
      totalTokens: payload.totalTokens,
      estimatedCostUSD: payload.estimatedCostUSD,
    });
    this.metricsByAgent.set(payload.agentName, metrics);
    return metrics;
  }

  getMetrics(agentName: string) {
    return this.metricsByAgent.get(agentName);
  }
}

export const metricsService = new MetricsService();
