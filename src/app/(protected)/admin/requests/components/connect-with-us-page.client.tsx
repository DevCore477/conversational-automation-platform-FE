"use client";

import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Table, type TableColumn } from "@/components/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRBAC } from "@/hooks/use-rbac";
import { getErrorMessage } from "@/lib/get-error-message";
import { RequestsService } from "@/service/requests.service";
import { type Request as ConnectUsRequest } from "@/types/requests.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { copyToClipboard } from "@/lib/clipboard";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";

function formatCategoryLabel(category: string) {
  if (!category) return "—";
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function TruncatedCell({ text, className }: {
  text: string;
  className?: string;
}) {
  if (!text) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`line-clamp-2 cursor-default text-left ${className ?? ""} truncate`}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-72 sm:max-w-md whitespace-pre-wrap text-sm">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function formatStatusLabel(status: string) {
  switch (status) {
    case "New":
      return "New";
    case "Contacted":
      return "Contacted";
    case "Qualified":
      return "Qualified";
    case "Unqualified":
      return "Unqualified";
    case "Converted":
      return "Converted";
    default:
      return status;
  }
}

function formatStatusBadge(status: string) {
  const baseClasses = "px-2 py-1 text-xs rounded";
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "new":
      return `${baseClasses} text-success`;
    case "contacted":
      return `${baseClasses} text-[#0EA5E9]`;
    case "qualified":
      return `${baseClasses} text-warning`;
    case "unqualified":
      return `${baseClasses} text-danger-soft`;
    case "converted":
      return `${baseClasses} text-purple-500`;
    default:
      return `${baseClasses} text-gray-800`;
  }
}

function formatRequestUserLabel(req: ConnectUsRequest) {
  const name = [req.firstName, req.lastName].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (req.email) return req.email;
  return null;
}

export function ConnectWithUsPageClient() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const [requests, setRequests] = useState<ConnectUsRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RequestsService.list();
      setRequests(data);
      setPage(1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load requests"));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequestStatus = useCallback(
    async (requestId: string, newStatus: string) => {
      try {
        await RequestsService.updateRequest(requestId, { status: newStatus });
        toast.success("Request status updated");
        await load();
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to update request status"));
      }
    },
    [load]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const columns: TableColumn<ConnectUsRequest>[] = useMemo(() => [
    {
      key: "user",
      header: "User",
      render: (row) => {
        const label = formatRequestUserLabel(row);
        return label ? (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="truncate">{label}</span>
            {row.email && label !== row.email ? (
              <span className="text-xs text-muted-foreground truncate">
                {row.email}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unknown user</span>
        );
      },
    },
    {
      key: "message",
      header: "Message",
      render: (row) => <TruncatedCell text={row.message ?? "—"} />,
    },
    {
      key: "companySize",
      header: "Company size",
      render: (row) => (
        <span className="">{formatCategoryLabel(row.companySize)}</span>
      ),
    },
    {
      key: "referralSource",
      header: "Referral Source",
      render: (row) => (
        <span className="">{formatCategoryLabel(row.referralSource ?? "—")}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Captured at",
      render: (row) => (
        <span className=" text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className={`${formatStatusBadge(row.status)} cursor-pointer`}>
              {formatStatusLabel(row.status || "N/A")}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => updateRequestStatus(row.id, "New")}>
              Mark as New
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateRequestStatus(row.id, "Contacted")}>
              Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateRequestStatus(row.id, "Qualified")}>
              Mark as Qualified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateRequestStatus(row.id, "Unqualified")}>
              Mark as Unqualified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateRequestStatus(row.id, "Converted")}>
              Mark as Converted
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [updateRequestStatus]);

  if (!isPlatformAdmin) {
    return null;
  }

  const paginatedData = requests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col gap-0 p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-lg lg:text-2xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
          Request Activity
        </h1>
        <p className="text-muted-foreground text-sm mt-1 ">
          View all captured user requests, including details and insights from your website, help center, or other channels.
        </p>
      </div>
      <div className="rounded-2xl border overflow-x-auto p-4 lg:p-6 space-y-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <h1 className="lg:text-lg 4xl:text-xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
            Recent Request Activity
          </h1>
          <div className="flex justify-end">
            <RefreshButton onRefresh={load}/>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <p className="text-sm font-medium">No requests yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No requests have been captured yet.
            </p>
          </div>
        ) : (
          <>
            <Table<ConnectUsRequest>
              data={paginatedData}
              columns={columns}
              isLoading={false}
              emptyMessage="No requests"
              getRowKey={(item) => item.id}
              desktopGridClassName="md:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_0.8fr]"
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={requests.length}
              onPageChange={setPage}
              onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
            />
          </>
        )}
      </div>
    </div>
  );
}
