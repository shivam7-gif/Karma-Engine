import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();
export const connectionToGroq = (maxTokens?: number) => {
  return new ChatOpenAI({
    model: "qwen/qwen3.8-27b",
    temperature: 0,
    maxTokens,
    maxRetries: 5,
    apiKey: process.env.GROQ_API_KEY,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
    },
    modelKwargs: {
      reasoning_effort: "none",
      response_format: { type: "json_object" },
    }
  });
};
