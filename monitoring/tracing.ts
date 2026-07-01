import {RunnableConfig} from "@langchain/core/runnables";

export interface TraceOptions{
  runName : string;
  userId ?: string;
  sessionId ?:string;
  tags ?: string[];
  metadata ?: Record<string,unknown>;
}

export function createTraceConfig(options : TraceOptions) : RunnableConfig{
  return {
    runName : options.runName,
    tags : options.tags,
    metadata :{
      userId : options.userId,
      sessionId : options.sessionId,
      ...options.metadata,
    },
  };
}