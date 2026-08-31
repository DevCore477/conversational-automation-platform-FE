"use client";

import { Shield, ShieldCheck, Trash2, Crown, X, RotateCcw, Copy, UserCog, MoreVertical,} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { useRBAC } from "@/hooks/use-rbac";
import { type CompanyUser, type PendingInvitation, } from "@/types/company.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeStore } from "@/store/theme.store";


interface CompanyUsersTableProps {
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
  isLoading?: boolean;
  companyId?: string;
  onRefresh?: () => Promise<void>;
}

const bgColors = ["bg-warning", "bg-[#6BBE66]", "bg-[#0EA5E9]"];

export function CompanyUsersTable({
  users,
  pendingInvitations,
  isLoading,
  companyId,
  onRefresh,
}: CompanyUsersTableProps) {
  const { theme, fetchTheme } = useThemeStore();
  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [selectedInvitation, setSelectedInvitation] =
    useState<PendingInvitation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelInviteDialog, setShowCancelInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<string>("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", });
  const {
    removeUser,
    updateUserRole,
    updateUser,
    removeUserFromCompany,
    updateUserRoleInCompany,
    updateUserInCompany,
    removeInvitationFromCompany,
    removeInvitation,
    resendInvitation,
    resendInvitationFromCompany,
  } = useCompanyStore();
  const { user: currentUser } = useAuthStore();
  const { isAdmin: isPlatformAdmin, isCompanyUser } = useRBAC();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemoveUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      if (companyId) {
        await removeUserFromCompany(companyId, selectedUser.id);
      } else {
        await removeUser(selectedUser.id);
      }
      toast.success("User removed successfully");
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to remove user"));
    }
  };

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) {
      return;
    }

    try {
      if (companyId) {
        await removeInvitationFromCompany(companyId, selectedInvitation.id);
      } else {
        await removeInvitation(selectedInvitation.id);
      }
      toast.success("Invitation cancelled successfully");
      setShowCancelInviteDialog(false);
      setSelectedInvitation(null);
      setSelectedUser(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel invitation"));
    }
  };

  const handleResendInvitation = async (invitation: PendingInvitation) => {
    try {
      if (companyId) {
        await resendInvitationFromCompany(companyId, invitation.id);
      } else {
        await resendInvitation(invitation.id);
      }
      toast.success("Invitation resent successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend invitation"));
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) {
      return;
    }
    setIsUpdating(true);

    try {
      const payload: {
        companyRole: "owner" | "admin" | "member";
        firstName?: string;
        lastName?: string;
      } = {
        companyRole: newRole as "owner" | "admin" | "member",
      };

      if (formData.firstName !== selectedUser.firstName) {
        payload.firstName = formData.firstName;
      }
      if (formData.lastName !== selectedUser.lastName) {
        payload.lastName = formData.lastName;
      }

      if (companyId) {
        await updateUserInCompany(companyId, selectedUser.id, payload);
      } else {
        await updateUser(selectedUser.id, payload);
      }
      toast.success("User updated successfully");
      setShowRoleDialog(false);
      setSelectedUser(null);
      setNewRole("");
      setFormData({ firstName: "", lastName: "" });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update user"));
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "outline";
      case "admin":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return Crown;
      case "admin":
        return ShieldCheck;
      default:
        return Shield;
    }
  };

  const canManageUser = (targetUser: CompanyUser) => {
    if (!currentUser) {
      return false;
    }

    // Platform super admins can manage all users
    if (isPlatformAdmin && !isCompanyUser) {
      return true;
    }

    // Can't manage yourself
    if (currentUser.id === targetUser.id) {
      return false;
    }

    // Only owners and admins can manage users
    if (!["owner", "admin"].includes(currentUser.companyRole || "")) {
      return false;
    }

    // Admins can't manage owners
    if (
      currentUser.companyRole === "admin" &&
      targetUser.companyRole === "owner"
    ) {
      return false;
    }

    return true;
  };

  const canManageInvitations = () => {
    if (!currentUser) {
      return false;
    }
    // Platform super admins can manage invitations
    if (isPlatformAdmin && !isCompanyUser) {
      return true;
    }
    // Only owners and admins can manage invitations
    return ["owner", "admin"].includes(currentUser.companyRole || "");
  };

  const isInvitationExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const hasNoData =
    (!users || users.length === 0) &&
    (!pendingInvitations || pendingInvitations.length === 0);

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No users found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start building your team by adding users to your company.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-80 no-scrollbar overflow-auto">
        <div className="space-y-6 w-auto">
          {users.map((user, index) => {
          const RoleIcon = getRoleIcon(user.companyRole);
          const canManage = canManageUser(user);
          const bgColor = bgColors[index % bgColors.length];

          return(
            <div
              key={user.id}
              className="flex items-center justify-evenly gap-2 md:gap-4 p-2 sm:p-4 pr-0 rounded-2xl border border-[#F0F0F0] bg-[#662d91]/3 transition-colors"
            >
              {/* Vertical line */}
              <div className={`w-[4px] h-12 rounded-2xl ${bgColor}`}></div>
              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm md:text-base text-sidebar-accent dark:text-sidebar-accent-foreground font-medium">
                      {user.firstName} {user.lastName}
                    </h4>
                  </div>                    
                  <div className="flex items-center gap-2 w-fit opacity-70 border py-1 px-2 rounded-md bg-sidebar">
                    <RoleIcon
                      className={`size-4 ${
                        user.companyRole === "admin"
                          ? "text-success" : user.companyRole === "owner"
                          ? "text-warning" : "text-syan-blue"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {user.companyRole.charAt(0).toUpperCase() + user.companyRole.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-wrap lg:flex-nowrap sm:flex-row sm:gap-2 items-cente justify-between gap-2 text-sm lg:text-base text-muted-foreground">
                  <span className="text-sm wrap-break-word w-full max-w-40 xs:max-w-60 lg:max-w- sm:max-w-full">{user.email}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <span>Status:</span>
                    <span className={ user.isActive === false ? "text-danger-soft" : "text-success"}>
                      {user.isActive === false ? " Inactive" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {canManage && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                            onClick={async () => {
                              const ok = await copyToClipboard(user.email);
                              if (ok) {
                                toast.success("Email copied to clipboard");
                              } else {
                                toast.error(
                                  "Unable to copy email to clipboard",
                                );
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            Copy email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.companyRole);
                              setFormData({
                                firstName: user.firstName,
                                lastName: user.lastName,
                              });
                              setShowRoleDialog(true);
                            }}
                          >
                            <UserCog className="h-4 w-4" />
                            Update user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )
          })}
        </div>
        <div className="space-y-6 mt-6">
          {pendingInvitations.map((invitation, index) => {
            const RoleIcon = getRoleIcon(invitation.companyRole);
            const expired = isInvitationExpired(invitation.expiresAt);
            const canManage = canManageInvitations();
            const bgColor = bgColors[index % bgColors.length];

          return(
            <div
              key={invitation.id}
              className="flex items-center justify-evenly gap-2 md:gap-4 p-2 sm:p-4 pr-0 rounded-2xl border border-[#F0F0F0] bg-[#662d91]/3 transition-colors"
            >
              {/* Vertical line */}
              <div className={`w-[4px] h-12 rounded-2xl ${bgColor}`}></div>
              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-col xs:flex-row gap-1 sm:items-center justify-between">
                  <h4 className="text-muted-foreground italic dark:text-sidebar-accent-foreground font-medium">
                    Pending Invitation
                  </h4>
                                        
                  <div className="flex items-center gap-2 w-fit opacity-70">
                    <RoleIcon
                      className={`size-4 ${
                        invitation.companyRole === "admin"
                          ? "text-success" : invitation.companyRole === "owner"
                          ? "text-warning" : "text-cyan-blue"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {invitation.companyRole.charAt(0).toUpperCase() + invitation.companyRole.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1 sm:items-center justify-between sm:gap-4 text-sm lg:text-base text-muted-foreground">
                  <span className="text-sm">{invitation.email}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <span>Status:</span> <span className="text-warning">{expired ? "Expired" : "Pending"}</span> 
                  </div>
                </div>
              </div>
              <div>
                {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-6 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              const ok = await copyToClipboard(
                                invitation.email,
                              );
                              if (ok) {
                                toast.success("Email copied to clipboard");
                              } else {
                                toast.error(
                                  "Unable to copy email to clipboard",
                                );
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            Copy email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleResendInvitation(invitation)}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Resend invitation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedInvitation(invitation);
                              setShowCancelInviteDialog(true);
                            }}
                          >
                            <X className="h-4 w-4" />
                            Cancel invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                )}
              </div>
            </div>
          )
          })}
        </div>
      </div >
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader className="text-start">
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>{" "}
              from your company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveUser}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Invitation Dialog */}
      <Dialog
        open={showCancelInviteDialog}
        onOpenChange={setShowCancelInviteDialog}
      >
        <DialogContent>
          <DialogHeader className="text-start">
            <DialogTitle>Cancel Invitation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the invitation sent to{" "}
              <span className="font-semibold">{selectedInvitation?.email}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelInviteDialog(false);
                setSelectedInvitation(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancelInvitation}>
              Cancel Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent preventAutoFocus>
          <DialogHeader className="text-start">
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Update user information for{" "}
              <span className="font-semibold">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={selectedUser?.email ?? ""}
                disabled
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Company Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser?.companyRole === "owner" && (
                    <SelectItem value="owner">Owner</SelectItem>
                  )}
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className='rounded-full'
              onClick={() => {
                setShowRoleDialog(false);
                setSelectedUser(null);
                setNewRole("");
                setFormData({ firstName: "", lastName: "" });
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} 
              showWave waveColor={theme?.primaryColor}
              className='rounded-full'  
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
