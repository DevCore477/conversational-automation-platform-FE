import { toDisplayName } from "@/common/utils/string.utils";
import {
  type FlowData,
  type BackendFlowPayload,
  type BackendFlow,
  type BackendNode,
  type BackendEdge,
  type BackendNodePayload,
  type BackendListen,
  type BackendTool,
  type BackendToolCatalogEntry,
  type BackendToolInvocation,
  type BackendToolParameters,
  type BackendToolReturns,
  type BackendSlots,
  NodeType,
  type FlowNode,
  type FlowEdge,
  type NodeTransition,
} from "@/types/flow.types";

function getStartNodeId(flow: FlowData): string {
  const startNode = flow.nodes.find((n) => n.type === NodeType.Start);
  if (!startNode) {
    return "";
  }
  const startEdge = flow.edges.find((e) => e.source === startNode.id);
  return startEdge?.target ?? "";
}

function getTemplate(node: FlowNode): string {
  if (node.type === NodeType.Ending) {
    return (
      (node.data.endingMessage as string) ?? (node.data.content as string) ?? ""
    );
  }
  return (node.data.content as string) ?? "";
}

function firstTransitionTarget(node: FlowNode): string | null {
  const t = node.data.transitions?.[0];
  return t?.targetNodeId ?? null;
}

function isEmbeddedToolSchema(
  tool: BackendTool | BackendToolInvocation | undefined,
): tool is BackendTool {
  const p = tool?.parameters as unknown;
  return (
    !!tool &&
    typeof p === "object" &&
    p !== null &&
    "properties" in p &&
    typeof (p as BackendToolParameters).properties === "object" &&
    (p as BackendToolParameters).properties !== null
  );
}

function normalizeExecutorKey(
  source: BackendTool | BackendToolCatalogEntry | Record<string, unknown> | undefined,
): string | undefined {
  if (!source) return undefined;
  const o = source as Record<string, unknown>;
  const k = o.executor_key ?? o.executorKey;
  return typeof k === "string" ? k : undefined;
}

function defaultInvocationBindings(
  schema?: BackendToolParameters,
): Record<string, string> | undefined {
  if (!schema?.properties) return undefined;
  const keys =
    schema.required?.length && schema.required.length > 0
      ? schema.required
      : Object.keys(schema.properties);
  if (keys.length === 0) return undefined;
  return Object.fromEntries(keys.map((k) => [k, `{{${k}}}`]));
}

function buildToolsCatalog(flow: FlowData): BackendToolCatalogEntry[] {
  const byName = new Map<string, BackendToolCatalogEntry>();
  for (const node of flow.nodes) {
    if (node.type !== NodeType.Function) continue;
    const name = ((node.data.toolName as string) || "").trim();
    if (!name) continue;
    const toolParameters = node.data.toolParameters as
      | BackendToolParameters
      | undefined;
    const toolReturns = node.data.toolReturns as
      | BackendToolReturns
      | undefined;
    const executorKey = ((node.data.executorKey as string) || "").trim();
    const entry: BackendToolCatalogEntry = {
      name,
      description: (node.data.toolDescription as string) || undefined,
      ...(toolParameters ? { parameters: toolParameters } : {}),
      ...(toolReturns ? { returns: toolReturns } : {}),
      ...(executorKey ? { executor_key: executorKey } : {}),
    };
    byName.set(name, entry);
  }
  return [...byName.values()];
}

function buildSlotsFromFlow(flow: FlowData): BackendSlots | undefined {
  const slots: BackendSlots = {};
  for (const node of flow.nodes) {
    const cs = (node.data.captureSlot as string | undefined)?.trim();
    if (cs) slots[cs] = "";
  }
  return Object.keys(slots).length > 0 ? slots : undefined;
}

function buildBackendEdge(
  transition: NodeTransition,
  nodeId: string,
  index: number,
): BackendEdge {
  const promptText = transition.prompt ?? transition.label;
  return {
    id: `edge-${nodeId}-${transition.id}-${index}`,
    condition: promptText,
    destination_node_id: transition.targetNodeId ?? "",
    transition_condition: {
      type: "prompt",
      prompt: promptText,
    },
  };
}

function buildNodeEdges(node: FlowNode): BackendEdge[] {
  const edges: BackendEdge[] = [];
  node.data.transitions?.forEach((t, idx) => {
    if (t.targetNodeId) {
      edges.push(buildBackendEdge(t, node.id, idx));
    }
  });
  return edges;
}

function buildBackendNode(
  node: FlowNode,
  _flow: FlowData,
  isFirstConversationForSpeaker: boolean,
): BackendNode {
  const contentType =
    (node.data.contentType as "prompt" | "static") || "prompt";

  const captureSlot = (node.data.captureSlot as string | undefined)?.trim();

  const baseFields = {
    id: node.id,
    name: node.data.title?.toLowerCase().replace(/\s+/g, "_") || node.id,
    edges: buildNodeEdges(node),
    instruction: {
      text: getTemplate(node),
      type: contentType,
    },
    display_position: {
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
    },
    interruption_sensitivity:
      (node.data.interruptionSensitivity as number) ?? 0,
    ...(captureSlot ? { capture_slot: captureSlot } : {}),
  };

  if (node.type === NodeType.Function) {
    const toolName = ((node.data.toolName as string) || "").trim();
    const toolParameters = node.data.toolParameters as
      | BackendToolParameters
      | undefined;
    const explicitInvocation = node.data.toolInvocationParameters as
      | Record<string, string>
      | undefined;
    const invocation =
      explicitInvocation && Object.keys(explicitInvocation).length > 0
        ? explicitInvocation
        : defaultInvocationBindings(toolParameters);

    const result: BackendNode = {
      ...baseFields,
      type: "tool",
      ...(toolName
        ? {
            tool: {
              name: toolName,
              ...(invocation && Object.keys(invocation).length > 0
                ? { parameters: invocation }
                : {}),
            },
          }
        : {}),
    };
    return result;
  }

    if (node.type === NodeType.CallTransfer) {
    const transferType = ((node.data.transferType as string) || "phone").trim();
    const transferDestination = ((node.data.transferDestination as string) || "").trim();
    const transferOption = (node.data.transferOption as string) || "cold_transfer";
    const warmTransfer = (node.data.warmTransfer as boolean) || false;
    const transferNotes = ((node.data.transferNotes as string) || "").trim();

    const destTypeMap: Record<string, string> = {
      phone: "phone_number",
      flow: "flow_id",
      agent: "agent_id",
    };
    const destType = destTypeMap[transferType] || "phone_number";

    const fallbackEdge: BackendEdge | undefined =
      node.data.transitions?.[0]?.targetNodeId
        ? {
            id: `edge-${node.id}-${node.data.transitions[0].id}-0`,
            condition:
              node.data.transitions[0].prompt ??
              node.data.transitions[0].label,
            destination_node_id: node.data.transitions[0].targetNodeId,
            transition_condition: {
              type: "prompt",
              prompt:
                node.data.transitions[0].prompt ??
                node.data.transitions[0].label,
            },
          }
        : undefined;

    const result: BackendNode = {
      id: node.id,
      name: node.data.title?.toLowerCase().replace(/\s+/g, "_") || node.id,
      type: "transfer_call",
      instruction: baseFields.instruction,
      display_position: baseFields.display_position,
      ...(fallbackEdge ? { edge: fallbackEdge } : {}),
      transfer_destination: {
        type: destType,
        ...(transferDestination ? { number: transferDestination } : {}),
      },
      ...(warmTransfer || transferOption === "warm_transfer" || transferNotes
        ? {
            transfer_option: {
              type: warmTransfer ? "warm_transfer" : (transferOption === "warm_transfer" ? "warm_transfer" : "cold_transfer"),
              ...(transferNotes
                ? ({ notes: transferNotes } as Record<string, string>)
                : {}),
            },
          }
        : {}),
    };
    return result;
  }

  const result: BackendNode = {
    ...baseFields,
    type: node.type === NodeType.Ending ? "end" : "conversation",
  };

  if (isFirstConversationForSpeaker) {
    result.start_speaker =
      (node.data.startSpeaker as "agent" | "user") || "agent";
  }
  return result;
}

/**
 * Converts internal FlowData to the backend payload format (new format).
 * Use this when saving or sending the flow to the API.
 */
export function toBackendPayload(flow: FlowData): BackendFlowPayload {
  const start = getStartNodeId(flow);
  const firstAfterStartId = start || null;

  const backendNodes: BackendNode[] = [];

  for (const node of flow.nodes) {
    if (node.type === NodeType.Start) {
      continue;
    }
    const isFirstConversationForSpeaker =
      firstAfterStartId !== null &&
      node.id === firstAfterStartId &&
      node.type === NodeType.Conversation;
    backendNodes.push(
      buildBackendNode(node, flow, isFirstConversationForSpeaker),
    );
  }

  const tools = buildToolsCatalog(flow);
  const slots = buildSlotsFromFlow(flow);

  const backendFlow: BackendFlow = {
    nodes: backendNodes,
    start_node_id: start,
    start_speaker: "agent",
    ...(tools.length > 0 ? { tools } : {}),
  };

  return {
    start,
    flow: backendFlow,
    nodes: undefined,
    intents: flow.intents ?? {},
    ...(slots ? { slots } : {}),
  };
}

// ============================================
// Deserialize BE payload → FlowData (for loading in builder)
// ============================================

/**
 * Converts new backend payload format to internal FlowData for use in the flow builder.
 */
export function fromBackendPayload(
  payload: BackendFlowPayload,
  existingMetadata?: FlowData["metadata"],
): FlowData {
  // Check if new format (flow.nodes) or legacy format (nodes)
  const backendFlow = payload.flow;
  const backendNodes = backendFlow?.nodes;

  if (backendNodes && backendNodes.length > 0) {
    return convertFromNewFormat(payload, existingMetadata);
  }

  // Legacy format handling
  return convertFromLegacyFormat(payload, existingMetadata);
}

/**
 * Resolves edge destination_node_id to an actual node id from the backend.
 * Handles common mismatch where edges point to "end_node" but the end node id is "end-node".
 */
function resolveTargetNodeId(
  destinationNodeId: string,
  backendNodes: BackendNode[],
): string {
  const exists = backendNodes.some((n) => n.id === destinationNodeId);
  if (exists) return destinationNodeId;
  // Normalize underscore/hyphen: "end_node" <-> "end-node"
  const toHyphen = destinationNodeId.replace(/_/g, "-");
  const matchByHyphen = backendNodes.find((n) => n.id === toHyphen);
  if (matchByHyphen) return matchByHyphen.id;
  const toUnderscore = destinationNodeId.replace(/-/g, "_");
  const matchByUnderscore = backendNodes.find((n) => n.id === toUnderscore);
  if (matchByUnderscore) return matchByUnderscore.id;
  // If destination looks like "end" node, use the actual end node id
  if (/end[-_]?node/i.test(destinationNodeId)) {
    const endNode = backendNodes.find(
      (n) => n.type === "end" || n.type === "ending",
    );
    if (endNode) return endNode.id;
  }
  return destinationNodeId;
}

function convertFromNewFormat(
  payload: BackendFlowPayload,
  existingMetadata?: FlowData["metadata"],
): FlowData {
  const START_NODE_ID = "start";
  const backendFlow = payload.flow!;
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // Add start node
  nodes.push({
    id: START_NODE_ID,
    type: NodeType.Start,
    label: "Start",
    position: { x: 250, y: 0 },
    data: { title: "Start", transitions: [] },
  });

  const startNodeId = backendFlow.start_node_id;

  // Edge from start to first node
  if (startNodeId) {
    edges.push({
      id: `edge-start-${startNodeId}`,
      source: START_NODE_ID,
      target: startNodeId,
    });
  }

  // Get saved node titles from existing metadata
  const savedNodeTitles = existingMetadata?.nodeTitles;
  const catalog = backendFlow.tools ?? [];

  backendFlow.nodes.forEach((node, i) => {
    const transitions: NodeTransition[] = [];
    const nodeId = node.id;

    // Convert edges to transitions (prompt-based: use transition_condition.prompt)
    node.edges?.forEach((edge, idx) => {
      const resolvedTarget = resolveTargetNodeId(
        edge.destination_node_id,
        backendFlow.nodes,
      );
      const promptText =
        edge.transition_condition?.prompt ?? edge.condition ?? "";
      const tid = `trans-${nodeId}-${edge.id}-${idx}`;
      transitions.push({
        id: tid,
        label: promptText,
        targetNodeId: resolvedTarget,
        transitionType: "prompt",
        prompt: promptText,
      });

      // Create edge for ReactFlow
      edges.push({
        id: edge.id,
        source: nodeId,
        target: resolvedTarget,
        sourceHandle: tid,
      });
    });

    // Handle singular edge on transfer_call nodes
    if (node.type === "transfer_call" && node.edge) {
      const resolvedTarget = resolveTargetNodeId(
        node.edge.destination_node_id,
        backendFlow.nodes,
      );
      const promptText =
        node.edge.transition_condition?.prompt ?? node.edge.condition ?? "";
      const tid = `trans-${nodeId}-${node.edge.id}-0`;
      transitions.push({
        id: tid,
        label: promptText,
        targetNodeId: resolvedTarget,
        transitionType: "prompt",
        prompt: promptText,
      });
      edges.push({
        id: node.edge.id,
        source: nodeId,
        target: resolvedTarget,
        sourceHandle: tid,
      });
    }

    const title = node.name
      ? toDisplayName(node.name)
      : savedNodeTitles?.[nodeId]
        ? toDisplayName(savedNodeTitles[nodeId])
        : nodeId;

    const embeddedTool =
      node.type === "conversation" && node.tool && isEmbeddedToolSchema(node.tool)
        ? node.tool
        : undefined;

    const nodeTypeFromBackend =
      node.type === "end" || node.type === "ending"
        ? NodeType.Ending
        : node.type === "tool"
          ? NodeType.Function
          : node.type === "transfer_call"
            ? NodeType.CallTransfer
            : NodeType.Conversation;

    const effectiveType = embeddedTool ? NodeType.Function : nodeTypeFromBackend;

    const schemaFromCatalog =
      node.tool?.name && catalog.length > 0
        ? catalog.find((t) => t.name === node.tool!.name)
        : undefined;
    const schemaSource: BackendTool | undefined =
      schemaFromCatalog ?? embeddedTool;

    let toolInvocationParameters: Record<string, string> | undefined;
    if (
      effectiveType === NodeType.Function &&
      node.type === "tool" &&
      node.tool &&
      !isEmbeddedToolSchema(node.tool)
    ) {
      toolInvocationParameters = (node.tool as BackendToolInvocation).parameters;
    }

    const captureSlotRaw = node.capture_slot?.trim();

    const isFirstConversationNode =
      nodeId === startNodeId && effectiveType === NodeType.Conversation;

    const nodeData: FlowNode["data"] = {
      title,
      content: node.instruction?.text ?? "",
      contentType: node.instruction?.type ?? "prompt",
      transitions,
      ...(isFirstConversationNode && {
        startSpeaker: node.start_speaker ?? "agent",
      }),
      interruptionSensitivity: node.interruption_sensitivity,
      ...(node.type === "transfer_call"
        ? {
            transferType: node.transfer_destination?.type === "phone_number" ? "phone" : node.transfer_destination?.type === "flow_id" ? "flow" : node.transfer_destination?.type === "agent_id" ? "agent" : node.transfer_destination?.type ?? "phone",
            transferDestination: node.transfer_destination?.number ?? "",
            transferOption: node.transfer_option?.type ?? (node.call_transfer?.warm_transfer ? "warm_transfer" : "cold_transfer"),
            warmTransfer: node.transfer_option?.type === "warm_transfer" || node.call_transfer?.warm_transfer || false,
          }
        : {}),
      isEnd: node.type === "end" || node.type === "ending",
      ...(captureSlotRaw ? { captureSlot: captureSlotRaw } : {}),
      ...(effectiveType === NodeType.Function && node.tool?.name
        ? {
            toolName: node.tool.name,
            toolDescription: schemaSource?.description,
            toolParameters: schemaSource?.parameters,
            toolReturns: schemaSource?.returns,
            executorKey: normalizeExecutorKey(schemaSource),
            ...(toolInvocationParameters &&
            Object.keys(toolInvocationParameters).length > 0
              ? { toolInvocationParameters }
              : {}),
          }
        : {}),
    };

    nodes.push({
      id: nodeId,
      type: effectiveType,
      label: title,
      position: {
        x: node.display_position?.x ?? 250,
        y: node.display_position?.y ?? 150 + i * 100,
      },
      data: nodeData,
    });
  });

  // Preserve saved node titles
  const preservedNodeTitles = existingMetadata?.nodeTitles || {};

  return {
    nodes,
    edges,
    intents: payload.intents ?? {},
    metadata: {
      ...existingMetadata,
      name: existingMetadata?.name || "Conversation Flow",
      description: existingMetadata?.description || "Loaded from template",
      createdAt: existingMetadata?.createdAt || new Date().toISOString(),
      nodeTitles:
        Object.keys(preservedNodeTitles).length > 0
          ? preservedNodeTitles
          : undefined,
    },
  };
}

function convertFromLegacyFormat(
  payload: BackendFlowPayload,
  existingMetadata?: FlowData["metadata"],
): FlowData {
  const START_NODE_ID = "start";
  const legacyNodes = payload.nodes;
  const nodeIds = Object.keys(legacyNodes ?? {});
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  nodes.push({
    id: START_NODE_ID,
    type: NodeType.Start,
    label: "Start",
    position: { x: 480, y: 0 },
    data: { title: "Start", transitions: [] },
  });

  const savedNodeTitles = existingMetadata?.nodeTitles;

  const SUPPORT_SALES_LAYOUT: Record<string, { x: number; y: number }> = {
    start: { x: 502, y: -46 },
    welcome: { x: 256, y: 116 },
    support_flow: { x: -12, y: 402 },
    support_confirm: { x: -60, y: 884 },
    sales_flow: { x: 480, y: 420 },
    pricing: { x: 514, y: 906 },
    demo: { x: 1094, y: 908 },
    handover: { x: 1258, y: 328 },
    fallback: { x: 1148, y: 596 },
  };

  function getLayoutPosition(
    nodeId: string,
    index: number,
  ): { x: number; y: number } {
    const known = SUPPORT_SALES_LAYOUT[nodeId];
    if (known) {
      return known;
    }
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { x: 120 + col * 360, y: 140 + row * 220 };
  }

  function inferNodeType(p: BackendNodePayload): NodeType {
    if (p.end && p.tool) {
      return NodeType.AgentTransfer;
    }
    if (p.end) {
      return NodeType.Ending;
    }
    const listen = p.listen as BackendListen | undefined;
    if (listen && "capture_slot" in listen) {
      return NodeType.ExtractVariable;
    }
    if (listen && "intent_scope" in listen) {
      return NodeType.Conversation;
    }
    return NodeType.Conversation;
  }

  nodeIds.forEach((nodeId, i) => {
    const p = legacyNodes![nodeId];
    const nodeType = inferNodeType(p);
    const position = p.position || getLayoutPosition(nodeId, i);

    const title =
      p.title || savedNodeTitles?.[nodeId] || toDisplayName(nodeId) || nodeId;

    const content = p.say?.template ?? "";
    const transitions: NodeTransition[] = [];
    const listen = p.listen as BackendListen | undefined;

    if (listen && "intent_scope" in listen) {
      const intentScope = listen.intent_scope ?? [];
      const fallback = (listen as { fallback?: string }).fallback ?? "";
      const transList = p.transitions ?? [];
      transList.forEach((t, idx) => {
        const tid = `trans-${nodeId}-${t.on_intent}-${idx}`;
        transitions.push({
          id: tid,
          label: t.on_intent,
          targetNodeId: t.to,
          linkedIntent: t.on_intent,
        } as any);
        edges.push({
          id: `edge-${nodeId}-${t.to}-${tid}`,
          source: nodeId,
          target: t.to,
          sourceHandle: tid,
        });
      });
      const fallbackTid = `trans-${nodeId}-fallback`;
      transitions.push({
        id: fallbackTid,
        label: "Fallback",
        targetNodeId: fallback || null,
      });
      if (fallback) {
        edges.push({
          id: `edge-${nodeId}-fallback-${fallback}`,
          source: nodeId,
          target: fallback,
          sourceHandle: fallbackTid,
        });
      }
      nodes.push({
        id: nodeId,
        type: nodeType,
        label: title,
        position,
        data: {
          title,
          content,
          transitions,
          intentScope,
          fallbackNodeId: fallback || undefined,
          intentTransitions: p.transitions,
        },
      });
    } else if (listen && "capture_slot" in listen) {
      const next = listen.next ?? "";
      const tid = `trans-${nodeId}-next`;
      transitions.push({ id: tid, label: "Next", targetNodeId: next || null });
      if (next) {
        edges.push({
          id: `edge-${nodeId}-${next}`,
          source: nodeId,
          target: next,
          sourceHandle: tid,
        });
      }
      nodes.push({
        id: nodeId,
        type: NodeType.ExtractVariable,
        label: title,
        position,
        data: {
          title,
          content,
          transitions,
          extractVariableName: listen.capture_slot,
          captureSlot: listen.capture_slot,
          listenNext: next || undefined,
        },
      });
    } else if (listen && "next" in listen) {
      const next = listen.next ?? "";
      const tid = `trans-${nodeId}-next`;
      transitions.push({ id: tid, label: "Next", targetNodeId: next || null });
      if (next) {
        edges.push({
          id: `edge-${nodeId}-${next}`,
          source: nodeId,
          target: next,
          sourceHandle: tid,
        });
      }
      nodes.push({
        id: nodeId,
        type: NodeType.Conversation,
        label: title,
        position,
        data: {
          title,
          content,
          transitions,
          listenNext: next || undefined,
        },
      });
    } else {
      nodes.push({
        id: nodeId,
        type: nodeType,
        label: title,
        position,
        data: {
          title,
          content,
          transitions: [],
          endingMessage: content,
          isEnd: true,
          toolName: p.tool?.name,
        },
      });
    }
  });

  if (payload.start) {
    edges.push({
      id: `edge-start-${payload.start}`,
      source: START_NODE_ID,
      target: payload.start,
    });
  }

  const preservedNodeTitles = existingMetadata?.nodeTitles || {};

  return {
    nodes,
    edges,
    intents: payload.intents ?? {},
    metadata: {
      ...existingMetadata,
      name: existingMetadata?.name || "Conversation Flow",
      description: existingMetadata?.description || "Loaded from template",
      createdAt: existingMetadata?.createdAt || new Date().toISOString(),
      nodeTitles:
        Object.keys(preservedNodeTitles).length > 0
          ? preservedNodeTitles
          : undefined,
    },
  };
}
