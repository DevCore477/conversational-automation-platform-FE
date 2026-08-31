"use client";

import { X } from "lucide-react";
import { type FC, memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { NodeTransition } from "@/types/flow.types";

interface TransitionItemProps {
  transition: NodeTransition;
  onUpdate: (id: string, data: Partial<NodeTransition>) => void;
  onDelete: (id: string) => void;
}

export const TransitionItem: FC<TransitionItemProps> = memo(
  ({ transition, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    const displayPrompt = transition.prompt ?? transition.label;

    const handleStartEdit = () => {
      setEditValue(displayPrompt);
      setIsEditing(true);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditValue("");
    };

    const handleCommitEdit = () => {
      const trimmed = editValue.trim();
      if (trimmed) {
        onUpdate(transition.id, {
          label: trimmed,
          prompt: trimmed,
        });
      }
      handleCancelEdit();
    };

    return (
      <div className="flex items-center gap-2 p-2 rounded border border-border bg-muted/30">
        {isEditing ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-sm min-h-[60px] flex-1"
            autoFocus
            onBlur={handleCommitEdit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
          />
        ) : (
          <button
            type="button"
            className="flex-1 text-left cursor-pointer hover:bg-muted rounded px-2 py-1"
            onClick={handleStartEdit}
          >
            <span className="text-xs font-medium line-clamp-2">
              {displayPrompt}
            </span>
          </button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive shrink-0"
          onClick={() => onDelete(transition.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  },
);

TransitionItem.displayName = "TransitionItem";