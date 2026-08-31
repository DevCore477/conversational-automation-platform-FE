"use client";

import { Plus } from "lucide-react";
import { type FC, memo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFlowStore } from "@/store/flow.store";
import type { FlowNode } from "@/types/flow.types";

import { TransitionItem } from "./transition-item";

interface TransitionsSectionProps {
  node: FlowNode;
}

export const TransitionsSection: FC<TransitionsSectionProps> = memo(({ node }) => {
  const addTransition = useFlowStore((s) => s.addTransition);
  const updateTransition = useFlowStore((s) => s.updateTransition);
  const deleteTransition = useFlowStore((s) => s.deleteTransition);

  const [newPrompt, setNewPrompt] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const trimmedNew = newPrompt.trim();
  const transitions = node.data.transitions ?? [];

  const handleAdd = () => {
    if (!trimmedNew) return;
    addTransition(node.id, {
      id: `trans-${node.id}-${Date.now()}`,
      label: trimmedNew,
      targetNodeId: null,
      transitionType: "prompt",
      prompt: trimmedNew,
    });
    setNewPrompt("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Transitions</Label>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 h-8">
              <Plus className="h-3 w-3" />
              Add Transition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transition</DialogTitle>
              <DialogDescription>
                Add a transition path. Describe when the flow should take this
                path (AI will use this prompt to decide).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="trans-prompt" className="text-sm font-medium">
                  Transition prompt
                </Label>
                <Textarea
                  id="trans-prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="e.g., If the user wants to book an appointment"
                  className="text-sm min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Describe when to take this path. The AI uses this prompt to
                  choose the next node.
                </p>
              </div>
              <Button
                onClick={handleAdd}
                className="w-full"
                disabled={!trimmedNew}
              >
                Add Transition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {transitions.map((transition) => (
          <TransitionItem
            key={transition.id}
            transition={transition}
            onUpdate={(id, data) => updateTransition(node.id, id, data)}
            onDelete={(id) => deleteTransition(node.id, transition.id)}
          />
        ))}

        {transitions.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No transitions defined. Add a transition and connect it to another
            node.
          </p>
        )}
      </div>
    </div>
  );
});

TransitionsSection.displayName = "TransitionsSection";
