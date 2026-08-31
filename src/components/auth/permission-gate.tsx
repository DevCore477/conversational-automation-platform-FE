"use client";

import { type ReactNode } from "react";

import { type Permission } from "@/common/constants/rbac.constant";
import { useRBAC } from "@/hooks/use-rbac";

interface PermissionGateProps {
  children: ReactNode;
  /**
   * Required permissions (user needs at least one)
   */
  permissions?: Permission[];
  /**
   * Require all permissions instead of any
   */
  requireAll?: boolean;
  /**
   * Require admin role
   */
  requireAdmin?: boolean;
  /**
   * Fallback to show when user doesn't have permission
   */
  fallback?: ReactNode;
}

/**
 * Permission Gate component to conditionally render content based on permissions
 * This is a lighter version of RBACGuard for inline permission checks
 *
 * Usage:
 * ```tsx
 * <PermissionGate requireAdmin>
 *   <Button>Admin Only Button</Button>
 * </PermissionGate>
 *
 * <PermissionGate permissions={[Permission.EDIT_SCRIPTS]}>
 *   <EditButton />
 * </PermissionGate>
 *
 * <PermissionGate
 *   permissions={[Permission.DELETE_CONTACT]}
 *   fallback={<span>You cannot delete contacts</span>}
 * >
 *   <DeleteButton />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  children,
  permissions,
  requireAll = false,
  requireAdmin = false,
  fallback = null,
}: PermissionGateProps) {
  const {
    isAdmin: userIsAdmin,
    hasAnyPermission,
    hasAllPermissions,
  } = useRBAC();

  // Check if user has access
  const hasAccess = (() => {
    // Check admin requirement
    if (requireAdmin && !userIsAdmin) {
      return false;
    }

    // Check permissions
    if (permissions && permissions.length > 0) {
      if (requireAll) {
        return hasAllPermissions(permissions);
      }
      return hasAnyPermission(permissions);
    }

    return true;
  })();

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Component to show content only to admins
 */
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate requireAdmin fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Component to show content only to members (non-admins)
 */
export function MemberOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isMember } = useRBAC();

  if (!isMember) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
