"use client";

import { Building2, Search,} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { CompanyThemeForm } from "@/app/(protected)/company-settings/components/company-theme-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { useRBAC } from "@/hooks/use-rbac";
import {
  type AddUserToCompanyDto,
  type Company,
  type CompanyStats,
  type CompanyUser,
  type PendingInvitation,
} from "@/types/company.types";

import { AddUserForm } from "./add-user-form";
import { CompanyInfoForm } from "./company-info-form";
import { CompanyUsersTable } from "./company-users-table";
import { addUserToCompany } from "../actions";
import { addUserToCompanyAdmin, updateUserRoleAdmin, removeUserFromCompanyAdmin,} from "@/app/(protected)/admin/companies/actions";
import { StatCard } from "@/components/stat-card";
import { ApiKeyIcn, CallIcn, PersonIcn, ScriptIcn } from "@/assets/icons/Icons";
import { useThemeStore } from "@/store/theme.store";
import GifButton from "@/components/GifButton";
import { SuperAdminCompanyScopePicker } from "../../components/super-admin-company-scope";

interface CompanySettingsPageClientProps {
  initialCompany: Company | null;
  initialUsers: {
    users: CompanyUser[];
    pendingInvitations: PendingInvitation[];
  };
  initialStats: CompanyStats | null;
  /** When opened by super admin with ?companyId=, pre-select this company */
  initialSelectedCompanyId?: string | null;
}

export function CompanySettingsPageClient({
  initialCompany,
  initialUsers,
  initialStats,
  initialSelectedCompanyId,
}: CompanySettingsPageClientProps) {
  const { user: currentUser } = useAuthStore();
  const {
    setCompany,
    company: storeCompany,
    allCompanies,
    fetchAllCompanies,
    fetchCompanyById,
    fetchCompanyUsers,
  } = useCompanyStore();
  const { isAdmin: isPlatformAdmin, isCompanyUser } = useRBAC();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<CompanyUser[]>(initialUsers?.users ?? []);
  const [pendingInvitations, setPendingInvitations] = useState<
    PendingInvitation[]
  >(initialUsers?.pendingInvitations ?? []);
  const [stats, setStats] = useState<CompanyStats | null>(initialStats ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    initialSelectedCompanyId ?? null,
  );
  const [displayCompany, setDisplayCompany] = useState<Company | null>( initialCompany, );

  const isSuperAdmin = isPlatformAdmin && !isCompanyUser;

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllCompanies();
    }
  }, [isSuperAdmin, fetchAllCompanies]);

  useEffect(() => {
    setCompany(initialCompany);
  }, [initialCompany, setCompany]);

  // Handle companyId from query parameter (when navigated from All Companies)
  useEffect(() => {
    if (isSuperAdmin && allCompanies.length > 0) {
      const companyIdFromUrl = searchParams.get("companyId");
      if (companyIdFromUrl) {
        handleCompanySelect(companyIdFromUrl);
      }
    }
  }, [isSuperAdmin, allCompanies, searchParams]);

  const handleCompanySelect = async (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsLoading(true);
    try {
      const company = await fetchCompanyById(companyId);
      setDisplayCompany(company);
      setCompany(company);

      const usersData = await fetchCompanyUsers(companyId);
      setUsers(usersData.users);
      setPendingInvitations(usersData.pendingInvitations);
    } catch (error) {
      toast.error("Failed to load company data");
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnerOrAdmin = ["owner", "admin"].includes( currentUser?.companyRole || "",);
  const isOwner = currentUser?.companyRole === "owner";
  const canAddUser = isSuperAdmin || isOwnerOrAdmin;
  const canEditCompany = isSuperAdmin || isOwnerOrAdmin;
  const totalTemplates =
    (stats?.totalScripts ?? 0) +
    (stats?.totalFlows ?? 0) +
    (stats?.totalAgents ?? 0);

  const handleAddUser = async (data: AddUserToCompanyDto) => {
    try {
      let result;
      if (selectedCompanyId) {
        result = await addUserToCompanyAdmin(selectedCompanyId, data);
      } else {
        result = await addUserToCompany(data);
      }
      if (result.success) {
        toast.success("User added successfully");
        setShowAddUserDialog(false);
        await handleRefresh();
      } else {
        toast.error(result.error || "Failed to add user");
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  };

  const { theme, fetchTheme } = useThemeStore();

  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  const handleRefresh = async () => {
    if (selectedCompanyId) {
      await handleCompanySelect(selectedCompanyId);
    }
  };

  return (
    <main className="flex-1 space-y-6 p-4 lg:p-6">
      {/* Company Selector for Super Admins */}
      {isSuperAdmin && (
        <div className="bg-surface-soft-light p-[5px] border rounded-2xl">
          <Card className="grid grid-cols-1 md:grid-cols-7 justify-between items-center border-none">
          <CardHeader className="bg-sidebar md:col-span-4">
            <CardTitle className="text-base lg:text-lg">
              Select Company to Manage
            </CardTitle>
            <CardDescription>
              Choose a company to view and edit its settings
            </CardDescription>
          </CardHeader>
          <CardContent className="md:col-span-3">
            <Select
              value={selectedCompanyId || ""}
              onValueChange={(value) => handleCompanySelect(value)}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {allCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Show message if super admin hasn't selected a company */}
      {isSuperAdmin && !displayCompany && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Company</h3>
            <p className="text-sm text-muted-foreground text-center">
              Use the dropdown above to select a company you want to manage
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main content - show only if user has access or super admin has selected a company */}
      {(!isSuperAdmin || displayCompany) && (
        <>
          <PageHeader
            title="Company Settings"
            description={
              isSuperAdmin && displayCompany
                ? `Managing: ${displayCompany.name}`
                : "Manage your company information and team members"
            }
          />

          {/* Stats Cards */}
          {!isSuperAdmin && (
            <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={<PersonIcn className="size-5 text-success" />}
                variant="default"
                showWave
                waveColor={theme?.primaryColor}
              />
              <StatCard
                title="Total Calls"
                value={stats?.totalCalls || 0}
                icon={<CallIcn className="size-5 text-cyan-blue" />}
                variant="default"
                showWave
                waveColor={theme?.primaryColor}
              />
              <StatCard
                title=" Calls This Month"
                value={stats?.callsThisMonth || 0}
                icon={<ScriptIcn className="size-5 text-warning" />}
                variant="default"
                showWave
                waveColor={theme?.primaryColor}
              />
              <StatCard
                title="Active API Keys"
                value={stats?.activeAPIKeys || 0}
                icon={<ApiKeyIcn className="size-5 text-cyan-blue" />}
                variant="default"
                showWave
                waveColor={theme?.primaryColor}
              />
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* General Section */}
            <CardContent className="p-0 lg:px-0">
              <CompanyInfoForm 
                companyId={selectedCompanyId || undefined} 
                isDisabled={!canEditCompany}
              />
            </CardContent>
            {/* Users Section */}
            <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-center justify-between">
                <div>
                  <CardTitle>Company Users</CardTitle>
                  <CardDescription>
                    Manage users in your company
                  </CardDescription>
                </div>
                <div className="justify-end flex">
                {canAddUser && (
                  <GifButton label="Add User" className="max-w-36" onClick={() => setShowAddUserDialog(true)} />
                )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <CompanyUsersTable
                users={users}
                pendingInvitations={pendingInvitations}
                isLoading={isLoading}
                companyId={selectedCompanyId || undefined}
                onRefresh={handleRefresh}
              />
            </CardContent>
            </Card>
          </div>

          {/* Themes Section */}
          <div className="">
            {canEditCompany ? (
              <CompanyThemeForm companyId={selectedCompanyId || undefined} />
            ) : (
              <CompanyThemeForm isDisabled={true} />
            )}
          </div>

          {/* Add User Dialog */}
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader className="text-start">
                <DialogTitle>Add User to Company</DialogTitle>
                <DialogDescription>
                  Invite a user to join your company. They will receive an email
                  with instructions.
                </DialogDescription>
              </DialogHeader>
              <AddUserForm
                onSubmit={handleAddUser}
                onCancel={() => setShowAddUserDialog(false)}
                isOwner={isOwner}
                companyId={selectedCompanyId || undefined}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </main>
  );
}
