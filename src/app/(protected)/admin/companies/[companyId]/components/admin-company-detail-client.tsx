"use client";

import {
  ArrowLeft,
  Building2,
  Users,
  RefreshCw,
  UserPlus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RBACGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import {
  type Company,
  type CompanyUser,
  type PendingInvitation,
} from "@/types/company.types";

import { AddUserForm } from "@/app/(protected)/company-settings/components/add-user-form";
import { CompanyUsersTable } from "@/app/(protected)/company-settings/components/company-users-table";
import { addUserToCompanyAdmin } from "../../actions";
import { companyService } from "@/service/company.service";
import { useCompanyStore } from "@/store/company.store";
import { useRouter } from "next/navigation";

interface AdminCompanyDetailPageClientProps {
  companyId: string;
  initialCompany: Company;
  initialUsers: {
    users: CompanyUser[];
    pendingInvitations: PendingInvitation[];
  };
}

export function AdminCompanyDetailPageClient({
  companyId,
  initialCompany,
  initialUsers,
}: AdminCompanyDetailPageClientProps) {
  const company = initialCompany;
  const [users, setUsers] = useState(initialUsers.users);
  const [pendingInvitations, setPendingInvitations] = useState(
    initialUsers.pendingInvitations,
  );
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const { fetchCompanyUsers } = useCompanyStore.getState();
      const usersData = await fetchCompanyUsers(companyId);
      setUsers(usersData.users);
      setPendingInvitations(usersData.pendingInvitations);
    } catch (error) {
      toast.error("Failed to refresh users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (data: {
    email: string;
    companyRole: string;
    sendInviteEmail: boolean;
  }) => {
    try {
      setIsLoading(true);
      const result = await addUserToCompanyAdmin(companyId, {
        email: data.email,
        companyRole: data.companyRole as "owner" | "admin" | "member",
        sendInviteEmail: data.sendInviteEmail,
      });

      if (result.success) {
        toast.success("User added successfully");
        setShowAddUserDialog(false);
        await handleRefresh();
      } else {
        throw new Error(result.error || "Failed to add user");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add user",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RBACGuard requireAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/admin/companies")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <PageHeader
              title={company?.name || "Loading..."}
              description={`Company ID: ${companyId}`}
              action={
                <div className="flex items-center gap-2">
                  {company?.isActive !== false ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          await companyService.admin.deactivate(companyId);
                          toast.success("Company deactivated");
                          window.location.reload();
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Failed to deactivate",
                          );
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          await companyService.admin.activate(companyId);
                          toast.success("Company activated");
                          window.location.reload();
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Failed to activate",
                          );
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Activate
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {company && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Name
                  </span>
                  <div className="text-sm mt-1">{company.name}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Slug
                  </span>
                  <div className="text-sm mt-1">
                    <code className="bg-muted px-2 py-1 rounded">
                      {company.slug}
                    </code>
                  </div>
                </div>
                {company.description && (
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Description
                    </span>
                    <div className="text-sm mt-1">{company.description}</div>
                  </div>
                )}
                {company.website && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Website
                    </span>
                    <div className="text-sm mt-1">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
                {company.industry && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Industry
                    </span>
                    <div className="text-sm mt-1">{company.industry}</div>
                  </div>
                )}
                {company.size && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Size
                    </span>
                    <div className="text-sm mt-1">{company.size}</div>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <div className="text-sm mt-1">
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Company Users
                </CardTitle>
                <CardDescription>Manage users in this company</CardDescription>
              </div>
              <Button onClick={() => setShowAddUserDialog(true)}>
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CompanyUsersTable
              users={users}
              pendingInvitations={pendingInvitations}
              isLoading={isLoading}
              companyId={companyId}
              onRefresh={handleRefresh}
            />
          </CardContent>
        </Card>

        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent className="max-w-md">
            <AddUserForm
              onSubmit={handleAddUser}
              onCancel={() => setShowAddUserDialog(false)}
              isOwner={false}
            />
          </DialogContent>
        </Dialog>
      </main>
    </RBACGuard>
  );
}
