"use client";

import { CircleCheck, CircleX, Key, } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { RBACGuard } from "@/components/auth";
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/stat-card";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { type ApiKey, type ApiKeyStats } from "@/types/api-key.types";
import { ApiKeysTable } from "./api-keys-table";
import { CreateApiKeyDialog } from "./create-api-key-dialog";
import { getApiKeys, getApiKeyStats } from "../actions";
import { DBSettingIcn } from "@/assets/icons/Icons";
import GifButton from "@/components/GifButton";
import RefreshButton from "../../dashboard/components/RefreshButton";
import { useRouter } from "next/navigation";

interface ApiKeysPageClientProps {
  initialApiKeys: ApiKey[];
  initialStats: ApiKeyStats;
}

/**
 * API Keys Page Client Component
 *
 * Handles all interactive features:
 * - Data refreshing
 * - Create dialog
 * - RBAC protection
 */
export function ApiKeysPageClient({
  initialApiKeys,
  initialStats,
}: ApiKeysPageClientProps) {
  const { user: currentUser } = useAuthStore();
  const { theme, fetchTheme } = useThemeStore();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [stats, setStats] = useState<ApiKeyStats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  const isOwnerOrAdmin = ["owner", "admin"].includes(
    currentUser?.companyRole || "",
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [apiKeysResult, statsResult] = await Promise.all([
        getApiKeys(),
        getApiKeyStats(),
      ]);
      if (apiKeysResult.success && apiKeysResult.data) {
        setApiKeys(apiKeysResult.data);
      }
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    await loadData();
    toast.success("Data refreshed");
  };

  const handleCreateSuccess = () => {
    loadData();
  };

  const handleCreateClick = () => {
    router.push("/api-keys/create-api-key");
  };
  return (
    <RBACGuard requireCompanyAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          title="API Keys"
          description="Manage your API keys for programmatic access"
          action={
            <div className="flex gap-2">
              {isOwnerOrAdmin && (
                <GifButton label="Create API Key" onClick={handleCreateClick} />
              )}
            </div>
          }
        />

        {/* Stats Cards */}
        <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Keys"
            value={stats?.total || 0}
            icon={<Key className="size-5 text-[#0EA5E9] rotate-90" />}
            variant="default"
            showWave
            waveColor={theme?.primaryColor}
          />

          <StatCard
            title="Active Keys"
            value={stats?.active || 0}
            icon={<CircleCheck className="size-5 text-[#6BBE66]" />}
            variant="success"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Total Usage"
            value={stats?.totalUsage || stats?.totalRequests || 0}
            icon={<DBSettingIcn className="size-5 text-warning" />}
            variant="info"
            showWave
            waveColor={theme?.primaryColor}
          />
          <StatCard
            title="Expired / Revoked"
            value={stats?.inactive || 0}
            icon={<CircleX className="size-5 text-danger-soft" />}
            variant="danger"
            showWave
            waveColor={theme?.primaryColor}
          />
        </div>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
              <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                <CardTitle className="text-lg text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
                  Your API Keys
                </CardTitle>
                <span className="text-[14px] text-[#666666]">
                  (Manage and monitor your API keys. Keep them secure and never share
                  them publicly.)
                </span>
              </div>
              <div className="flex justify-end">
               <RefreshButton onRefresh={handleRefresh}/>
               </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isOwnerOrAdmin && (
              <div className="mb-4 p-4 bg-muted rounded-md text-sm text-muted-foreground">
                You don&apos;t have permission to create or manage API keys.
                Contact your company owner or admin.
              </div>
            )}
            <ApiKeysTable
              apiKeys={apiKeys}
              isLoading={isLoading}
              onRefresh={loadData}
            />
          </CardContent>
        </Card>

        {/* Create API Key Dialog */}
        {/* {isOwnerOrAdmin && (
          <CreateApiKeyDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={handleCreateSuccess}
          />
        )} */}
      </main>
    </RBACGuard>
  );
}
