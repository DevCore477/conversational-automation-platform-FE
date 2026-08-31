"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { type CallActivity } from "@/types/dashboard.types";
import { Table, type TableColumn } from "@/components/table";
import { useRouter } from "next/navigation";
import { usePeriodStore } from "@/store/period.store";
import { apiGet } from "@/lib/dashboard/api-client";
import { CallDetailDialog } from "@/app/(protected)/components/CallDetailDialog";

interface RecentActivityProps {
  calls: CallActivity[];
  isLoading?: boolean;
}

export function RecentActivity({
  calls: initialCalls,
  isLoading: externalLoading,
}: RecentActivityProps) {
  const router = useRouter();
  const { period } = usePeriodStore();

  const [calls, setCalls] = React.useState<CallActivity[]>(initialCalls ?? []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [selectedCallSid, setSelectedCallSid] = React.useState<string | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const LIMIT = 50;

  React.useEffect(() => {
    const fetchActivity = async (selectedPeriod: string) => {
      setIsLoading(true);
      try {
        const data = await apiGet<CallActivity[]>(
          `/dashboard-stats/activity/recent?period=${selectedPeriod}&limit=${LIMIT}`,
        );
        setCalls(data);
        setPage(1);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchActivity(period ?? "");
  }, [period]);

  const data = calls?.length ? calls : [];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      completed: { label: "Completed", color: "text-success" },
      failed: { label: "Failed", color: "text-danger-soft" },
      initiating: { label: "Initiating", color: "text-warning" },
      active: { label: "Active", color: "text-cyan-blue" },
    };

    return (
      map[status?.toLowerCase()] || {
        label: status,
        color: "text-muted-foreground",
      }
    );
  };

  const handleRowClick = (row: CallActivity) => {
    if (!row.callSid) return;

    setSelectedCallSid(row.callSid);
    setDialogOpen(true);
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const columns: TableColumn<CallActivity>[] = [
    {
      key: "phoneFrom",
      header: "Call From",
      render: (row) => (
        <span className="truncate cursor-pointer">{row.phoneNumberFrom}</span>
      ),
    },
    {
      key: "phoneTo",
      header: "Call To",
      render: (row) => (
        <span className="cursor-pointer truncate">{row.phoneNumberTo}</span>
      ),
    },
    {
      key: "template",
      header: "Template",
      render: (row) => (
        <span className="cursor-pointer truncate">
          {row.scriptUsed?.name || row.flowUsed?.name || "No Script/Flow"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="text-muted-foreground cursor-pointer truncate">
          {row.template.charAt(0).toUpperCase() + row.template.slice(1)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const status = getStatusBadge(row.status);
        return (
          <span className={`${status.color} cursor-pointer`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: "time",
      header: "Time",
      render: (row) =>
        mounted
          ? formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })
          : "—",
    },
  ];

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if ((isLoading || externalLoading) && data.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Phone className="size-8 md:size-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-card">
      <Table<CallActivity>
        data={paginatedData}
        columns={columns}
        isLoading={false}
        emptyMessage="No recent activity"
        getRowKey={(item) => item.callSid || item.createdAt}
        onRowClick={handleRowClick}
        desktopGridClassName="md:grid-cols-[1.5fr_1fr_1.5fr_1fr_0.8fr_0.8fr]"
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={data.length}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => {
          setRowsPerPage(r);
          setPage(1);
        }}
      />

      {selectedCallSid && (
        <CallDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          callSid={selectedCallSid}
        />
      )}
    </div>
  );
}
