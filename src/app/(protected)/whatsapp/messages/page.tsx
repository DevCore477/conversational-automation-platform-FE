"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useDebounce } from "use-debounce";
import { Upload, Send, CheckCircle2, XCircle, Clock, SendHorizonal } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import GifButton from "@/components/GifButton";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";
import { getErrorMessage } from "@/lib/get-error-message";
import { whatsappService } from "@/service/whatsapp.service";
import { SuperAdminCompanyScopePicker } from "@/app/(protected)/components/super-admin-company-scope";
import type { WhatsAppConversation, WhatsAppMessageStats } from "@/types/whatsapp.types";
import { StatCard } from "@/components/stat-card";
import { useThemeStore } from "@/store/theme.store";

import { NumbersTable } from "../components/numbers-table";
import { ImportCsvDialog } from "../components/import-csv-dialog";
import { SendTemplateDialog } from "../components/send-template-dialog";
import { SendMessageDialog } from "../components/send-message-dialog";
import { ConversationDetailModal } from "../components/conversation-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { toast } from "sonner";

function hasConversationMessages(conversation: WhatsAppConversation) {
  return Boolean(conversation.lastMessageAt);
}

function WhatsAppMessagesPageInner() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const { company, fetchMyCompany } = useCompanyStore();
  const { theme } = useThemeStore();
  const searchParams = useSearchParams();

  const effectiveCompanyId = isPlatformAdmin
    ? searchParams.get("companyId")
    : (company?.id ?? null);

  const [conversations, setConversations] = useState<WhatsAppConversation[]>(
    [],
  );
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [stats, setStats] = useState<WhatsAppMessageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [sendTemplateOpen, setSendTemplateOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [conversationDetail, setConversationDetail] =
    useState<WhatsAppConversation | null>(null);
  const [conversationDetailOpen, setConversationDetailOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!effectiveCompanyId) return;
    setStatsLoading(true);
    try {
      const data = await whatsappService.getMessageStats(effectiveCompanyId);
      setStats(data);
    } catch {
      // stats are optional, don't show error
    } finally {
      setStatsLoading(false);
    }
  }, [effectiveCompanyId]);

  const fetchConversations = useCallback(async () => {
    if (!effectiveCompanyId) {
      return;
    }
    setLoading(true);
    try {
      const { data, meta } = await whatsappService.getConversations(effectiveCompanyId, {
        limit: rowsPerPage,
        page,
        search: debouncedSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      const visibleConversations = data.filter(hasConversationMessages);
      const hiddenCount = data.length - visibleConversations.length;

      setConversations(visibleConversations);
      setTotalCount(Math.max(0, meta.totalItems - hiddenCount));
      setSelectedIds((current) => {
        const visiblePhones = new Set(visibleConversations.map((c) => c.contactPhone));
        return new Set([...current].filter((phone) => visiblePhones.has(phone)));
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load conversations"));
    } finally {
      setLoading(false);
    }
  }, [effectiveCompanyId, page, rowsPerPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    if (!effectiveCompanyId && !isPlatformAdmin) {
      void fetchMyCompany();
    }
  }, [effectiveCompanyId, isPlatformAdmin, fetchMyCompany]);

  useEffect(() => {
    if (effectiveCompanyId) {
      void fetchConversations();
      void fetchStats();
    }
  }, [effectiveCompanyId, fetchConversations, fetchStats]);

  const handleViewConversation = (conv: WhatsAppConversation) => {
    setConversationDetail(conv);
    setConversationDetailOpen(true);
  };

  const handleRefresh = async () => {
    await Promise.all([fetchConversations(), fetchStats()]);
    toast.success("Data refreshed");
  };

  return (
    <RBACGuard route="/whatsapp/messages" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        {isPlatformAdmin && (
          <SuperAdminCompanyScopePicker
            scopePath="/whatsapp/messages"
            title="WhatsApp Messages"
            description="Select a company to view their WhatsApp conversations."
          />
        )}

        {!isPlatformAdmin && (
          <PageHeader
            title="WhatsApp Messages"
            description="Manage numbers, import contacts, and send template messages."
            action={
              <div className="flex flex-col xs:flex-row items-end gap-2">
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full py-5 px-16"
                  onClick={() => setImportCsvOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button> */}
                <GifButton
                  label="Import CSV"
                  icon={<Upload className="size-4 lg:size-5" />}
                  onClick={() => setImportCsvOpen(true)}
                />
                <GifButton
                  label="Send Message"
                  icon={<SendHorizonal className="size-4 lg:size-5" />}
                  onClick={() => setSendMessageOpen(true)}
                />
                {selectedIds.size > 0 && (
                  <GifButton
                    label={`Send (${selectedIds.size})`}
                    icon={<Send className="size-4 lg:size-5" />}
                    onClick={() => setSendTemplateOpen(true)}
                  />
                )}
              </div>
            }
          />
        )}

        {isPlatformAdmin && !effectiveCompanyId && (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">
              Select a company above to view WhatsApp conversations.
            </p>
          </div>
        )}

        {effectiveCompanyId && (
          <>
            {isPlatformAdmin && (
              <PageHeader
                title="WhatsApp Messages"
                description="View and manage WhatsApp conversations for the selected company."
              />
            )}

            {stats && !statsLoading && (
              <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Delivered" value={stats.messagesByStatus.delivered ?? 0} icon={<CheckCircle2 className="size-5 text-success" />} variant="success" showWave waveColor={theme?.primaryColor} />
                <StatCard title="Read" value={stats.messagesByStatus.read ?? 0} icon={<Send className="size-5 text-info" />} variant="info" showWave waveColor={theme?.primaryColor} />
                <StatCard title="Pending" value={stats.messagesByStatus.pending ?? 0} icon={<Clock className="size-5 text-warning" />} variant="default" showWave waveColor={theme?.primaryColor} />
                <StatCard title="Failed" value={stats.messagesByStatus.failed ?? 0} icon={<XCircle className="size-5 text-destructive" />} variant="danger" showWave waveColor={theme?.primaryColor} />
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                    <CardTitle className="md:text-lg text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
                      WhatsApp Conversations
                    </CardTitle>
                    <span className="text-[14px] text-[#666666]">
                      (Manage all your WhatsApp conversations)
                    </span>
                  </div>
                  <div className="flex justify-end">
                  <RefreshButton onRefresh={handleRefresh} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NumbersTable
                  conversations={conversations}
                  isLoading={loading}
                  totalCount={totalCount}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  search={search}
                  statusFilter={statusFilter}
                  selectedIds={selectedIds}
                  onPageChange={setPage}
                  onRowsPerPageChange={(r) => {
                    setRowsPerPage(r);
                    setPage(1);
                  }}
                  onSearchChange={(s) => {
                    setSearch(s);
                    setPage(1);
                  }}
                  onStatusFilterChange={(f) => {
                    setStatusFilter(f);
                    setPage(1);
                  }}
                  onSelectionChange={setSelectedIds}
                  onViewConversation={handleViewConversation}
                  onUpdateStatus={async (id, status) => {
                    try {
                      await whatsappService.updateConversationStatus(id, { status });
                      toast.success(`Conversation ${status === "human_handoff" ? "escalated" : status === "closed" ? "closed" : "reopened"}`);
                      await fetchConversations();
                    } catch (err) {
                      toast.error(getErrorMessage(err, "Failed to update conversation"));
                    }
                  }}
                  onClearConversation={async (id) => {
                    try {
                      const result = await whatsappService.clearConversation(id);
                      toast.success(`${result.deletedMessages} message(s) cleared`);
                      await fetchConversations();
                    } catch (err) {
                      toast.error(getErrorMessage(err, "Failed to clear conversation"));
                    }
                  }}
                />
              </CardContent>
            </Card>

            <ImportCsvDialog
              open={importCsvOpen}
              onOpenChange={setImportCsvOpen}
              onSuccess={fetchConversations}
            />

            <SendMessageDialog
              open={sendMessageOpen}
              onOpenChange={setSendMessageOpen}
              preselectedPhone={undefined}
              onSuccess={() => void fetchConversations()}
            />

            <SendTemplateDialog
              open={sendTemplateOpen}
              onOpenChange={setSendTemplateOpen}
              selectedNumbers={Array.from(selectedIds)}
              onSuccess={() => {
                setSelectedIds(new Set());
                void fetchConversations();
              }}
            />

            <ConversationDetailModal
              open={conversationDetailOpen}
              onOpenChange={(open) => {
                setConversationDetailOpen(open);
                if (!open) {
                  setConversationDetail(null);
                }
              }}
              conversation={conversationDetail}
              companyId={effectiveCompanyId}
            />
          </>
        )}
      </main>
    </RBACGuard>
  );
}

export default function WhatsAppMessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><p className="text-muted-foreground">Loading...</p></div>}>
      <WhatsAppMessagesPageInner />
    </Suspense>
  );
}
