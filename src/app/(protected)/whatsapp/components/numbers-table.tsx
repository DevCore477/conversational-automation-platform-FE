"use client";

import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle, Search, Eye, XCircle, X,
  RefreshCw, Trash2, RotateCw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, type TableColumn, type TableAction } from "@/components/table";
import { type WhatsAppConversation } from "@/types/whatsapp.types";

interface NumbersTableProps {
  conversations: WhatsAppConversation[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  search: string;
  statusFilter: string;
  selectedIds: Set<string>;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onViewConversation: (conversation: WhatsAppConversation) => void;
  onUpdateStatus?: (id: string, status: "open" | "closed" | "human_handoff") => void;
  onClearConversation?: (id: string) => void;
}

export function NumbersTable({
  conversations,
  isLoading,
  totalCount,
  page,
  rowsPerPage,
  search,
  statusFilter,
  selectedIds,
  onPageChange,
  onRowsPerPageChange: _onRowsPerPageChange,
  onSearchChange,
  onStatusFilterChange,
  onSelectionChange,
  onViewConversation,
  onUpdateStatus,
  onClearConversation,
}: NumbersTableProps) {
  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      open: { label: "Open", color: "text-success" },
      closed: { label: "Closed", color: "text-muted-foreground" },
      pending: { label: "Pending", color: "text-warning" },
    };
    return (
      map[status?.toLowerCase()] || {
        label: status,
        color: "text-muted-foreground",
      }
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(conversations.map((c) => c.contactPhone)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (phone: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(phone);
    } else {
      next.delete(phone);
    }
    onSelectionChange(next);
  };

  const allSelected =
    conversations.length > 0 &&
    conversations.every((c) => selectedIds.has(c.contactPhone));

  const getActions = (
    conv: WhatsAppConversation,
  ): TableAction<WhatsAppConversation>[] => {
    const actions: TableAction<WhatsAppConversation>[] = [
      {
        label: "View Conversation",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => onViewConversation(conv),
      },
    ];
    if (conv.status === "open") {
      actions.push({
        label: "Close conversation",
        icon: <XCircle className="h-4 w-4" />,
        onClick: () => onUpdateStatus?.(conv.id, "closed"),
      });
    }
    if (conv.status === "closed") {
      actions.push({
        label: "Reopen conversation",
        icon: <RefreshCw className="h-4 w-4" />,
        onClick: () => onUpdateStatus?.(conv.id, "open"),
      });
    }
    actions.push({
      label: "Clear conversation",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onClearConversation?.(conv.id),
      variant: "destructive",
    });
    return actions;
  };

  const numbersDesktopGridClassName =
    "md:max-lg:[grid-template-columns:40fr_35fr_25fr] " +
    "lg:max-2xl:[grid-template-columns:30fr_18fr_18fr_28fr_6fr] " +
    "2xl:[grid-template-columns:25fr_15fr_15fr_25fr_15fr_5fr]";

  const columns: TableColumn<WhatsAppConversation>[] = [
    // {
    //   key: "checkbox",
    //   header: (
    //     <input
    //       type="checkbox"
    //       onChange={(e) => handleSelectAll(e.target.checked)}
    //       checked={allSelected}
    //       className="rounded"
    //     />
    //   ),
    //   width: "w-12 shrink-0",
    //   render: (row) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedIds.has(row.contactPhone)}
    //       onChange={(e) => handleSelectRow(row.contactPhone, e.target.checked)}
    //       className="rounded"
    //     />
    //   ),
    // },
    {
      key: "phone",
      header: "Phone Number",
      width: "min-w-0",
      render: (row) => (
        <span className="text-sm font-mono">{row.contactPhone}</span>
      ),
    },
    {
      key: "source",
      header: "Source",
      width: "hidden lg:block min-w-0",
      render: (row) => (
        <span className="text-sm capitalize">{row.importSource || "inbound"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "min-w-0",
      render: (row) => {
        const status = getStatusBadge(row.status);
        return (
          <span className={`font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: "lastMessage",
      header: "Last Message",
      width: "hidden lg:block min-w-0",
      render: (row) =>
        row.lastMessageAt
          ? formatDistanceToNow(new Date(row.lastMessageAt), {
              addSuffix: true,
            })
          : "\u2014",
    },
    {
      key: "conversation",
      header: "Conversation",
      width: "hidden 2xl:block min-w-0",
      render: (row) => (
        <span className="text-sm capitalize">
          {row.unreadCount > 0 ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {row.unreadCount} unread
            </span>
          ) : (
            "Read"
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full max-w-60 xs:max-w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone number..."
            value={search}
            showLeftBorder={false}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px]" showLeftBorder={false}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table<WhatsAppConversation>
        data={conversations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No conversations found."
        getRowKey={(item) => item.id || item.contactPhone}
        getActions={getActions}
        onRowClick={onViewConversation}
        desktopGridClassName={numbersDesktopGridClassName}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={_onRowsPerPageChange}
      />
    </div>
  );
}
