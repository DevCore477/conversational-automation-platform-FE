"use client";

import {
  X,
  Copy,
  MessageCircle,
  Settings,
  Phone,
  Key,
  GitBranch,
  User,
  MessageSquare,
  Package,
  Plug,
  Flag,
  Play,
  type LucideIcon,
  Hash,
  Trash2,
  FileText,
  Sparkles,
} from "lucide-react";
import { type FC, memo, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFlowStore } from "@/store/flow.store";
import {
  type FlowNode as FlowNodeType,
  NodeType,
  type ContentType,
} from "@/types/flow.types";

interface CustomNodeProps extends NodeProps {
  data: FlowNodeType["data"] & { label?: string };
}

const getNodeIcon = (type: NodeType): LucideIcon => {
  const icons: Record<NodeType, LucideIcon> = {
    [NodeType.Start]: Play,
    [NodeType.Conversation]: MessageCircle,
    [NodeType.Function]: Settings,
    [NodeType.CallTransfer]: Phone,
    [NodeType.PressDigit]: Key,
    [NodeType.LogicSplit]: GitBranch,
    [NodeType.AgentTransfer]: User,
    [NodeType.SMS]: MessageSquare,
    [NodeType.ExtractVariable]: Package,
    [NodeType.MCP]: Plug,
    [NodeType.Ending]: Flag,
    [NodeType.Script]: FileText,
  };
  return icons[type] || MessageCircle;
};

const getNodeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    [NodeType.Start]: "bg-sidebar-accent text-white",
    [NodeType.Conversation]: "bg-blue-500/10 border-blue-500/30",
    [NodeType.Function]: "bg-purple-500/10 border-purple-500/30",
    [NodeType.CallTransfer]: "bg-orange-500/10 border-orange-500/30",
    [NodeType.PressDigit]: "bg-green-500/10 border-green-500/30",
    [NodeType.LogicSplit]: "bg-yellow-500/10 border-yellow-500/30",
    [NodeType.AgentTransfer]: "bg-pink-500/10 border-pink-500/30",
    [NodeType.SMS]: "bg-cyan-500/10 border-cyan-500/30",
    [NodeType.ExtractVariable]: "bg-indigo-500/10 border-indigo-500/30",
    [NodeType.MCP]: "bg-red-500/10 border-red-500/30",
    [NodeType.Ending]: "bg-gray-500/10 border-gray-500/30",
    [NodeType.Script]: "bg-emerald-500/10 border-emerald-500/30",
  };
  return colors[type] || "bg-gray-500/10 border-gray-500/30";
};

// Reusable Delete Confirmation Button
interface DeleteNodeButtonProps {
  nodeId: string;
  nodeTitle?: string;
}

const DeleteNodeButton: FC<DeleteNodeButtonProps> = memo(
  ({ nodeId, nodeTitle }) => {
    const { deleteNode } = useFlowStore();
    const [open, setOpen] = useState(false);

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Node</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                &quot;{nodeTitle || "this node"}&quot;
              </span>
              ? This action cannot be undone. All connections to and from this
              node will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(nodeId);
                setOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);
DeleteNodeButton.displayName = "DeleteNodeButton";

export const StartNode: FC<CustomNodeProps> = memo(({ id, selected }) => {
  const { selectNode } = useFlowStore();
  const Icon = getNodeIcon(NodeType.Start);

  return (
    <div
      className={`min-w-[140px] rounded-full border-2 px-4 py-2 flex items-center justify-center gap-2 cursor-pointer transition-all select-none ${getNodeColor(
        NodeType.Start,
      )} ${selected ? "ring-2 ring-primary" : ""}`}
      onClick={() => selectNode(id)}
    >
      <Icon className="h-4 w-4" />
      <span className="font-semibold text-sm">Start</span>
      {/* Single output handle to connect to the first node */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary"
      />
    </div>
  );
});
StartNode.displayName = "StartNode";

export const ConversationNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode, updateNode, flow } = useFlowStore();
    const [showTabs, setShowTabs] = useState(false);
    const contentType: ContentType = data.contentType || "prompt";
    const startSpeaker: "agent" | "user" = data.startSpeaker || "agent";
    const interruptionSensitivity = data.interruptionSensitivity ?? 0;

    // Get edge color for a transition
    const getEdgeColorForTransition = (transitionId: string): string | null => {
      if (typeof window === "undefined" || !(window as any).edgeColors) {
        return null;
      }
      // Find edge that uses this transition as sourceHandle
      const edge = flow.edges.find((e) => e.sourceHandle === transitionId);
      if (edge && (window as any).edgeColors.has(edge.id)) {
        return (window as any).edgeColors.get(edge.id);
      }
      return null;
    };

    const handleContentTypeChange = (value: string) => {
      updateNode(id, {
        data: {
          ...data,
          contentType: value as ContentType,
        },
      });
    };

    const handleTitleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowTabs(!showTabs);
    };

    return (
      <div
        className={`min-w-[280px] max-w-[350px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.Conversation,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Clickable Title Area */}
            <button
              type="button"
              className="flex items-center gap-2 mb-2 hover:bg-muted/50 rounded px-1 -ml-1 transition-colors w-full text-left"
              onClick={handleTitleClick}
            >
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Conversation"}
              </h3>
            </button>

            {/* Content Type Tabs - shown when title is clicked */}
            {showTabs && (
              <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                <Tabs
                  value={contentType}
                  onValueChange={handleContentTypeChange}
                >
                  <TabsList className="h-7 w-full">
                    <TabsTrigger value="prompt" className="text-xs h-6 px-3">
                      Prompt
                    </TabsTrigger>
                    <TabsTrigger value="static" className="text-xs h-6 px-3">
                      Static
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Node Indicators (Always visible) */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* Content Type Badge */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  contentType === "prompt"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {contentType === "prompt" ? "AI" : "Static"}
              </span>

              {/* Start Speaker Badge */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  startSpeaker === "agent"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}
              >
                {startSpeaker === "agent" ? "Agent First" : "User First"}
              </span>

              {/* Interruption Sensitivity Badge */}
              {interruptionSensitivity > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    interruptionSensitivity >= 75
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : interruptionSensitivity >= 50
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                  }`}
                >
                  Interrupt: {interruptionSensitivity}%
                </span>
              )}
            </div>

            {/* Content Preview with type indicator */}
            <div className="bg-muted/30 rounded-md p-2">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {data.content ||
                  (contentType === "prompt"
                    ? "No prompt defined"
                    : "No static content defined")}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton
              nodeId={id}
              nodeTitle={data.title || "Conversation"}
            />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Transition Output Handles */}
        <div className="mt-3 space-y-2 relative">
          {(data.transitions || []).map((transition) => (
            <div
              key={transition.id}
              className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors relative"
            >
              <Handle
                type="source"
                position={Position.Right}
                id={transition.id}
                className="w-3 h-3 bg-primary"
                style={{
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Transition Type Indicator */}
              {transition.transitionType === "condition" && (
                <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
              )}
              {transition.transitionType === "prompt" && (
                <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              )}
              <span className="truncate font-medium flex-1">
                {transition.label}
              </span>
              {transition.targetNodeId &&
                (() => {
                  const edgeColor = getEdgeColorForTransition(transition.id);
                  return (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: edgeColor || "#22c55e",
                      }}
                      title="Connected"
                    />
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
ConversationNode.displayName = "ConversationNode";

export const FunctionNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode, flow } = useFlowStore();
    const Icon = getNodeIcon(NodeType.Function);
    const toolName = data.toolName as string | undefined;
    const toolDescription = data.toolDescription as string | undefined;
    const executorKey = data.executorKey as string | undefined;
    const toolParams = data.toolParameters as
      | { type: string; properties: Record<string, any>; required?: string[] }
      | undefined;
    const toolReturns = data.toolReturns as
      | { properties?: Record<string, unknown>; description?: string }
      | undefined;
    const paramCount = toolParams?.properties ? Object.keys(toolParams.properties).length : 0;
    const returnCount = toolReturns?.properties
      ? Object.keys(toolReturns.properties).length
      : 0;

    const getEdgeColorForTransition = (transitionId: string): string | null => {
      if (typeof window === "undefined" || !(window as any).edgeColors) {
        return null;
      }
      const edge = flow.edges.find((e) => e.sourceHandle === transitionId);
      if (edge && (window as any).edgeColors.has(edge.id)) {
        return (window as any).edgeColors.get(edge.id);
      }
      return null;
    };

    return (
      <div
        className={`min-w-[280px] max-w-[350px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.Function,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Function"}
              </h3>
            </div>

            {/* Function Details */}
            <div className="bg-muted/30 rounded-md p-2 space-y-1 mb-2">
              {toolName ? (
                <>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      Tool:
                    </span>
                    <code className="text-xs font-mono text-purple-600 line-clamp-1">
                      {toolName}
                    </code>
                  </div>
                  {toolDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {toolDescription}
                    </p>
                  )}
                  {executorKey && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Executor: {executorKey}
                    </p>
                  )}
                  {paramCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Args: {paramCount} param{paramCount !== 1 ? "s" : ""}
                    </p>
                  )}
                  {returnCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Outputs: {returnCount} field{returnCount !== 1 ? "s" : ""} for downstream prompts
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No function configured. Click to configure.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton
              nodeId={id}
              nodeTitle={data.title || "Function"}
            />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Transition Output Handles */}
        {(data.transitions || []).length > 0 && (
          <div className="mt-3 space-y-1 relative">
            {(data.transitions || []).map((transition) => (
              <div
                key={transition.id}
                className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors"
              >
                <Handle
                  type="source"
                  position={Position.Right}
                  id={transition.id}
                  className="w-3 h-3 bg-primary"
                  style={{
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                {transition.transitionType === "condition" && (
                  <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
                )}
                {transition.transitionType === "prompt" && (
                  <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
                )}
                <span className="truncate font-medium flex-1 min-w-0">
                  {transition.label}
                </span>
                {transition.targetNodeId &&
                  (() => {
                    const edgeColor = getEdgeColorForTransition(transition.id);
                    return (
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: edgeColor || "#22c55e",
                        }}
                        title="Connected"
                      />
                    );
                  })()}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
FunctionNode.displayName = "FunctionNode";

export const CallTransferNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode, flow } = useFlowStore();
    const Icon = getNodeIcon(NodeType.CallTransfer);
    const transferDestination = (data.transferDestination as string) || (data.transferNumber as string) || "";
    const warmTransfer = data.warmTransfer as boolean | undefined;

    // Get edge color for a transition
    const getEdgeColorForTransition = (transitionId: string): string | null => {
      if (typeof window === "undefined" || !(window as any).edgeColors) {
        return null;
      }
      const edge = flow.edges.find((e) => e.sourceHandle === transitionId);
      if (edge && (window as any).edgeColors.has(edge.id)) {
        return (window as any).edgeColors.get(edge.id);
      }
      return null;
    };

    return (
      <div
        className={`min-w-[280px] max-w-[350px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.CallTransfer,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Call Transfer"}
              </h3>
            </div>

            {/* Transfer Details */}
            <div className="bg-muted/30 rounded-md p-2 space-y-1">
              {transferDestination ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        Transfer to:
                      </span>
                      <code className="text-xs font-mono text-orange-600">
                        {transferDestination}
                      </code>
                    </div>
                  {warmTransfer && (
                    <span className="text-xs text-muted-foreground bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">
                      Warm Transfer
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No transfer destination set. Click to configure.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton
              nodeId={id}
              nodeTitle={data.title || "Call Transfer"}
            />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Transition Output Handles */}
        <div className="mt-3 space-y-2 relative">
          {(data.transitions || []).map((transition) => (
            <div
              key={transition.id}
              className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors relative"
            >
              <Handle
                type="source"
                position={Position.Right}
                id={transition.id}
                className="w-3 h-3 bg-primary"
                style={{
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Transition Type Indicator */}
              {transition.transitionType === "condition" && (
                <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
              )}
              {transition.transitionType === "prompt" && (
                <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              )}
              <span className="truncate font-medium flex-1">
                {transition.label}
              </span>
              {transition.targetNodeId &&
                (() => {
                  const edgeColor = getEdgeColorForTransition(transition.id);
                  return (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: edgeColor || "#22c55e",
                      }}
                      title="Connected"
                    />
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
CallTransferNode.displayName = "CallTransferNode";

export const ExtractVariableNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode, flow } = useFlowStore();
    const Icon = getNodeIcon(NodeType.ExtractVariable);
    const variableName = data.extractVariableName as string | undefined;
    const extractFormat = data.extractFormat as string | undefined;

    // Get edge color for a transition
    const getEdgeColorForTransition = (transitionId: string): string | null => {
      if (typeof window === "undefined" || !(window as any).edgeColors) {
        return null;
      }
      const edge = flow.edges.find((e) => e.sourceHandle === transitionId);
      if (edge && (window as any).edgeColors.has(edge.id)) {
        return (window as any).edgeColors.get(edge.id);
      }
      return null;
    };

    return (
      <div
        className={`min-w-[280px] max-w-[350px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.ExtractVariable,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Extract Variable"}
              </h3>
            </div>

            {/* Extraction Details */}
            <div className="bg-muted/30 rounded-md p-2 space-y-1">
              {variableName ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      Variable:
                    </span>
                    <code className="text-xs font-mono text-indigo-600">{`{{${variableName}}}`}</code>
                  </div>
                  {extractFormat && extractFormat !== "text" && (
                    <span className="text-xs text-muted-foreground bg-indigo-100 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">
                      Format: {extractFormat}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No variable configured. Click to configure.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton
              nodeId={id}
              nodeTitle={data.title || "Extract Variable"}
            />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Transition Output Handles */}
        <div className="mt-3 space-y-2 relative">
          {(data.transitions || []).map((transition) => (
            <div
              key={transition.id}
              className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors relative"
            >
              <Handle
                type="source"
                position={Position.Right}
                id={transition.id}
                className="w-3 h-3 bg-primary"
                style={{
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Transition Type Indicator */}
              {transition.transitionType === "condition" && (
                <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
              )}
              {transition.transitionType === "prompt" && (
                <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              )}
              <span className="truncate font-medium flex-1">
                {transition.label}
              </span>
              {transition.targetNodeId &&
                (() => {
                  const edgeColor = getEdgeColorForTransition(transition.id);
                  return (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: edgeColor || "#22c55e",
                      }}
                      title="Connected"
                    />
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
ExtractVariableNode.displayName = "ExtractVariableNode";

export const EndingNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode } = useFlowStore();
    const Icon = getNodeIcon(NodeType.Ending);
    const endingMessage = data.endingMessage as string | undefined;
    const disposition = data.disposition as string | undefined;

    return (
      <div
        className={`min-w-[220px] max-w-[350px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.Ending,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5" />
              <h3 className="font-semibold text-sm">{data.title || "End"}</h3>
            </div>

            {/* Ending Details */}
            {(endingMessage || disposition) && (
              <div className="bg-muted/30 rounded-md p-2 space-y-1">
                {endingMessage && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {endingMessage}
                  </p>
                )}
                {disposition && disposition !== "completed" && (
                  <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {disposition}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton nodeId={id} nodeTitle={data.title || "End"} />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />
      </div>
    );
  },
);
EndingNode.displayName = "EndingNode";

export const LogicSplitNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode, updateNode, flow } = useFlowStore();
    const [showTabs, setShowTabs] = useState(false);
    const contentType: ContentType = data.contentType || "static";

    // Get edge color for a transition
    const getEdgeColorForTransition = (transitionId: string): string | null => {
      if (typeof window === "undefined" || !(window as any).edgeColors) {
        return null;
      }
      const edge = flow.edges.find((e) => e.sourceHandle === transitionId);
      if (edge && (window as any).edgeColors.has(edge.id)) {
        return (window as any).edgeColors.get(edge.id);
      }
      return null;
    };

    const handleContentTypeChange = (value: string) => {
      updateNode(id, {
        data: {
          ...data,
          contentType: value as ContentType,
        },
      });
    };

    const handleTitleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowTabs(!showTabs);
    };

    return (
      <div
        className={`min-w-[280px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.LogicSplit,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Clickable Title Area */}
            <button
              type="button"
              className="flex items-center gap-2 mb-2 hover:bg-muted/50 rounded px-1 -ml-1 transition-colors w-full text-left"
              onClick={handleTitleClick}
            >
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Logic Split"}
              </h3>
            </button>

            {/* Content Type Tabs - shown when title is clicked */}
            {showTabs && (
              <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                <Tabs
                  value={contentType}
                  onValueChange={handleContentTypeChange}
                >
                  <TabsList className="h-7 w-full">
                    <TabsTrigger value="prompt" className="text-xs h-6 px-3">
                      Prompt
                    </TabsTrigger>
                    <TabsTrigger value="static" className="text-xs h-6 px-3">
                      Static Sentence
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Content Preview with type indicator */}
            <div className="bg-muted/30 rounded-md p-2">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {data.content ||
                  (contentType === "prompt"
                    ? "No prompt defined"
                    : "Define conditional paths")}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton
              nodeId={id}
              nodeTitle={data.title || "Logic Split"}
            />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Conditional Output Handles */}
        <div className="mt-3 space-y-2 relative">
          {(data.transitions || []).map((transition) => (
            <div
              key={transition.id}
              className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors relative"
            >
              <Handle
                type="source"
                position={Position.Right}
                id={transition.id}
                className="w-3 h-3 bg-primary"
                style={{
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Transition Type Indicator */}
              {transition.transitionType === "condition" && (
                <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
              )}
              {transition.transitionType === "prompt" && (
                <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              )}
              <span className="truncate font-medium flex-1">
                {transition.label}
              </span>
              {transition.condition && (
                <span className="text-xs font-mono text-muted-foreground ml-auto">
                  {transition.condition}
                </span>
              )}
              {transition.targetNodeId &&
                (() => {
                  const edgeColor = getEdgeColorForTransition(transition.id);
                  return (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: edgeColor || "#22c55e",
                      }}
                      title="Connected"
                    />
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
LogicSplitNode.displayName = "LogicSplitNode";

export const ScriptNode: FC<CustomNodeProps> = memo(
  ({ data, id, selected }) => {
    const { duplicateNode, selectNode } = useFlowStore();
    const Icon = getNodeIcon(NodeType.Script);

    // Get selected script info from data
    const selectedScriptId = data.scriptId as string | undefined;
    const selectedScriptName = data.scriptName as string | undefined;

    return (
      <div
        className={`min-w-[280px] rounded-lg border-2 p-4 bg-card cursor-pointer transition-all select-none ${getNodeColor(
          NodeType.Script,
        )} ${selected ? "ring-2 ring-primary" : ""}`}
        onClick={() => selectNode(id)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-sm line-clamp-1">
                {data.title || "Script"}
              </h3>
            </div>

            {/* Selected Script Display */}
            <div className="bg-muted/30 rounded-md p-2">
              {selectedScriptId ? (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-foreground">
                    {selectedScriptName || "Selected Script"}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No script selected. Click to configure.
                </p>
              )}
            </div>

            {/* Description if available */}
            {data.content && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {data.content}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <DeleteNodeButton nodeId={id} nodeTitle={data.title || "Script"} />
          </div>
        </div>

        {/* Input Handle - positioned at top-left */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
          style={{ left: "20px" }}
        />

        {/* Transition Output Handles */}
        <div className="mt-3 space-y-2 relative">
          {(data.transitions || []).map((transition) => (
            <div
              key={transition.id}
              className="text-xs bg-muted/50 hover:bg-muted rounded px-2 py-1 flex items-center gap-2 transition-colors relative"
            >
              <Handle
                type="source"
                position={Position.Right}
                id={transition.id}
                className="w-3 h-3 bg-primary"
                style={{
                  right: "-8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              {/* Transition Type Indicator */}
              {transition.transitionType === "condition" && (
                <GitBranch className="h-3 w-3 text-amber-500 shrink-0" />
              )}
              {transition.transitionType === "prompt" && (
                <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              )}
              <span className="truncate font-medium flex-1">
                {transition.label}
              </span>
              {transition.targetNodeId &&
                (() => {
                  const edgeColor = (window as any).edgeColors.get(
                    transition.id,
                  );
                  return (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: edgeColor ?? "#22c55e",
                      }}
                      title="Connected"
                    />
                  );
                })()}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
ScriptNode.displayName = "ScriptNode";
