"use client";

import { type FC, memo, useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFlowStore } from "@/store/flow.store";
import type { ContentType, FlowNode } from "@/types/flow.types";

interface BasicFieldsProps {
  node: FlowNode;
  showTitle: boolean;
  showContent: boolean;
  showContentType: boolean;
  showStartSpeaker: boolean;
}

export const BasicFields: FC<BasicFieldsProps> = memo(
  ({ node, showTitle, showContent, showContentType, showStartSpeaker }) => {
    const updateNode = useFlowStore((s) => s.updateNode);

    const patchData = useCallback(
      (patch: Partial<FlowNode["data"]>) => {
        updateNode(node.id, { data: { ...node.data, ...patch } });
      },
      [node.id, node.data, updateNode],
    );

    const handleTitle = (title: string) => {
      updateNode(node.id, {
        label: title,
        data: { ...node.data, title },
      });
    };

    const contentType = (node.data.contentType as ContentType | undefined) ?? "prompt";
    const startSpeaker =
      (node.data.startSpeaker as "agent" | "user" | undefined) ?? "agent";

    return (
      <>
        {showTitle && (
          <div className="space-y-2">
            <Label htmlFor="node-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="node-title"
              showLeftBorder={false}
              value={node.data.title || ""}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Node title"
              className="text-sm"
            />
          </div>
        )}

        {showContent && (
          <div className="space-y-2">
            <Label htmlFor="node-content" className="text-sm font-medium">
              Content / Prompt
            </Label>
            <Textarea
              id="node-content"
              value={node.data.content || ""}
              onChange={(e) => patchData({ content: e.target.value })}
              placeholder="Enter node content or prompt"
              className="text-sm min-h-[120px]"
            />
          </div>
        )}

        {showContentType && (
          <div className="space-y-2">
            <Label htmlFor="content-type" className="text-sm font-medium">
              Instruction Type
            </Label>
            <Select
              value={contentType}
              onValueChange={(value) =>
                patchData({ contentType: value as ContentType })
              }
            >
              <SelectTrigger id="content-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prompt">
                  <div className="flex items-center gap-2">
                    <span>Prompt</span>
                    <span className="text-xs text-muted-foreground">
                      (AI evaluates intent)
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="static">
                  <div className="flex items-center gap-2">
                    <span>Static</span>
                    <span className="text-xs text-muted-foreground">
                      (Agent says as written)
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {contentType === "static"
                ? "The agent will speak this text exactly as written."
                : "This text will be evaluated by AI to determine the next transition."}
            </p>
          </div>
        )}

        {showStartSpeaker && (
          <div className="space-y-2">
            <Label htmlFor="start-speaker" className="text-sm font-medium">
              Start Speaker
            </Label>
            <Select
              value={startSpeaker}
              onValueChange={(value) =>
                patchData({ startSpeaker: value as "agent" | "user" })
              }
            >
              <SelectTrigger id="start-speaker" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Who speaks first in this node (only applies to the first node
              after Start)
            </p>
          </div>
        )}
      </>
    );
  },
);

BasicFields.displayName = "BasicFields";
