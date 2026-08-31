"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Loader2,
  Play,
  Archive,
  Trash2,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/table";
import { withCompanyScope } from "@/lib/company-scope";
import { countFlowNodes } from "@/lib/flow-node-utils";
import { type ConversationFlow } from "@/types/flow.types";
import RefreshButton from "../../dashboard/components/RefreshButton";

interface FlowListProps {
  flows: ConversationFlow[];
  isLoading: boolean;
  isCompanyLoading: boolean;
  companyId: string | undefined;
  onRefresh: () => void;
  onDeleteClick: (flow: ConversationFlow) => void;
  onActivate: (flowId: string) => void;
  onArchive: (flowId: string) => void;
  deletingFlowId: string | null;
  activatingFlowId: string | null;
  archivingFlowId: string | null;
}

export function FlowList({
  flows,
  isLoading,
  isCompanyLoading,
  companyId,
  onRefresh,
  onDeleteClick,
  onActivate,
  onArchive,
  deletingFlowId,
  activatingFlowId,
  archivingFlowId,
}: FlowListProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

 const handleRowClick = (item: ConversationFlow) => {
    router.push(
      withCompanyScope(`/conversation-flow/${item.id}`, companyId),
    );
  };

  if (!companyId && isCompanyLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading…</span>
      </div>
    );
  }

  if (isLoading && flows.length === 0) {
    return (
      <Table
        data={[]}
        columns={[]}
        isLoading={true}
        getRowKey={() => ""}
        emptyMessage="Loading..."
      />
    );
  }

  if (!companyId) {
    return (
      <Card className="dark:bg-[#252542]">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          Unable to load company. Refresh the page or try again later.
        </CardContent>
      </Card>
    );
  }

  if (flows.length === 0) {
    return (
      <Card className="dark:bg-[#252542]">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No flows yet. Create a new flow or start from a template above.
        </CardContent>
      </Card>
    );
  }

  const paginatedFlows = flows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="border rounded-2xl p-4 lg:p-6 bg-sidebar">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1">
          <h3 className="lg:text-lg 4xl:text-xl font-medium text-text-dark dark:text-sidebar-accent-foreground">Your flows</h3>
          <span className="text-muted-foreground text-sm">(Manage your all flows)</span>
        </div>
        <div className="flex justify-end">
        {companyId && (
          <RefreshButton onRefresh={onRefresh}/>
        )}
        </div>
      </div>
      <Table
        data={paginatedFlows}
        columns={[
          {
            key: "name",
            header: "Name",
            render: (item: ConversationFlow) => (
              <div className="flex items-center gap-2 ">
                <span className="cursor-pointer">{item.name}</span>
              </div>
            ),
          },
          {
            key: "version",
            header: "Version",
            render: (item: ConversationFlow) => (
              <span className="text-muted-foreground cursor-pointer">{item.version}</span>
            ),
          },
          {
            key: "nodes",
            header: "Nodes",
            render: (item: ConversationFlow) => {
              const nodeCount =
                countFlowNodes(item) === 0
                  ? Object.keys(item.flow?.nodes ?? {}).length
                  : countFlowNodes(item);
              return <span className="font-medium cursor-pointer">{nodeCount}</span>;
            },
          },
          {
            key: "status",
            header: "Status",
            render: (item: ConversationFlow) => {
              if (item.status === "published") {
                return <span className="text-success cursor-pointer">Live</span>;
              }
              if (item.status === "draft") {
                return <span className="text-yellow-600 cursor-pointer">Draft</span>;
              }
              return <span className="text-danger-soft cursor-pointer">Archived</span>;
            },
          },
          {
            key: "publishedAt",
            header: "Published",
            render: (item: ConversationFlow) => (
              <span className="text-muted-foreground cursor-pointer">
                {item.publishedAt
                  ? format(new Date(item.publishedAt), "MMM d, yyyy")
                  : "-"}
              </span>
            ),
          },
          {
            key: "updatedAt",
            header: "Updated",
            render: (item: ConversationFlow) => (
              <span className="text-muted-foreground cursor-pointer">
                {format(new Date(item.updatedAt), "MMM d, yyyy")}
              </span>
            ),
          },
        ]}
        getActions={(item: ConversationFlow) => [
          {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent row click when clicking on action button
              router.push(
                withCompanyScope(`/conversation-flow/${item.id}`, companyId),
              );
            },
          },
          ...(item.status === "archived"
            ? [
                {
                  label: "Activate",
                  icon: <Play className="h-4 w-4" />,
                  onClick: (e: React.MouseEvent) => {
                    e.stopPropagation(); // Prevent row click when clicking on action button
                    onActivate(item.id);
                  },
                },
              ]
            : [
                {
                  label: "Archive",
                  icon: <Archive className="h-4 w-4" />,
                   onClick: (e: React.MouseEvent) => {
                    e.stopPropagation(); // Prevent row click when clicking on action button
                    onArchive(item.id);
                  },
                },
              ]),
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent row click when clicking on action button
              onDeleteClick(item);
            },
            variant: "destructive",
          },
        ]}
        getRowKey={(item: ConversationFlow) => item.id}
        isLoading={isLoading}
        emptyMessage="No flows yet"
        onRowClick={handleRowClick}
        desktopGridClassName=" md:grid-cols-[1.5fr_0.6fr_0.6fr_1fr_1fr_1fr_0.5fr]"
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={flows.length}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
      />
    </div>
  );
}
