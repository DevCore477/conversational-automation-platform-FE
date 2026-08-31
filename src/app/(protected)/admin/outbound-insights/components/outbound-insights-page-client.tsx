"use client";

import { formatDistanceToNow } from "date-fns";
import { Phone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Table, type TableColumn } from "@/components/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRBAC } from "@/hooks/use-rbac";
import { getErrorMessage } from "@/lib/get-error-message";
import { callService } from "@/service/call.service";
import { type CallListRow } from "@/types/dashboard.types";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { CallDetailDialog } from "@/app/(protected)/components/CallDetailDialog";

const ACTIVITY_LIMIT = 200;

function TruncatedCell({text, className, onClick}: { text: string; className?: string; onClick?: () => void;}) {
  if (!text) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`line-clamp-2 cursor-default text-left ${className ?? ""} truncate`}
          onClick={onClick}
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-72 sm:max-w-md whitespace-pre-wrap text-sm"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function OutboundInsightsPageClient() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const [calls, setCalls] = useState<CallListRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCallSid, setSelectedCallSid] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await callService.getOutboundCalls(ACTIVITY_LIMIT);
      const filtered = data.filter((call) => call.metadata?.trustedCallerAttribution != null);
      setCalls(filtered);
      setPage(1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load outbound calls"));
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
  
    const getColorClasses = () => {
      switch (statusLower) {
        case "completed":
          return "text-xs lg:text-sm text-success cursor-pointer";
        case "active":
          return "text-xs lg:text-sm text-cyan-blue cursor-pointer";
        case "initiating":
          return "text-xs lg:text-sm text-warning cursor-pointer";
        case "failed":
          return "text-xs lg:text-sm text-danger-soft cursor-pointer";
        default:
          return "text-xs lg:text-sm text-gray-600 dark:text-gray-400 cursor-pointer";
      }
    };
  
    const getLabel = () => {
      switch (statusLower) {
        case "completed": return "Completed";
        case "active": return "Active";
        case "initiating": return "Initiating";
        case "failed": return "Failed";
        default: return status;
      }
    };
  
    return (
      <span className={`text-sm font-medium ${getColorClasses()}`}>
        {getLabel()}
      </span>
    );
  };

  const handleRowClick = (row: CallListRow) => {
    setSelectedCallSid(row.callSid);
    setDialogOpen(true);
  };

  const columns: TableColumn<CallListRow>[] = useMemo(() => [
    {
      key: "callerName",
      header: "Caller Name",
      render: (row) => (
        <span className="cursor-pointer truncate">
          {row.metadata?.trustedCallerAttribution?.displayName ?? "—"}
        </span>
      ),
    },
    {
      key: "callerEmail",
      header: "Caller Email",
      render: (row) => (
        <span className="cursor-pointer truncate">
          {row.metadata?.trustedCallerAttribution?.email ?? "—"}
        </span>
      ),
    },
    {
      key: "from",
      header: "From",
      render: (row) => (
        <span className="line-clamp-2 cursor-pointer">{row.phoneNumberFrom ?? "—"}</span>
      ),
    },
    {
      key: "to",
      header: "To",
      render: (row) => <span className="line-clamp-2 cursor-pointer">{row.phoneNumberTo ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <span className="cursor-pointer">{getStatusBadge(row.status)}</span>,
    },
    {
      key: "firstMessage",
      header: "First Message",
      render: (row) => <TruncatedCell className="cursor-pointer" text={row.metadata?.firstMessage ?? "—"} onClick={() => handleRowClick(row)}/>,
    },
    {
      key: "time",
      header: "Time",
      render: (row) => {
        const date = row.createdAt ? new Date(row.createdAt) : null;
        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground cursor-pointer">
            {date && !isNaN(date.getTime()) ? formatDistanceToNow(date, { addSuffix: true }) : "—"}
          </span>
        );
      },
    },
  ], []);

  if (!isPlatformAdmin) {
    return null;
  }

  const paginatedData = calls.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col gap-0 p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-lg lg:text-2xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
          Outbound Insights
        </h1>
        <p className="text-muted-foreground text-sm mt-1 ">
          Outbound calls from platform activity that include an
          <code className="text-xs">request or information</code> (category, purpose,
          and summary).
        </p>
      </div>
      <div className="rounded-2xl border overflow-x-auto p-4 lg:p-6 space-y-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <h1 className="lg:text-lg 4xl:text-xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
            Outbound Call Insight
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
        ) : calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Phone className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">No outbound calls yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No outbound calls in the last {ACTIVITY_LIMIT} activity items.
            </p>
          </div>
        ) : (
          <>
            <Table<CallListRow>
              data={paginatedData}
              columns={columns}
              isLoading={false}
              emptyMessage="No outbound calls"
              getRowKey={(item) => item.callSid || item.createdAt}
              onRowClick={handleRowClick}
              desktopGridClassName="md:grid-cols-[1.2fr_1.2fr_1fr_1fr_0.8fr_1.5fr_0.8fr]"
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={calls.length}
              onPageChange={setPage}
              onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
            />
          </>
        )}
      </div>

      <CallDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        callSid={selectedCallSid || ""}
      />
    </div>
  );
}
