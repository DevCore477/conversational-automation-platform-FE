"use client";

import { type FC, memo, useMemo } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useFlowStore } from "@/store/flow.store";
import { NodeType } from "@/types/flow.types";

import { BasicFields } from "./basic-fields";
import { CallTransferConfig } from "./call-transfer-config";
import { CaptureSlotField } from "./capture-slot-field";
import { FunctionToolConfig } from "./function-tool-config";
import { TransitionsSection } from "./transitions-section";

interface NodeConfigPanelProps {
  selectedNodeId: string | null;
}

const EmptyState: FC = () => (
  <div className="flex items-center justify-center h-full w-full bg-card">
    <p className="text-muted-foreground text-center px-4">
      Select a node to configure its properties
    </p>
  </div>
);

export const NodeConfigPanel: FC<NodeConfigPanelProps> = memo(
  ({ selectedNodeId }) => {
    const flow = useFlowStore((s) => s.flow);

    const selectedNode = useMemo(
      () =>
        selectedNodeId
          ? flow.nodes.find((n) => n.id === selectedNodeId) ?? null
          : null,
      [flow.nodes, selectedNodeId],
    );

    const isFirstConversationNode = useMemo(() => {
      if (!selectedNode) return false;
      const startNode = flow.nodes.find((n) => n.type === NodeType.Start);
      const firstAfterStart =
        flow.edges.find((e) => e.source === startNode?.id)?.target ?? null;
      return firstAfterStart !== null && selectedNode.id === firstAfterStart;
    }, [flow.nodes, flow.edges, selectedNode]);

    if (!selectedNode) return <EmptyState />;

    const { type } = selectedNode;
    const isStart = type === NodeType.Start;
    const isEnding = type === NodeType.Ending;
    const isFunction = type === NodeType.Function;
    const isCallTransfer = type === NodeType.CallTransfer;

    console.log("Tyoee", selectedNode, type);

    const showContentFields = !isStart && !isEnding && !isFunction && !isCallTransfer;
    const showStartSpeaker = !isStart && !isEnding && isFirstConversationNode;
    const showTransitions = !isStart && !isEnding;
    const showCaptureSlot = type === NodeType.Conversation;


    return (
      <ScrollArea className="h-full w-full bg-card border-l border-border">
        {/* Keying by node id forces local edit/draft state to reset when the user
            switches between nodes — avoids leaking in-progress edits across nodes. */}
        <div key={selectedNode.id} className="p-4 space-y-6">
          <p className="text-xs text-muted-foreground">{selectedNode.label}</p>

          <BasicFields
            node={selectedNode}
            showTitle={!isStart}
            showContent={showContentFields}
            showContentType={showContentFields}
            showStartSpeaker={showStartSpeaker}
          />

          {isFunction && <FunctionToolConfig node={selectedNode} />}

          {isCallTransfer && <CallTransferConfig node={selectedNode} />}

          {showTransitions && <TransitionsSection node={selectedNode} />}

          {showCaptureSlot && <CaptureSlotField node={selectedNode} />}
        </div>
      </ScrollArea>
    );
  },
);

NodeConfigPanel.displayName = "NodeConfigPanel";
