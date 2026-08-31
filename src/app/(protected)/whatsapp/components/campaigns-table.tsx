"use client";

import { Eye, Pencil, Trash2, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, type TableColumn, type TableAction } from "@/components/table";
import { type WhatsAppCampaign } from "@/types/whatsapp.types";

interface CampaignsTableProps {
  campaigns: WhatsAppCampaign[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  search: string;
  statusFilter: string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onViewCampaign: (campaign: WhatsAppCampaign) => void;
  onRenameCampaign: (campaign: WhatsAppCampaign) => void;
  onDeleteCampaign: (campaign: WhatsAppCampaign) => void;
}

const STATUS_BADGE: Record<string, string> = {
  draft: "text-gray-500 dark:text-gray-400",
  queued: "text-blue-600 dark:text-blue-400",
  sending: "text-yellow-600 dark:text-yellow-400",
  running: "text-yellow-600 dark:text-yellow-400",
  completed: "text-green-600 dark:text-green-400",
  failed: "text-red-600 dark:text-red-400",
  paused: "text-gray-500 dark:text-gray-400",
  cancelled: "text-gray-500 dark:text-gray-400",
};

function ProgressCell({ campaign }: { campaign: WhatsAppCampaign }) {
  const { totalCount, deliveredCount } = campaign;
  if (totalCount === 0) return <span className="text-muted-foreground">—</span>;

  const pct = Math.min(Math.round((deliveredCount / totalCount) * 100), 100);
  const color =
    pct >= 70 ? "text-success" :
    pct >= 30 ? "text-info" :
    "text-destructive";

  return (
    <span className={`font-medium ${color}`}>
      {pct}%
    </span>
  );
}

const ROUTING_LABEL: Record<string, string> = {
  ai: "AI",
  agent: "Agent",
  flow: "Flow",
  script: "Script",
  database_default: "Default",
};

const desktopGridClassName =
  "md:max-lg:[grid-template-columns:25fr_15fr_18fr_12fr_20fr_auto] " +
  "lg:max-2xl:[grid-template-columns:18fr_10fr_14fr_8fr_8fr_10fr_14fr_auto] " +
  "2xl:[grid-template-columns:16fr_8fr_12fr_8fr_8fr_10fr_12fr_auto]";

export function CampaignsTable({
  campaigns,
  isLoading,
  totalCount,
  page,
  rowsPerPage,
  search,
  statusFilter,
  onPageChange,
  onRowsPerPageChange: _onRowsPerPageChange,
  onSearchChange,
  onStatusFilterChange,
  onViewCampaign,
  onRenameCampaign,
  onDeleteCampaign,
}: CampaignsTableProps) {
  const getActions = (campaign: WhatsAppCampaign): TableAction<WhatsAppCampaign>[] => [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onViewCampaign(campaign),
    },
    {
      label: "Rename",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => onRenameCampaign(campaign),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 text-destructive" />,
      onClick: () => onDeleteCampaign(campaign),
    },
  ];

  const columns: TableColumn<WhatsAppCampaign>[] = [
    {
      key: "name",
      header: "Name",
      width: "min-w-0",
      render: (row) => <span className="truncate font-medium">{row.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "min-w-0",
      render: (row) => (
        <span className={`font-medium ${STATUS_BADGE[row.status] || "text-gray-500"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      width: "min-w-0",
      render: (row) => <ProgressCell campaign={row} />,
    },
    {
      key: "total",
      header: "Total",
      width: "min-w-0",
      render: (row) => row.totalCount,
    },
    {
      key: "failed",
      header: "Failed",
      width: "hidden lg:block min-w-0",
      render: (row) => (
        <span className={row.failedCount > 0 ? "text-red-600 dark:text-red-400 font-medium" : ""}>
          {row.failedCount}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      width: "min-w-0",
      render: (row) =>
        row.createdAt
          ? formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })
          : "\u2014",
    },
    {
      key: "routing",
      header: "Routing",
      width: "min-w-0",
      render: (row) => {
        const mode = row.routingMode;
        if (!mode) return <span className="text-muted-foreground">Default</span>;
        return (
          <span className="text-xs font-medium text-muted-foreground">
            {ROUTING_LABEL[mode] ?? mode}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="sending">Sending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table<WhatsAppCampaign>
        data={campaigns}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No campaigns found."
        getRowKey={(item) => item.id}
        getActions={getActions}
        onRowClick={onViewCampaign}
        desktopGridClassName={desktopGridClassName}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={_onRowsPerPageChange}
      />
    </div>
  );
}
