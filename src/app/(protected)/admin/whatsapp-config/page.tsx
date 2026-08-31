"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";

import { Table, type TableColumn, type TableAction } from "@/components/table";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { useCompanyStore } from "@/store/company.store";
import type { Company } from "@/types/company.types";

export default function AdminWhatsAppConfigPage() {
  const router = useRouter();
  const { allCompanies, fetchAllCompanies, isLoading } = useCompanyStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    void fetchAllCompanies();
  }, [fetchAllCompanies]);

  const handleRefresh = async () => {
    await fetchAllCompanies();
  };

  const handleViewConfig = (companyId: string) => {
    router.push(`/admin/whatsapp-config/${companyId}`);
  };

  const columns: TableColumn<Company>[] = [
    {
      key: "name",
      header: "Company Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="cursor-pointer font-medium">{item.name}</span>
          <span className="text-muted-foreground text-xs hidden lg:inline">({item.email || "—"})</span>
        </div>
      ),
    },
    {
      key: "adminName",
      header: "Admin",
      render: (item) => <span className="text-muted-foreground cursor-pointer">{item.adminName || "—"}</span>,
    },
    {
      key: "whatsappEnabled",
      header: "WhatsApp",
      render: (item) =>
        item.whatsapp?.enabled ? (
          <span className="text-success cursor-pointer font-medium">Enabled</span>
        ) : (
          <span className="text-danger-soft cursor-pointer font-medium">Disabled</span>
        ),
    },
    {
      key: "whatsappConfigured",
      header: "Meta Config",
      hideOnMobile: true,
      render: (item) =>
        item.whatsapp?.configured ? (
          <span className="text-cyan-blue cursor-pointer font-medium">Configured</span>
        ) : (
          <span className="text-muted-foreground cursor-pointer font-medium">Not Configured</span>
        ),
    },
    {
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      render: (item) => (
        <span className="text-muted-foreground cursor-pointer">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const getActions = (item: Company): TableAction<Company>[] => [
    {
      label: item.whatsapp?.configured ? "Edit Config" : "Add Config",
      onClick: () => handleViewConfig(item.id),
    },
  ];

  return (
    <RBACGuard requireAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          title="WhatsApp Configuration"
          description="Manage WhatsApp/Meta configuration for all companies"
        />

        <div className="border rounded-2xl p-4 lg:p-6 bg-sidebar">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1">
              <h3 className="lg:text-lg 4xl:text-xl font-medium text-text-dark dark:text-sidebar-accent-foreground">All Companies</h3>
              <span className="text-muted-foreground text-sm">(WhatsApp configuration status)</span>
            </div>
            <div className="flex justify-end">
            <RefreshButton onRefresh={handleRefresh} />
            </div>
          </div>
          <Table<Company>
            data={allCompanies}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No companies found."
            getRowKey={(item) => item.id}
            onRowClick={(item) => handleViewConfig(item.id)}
            getActions={getActions}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(r) => {
              setRowsPerPage(r);
              setPage(1);
            }}
            desktopGridClassName="md:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_0.5fr]"
          />
        </div>
      </main>
    </RBACGuard>
  );
}
