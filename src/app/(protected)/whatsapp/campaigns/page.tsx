"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { Plus, Upload, CheckCircle2, XCircle, Clock, Send, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import GifButton from "@/components/GifButton";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";
import { getErrorMessage } from "@/lib/get-error-message";
import { whatsappService } from "@/service/whatsapp.service";
import { SuperAdminCompanyScopePicker } from "@/app/(protected)/components/super-admin-company-scope";
import type { WhatsAppCampaign, CampaignAllMessagesStats } from "@/types/whatsapp.types";
import { StatCard } from "@/components/stat-card";
import { useThemeStore } from "@/store/theme.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { CampaignsTable } from "../components/campaigns-table";
import { CreateCampaignDialog } from "../components/create-campaign-dialog";
import { UploadCampaignCsvDialog } from "../components/upload-campaign-csv-dialog";
import { RenameCampaignDialog } from "../components/rename-campaign-dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function CampaignsPageInner() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const { company, fetchMyCompany } = useCompanyStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const effectiveCompanyId = isPlatformAdmin
    ? searchParams.get("companyId")
    : (company?.id ?? null);

  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState<CampaignAllMessagesStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<WhatsAppCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WhatsAppCampaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = filteredCampaigns.length;
  const paginatedCampaigns = filteredCampaigns.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const fetchCampaigns = useCallback(async () => {
    if (!effectiveCompanyId) return;
    setLoading(true);
    try {
      const data = isPlatformAdmin
        ? await whatsappService.getCompanyCampaigns(effectiveCompanyId)
        : await whatsappService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load campaigns"));
    } finally {
      setLoading(false);
    }
  }, [effectiveCompanyId, isPlatformAdmin]);

  const fetchStats = useCallback(async () => {
    if (!effectiveCompanyId) return;
    setStatsLoading(true);
    try {
      const data = isPlatformAdmin
        ? await whatsappService.getCompanyCampaignStats(effectiveCompanyId)
        : await whatsappService.getCampaignAllMessagesStats();
      setStats(data);
    } catch {
      // stats are optional
    } finally {
      setStatsLoading(false);
    }
  }, [effectiveCompanyId, isPlatformAdmin]);

  useEffect(() => {
    if (!effectiveCompanyId && !isPlatformAdmin) {
      void fetchMyCompany();
    }
  }, [effectiveCompanyId, isPlatformAdmin, fetchMyCompany]);

  useEffect(() => {
    if (effectiveCompanyId) {
      void fetchCampaigns();
      void fetchStats();
    }
  }, [effectiveCompanyId, fetchCampaigns, fetchStats]);

  const handleRefresh = async () => {
    await Promise.all([fetchCampaigns(), fetchStats()]);
    toast.success("Data refreshed");
  };

  const handleViewCampaign = (campaign: WhatsAppCampaign) => {
    const companyId = searchParams.get("companyId");
    const url = companyId ? `/whatsapp/campaigns/${campaign.id}?companyId=${companyId}` : `/whatsapp/campaigns/${campaign.id}`;
    router.push(url);
  };

  const handleRename = (campaign: WhatsAppCampaign) => {
    setRenameTarget(campaign);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await whatsappService.deleteCampaign(deleteTarget.id);
      toast.success("Campaign deleted");
      setDeleteTarget(null);
      void fetchCampaigns();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete campaign"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <RBACGuard route="/whatsapp/campaigns" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        {isPlatformAdmin && (
          <SuperAdminCompanyScopePicker
            scopePath="/whatsapp/campaigns"
            title="Campaigns"
            description="Select a company to view their WhatsApp campaigns."
          />
        )}

        {!isPlatformAdmin && (
          <PageHeader
            title="Campaigns"
            description="Create and manage bulk WhatsApp message campaigns."
            action={
              <div className="flex flex-col xs:flex-row items-end gap-2">
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full py-5 px-16"
                  onClick={() => setCsvOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button> */}
                 <GifButton
                  label="Import CSV"
                  icon={<Upload className="size-4 lg:size-5" />}
                  onClick={() => setCsvOpen(true)}
                />
                <GifButton
                  label="Create Campaign"
                  icon={<Plus className="size-4 lg:size-5" />}
                  onClick={() => setCreateOpen(true)}
                />
              </div>
            }
          />
        )}

        {isPlatformAdmin && !effectiveCompanyId && (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">Select a company above to view campaigns.</p>
          </div>
        )}

        {effectiveCompanyId && (
          <>
            {isPlatformAdmin && (
              <PageHeader
                title="Campaigns"
                description="View WhatsApp campaigns for the selected company."
              />
            )}

            {stats && !statsLoading && (
              <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-5">
                <StatCard
                  title="Campaigns"
                  value={stats.campaignCount}
                  icon={<Send className="size-4 text-primary" />}
                  variant="default"
                  showWave
                  waveColor={theme?.primaryColor}
                />
                <StatCard
                  title="Delivered"
                  value={stats.messagesByStatus.delivered ?? 0}
                  icon={<CheckCircle2 className="size-5 text-success" />}
                  variant="success"
                  showWave
                  waveColor={theme?.primaryColor}
                />
                <StatCard
                  title="Read"
                  value={stats.messagesByStatus.read ?? 0}
                  icon={<Eye className="size-5 text-info" />}
                  variant="info"
                  showWave
                  waveColor={theme?.primaryColor}
                />
                <StatCard
                  title="Pending"
                  value={(stats.messagesByStatus.queued ?? 0) + (stats.messagesByStatus.pending ?? 0) + (stats.messagesByStatus.accepted ?? 0) + (stats.messagesByStatus.sent ?? 0)}
                  icon={<Clock className="size-5 text-warning" />}
                  variant="default"
                  showWave
                  waveColor={theme?.primaryColor}
                />
                <StatCard
                  title="Failed"
                  value={stats.messagesByStatus.failed ?? 0}
                  icon={<XCircle className="size-5 text-destructive" />}
                  variant="danger"
                  showWave
                  waveColor={theme?.primaryColor}
                />
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <CardTitle className="text-lg text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
                      All Campaigns
                    </CardTitle>
                    <span className="text-[14px] text-[#666666]">
                      ({totalCount} campaign{totalCount !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex justify-end">
                  <RefreshButton onRefresh={handleRefresh} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CampaignsTable
                  campaigns={paginatedCampaigns}
                  isLoading={loading}
                  totalCount={totalCount}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  search={search}
                  statusFilter={statusFilter}
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
                  onViewCampaign={handleViewCampaign}
                  onRenameCampaign={handleRename}
                  onDeleteCampaign={(c) => setDeleteTarget(c)}
                />
              </CardContent>
            </Card>

            <CreateCampaignDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              onSuccess={fetchCampaigns}
            />
            <UploadCampaignCsvDialog
              open={csvOpen}
              onOpenChange={setCsvOpen}
              onSuccess={fetchCampaigns}
            />
            <RenameCampaignDialog
              campaign={renameTarget}
              onOpenChange={(o) => { if (!o) setRenameTarget(null); }}
              onSuccess={() => { setRenameTarget(null); void fetchCampaigns(); }}
            />
            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
              <AlertDialogContent className="bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void handleDeleteConfirm()} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </main>
    </RBACGuard>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><p className="text-muted-foreground">Loading...</p></div>}>
      <CampaignsPageInner />
    </Suspense>
  );
}
