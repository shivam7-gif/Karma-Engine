import "dotenv/config";

function getLangsmithConfig() {
  const enabled = [
    process.env.LANGCHAIN_TRACING_V2,
    process.env.LANGSMITH_TRACING_V2,
    process.env.LANGCHAIN_TRACING,
    process.env.LANGSMITH_TRACING,
  ].includes("true");

  const apiKey = process.env.LANGCHAIN_API_KEY ?? process.env.LANGSMITH_API_KEY;
  const endpoint =
    process.env.LANGCHAIN_ENDPOINT ??
    process.env.LANGSMITH_ENDPOINT ??
    "https://api.smith.langchain.com";
  const project =
    process.env.LANGCHAIN_PROJECT ?? process.env.LANGSMITH_PROJECT ?? "default";

  return {
    enabled,
    apiKey,
    endpoint,
    project,
  };
}

export const langsmithConfig = getLangsmithConfig();

export function initializeLangsmith() {
  const config = getLangsmithConfig();

  if (config.apiKey) {
    process.env.LANGCHAIN_API_KEY = config.apiKey;
    process.env.LANGSMITH_API_KEY = config.apiKey;
  }

  if (config.enabled) {
    process.env.LANGCHAIN_TRACING_V2 = "true";
    process.env.LANGSMITH_TRACING_V2 = "true";
    process.env.LANGCHAIN_TRACING = "true";
    process.env.LANGSMITH_TRACING = "true";
  }

  if (config.endpoint) {
    process.env.LANGCHAIN_ENDPOINT = config.endpoint;
    process.env.LANGSMITH_ENDPOINT = config.endpoint;
  }

  if (config.project) {
    process.env.LANGCHAIN_PROJECT = config.project;
    process.env.LANGSMITH_PROJECT = config.project;
  }

  return config;
}

export function isTracingEnabled() {
  const config = getLangsmithConfig();
  return Boolean(config.enabled && config.apiKey);
}
