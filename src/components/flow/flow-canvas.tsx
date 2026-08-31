"use client";

import { type FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import { useFlowStore } from "@/store/flow.store";
import { type FlowNode as FlowNodeType, NodeType } from "@/types/flow.types";

import { CustomEdge } from "./flow-edge";
import {
  StartNode,
  ConversationNode,
  FunctionNode,
  EndingNode,
  LogicSplitNode,
  ScriptNode,
  CallTransferNode,
  ExtractVariableNode,
} from "./flow-nodes";

const nodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.Conversation]: ConversationNode,
  [NodeType.Function]: FunctionNode,
  [NodeType.CallTransfer]: CallTransferNode,
  [NodeType.PressDigit]: ConversationNode,
  [NodeType.LogicSplit]: LogicSplitNode,
  [NodeType.AgentTransfer]: ConversationNode,
  [NodeType.SMS]: ConversationNode,
  [NodeType.ExtractVariable]: ExtractVariableNode,
  [NodeType.MCP]: ConversationNode,
  [NodeType.Ending]: EndingNode,
  [NodeType.Script]: ScriptNode,
};

const edgeTypes = {
  default: CustomEdge,
};

/** Calls fitView when flow nodes/edges change so the graph fills the canvas (relative to nodes). */
const FlowFitView: FC = memo(function FlowFitView() {
  const { fitView } = useReactFlow();
  const flow = useFlowStore((s) => s.flow);
  useEffect(() => {
    // Double rAF so fitView runs after React Flow has rendered the new nodes
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fitView({
          padding: 0.2,
          duration: 300,
          maxZoom: 0.9,
          minZoom: 0.15,
        });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [flow.nodes.length, flow.edges.length, fitView]);
  return null;
});

export const FlowCanvas: FC = memo(() => {
  const {
    flow,
    selectNode,
    addEdge: addEdgeToStore,
    updateTransition,
    updateNode,
    deleteNode,
    deleteEdge,
  } = useFlowStore();

  // Derive nodes and edges from store so UI always reflects store (transitions, edges, etc.)
  const nodes: Node[] = useMemo(
    () =>
      flow.nodes.map((node) => ({
        id: node.id,
        data: node.data,
        position: node.position,
        type: node.type,
      })),
    [flow.nodes],
  );

  const edges: Edge[] = useMemo(
    () =>
      flow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
        sourceHandle: edge.sourceHandle ?? undefined,
        targetHandle: edge.targetHandle ?? undefined,
      })),
    [flow.edges],
  );

  // Apply node changes to the store so config panel and canvas stay in sync
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          updateNode(change.id, {
            position: change.position,
          } as Partial<FlowNodeType>);
        }
        if (change.type === "remove") {
          deleteNode(change.id);
        }
      });
    },
    [updateNode, deleteNode],
  );

  // Apply edge changes to the store (e.g. edge removed on canvas)
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "remove" && change.id) {
          deleteEdge(change.id);
        }
      });
    },
    [deleteEdge],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.sourceHandle ?? "default"}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        animated: true,
      };

      addEdgeToStore({
        id: newEdge.id,
        source: newEdge.source,
        target: newEdge.target,
        label: connection.sourceHandle ?? "",
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      });

      if (connection.sourceHandle) {
        updateTransition(connection.source, connection.sourceHandle, {
          targetNodeId: connection.target,
        });
      }
    },
    [addEdgeToStore, updateTransition],
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleCopy = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventSelect = (e: Event) => e.preventDefault();
    el.addEventListener("selectstart", preventSelect);
    return () => el.removeEventListener("selectstart", preventSelect);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-card select-none"
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onCopy={handleCopy}
      onCut={handleCopy}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        minZoom={0.1}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
        className="select-none"
      >
        <FlowFitView />
        <Background color="var(--color-border)" gap={16} size={1} />
        <Controls className="bg-card border border-border rounded-lg shadow-md" />
      </ReactFlow>
    </div>
  );
});

FlowCanvas.displayName = "FlowCanvas";
