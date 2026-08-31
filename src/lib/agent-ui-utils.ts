import { type ResponseEngine } from "@/types/agent.types";
import { type ConversationFlow } from "@/types/flow.types";
import { type CallScript } from "@/types/script.types";

/** Short label for agent list rows (flow/script name or id). */
export function formatEngineBindingSubtitle(
  engine: ResponseEngine,
  flows: ConversationFlow[],
  scripts: CallScript[],
): string {
  if (engine.type === "conversation-flow") {
    const id = engine.conversation_flow_id;
    if (!id) {
      return "Flow";
    }
    const n = resolveFlowName(flows, id);
    return n ? `Flow: ${n}` : `Flow: ${id.slice(0, 8)}…`;
  }
  if (engine.type === "script") {
    const id = engine.script_id;
    if (!id) {
      return "Script";
    }
    const n = resolveScriptName(scripts, id);
    return n ? `Script: ${n}` : `Script: ${id.slice(0, 8)}…`;
  }
  return engine.llm_id ? `LLM: ${engine.llm_id}` : "LLM";
}

export function resolveFlowName(
  flows: ConversationFlow[],
  flowId: string | undefined,
): string | null {
  if (!flowId) {
    return null;
  }
  return flows.find((f) => f.id === flowId)?.name ?? null;
}

export function resolveScriptName(
  scripts: CallScript[],
  scriptId: string | undefined,
): string | null {
  if (!scriptId) {
    return null;
  }
  return scripts.find((s) => s.id === scriptId)?.name ?? null;
}

/** Options for Select: includes a synthetic row when the saved ID is not in the current list. */
export function buildFlowSelectOptions(
  flows: ConversationFlow[],
  selectedFlowId: string | undefined,
): { id: string; label: string; isUnknown: boolean }[] {
  const rows = flows.map((f) => ({
    id: f.id,
    label: f.name,
    isUnknown: false,
  }));
  if (
    selectedFlowId &&
    !rows.some((r) => r.id === selectedFlowId)
  ) {
    rows.unshift({
      id: selectedFlowId,
      label: `Unknown flow (${selectedFlowId.slice(0, 8)}…)`,
      isUnknown: true,
    });
  }
  return rows;
}

/** Comma/space-separated UUIDs → human-readable flow names where possible. */
export function describeExtraFlowIdList(
  flows: ConversationFlow[],
  raw: string,
): string | null {
  const ids = raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length === 0) {
    return null;
  }
  return ids
    .map((id) => resolveFlowName(flows, id) ?? `Unknown (${id.slice(0, 8)}…)`)
    .join(", ");
}

export function buildScriptSelectOptions(
  scripts: CallScript[],
  selectedScriptId: string | undefined,
): { id: string; label: string; isUnknown: boolean }[] {
  const rows = scripts.map((s) => ({
    id: s.id,
    label: s.name,
    isUnknown: false,
  }));
  if (
    selectedScriptId &&
    !rows.some((r) => r.id === selectedScriptId)
  ) {
    rows.unshift({
      id: selectedScriptId,
      label: `Unknown script (${selectedScriptId.slice(0, 8)}…)`,
      isUnknown: true,
    });
  }
  return rows;
}
