"use client";

import {
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
  FileText,
  type LucideIcon,
} from "lucide-react";
import { type FC, memo } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFlowStore } from "@/store/flow.store";
import { NodeType, NODE_TYPE_LABELS, type FlowNode } from "@/types/flow.types";

const NODE_TYPE_ICONS: Record<NodeType, LucideIcon> = {
  [NodeType.Start]: MessageCircle,
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

const getNodeIcon = (type: NodeType): LucideIcon =>
  NODE_TYPE_ICONS[type] ?? MessageCircle;

type NodePaletteProps = object;

export const NodePalette: FC<NodePaletteProps> = memo(() => {
  const { addNode } = useFlowStore();

  const nodeTypes: NodeType[] = [
    NodeType.Conversation,
    NodeType.Script,
    NodeType.Function,
    NodeType.CallTransfer,
    NodeType.ExtractVariable,
    NodeType.Ending,
  ];

  const allowedTypes = [
    NodeType.Conversation,
    NodeType.ExtractVariable,
    NodeType.Function,
    NodeType.CallTransfer,
    NodeType.Ending,
  ];

  const handleAddNode = (type: NodeType) => {
    if (!allowedTypes.includes(type)) {
      return;
    } // block others

    const newId = `${type}-${Date.now()}`;
    const xOffset = Math.random() * 200 - 100;
    const yOffset = Math.random() * 200 - 100;

    const getDefaultContent = (nodeType: NodeType): string => {
      switch (nodeType) {
        case NodeType.Conversation:
          return "Enter conversation prompt here";
        default:
          return `Configure ${NODE_TYPE_LABELS[nodeType]}`;
      }
    };

    const newNode: FlowNode = {
      id: newId,
      type,
      label: NODE_TYPE_LABELS[type],
      position: { x: 300 + xOffset, y: 200 + yOffset },
      data: {
        title: NODE_TYPE_LABELS[type],
        content: getDefaultContent(type),
        transitions:
          type === NodeType.Ending
            ? []
            : [
                {
                  id: `trans-${Date.now()}`,
                  label: "Next",
                  targetNodeId: null,
                },
              ],
        ...(type === NodeType.CallTransfer
          ? {
              transferType: "phone",
              transferDestination: undefined,
              transferOption: "cold_transfer",
              warmTransfer: false,
              transferNotes: undefined,
            }
          : {}),
      },
    };

    addNode(newNode);
  };

  return (
    <ScrollArea className="h-full w-full bg-card border-r border-border">
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground mb-3 sticky top-0 bg-card py-1">
          Click to add nodes
        </p>

        {nodeTypes.map((type) => {
          const Icon = getNodeIcon(type);
          const isEnabled = allowedTypes.includes(type);

          return (
            <div key={type} className="relative group">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-left font-normal h-auto py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => isEnabled && handleAddNode(type)}
                disabled={!isEnabled}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium">
                    {NODE_TYPE_LABELS[type]}
                  </span>
                </div>
              </Button>

              {!isEnabled && (
                <div
                  className="
        pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
      "
                >
                  <span
                    className="
          px-2 py-0.5 text-[10px] rounded-full
          bg-muted text-muted-foreground
          border border-border
        "
                  >
                    Coming soon
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
});

NodePalette.displayName = "NodePalette";
