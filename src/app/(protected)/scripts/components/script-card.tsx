"use client";

import {
  MoreHorizontal,
  Star,
  Power,
  Trash2,
  Edit,
  Copy,
  EyeIcon,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneCall,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { type CallScript } from "@/types/script.types";
import { deleteScript, setDefaultScript, toggleScriptActive } from "../actions";

interface ScriptCardProps {
  script: CallScript;
  onEdit?: (script: CallScript) => void;
  onView?: (script: CallScript) => void;
  onRefresh?: () => void | Promise<void>;
}

export function ScriptCard({
  script,
  onEdit,
  onView,
  onRefresh,
}: ScriptCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const result = await deleteScript(script.id);
    if (result.success) {
      toast.success("Script deleted successfully");
      await onRefresh?.();
    } else {
      toast.error(result.error || "Failed to delete script");
    }
    setShowDeleteDialog(false);
  };

  const handleSetDefault = async () => {
    const result = await setDefaultScript(script.id);
    if (result.success) {
      toast.success("Default script updated");
      await onRefresh?.();
    } else {
      toast.error(result.error || "Failed to set default");
    }
  };

  const handleToggleActive = async () => {
    const result = await toggleScriptActive(script.id);
    if (result.success) {
      toast.success(
        `Script ${script.isActive ? "deactivated" : "activated"} successfully`,
      );
      await onRefresh?.();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCopyContent = async () => {
    const ok = await copyToClipboard(script.script);
    if (ok) {
      toast.success("Script content copied to clipboard");
    } else {
      toast.error("Unable to copy script content to clipboard");
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {script.name}
                {script.isDefault && (
                  <Star className="h-4 w-4 text-warning fill-warning" />
                )}
              </CardTitle>
              {script.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {script.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(script)}>
                  <EyeIcon className="h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(script)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyContent}>
                  <Copy className="h-4 w-4" />
                  Copy Script Content
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!script.isDefault && (
                  <DropdownMenuItem onClick={handleSetDefault}>
                    <Star className="h-4 w-4" />
                    Set as Default
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleToggleActive}>
                  <Power className="h-4 w-4" />
                  {script.isActive ? "Delete" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={script.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="capitalize flex items-center gap-1"
              >
                {script.callType === "inbound" && (
                  <PhoneIncoming className="h-3 w-3" />
                )}
                {script.callType === "outbound" && (
                  <PhoneOutgoing className="h-3 w-3" />
                )}
                {script.callType === "both" && (
                  <PhoneCall className="h-3 w-3" />
                )}
                {script.callType}
              </Badge>
              <Badge variant={script.isActive ? "default" : "secondary"}>
                {script.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="secondary">{script.model}</Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>{script.totalCalls} calls</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">
                  {script.successfulCalls}✓
                </span>
                <span>/</span>
                <span className="text-danger-soft">{script.failedCalls}✗</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {script.firstMessage || script.script}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Script</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{script.name}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-danger-soft hover:bg-danger-soft/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
