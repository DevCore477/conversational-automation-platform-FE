"use client";

import { Star, Power, Trash2, Edit, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableColumn } from "@/components/table";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { type CallScript } from "@/types/script.types";
import { deleteScript, setDefaultScript, toggleScriptActive } from "../actions";

interface ScriptsTableProps {
  scripts: CallScript[];
  isLoading?: boolean;
  onEdit?: (script: CallScript) => void;
  onView?: (script: CallScript) => void;
  onRefresh?: () => void | Promise<void>;
}

export function ScriptsTable({
  scripts,
  isLoading,
  onEdit,
  onView,
  onRefresh,
}: ScriptsTableProps) {
  const [selectedScript, setSelectedScript] = useState<CallScript | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedScript) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteScript(selectedScript.id);
      if (result.success) {
        toast.success("Script deleted successfully");
        setShowDeleteDialog(false);
        setSelectedScript(null);
        await onRefresh?.();
      } else {
        toast.error(result.error || "Failed to delete script");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete script"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async (script: CallScript) => {
    const result = await setDefaultScript(script.id);
    if (result.success) {
      toast.success("Default script updated");
      await onRefresh?.();
    } else {
      toast.error(result.error || "Failed to set default");
    }
  };

  const handleToggleActive = async (script: CallScript) => {
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

  const handleCopyContent = async (content: string) => {
    const ok = await copyToClipboard(content);
    if (ok) {
      toast.success("Script content copied to clipboard");
    } else {
      toast.error("Unable to copy script content to clipboard");
    }
  };

  const handleRowClick = (script: CallScript) => {
    if (onView) {
      onView(script);
    }
  };

  const getActions = (item: CallScript) => {
    const actions: {
      label: string;
      icon: React.ReactNode;
      onClick: (e?: React.MouseEvent) => void;
      variant?: "default" | "destructive";
    }[] = [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          if (onEdit) onEdit(item);
        },
      },
      {
        label: "Copy Content",
        icon: <Copy className="h-4 w-4" />,
        onClick: (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          handleCopyContent(item.script);
        },
      },
    ];

    if (!item.isDefault) {
      actions.push({
        label: "Set as Default",
        icon: <Star className="h-4 w-4" />,
        onClick: (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          handleSetDefault(item);
        },
      });
    }

    actions.push({
      label: item.isActive ? "Deactivate" : "Activate",
      icon: <Power className="h-4 w-4" />,
      onClick: (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        handleToggleActive(item);
      },
    });

    actions.push({
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedScript(item);
        setShowDeleteDialog(true);
      },
      variant: "destructive",
    });

    return actions;
  };

  const scriptsDesktopGridClassName =
    "md:max-lg:[grid-template-columns:minmax(0,1.5fr)_repeat(5,minmax(0,1fr))_auto] " +
    "lg:max-2xl:[grid-template-columns:minmax(0,1.5fr)_repeat(5,minmax(0,1fr))_auto] " +
    "2xl:[grid-template-columns:minmax(0,1.5fr)_repeat(5,minmax(0,1fr))_auto]";

  const columns: TableColumn<CallScript>[] = [
    {
      key: "name",
      header: "Name",
      width: "min-w-0",
      render: (item) => (
        <div className="flex flex-col">
          <span className="truncate cursor-pointer">
            {item.name}
          </span>
          {item.description && (
            <span className="text-xs text-muted-foreground truncate cursor-pointer">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "callType",
      header: "Type",
      width: "min-w-0",
      render: (item) => (
        <span className="capitalize cursor-pointer">{item.callType}</span>
      ),
    },
    {
      key: "model",
      header: "Model",
      width: "min-w-0",
      render: (item) => item.model,
    },
    {
      key: "isActive",
      header: "Status",
      width: "min-w-0",
      render: (item) => (
        <span
          className="font-medium cursor-pointer"
          style={{ color: item.isActive ? "success" : "warning" }}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      width: "min-w-0",
      render: (item) => (
        <div className="flex items-center gap-1 ">
          <span className="font-medium cursor-pointer">{item.totalCalls}</span>
          <span className="text-xs text-muted-foreground ">
          (
            <span className="text-success cursor-pointer">{item.successfulCalls}✓</span>
            {" / "}
            <span className="text-danger-soft cursor-pointer">{item.failedCalls}✗</span>
          )
          </span>
        </div>
      ),
    },
    {
      key: "isDefault",
      header: "Default",
      width: "min-w-0",
      render: (item) =>
        item.isDefault ? (
          <Star className="h-4 w-4 text-warning fill-warning cursor-pointer" />
        ) : (
          <span className="text-muted-foreground cursor-pointer">-</span>
        ),
    },
  ];

  return (
    <>
      <Table<CallScript>
        data={scripts}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No scripts found. Create your first call script to get started."
        getRowKey={(item) => item.id}
        getActions={getActions}
        onRowClick={handleRowClick}
        desktopGridClassName={scriptsDesktopGridClassName}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Script</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedScript?.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedScript(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}