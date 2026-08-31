import { type ConversationFlow } from "@/types/flow.types";

/**
 * Count nodes in a stored conversation flow.
 * Supports: nested `flow.flow.nodes` (BackendFlow), legacy `flow.nodes` record, and `flowData.nodes`.
 */
export function countFlowNodes(flow: ConversationFlow): number {
  return getFlowNodeLabels(flow).length;
}

/**
 * Human-readable labels for each node (for previews and listings).
 */
export function getFlowNodeLabels(flow: ConversationFlow): string[] {
  const payload = flow.flow;
  if (!payload) {
    const fromDataOnly = flow.flowData?.nodes;
    if (Array.isArray(fromDataOnly)) {
      return fromDataOnly.map((n) => n.name || n.id);
    }
    return [];
  }

  // New format: BackendFlowPayload.flow = BackendFlow with nodes: BackendNode[]
  const nested = payload.flow?.nodes;
  if (Array.isArray(nested)) {
    return nested.map((n) => n.name || n.id);
  }

  // Legacy: top-level `nodes` is Record<nodeId, BackendNodePayload>
  const legacy = payload.nodes;
  if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) {
    return Object.entries(legacy).map(([id, node]) => {
      const title = node && typeof node === "object" && "title" in node
        ? String((node as { title?: string }).title ?? "")
        : "";
      return title || id;
    });
  }

  const fromData = flow.flowData?.nodes;
  if (Array.isArray(fromData)) {
    return fromData.map((n) => n.name || n.id);
  }

  return [];
}
