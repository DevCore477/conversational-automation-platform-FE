import {
  type Agent,
  type AgentExecutionMode,
  type ResponseEngine,
} from "@/types/agent.types";

function parseExecutionMode(raw: unknown): AgentExecutionMode {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  return v === "rigid" ? "rigid" : "flex";
}

function asUuidArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) {
    return undefined;
  }
  return v.map((x) => String(x));
}

/**
 * Normalize `responseEngine` from API (camelCase or snake_case).
 */
export function normalizeResponseEngine(raw: unknown): ResponseEngine {
  if (!raw || typeof raw !== "object") {
    return { type: "llm", llm_id: "" };
  }
  const o = raw as Record<string, unknown>;
  const type = String(o.type ?? "");
  if (type === "conversation-flow") {
    return {
      type: "conversation-flow",
      version:
        typeof o.version === "number" ? o.version : Number(o.version) || undefined,
      conversation_flow_id: String(
        o.conversation_flow_id ?? o.conversationFlowId ?? "",
      ),
      conversation_flow_ids: asUuidArray(
        o.conversation_flow_ids ?? o.conversationFlowIds,
      ),
    };
  }
  if (type === "script") {
    return {
      type: "script",
      version:
        typeof o.version === "number" ? o.version : Number(o.version) || undefined,
      script_id: String(o.script_id ?? o.scriptId ?? ""),
    };
  }
  return {
    type: "llm",
    version:
      typeof o.version === "number" ? o.version : Number(o.version) || undefined,
    llm_id: String(o.llm_id ?? o.llmId ?? ""),
  };
}

/**
 * Map agent API payloads (camelCase or snake_case) to our `Agent` type.
 */
/** Read response engine from an agent object (camelCase or snake_case). */
export function getResponseEngineFromAgentLike(agent: unknown): ResponseEngine {
  if (!agent || typeof agent !== "object") {
    return normalizeResponseEngine(undefined);
  }
  const a = agent as Record<string, unknown>;
  return normalizeResponseEngine(a.responseEngine ?? a.response_engine);
}

export function normalizeAgentFromApi(raw: unknown): Agent {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid agent payload");
  }
  const r = raw as Record<string, unknown>;
  const responseEngine = getResponseEngineFromAgentLike(raw);

  return {
    id: String(r.id ?? ""),
    agentName: String(r.agentName ?? r.agent_name ?? ""),
    companyId: (r.companyId ?? r.company_id ?? null) as string | null,
    channel: "voice",
    responseEngine,
    language: String(r.language ?? "en-US"),
    voiceId: (r.voiceId ?? r.voice_id ?? null) as string | null,
    maxCallDurationMs: Number(
      r.maxCallDurationMs ?? r.max_call_duration_ms ?? 3600000,
    ),
    interruptionSensitivity: Number(
      r.interruptionSensitivity ?? r.interruption_sensitivity ?? 0.9,
    ),
    dataStorageSetting: String(
      r.dataStorageSetting ?? r.data_storage_setting ?? "everything",
    ),
    userDtmfOptions: (r.userDtmfOptions ?? r.user_dtmf_options ?? null) as
      | Record<string, unknown>
      | null,
    isPublished: Boolean(r.isPublished ?? r.is_published ?? false),
    postCallAnalysisModel: (r.postCallAnalysisModel ??
      r.post_call_analysis_model ??
      null) as string | null,
    mode: parseExecutionMode(r.mode ?? r.conversationFlowMode ?? r.conversation_flow_mode),
    globalPrompt: String(r.globalPrompt ?? r.global_prompt ?? ""),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    updatedAt: String(r.updatedAt ?? r.updated_at ?? ""),
  };
}
