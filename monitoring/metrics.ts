export interface ExecutionMetrics {
  startTime: number;

  endTime?: number;

  latencyMs?: number;

  promptTokens: number;

  completionTokens: number;

  totalTokens: number;

  estimatedCostUSD: number;
}

export function createMetrics(): ExecutionMetrics {
  return {
    startTime: Date.now(),

    promptTokens: 0,

    completionTokens: 0,

    totalTokens: 0,

    estimatedCostUSD: 0,
  };
}

export function finishMetrics(
  metrics: ExecutionMetrics
): ExecutionMetrics {
  metrics.endTime = Date.now();

  metrics.latencyMs =
    metrics.endTime - metrics.startTime;

  return metrics;
}

export function addUsage(
  metrics: ExecutionMetrics,
  usage: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    estimatedCostUSD?: number;
  }
) {
  metrics.promptTokens += usage.promptTokens ?? 0;

  metrics.completionTokens += usage.completionTokens ?? 0;

  metrics.totalTokens += usage.totalTokens ?? 0;

  metrics.estimatedCostUSD +=
    usage.estimatedCostUSD ?? 0;
}