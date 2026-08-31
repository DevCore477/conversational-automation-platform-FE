"use client";

import { FileText, CheckCircle2, PhoneIncoming, PhoneOutgoing, PhoneCall } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { SuperAdminCompanyScopePicker } from "@/app/(protected)/components/super-admin-company-scope";
import { RBACGuard } from "@/components/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { useThemeStore } from "@/store/theme.store";
import { type CallScript, type ScriptStats } from "@/types/script.types";
import { type Company } from "@/types/company.types";

import { CreateScriptDialog } from "./create-script-dialog";
import { ScriptsTable } from "./scripts-table";
import { EditScriptDialog } from "@/app/(protected)/scripts/components/edit-script-dialog";
import { ViewScriptDialog } from "@/app/(protected)/scripts/components/view-script-dialog";
import { getScriptsByCompanyId, getScripts, getScriptStatsAction } from "../actions";
import GifButton from "@/components/GifButton";
import RefreshButton from "../../dashboard/components/RefreshButton";
import Link from "next/link";
interface ScriptsPageClientProps {
  initialScripts: CallScript[];
  initialStats: ScriptStats;
  initialCompany: Company | null;
  superAdminMustPickCompany: boolean;
  companyId: string | null;
}

export function ScriptsPageClient({
  initialScripts,
  initialStats,
  initialCompany,
  superAdminMustPickCompany,
  companyId: initialCompanyId,
}: ScriptsPageClientProps) {
  const { theme, fetchTheme } = useThemeStore();
  const searchParams = useSearchParams();
  
  // Get companyId from URL params if available (for real-time updates)
  const urlCompanyId = searchParams.get("companyId");
  const effectiveCompanyId = urlCompanyId ?? initialCompanyId ?? initialCompany?.id ?? null;
  
  const [scripts, setScripts] = useState<CallScript[]>(initialScripts);
  const [stats, setStats] = useState<ScriptStats>(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState<CallScript | null>(null);
  
  // Track previous companyId to detect changes
  const prevCompanyIdRef = useRef(effectiveCompanyId);

  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (effectiveCompanyId) {
        const scriptsRes = await getScriptsByCompanyId(effectiveCompanyId);
        if (scriptsRes.success && scriptsRes.data) {
          const fetchedScripts = scriptsRes.data;
          setScripts(fetchedScripts);
          setStats({
            total: fetchedScripts.length,
            active: fetchedScripts.filter((s) => s.isActive).length,
            inactive: fetchedScripts.filter((s) => !s.isActive).length,
            byCallType: {
              inbound: fetchedScripts.filter((s) => s.callType === "inbound").length,
              outbound: fetchedScripts.filter((s) => s.callType === "outbound").length,
              both: fetchedScripts.filter((s) => s.callType === "both").length,
            },
            hasDefault: fetchedScripts.some((s) => s.isDefault),
          });
        }
      } else {
        const [scriptsRes, statsRes] = await Promise.all([
          getScripts(),
          getScriptStatsAction(),
        ]);
        if (scriptsRes.success && scriptsRes.data) setScripts(scriptsRes.data);
        if (statsRes.success && statsRes.data) setStats(statsRes.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, [effectiveCompanyId]);

  // Only fetch data when companyId changes
  useEffect(() => {
    // Skip if companyId hasn't changed
    if (prevCompanyIdRef.current === effectiveCompanyId) {
      return;
    }
    
    // Update ref and fetch data
    prevCompanyIdRef.current = effectiveCompanyId;
    loadData();
  }, [effectiveCompanyId, loadData]);

  const handleRefresh = async () => {
    await loadData();
    toast.success("Data refreshed");
  };

  const handleCreateSuccess = () => {
    loadData();
  };

  const handleEdit = (script: CallScript) => {
    setSelectedScript(script);
    setShowEditDialog(true);
  };

  const handleView = (script: CallScript) => {
    setSelectedScript(script);
    setShowViewDialog(true);
  };

  const handleViewDialogClose = (open: boolean) => {
    setShowViewDialog(open);
    if (!open) {
      setSelectedScript(null);
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    setShowEditDialog(open);
    if (!open) {
      setSelectedScript(null);
    }
  };

  const handleEditFromView = (script: CallScript) => {
    setSelectedScript(script);
    setShowViewDialog(false);
    setShowEditDialog(true);
  };

  if (superAdminMustPickCompany) {
    return (
      <RBACGuard route="/scripts" redirectTo="/dashboard">
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg lg:text-3xl font-medium text-text-dark dark:text-accent-foreground tracking-tight">
                Script Management
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Create and manage conversation scripts for your AI calls
              </p>
            </div>
          </div>
          <SuperAdminCompanyScopePicker
            scopePath="/scripts"
            title="Select a Company"
            description="Choose which company's scripts to view or edit."
          />
        </main>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard route="/scripts" redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div>
            <h1 className="text-lg lg:text-3xl font-medium text-text-dark dark:text-accent-foreground tracking-tight">
              Script Management
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Create and manage conversation scripts for your AI calls
            </p>
          </div>
          <div className="w-auto flex justify-end" >
            <GifButton label="Create Script" href={`/scripts/create-script${effectiveCompanyId ? `?companyId=${effectiveCompanyId}` : ''}`}/>
          </div>
        </div>

        {/* Super Admin Company Scope Picker */}
        <SuperAdminCompanyScopePicker
          scopePath="/scripts"
          title="Select a Company"
          description="Choose which company's scripts to view or edit."
        />
        
        {/* Stat Cards */}
        <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
          <StatCard
            title="Total Scripts"
            value={stats.total}
            icon={<FileText className="size-4 text-cyan-blue" />}
            variant="default"
            showWave
            waveColor={theme?.primaryColor}
          />

          <StatCard
            title="Active Scripts"
            value={stats.active}
            icon={<CheckCircle2 className="size-4 text-success" />}
            variant="success"
            showWave
            waveColor={theme?.primaryColor}
          />

          <StatCard
            title="Inbound"
            value={stats.byCallType.inbound}
            icon={<PhoneIncoming className="size-4 text-success" />}
            variant="success"
            showWave
            waveColor={theme?.primaryColor}
          />

          <StatCard
            title="Outbound"
            value={stats.byCallType.outbound}
            icon={<PhoneOutgoing className="size-4 text-warning" />}
            variant="info"
            showWave
            waveColor={theme?.primaryColor}
          />

          <StatCard
            title="Both"
            value={stats.byCallType.both}
            icon={<PhoneCall className="size-4 text-warning" />}
            variant="danger"
            showWave
            waveColor={theme?.primaryColor}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row lg:items-center gap-4 justify-between">
              <div className="lg:flex items-center gap-2">
                <CardTitle className="lg:text-lg 4xl:text-xl text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
                  Call Scripts
                </CardTitle>
                <span className="text-[14px] text-sidebar-accent dark:text-sidebar-accent-foreground">
                  (Manage all your conversation scripts)
                </span>
              </div>
              <div className="flex justify-end">
                <RefreshButton onRefresh={handleRefresh}/>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScriptsTable
              scripts={scripts}
              isLoading={isLoading}
              onEdit={handleEdit}
              onView={handleView}
              onRefresh={loadData}
            />
          </CardContent>
        </Card>

        <CreateScriptDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleCreateSuccess}
          companyId={effectiveCompanyId}
        />

        <EditScriptDialog
          open={showEditDialog}
          onOpenChange={handleEditDialogClose}
          script={selectedScript}
          onSuccess={loadData}
          companyId={effectiveCompanyId}
        />

        <ViewScriptDialog
          open={showViewDialog}
          onOpenChange={handleViewDialogClose}
          script={selectedScript}
          onEdit={handleEditFromView}
        />
      </main>
    </RBACGuard>
  );
}