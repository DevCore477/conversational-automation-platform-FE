"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCompanyDialog } from "@/app/(protected)/admin/companies/components/create-company-form";
import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { type Company } from "@/types/company.types";
import { CompaniesTable } from "./companies-table";
import GifButton from "@/components/GifButton";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";

interface AdminCompaniesPageClientProps {
  initialCompanies: Company[];
}

export function AdminCompaniesPageClient({
  initialCompanies,
}: AdminCompaniesPageClientProps) {
  const { user: currentUser } = useAuthStore();
  const { allCompanies, fetchAllCompanies, isLoading: isLoadingCompanies } = useCompanyStore();
  const isAdmin = ["admin"].includes(currentUser?.role || "");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const router = useRouter();

  useEffect(() => {
    if (allCompanies.length > 0) {
      setCompanies(allCompanies);
    }
  }, [allCompanies]);

  const handleRefresh = async () => {
    await fetchAllCompanies();
  };

  const handleCreateCompany = () => {
    router.push("/admin/companies/create-company");
  };

  const handleCreateSuccess = async () => {
    await fetchAllCompanies();
  };

  return (
    <RBACGuard requireAdmin route="/admin/companies" redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          title="All Companies"
          description="Platform admin view - Manage all companies in the system"
          action={
            <div className="flex items-center gap-2">
              {isAdmin && (
                <GifButton label="Create Company" onClick={handleCreateCompany} />
              )}
            </div>
          }
        />

        <div className="border rounded-2xl p-4 lg:p-6 bg-sidebar">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-1">
              <h3 className="lg:text-lg font-medium text-text-dark dark:text-sidebar-accent-foreground">Companies</h3>
              <span className="text-muted-foreground text-sm">(View and manage all companies in the platform)</span>
            </div>
            <div className="flex justify-end">
            <RefreshButton onRefresh={handleRefresh} />
            </div>
          </div>
          <CompaniesTable
            companies={companies || []}
            isLoading={isLoadingCompanies}
            onRefresh={handleRefresh}
          />
        </div>

        {isAdmin && (
          <CreateCompanyDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            companyId={currentUser?.companyId}
            onSuccess={handleCreateSuccess}
          />
        )}
      </main>
    </RBACGuard>
  );
}
