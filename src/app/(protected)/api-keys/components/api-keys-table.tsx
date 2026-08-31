"use client";

import { format } from "date-fns";
import { Copy, Trash2, Ban, Check } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableColumn } from "@/components/table";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { type ApiKey } from "@/types/api-key.types";
import { revokeApiKey, deleteApiKey } from "../actions";

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ApiKeysTable({
  apiKeys,
  isLoading,
  onRefresh,
}: ApiKeysTableProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyKey = async (key: string, id: string) => {
    const ok = await copyToClipboard(key);
    if (ok) {
      setCopiedId(id);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error("Unable to copy API key to clipboard");
    }
  };

  const handleRevoke = async () => {
    if (!selectedKey) return;

    setIsRevoking(true);
    try {
      const result = await revokeApiKey(selectedKey.id);
      if (result.success) {
        toast.success("API key revoked successfully");
        setShowRevokeDialog(false);
        setSelectedKey(null);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to revoke API key");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to revoke API key"));
    } finally {
      setIsRevoking(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey) return;

    setIsDeleting(true);
    try {
      const result = await deleteApiKey(selectedKey.id);
      if (result.success) {
        toast.success("API key deleted successfully");
        setShowDeleteDialog(false);
        setSelectedKey(null);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to delete API key");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete API key"));
    } finally {
      setIsDeleting(false);
    }
  };

  const getActions = (item: ApiKey) => {
    const actions: {
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
      variant?: "default" | "destructive";
    }[] = [
      {
        label: "Copy Key",
        icon: <Copy className="h-4 w-4" />,
        onClick: () => handleCopyKey(item.key, item.id),
      },
    ];

    if (item.isActive) {
      actions.push({
        label: "Revoke",
        icon: <Ban className="h-4 w-4" />,
        onClick: () => {
          setSelectedKey(item);
          setShowRevokeDialog(true);
        },
      });
    }

    actions.push({
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        setSelectedKey(item);
        setShowDeleteDialog(true);
      },
      variant: "destructive",
    });

    return actions;
  };

  /** Percentage / fr tracks fill the row; Key uses 1fr to absorb leftover space after fixed % columns. */
const apiKeysDesktopGridClassName =
  "md:max-lg:[grid-template-columns:minmax(0,18%)_minmax(0,1fr)_minmax(0,12%)_minmax(0,15%)_auto] " +
  "lg:max-2xl:[grid-template-columns:minmax(0,14%)_minmax(0,1fr)_minmax(0,9%)_minmax(0,8%)_minmax(0,10%)_minmax(0,11%)_auto] " +
  "2xl:[grid-template-columns:minmax(0,12%)_minmax(0,1fr)_minmax(0,8%)_minmax(0,7%)_minmax(0,9%)_minmax(0,9%)_minmax(0,10%)_auto]";

  const columns: TableColumn<ApiKey>[] = [
    {
      key: "name",
      header: "Name",
      width: "min-w-0",
      render: (item) => <span className="truncate">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>,
    },
    {
      key: "key",
      header: "Key",
      width: "min-w-0",
      render: (item) => (
        <div className="flex items-center gap-2 lg:gap-4 min-w-0 w-full max-w-24 sm:max-w-sm">
          <span className="truncate min-w-0">
            {item.key.length > 45
              ? `${item.key.substring(0, 45)}...`
              : item.key}
          </span>
          <button
            onClick={() => handleCopyKey(item.key, item.id)}
            className="hover:opacity-70 shrink-0"
          >
            {copiedId === item.id ? (
              <Check className="h-4 w-4 text-[#6BBE66]" />
            ) : (
              <Copy className="h-4 w-4 text-[#A3A3A3]" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "min-w-0",
      render: (item) => (
        <span
          className="font-medium"
          style={{ color: item.isActive ? "success" : "warning" }}
        >
          {item.isActive ? "Active" : "Revoked"}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      width: "hidden lg:block min-w-0",
      render: (item) => item.totalRequests || 0,
    },
    {
      key: "lastUsedAt",
      header: "Last Used",
      width: "min-w-0",
      render: (item) =>
        item.lastUsedAt ? format(new Date(item.lastUsedAt), "MMM dd") : "Never",
    },
    {
      key: "created",
      header: "Created",
      width: "hidden 2xl:block min-w-0",
      render: (item) => "Mar 31, 2026",
    },
  ];

  const paginatedKeys = apiKeys.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <Table<ApiKey>
        data={paginatedKeys}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No API keys found. Create your first API key to start integrating with our platform."
        getRowKey={(item) => item.id}
        getActions={getActions}
        desktopGridClassName={apiKeysDesktopGridClassName}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={apiKeys.length}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
      />

      {/* Revoke Confirmation Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke{" "}
              <span className="font-semibold">{selectedKey?.name}</span>? This
              will immediately stop all API requests using this key.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevokeDialog(false);
                setSelectedKey(null);
              }}
              disabled={isRevoking}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? "Revoking..." : "Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold">{selectedKey?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedKey(null);
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
