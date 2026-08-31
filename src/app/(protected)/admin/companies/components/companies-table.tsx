"use client";

import { format } from "date-fns";
import { useState } from "react";
import { Building2, Eye, Copy, ExternalLink, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";
import { Table, type TableColumn, type TableAction } from "@/components/table";
import { copyToClipboard } from "@/lib/clipboard";
import { companyService } from "@/service/company.service";
import { type Company } from "@/types/company.types";

interface CompaniesTableProps {
  companies: Company[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function CompaniesTable({ companies, isLoading, onRefresh }: CompaniesTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleViewCompany = (companyId: string) => {
    router.push(`/company-settings?companyId=${companyId}`);
  };

  const handleAction = async () => {
    if (!companyToDelete || !actionType) return;
    try {
      setIsDeleting(true);
      if (actionType === "deactivate") {
        await companyService.admin.deactivate(companyToDelete);
        toast.success("Company deactivated successfully");
      } else {
        await companyService.admin.activate(companyToDelete);
        toast.success("Company activated successfully");
      }
      setDeleteDialogOpen(false);
      onRefresh?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update company",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (
    companyId: string,
    type: "activate" | "deactivate",
  ) => {
    setCompanyToDelete(companyId);
    setActionType(type);
    setDeleteDialogOpen(true);
  };

  const columns: TableColumn<Company>[] = [
    {
      key: "name",
      header: "Company Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="cursor-pointer font-medium">{row.name}</span>
          {row.description && (
            <span className="text-muted-foreground text-xs hidden lg:inline">— {row.description}</span>
          )}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => <span className="text-muted-foreground cursor-pointer">{row.slug}</span>,
    },
    {
      key: "industry",
      header: "Industry",
      hideOnMobile: true,
      render: (row) => <span className="text-muted-foreground cursor-pointer">{row.industry || "—"}</span>,
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <span className={`cursor-pointer ${row.isActive ? "text-success" : "text-danger-soft"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-muted-foreground cursor-pointer">
          {row.createdAt ? format(new Date(row.createdAt), "MMM dd, yyyy") : "N/A"}
        </span>
      ),
    },
  ];

  const getActions = (row: Company): TableAction<Company>[] => [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => handleViewCompany(row.id),
    },
    {
      label: "Copy ID",
      icon: <Copy className="h-4 w-4" />,
      onClick: async () => {
        const ok = await copyToClipboard(row.id);
        if (ok) {
          toast.success("Company ID copied to clipboard");
        } else {
          toast.error("Unable to copy company ID to clipboard");
        }
      },
    },
    ...(row.website
      ? [
          {
            label: "Visit Website",
            icon: <ExternalLink className="h-4 w-4" />,
            onClick: () => window.open(row.website, "_blank"),
          } as TableAction<Company>,
        ]
      : []),
    {
      label: row.isActive !== false ? "Deactivate" : "Activate",
      icon: row.isActive !== false ? <Trash2 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />,
      onClick: () => openDeleteDialog(row.id, row.isActive !== false ? "deactivate" : "activate"),
      variant: row.isActive !== false ? "destructive" : "default",
    },
  ];

  return (
    <>
      <Table<Company>
        data={companies}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No companies found."
        getRowKey={(item) => item.id}
        onRowClick={(item) => handleViewCompany(item.id)}
        onPageChange={() => {}}
        onRowsPerPageChange={(r) => {
          setRowsPerPage(r);
          setPage(1);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={companies.length}
        getActions={getActions}
        desktopGridClassName="md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr]"
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-11/12 max-w-md">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">
              {actionType === "deactivate"
                ? "Deactivate Company"
                : "Activate Company"}
            </h3>
            {actionType === "deactivate" ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to deactivate this company? This will:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Disable all API keys for this company</li>
                  <li>Stop inbound call routing</li>
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to activate this company? This will
                restore API key access and inbound call routing.
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={
                  actionType === "deactivate" ? "destructive" : "default"
                }
                onClick={handleAction}
                disabled={isDeleting}
              >
                {isDeleting
                  ? actionType === "deactivate"
                    ? "Deactivating..."
                    : "Activating..."
                  : actionType === "deactivate"
                    ? "Deactivate"
                    : "Activate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
