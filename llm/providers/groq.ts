import {ChatOpenAI} from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();
export const connectionToGroq =()=>{
  return new ChatOpenAI({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
});
}