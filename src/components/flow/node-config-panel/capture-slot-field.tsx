"use client";

import { Save } from "lucide-react";
import { type FC, memo, useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlowStore } from "@/store/flow.store";
import type { FlowNode } from "@/types/flow.types";

interface CaptureSlotFieldProps {
  node: FlowNode;
}

export const CaptureSlotField: FC<CaptureSlotFieldProps> = memo(({ node }) => {
  const updateNode = useFlowStore((s) => s.updateNode);
  const captureSlot = (node.data.captureSlot as string) || "";

  const handleChange = useCallback(
    (slotName: string) => {
      updateNode(node.id, {
        data: {
          ...node.data,
          captureSlot: slotName.trim() || undefined,
        },
      });
    },
    [node.id, node.data, updateNode],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Save className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="capture-slot" className="text-sm font-medium">
          Save User Input As
        </Label>
      </div>
      <Input
        id="capture-slot"
        showLeftBorder={false}
        value={captureSlot}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="e.g., issue, name, email"
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Enter a variable name to save what the user says. Use
        {"{{variable_name}}"} in your content to display it later.
      </p>
      {captureSlot && (
        <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-900 dark:text-green-200">
            User input will be saved as:{" "}
            <code className="font-mono bg-green-100 dark:bg-green-900/30 px-1 rounded">
              {captureSlot}
            </code>
          </p>
        </div>
      )}
    </div>
  );
});

CaptureSlotField.displayName = "CaptureSlotField";
