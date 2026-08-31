"use client";

import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type CallScript } from "@/types/script.types";
import { useThemeStore } from "@/store/theme.store";

interface ViewScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: CallScript | null;
  onEdit?: (script: CallScript) => void;
}

export function ViewScriptDialog({
  open,
  onOpenChange,
  script,
  onEdit,
}: ViewScriptDialogProps) {

  const { theme, fetchTheme } = useThemeStore();

  if (!script) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-start">
          <DialogTitle>Script Details</DialogTitle>
          <DialogDescription>
            Call script details and usage statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and Default */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground mb-2 block">Status</Label>
              <Badge variant={script.isActive ? "default" : "secondary"}>
                {script.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <Label className="text-muted-foreground mb-2 block">
                Default
              </Label>
              {script.isDefault ? (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Default Script
                </Badge>
              ) : (
                <span className="text-sm">No</span>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{script.totalCalls}</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {script.successfulCalls}
              </p>
              <p className="text-xs text-muted-foreground">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-danger-soft">
                {script.failedCalls}
              </p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>

          {/* Script Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground mb-2 block">
                Script Name
              </Label>
              <p className="text-sm font-medium">{script.name}</p>
            </div>

            {script.description && (
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Description
                </Label>
                <p className="text-sm">{script.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Call Type
                </Label>
                <Badge variant="outline" className="capitalize">
                  {script.callType}
                </Badge>
              </div>
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  AI Model
                </Label>
                <p className="text-sm">{script.model}</p>
              </div>
            </div>

            {script.voiceId && (
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  Voice ID
                </Label>
                <p className="text-sm font-mono">{script.voiceId}</p>
              </div>
            )}

            {script.firstMessage && (
              <div>
                <Label className="text-muted-foreground mb-2 block">
                  First Message
                </Label>
                <p className="text-sm">{script.firstMessage}</p>
              </div>
            )}

            <div>
              <Label className="text-muted-foreground mb-2 block">
                Script Content
              </Label>
              <div className="bg-muted p-4 rounded-md max-h-[300px] overflow-y-auto">
                <pre className="text-xs lg:text-sm whitespace-pre-wrap font-sans">
                  {script.script}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end items-end">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button
              type="button"
              onClick={() => {
                onEdit(script);
              }}
              showWave waveColor={theme?.primaryColor}
              className="rounded-full"
            >
              Edit Script
            </Button>
          )}
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
