import { create } from "zustand";

import { toDisplayName } from "@/common/utils/string.utils";
import { toBackendPayload } from "@/lib/flow-backend";
import {
  type FlowData,
  type FlowNode,
  type FlowEdge,
  NodeType,
  type NodeTransition,
  type BackendFlowPayload,
  type BackendIntents,
} from "@/types/flow.types";

interface FlowStore {
  flow: FlowData;
  selectedNodeId: string | null;

  // Initialize flow
  initializeFlow: (flowData?: FlowData) => void;

  // Node operations
  addNode: (node: FlowNode) => void;
  updateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;

  // Edge operations
  addEdge: (edge: FlowEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<FlowEdge>) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection
  selectNode: (nodeId: string | null) => void;

  // Transitions
  addTransition: (nodeId: string, transition: NodeTransition) => void;
  updateTransition: (
    nodeId: string,
    transitionId: string,
    updates: Partial<NodeTransition>,
  ) => void;
  deleteTransition: (nodeId: string, transitionId: string) => void;

  // Flow metadata
  setFlowMetadata: (metadata: FlowData["metadata"]) => void;

  /** Set intents for backend payload (intent id → { rules: string[] }) */
  setFlowIntents: (intents: BackendIntents) => void;

  // Export/Import
  getFlowData: () => FlowData;
  setFlowData: (data: FlowData) => void;

  /** Payload in the format the backend expects (start, nodes, intents) */
  getBackendPayload: () => BackendFlowPayload;
}

const createInitialFlow = (): FlowData => ({
  nodes: [
    {
      id: "start-1",
      type: NodeType.Start,
      label: "Start",
      position: { x: 250, y: 0 },
      data: {
        title: "Start",
        transitions: [],
      },
    },
    {
      id: "welcome-1",
      type: NodeType.Conversation,
      label: "Welcome",
      position: { x: 250, y: 150 },
      data: {
        title: "Welcome to Support",
        content: "Hello! How can we assist you today?",
        transitions: [
          {
            id: "trans-1",
            label: "Continue",
            targetNodeId: "end-1",
            condition: undefined,
          },
        ],
      },
    },
    {
      id: "end-1",
      type: NodeType.Ending,
      label: "End Call",
      position: { x: 350, y: 350 },
      data: {
        title: "End",
        transitions: [],
      },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "start-1",
      target: "welcome-1",
      label: "Start",
    },
    {
      id: "edge-2",
      source: "welcome-1",
      target: "end-1",
      label: "Continue",
      // Bind to the specific transition handle so the edge originates
      // from the correct visual transition on the node
      sourceHandle: "trans-1",
    },
  ],
  metadata: {
    name: "Sample Flow",
    description: "Initial sample flow",
    createdAt: new Date().toISOString(),
  },
});

export const useFlowStore = create<FlowStore>((set, get) => ({
  flow: createInitialFlow(),
  selectedNodeId: null,

  initializeFlow: (flowData) => {
    const flow = flowData || createInitialFlow();

    // Restore node titles from metadata if available
    if (flow.metadata?.nodeTitles) {
      flow.nodes = flow.nodes.map((node) => {
        const savedTitle = flow.metadata?.nodeTitles?.[node.id];
        if (savedTitle) {
          return {
            ...node,
            label: savedTitle,
            data: {
              ...node.data,
              title: savedTitle,
            },
          };
        }
        return node;
      });
    }

    set({ flow });
  },

  addNode: (node) => {
    set((state) => ({
      flow: {
        ...state.flow,
        nodes: [...state.flow.nodes, node],
      },
    }));
  },

  updateNode: (nodeId, updates) => {
    set((state) => {
      const updatedNodes = state.flow.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node,
      );

      // Update node titles in metadata when title changes
      const updatedNode = updatedNodes.find((n) => n.id === nodeId);
      const nodeTitles = { ...(state.flow.metadata?.nodeTitles || {}) };

      if (updatedNode && updatedNode.data.title) {
        // Only store if it's different from auto-generated title
        const autoTitle = toDisplayName(nodeId);
        if (updatedNode.data.title !== autoTitle) {
          nodeTitles[nodeId] = updatedNode.data.title;
        } else {
          delete nodeTitles[nodeId];
        }
      }

      return {
        flow: {
          ...state.flow,
          nodes: updatedNodes,
          metadata: {
            ...state.flow.metadata,
            nodeTitles:
              Object.keys(nodeTitles).length > 0 ? nodeTitles : undefined,
          },
        },
      };
    });
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      flow: {
        ...state.flow,
        nodes: state.flow.nodes.filter((node) => node.id !== nodeId),
        edges: state.flow.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      },
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  duplicateNode: (nodeId) => {
    const state = get();
    const nodeToClone = state.flow.nodes.find((n) => n.id === nodeId);
    if (!nodeToClone) {
      return;
    }

    const newNode: FlowNode = {
      ...nodeToClone,
      id: `${nodeToClone.id}-copy-${Date.now()}`,
      position: {
        x: nodeToClone.position.x + 50,
        y: nodeToClone.position.y + 50,
      },
      data: {
        ...nodeToClone.data,
        transitions: nodeToClone.data.transitions.map((t) => ({
          ...t,
          id: `${t.id}-${Date.now()}`,
        })),
      },
    };

    set((state) => ({
      flow: {
        ...state.flow,
        nodes: [...state.flow.nodes, newNode],
      },
    }));
  },

  addEdge: (edge) => {
    set((state) => ({
      flow: {
        ...state.flow,
        edges: [...state.flow.edges, edge],
      },
    }));
  },

  updateEdge: (edgeId, updates) => {
    set((state) => ({
      flow: {
        ...state.flow,
        edges: state.flow.edges.map((edge) =>
          edge.id === edgeId ? { ...edge, ...updates } : edge,
        ),
      },
    }));
  },

  deleteEdge: (edgeId) => {
    const state = get();
    const edgeToDelete = state.flow.edges.find((edge) => edge.id === edgeId);

    set((current) => ({
      flow: {
        ...current.flow,
        edges: current.flow.edges.filter((edge) => edge.id !== edgeId),
        // Also clear the matching transition's targetNodeId so the
        // checkmark icon on the source node is updated when the edge is removed.
        nodes:
          edgeToDelete && edgeToDelete.sourceHandle
            ? current.flow.nodes.map((node) =>
                node.id === edgeToDelete.source
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        transitions: (node.data.transitions || []).map((t) =>
                          t.id === edgeToDelete.sourceHandle
                            ? { ...t, targetNodeId: null }
                            : t,
                        ),
                      },
                    }
                  : node,
              )
            : current.flow.nodes,
      },
    }));
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  addTransition: (nodeId, transition) => {
    set((state) => ({
      flow: {
        ...state.flow,
        nodes: state.flow.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  transitions: [...(node.data.transitions || []), transition],
                },
              }
            : node,
        ),
      },
    }));
  },

  updateTransition: (nodeId, transitionId, updates) => {
    set((state) => ({
      flow: {
        ...state.flow,
        nodes: state.flow.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  transitions: (node.data.transitions || []).map((t) =>
                    t.id === transitionId ? { ...t, ...updates } : t,
                  ),
                },
              }
            : node,
        ),
      },
    }));
  },

  deleteTransition: (nodeId, transitionId) => {
    set((state) => ({
      flow: {
        ...state.flow,
        nodes: state.flow.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  transitions: (node.data.transitions || []).filter(
                    (t) => t.id !== transitionId,
                  ),
                },
              }
            : node,
        ),
      },
    }));
  },

  setFlowMetadata: (metadata) => {
    set((state) => ({
      flow: {
        ...state.flow,
        metadata,
      },
    }));
  },

  setFlowIntents: (intents) => {
    set((state) => ({
      flow: {
        ...state.flow,
        intents,
      },
    }));
  },

  getFlowData: () => get().flow,

  setFlowData: (data) => {
    set({ flow: data });
  },

  getBackendPayload: () => toBackendPayload(get().flow),
}));
