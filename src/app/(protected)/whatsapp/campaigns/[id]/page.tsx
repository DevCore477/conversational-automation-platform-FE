"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";
import { getErrorMessage } from "@/lib/get-error-message";
import { whatsappService } from "@/service/whatsapp.service";
import { useThemeStore } from "@/store/theme.store";
import type {
  CampaignDetailResponse,
  CampaignRecipientRow,
  ReplyRoutingMode,
} from "@/types/whatsapp.types";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, type TableColumn } from "@/components/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  queued: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  running:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  paused: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const RECIPIENT_STATUS_COLOR: Record<string, string> = {
  delivered: "text-green-600 dark:text-green-400",
  read: "text-blue-600 dark:text-blue-400",
  sent: "text-yellow-600 dark:text-yellow-400",
  pending: "text-gray-500 dark:text-gray-400",
  queued: "text-gray-500 dark:text-gray-400",
  accepted: "text-purple-600 dark:text-purple-400",
  failed: "text-red-600 dark:text-red-400",
};

const ROUTING_LABEL: Record<string, string> = {
  ai: "AI Reply",
  agent: "Agent",
  flow: "Flow",
  script: "Script",
  database_default: "Default",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleString();
}

const recipientsDesktopGridClassName =
  "md:max-lg:[grid-template-columns:18fr_15fr_15fr_18fr_18fr_auto] " +
  "lg:[grid-template-columns:14fr_24fr_18fr_10fr_10fr_12fr_12fr]";

function CampaignDetailPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { isAdmin, isCompanyUser } = useRBAC();
  const { company, fetchMyCompany } = useCompanyStore();
  const { theme } = useThemeStore();

  const [detail, setDetail] = useState<CampaignDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await whatsappService.getCampaign(id, { page, limit });
      setDetail(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load campaign details"));
    } finally {
      setLoading(false);
    }
  }, [id, page, limit]);

  useEffect(() => {
    if (id) void fetchData();
  }, [id, fetchData]);

  const campaign = detail?.campaign;
  const recipients = detail?.recipients;
  const templateInfo = detail?.template;
  const meta = recipients?.meta;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (meta && newPage > meta.totalPages)) return;
    setPage(newPage);
  };

  const recipientColumns: TableColumn<CampaignRecipientRow>[] = [
    {
      key: "phone",
      header: "Phone",
      width: "min-w-0",
      render: (row) => (
        <span className="font-mono text-sm truncate">{row.phoneNumber}</span>
      ),
    },
    {
      key: "conversationId",
      header: "Conversation ID",
      width: "hidden lg:block min-w-0",
      render: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-mono text-muted-foreground truncate block">
              {row.conversationId || "\u2014"}
            </span>
          </TooltipTrigger>
          {row.conversationId && (
            <TooltipContent side="bottom" align="start" className="max-w-[400px] break-all font-mono text-xs">
              {row.conversationId}
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      key: "body",
      header: "Body",
      width: "hidden lg:block min-w-0",
      render: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm truncate block max-w-[200px]">
              {row.body || "\u2014"}
            </span>
          </TooltipTrigger>
          {row.body && (
            <TooltipContent side="bottom" align="start" className="max-w-[400px] break-words text-xs">
              {row.body}
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      key: "templateName",
      header: "Template",
      width: "min-w-0",
      render: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm truncate block">
              {row.templateName || "\u2014"}
            </span>
          </TooltipTrigger>
          {row.templateName && (
            <TooltipContent side="bottom" align="start" className="max-w-[300px] break-all text-xs">
              {row.templateName}
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "min-w-0",
      render: (row) => (
        <span
          className={`font-medium ${RECIPIENT_STATUS_COLOR[row.status] || "text-gray-500"}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      width: "min-w-0",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "sentAt",
      header: "Sent At",
      width: "min-w-0",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.sentAt)}
        </span>
      ),
    },
  ];

  if (loading && !campaign) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Campaign not found.</p>
      </div>
    );
  }

  return (
    <RBACGuard route="/whatsapp/campaigns" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const companyId = searchParams.get("companyId");
              const url = companyId ? `/whatsapp/campaigns?companyId=${companyId}` : "/whatsapp/campaigns";
              router.push(url);
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageHeader title={campaign.name} description="" />
          <div className="ml-auto">
            <RefreshButton onRefresh={fetchData} />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            className={
              STATUS_BADGE[campaign.status] || "bg-gray-100 text-gray-700"
            }
          >
            {campaign.status}
          </Badge>
          {templateInfo && (
            <Badge variant="outline" className="text-xs">
              {templateInfo.metaTemplateName}
            </Badge>
          )}
          {campaign.routingMode && (
            <Badge variant="secondary" className="text-xs">
              {ROUTING_LABEL[campaign.routingMode] ?? campaign.routingMode}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            Created {new Date(campaign.createdAt).toLocaleString()}
          </span>
          {campaign.completedAt && (
            <>
              <span className="text-sm text-muted-foreground">&middot;</span>
              <span className="text-sm text-muted-foreground">
                Completed {new Date(campaign.completedAt).toLocaleString()}
              </span>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Contacts"
            value={campaign.totalCount}
            icon={<Send className="size-4 text-primary" />}
            variant="default"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Delivered"
            value={campaign.deliveredCount}
            icon={<CheckCircle2 className="size-5 text-success" />}
            variant="success"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Read"
            value={campaign.readCount}
            icon={<Eye className="size-5 text-info" />}
            variant="info"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Pending"
            value={
              campaign.totalCount -
              campaign.sentCount -
              campaign.failedCount -
              campaign.skippedCount
            }
            icon={<Clock className="size-5 text-warning" />}
            variant="default"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Failed"
            value={campaign.failedCount}
            icon={<XCircle className="size-5 text-destructive" />}
            variant="danger"
            showWave
            waveColor={theme?.primaryColor}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <CardTitle className="text-lg text-sidebar-accent dark:text-sidebar-accent-foreground font-medium">
                Recipients
                {meta && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({meta.totalItems} total)
                  </span>
                )}
              </CardTitle>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {meta.currentPage} of {meta.totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!meta.hasPreviousPage}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!meta.hasNextPage}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table<CampaignRecipientRow>
              data={recipients?.data ?? []}
              columns={recipientColumns}
              isLoading={loading}
              emptyMessage="No recipients found."
              getRowKey={(row) => row.messageId}
              desktopGridClassName={recipientsDesktopGridClassName}
            />
            {meta && meta.totalPages <= 1 && meta.totalItems > 0 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing all {meta.totalItems} recipient
                  {meta.totalItems !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </RBACGuard>
  );
}

export default function CampaignDetailPage() {
  return <CampaignDetailPageInner />;
}
