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
import { dashboardService } from "@/service/dashboard.service";
import { type CallActivity } from "@/types/dashboard.types";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { CallDetailDialog } from "@/app/(protected)/components/CallDetailDialog";

const ACTIVITY_LIMIT = 200;

function formatCategoryLabel(category: string) {
  if (!category) return "—";
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function isCallWithInbound(
  call: CallActivity,
): call is CallActivity & { inboundInsight: { category?: string; purpose?: string; summary?: string } } {
  return call.inboundInsight != null && typeof call.inboundInsight === "object";
}

export function TruncatedCell({
  text,
  className,
  onClick,
}: {
  text: string;
  className?: string;
  onClick?: () => void;
}) {
  if (!text) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span onClick={onClick}
          className={`line-clamp-2 cursor-default text-left ${className ?? ""} truncate`}
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

export function InboundInsightsPageClient() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const [calls, setCalls] = useState<CallActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCallSid, setSelectedCallSid] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getRecentActivity(ACTIVITY_LIMIT);
      setCalls(data);
      setPage(1);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Failed to load recent call activity"),
      );
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const insightRows = useMemo(
    () => calls.filter(isCallWithInbound),
    [calls],
  );

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

  const handleRowClick = (row: CallActivity) => {
    setSelectedCallSid(row.callSid);
    setDialogOpen(true);
  };

  const columns: TableColumn<CallActivity>[] = useMemo(() => [
    {
      key: "from",
      header: "From",
      render: (row) => <span className="cursor-pointer truncate">{row.phoneNumberFrom}</span>,
    },
    {
      key: "to",
      header: "To",
      render: (row) => <span className="cursor-pointer truncate">{row.phoneNumberTo}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <span className="cursor-pointer">{getStatusBadge(row.status)}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="text-xs cursor-pointer truncate">
          {formatCategoryLabel(row.inboundInsight?.category ?? "")}
        </span>
      ),
    },
    {
      key: "purpose",
      header: "Purpose",
      render: (row) => <TruncatedCell className="cursor-pointer" text={row.inboundInsight?.purpose ?? ""} onClick={() => handleRowClick(row)}/>,
    },
    {
      key: "summary",
      header: "Summary",
      render: (row) => <TruncatedCell className="cursor-pointer" text={row.inboundInsight?.summary ?? ""} onClick={() => handleRowClick(row)}/>,
    },
    {
      key: "time",
      header: "Time",
      render: (row) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground cursor-pointer">
          {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
        </span>
      ),
    },
  ], []);

  if (!isPlatformAdmin) {
    return null;
  }

  const paginatedData = insightRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col gap-0 p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-lg lg:text-2xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
          Inbound Insights
        </h1>
        <p className="text-muted-foreground text-sm mt-1 ">
          Recent calls from platform activity that include an{" "}
          <code className="text-xs">request or information</code> (category, purpose,
          and summary).
        </p>
      </div>
      <div className="rounded-2xl border overflow-x-auto p-4 lg:p-6 space-y-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <h1 className="lg:text-lg 4xl:text-xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
            Inbound Call Insight
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
        ) : insightRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
            <Phone className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">No inbound insights yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No calls in the last {ACTIVITY_LIMIT} activity items include an
              inbound insight. Try again after new analyzed inbound
              calls.
            </p>
          </div>
        ) : (
          <>
            <Table<CallActivity>
              data={paginatedData}
              columns={columns}
              isLoading={false}
              emptyMessage="No inbound insights"
              getRowKey={(item) => item.callSid || item.createdAt}
              onRowClick={handleRowClick}
              desktopGridClassName="md:grid-cols-[1fr_1fr_0.8fr_1fr_1.5fr_1.5fr_0.8fr]"
              page={page}
              rowsPerPage={rowsPerPage}
               totalCount={insightRows.length}
               onPageChange={setPage}
               onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
            />

            <CallDetailDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              callSid={selectedCallSid || ""}
            />
          </>
        )}
      </div>
    </div>
  );
}
