"use client";

import { formatDate } from "@/common/utils/date.utils";
import { Mail, Shield, ShieldCheck, Trash2, Copy, UserCog, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/common/enums/user.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { type TeamMember } from "@/types/team.types";
import { deleteTeamMember, updateMemberRole, updateTeamMember } from "../actions";
import { Table, type TableColumn, type TableAction } from "@/components/table";
import { useThemeStore } from "@/store/theme.store";

interface MembersTableProps {
  members: TeamMember[];
  isLoading?: boolean;
  onRefresh?: () => void;
  totalRows?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPerRowsChange?: (newPerPage: number, page: number) => void;
}

export function MembersTable({ 
  members, 
  isLoading, 
  onRefresh,
  totalRows = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onPerRowsChange,
}: MembersTableProps) {

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useThemeStore();

  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    setIsDeleting(true);
    try {
      const result = await deleteTeamMember(selectedMember.id);
      if (result.success) {
        toast.success("Team member removed successfully");
        setShowDeleteDialog(false);
        setSelectedMember(null);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to remove team member");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to remove team member"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleRole = async (member: TeamMember) => {
    const isCurrentlyAdmin = member.role === UserRole.ADMIN || member.role === "admin";
    const newRole = isCurrentlyAdmin ? "member" : "admin";

    setIsUpdatingRole(member.id);
    try {
      const result = await updateMemberRole(member.id, newRole);
      if (result.success) {
        toast.success(`Role updated to ${newRole === "admin" ? "Admin" : "Member"}`);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update role"));
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const getRoleIcon = (role: string) => {
    return role === UserRole.ADMIN || role === "admin" ? ShieldCheck : Shield;
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (data: { firstName: string; lastName: string; role: string; }) => {
    if (!selectedMember) return;

    setIsSaving(true);
    try {
      const result = await updateTeamMember(selectedMember.id, data);
      if (result.success) {
        toast.success("Member updated successfully");
        setShowEditDialog(false);
        setSelectedMember(null);
        onRefresh?.();
      } else {
        toast.error(result.error || "Failed to update member");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update member"));
    } finally {
      setIsSaving(false);
    }
  };

  const columns: TableColumn<TeamMember>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="truncate">{row.firstName} {row.lastName}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="truncate text-muted-foreground">{row.email}</span>
      ),
    },
    {
      key: "role",
      header: "Platform Role",
      render: (row) => {
        const RoleIcon = getRoleIcon(row.role);
        const isAdmin = row.role === UserRole.ADMIN || row.role === "admin";
        return (
          <div className="flex items-center gap-2">
            <RoleIcon className={`size-3 md:size-4 ${isAdmin ? "text-success" : "text-cyan-blue"}`} />
            {isAdmin ? "Admin" : "Member"}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={row.isActive === false ? "text-danger-soft" : "text-success"}>
          {row.isActive === false ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (row) => (
        <span className="truncate">{row.company?.name || "-"}</span>
      ),
    },
    {
      key: "companyRole",
      header: "Company Role",
      render: (row) =>
        row.companyRole ? row.companyRole.charAt(0).toUpperCase() + row.companyRole.slice(1) : "",
    },
    {
      key: "joinedDate",
      header: "Joined Date",
      render: (row) => (
        <span>{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  const getActions = (row: TeamMember): TableAction<TeamMember>[] => [
    {
      label: "Edit",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => handleEditMember(row),
    },
    {
      label: "Copy email",
      icon: <Copy className="h-4 w-4" />,
      onClick: async () => {
        const ok = await copyToClipboard(row.email);
        if (ok) {
          toast.success("Email copied to clipboard");
        } else {
          toast.error("Unable to copy email to clipboard");
        }
      },
    },
    {
      label: row.role === UserRole.ADMIN || row.role === "admin" ? "Change to Member" : "Change to Admin",
      icon: <UserCog className="h-4 w-4" />,
      onClick: () => handleToggleRole(row),
    },
    {
      label: "Remove member",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        setSelectedMember(row);
        setShowDeleteDialog(true);
      },
      variant: "destructive",
    },
  ];

  if (isLoading && members.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No team members found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start building your team by inviting members. Click the &quot;Invite
          Member&quot; button above to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table<TeamMember>
        data={members}
        columns={columns}
        isLoading={false}
        emptyMessage="No team members"
        getRowKey={(item) => item.id}
        getActions={getActions}
        desktopGridClassName="md:grid-cols-[1.5fr_1.5fr_1fr_0.8fr_1fr_0.8fr_0.8fr_0.5fr]"
        page={currentPage}
        rowsPerPage={itemsPerPage}
        totalCount={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerRowsChange ? (value) => onPerRowsChange(value, 1) : undefined}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-11/12 xs:max-w-[400px]" preventAutoFocus>
          <DialogHeader className="text-start">
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveEdit({
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                role: formData.get("role") as string,
              });
            }}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                defaultValue={selectedMember?.firstName}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                defaultValue={selectedMember?.lastName}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={selectedMember?.email ?? ""}
                readOnly
                disabled
                className="flex h-10 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground ring-offset-background"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue={selectedMember?.role}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedMember(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} showWave waveColor={theme?.primaryColor} className="rounded-full">
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will remove{" "}
              <span className="font-semibold">
                {selectedMember?.firstName} {selectedMember?.lastName}
              </span>{" "}
              from your team. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedMember(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMember}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
