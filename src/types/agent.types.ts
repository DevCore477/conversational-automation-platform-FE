/**
 * Response engine configuration.
 * An agent uses one of: conversation flow(s), script, or LLM.
 */

/** Single conversation flow as response engine */
export interface ResponseEngineConversationFlow {
  type: "conversation-flow";
  version?: number;
  /** Primary conversation flow ID (required) */
  conversation_flow_id: string;
  /** Optional additional flow IDs for routing/fallback */
  conversation_flow_ids?: string[];
}

/** Script-based response engine */
export interface ResponseEngineScript {
  type: "script";
  version?: number;
  script_id: string;
}

/** LLM-based response engine */
export interface ResponseEngineLlm {
  type: "llm";
  version?: number;
  llm_id: string;
}

export type ResponseEngine =
  | ResponseEngineConversationFlow
  | ResponseEngineScript
  | ResponseEngineLlm;

/** How the agent follows a conversation flow at runtime. */
export type AgentExecutionMode = "flex" | "rigid";

export function isConversationFlowEngine(
  engine: ResponseEngine,
): engine is ResponseEngineConversationFlow {
  return engine.type === "conversation-flow";
}

export function isScriptEngine(
  engine: ResponseEngine,
): engine is ResponseEngineScript {
  return engine.type === "script";
}

export function isLlmEngine(engine: ResponseEngine): engine is ResponseEngineLlm {
  return engine.type === "llm";
}

export function responseEngineLabel(engine: ResponseEngine): string {
  switch (engine.type) {
    case "conversation-flow":
      return "Conversation flow";
    case "script":
      return "Script";
    case "llm":
      return "LLM";
    default:
      return "Unknown";
  }
}

/** Agent entity returned by GET/PATCH /agents */
export interface Agent {
  id: string;
  agentName: string;
  companyId: string | null;
  channel: "voice";
  responseEngine: ResponseEngine;
  language: string;
  voiceId: string | null;
  maxCallDurationMs: number;
  interruptionSensitivity: number;
  dataStorageSetting: string;
  userDtmfOptions: Record<string, unknown> | null;
  isPublished: boolean;
  postCallAnalysisModel: string | null;
  /** Flow execution: shared context vs step-by-step. */
  mode: AgentExecutionMode;
  /** System / global instructions for the agent. */
  globalPrompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentDto {
  agentName: string;
  companyId?: string | null;
  channel?: "voice";
  responseEngine: ResponseEngine;
  language?: string;
  voiceId?: string | null;
  maxCallDurationMs?: number;
  interruptionSensitivity?: number;
  dataStorageSetting?: string;
  userDtmfOptions?: Record<string, unknown> | null;
  isPublished?: boolean;
  postCallAnalysisModel?: string | null;
  mode?: AgentExecutionMode;
  globalPrompt?: string;
}

export interface UpdateAgentDto {
  agentName?: string;
  channel?: "voice";
  responseEngine?: ResponseEngine;
  language?: string;
  voiceId?: string | null;
  maxCallDurationMs?: number;
  interruptionSensitivity?: number;
  dataStorageSetting?: string;
  userDtmfOptions?: Record<string, unknown> | null;
  isPublished?: boolean;
  postCallAnalysisModel?: string | null;
  mode?: AgentExecutionMode;
  globalPrompt?: string;
}

export interface GetForCallOptions {
  requirePublished?: boolean;
}
