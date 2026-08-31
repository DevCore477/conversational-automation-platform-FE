"use client";

import { useMemo } from "react";

import {
  type Permission,
  COMPANY_ADMIN_PERMISSIONS,
} from "@/common/constants/rbac.constant";
import { type UserRole } from "@/common/enums/user.types";
import {
  isAdmin,
  isMember,
  getRolePermissions,
  getRoutePermissions,
  isCompanyUser,
  isCompanyAdmin,
} from "@/lib/rbac.utils";
import { useAuthStore } from "@/store/auth.store";

/**
 * Hook to access RBAC functionality
 */
export function useRBAC() {
  const { user, whatsappConfig } = useAuthStore();
  const userRole = (user?.role as UserRole) || null;
  const isCompanyAdminRole = isCompanyAdmin(user?.companyRole);

  const isWhatsappEnabled = !!(whatsappConfig?.configured && whatsappConfig?.enabled);

  // Merge base role permissions with company admin extras
  const effectivePermissions = useMemo(() => {
    const base = userRole ? getRolePermissions(userRole) : [];
    if (isCompanyAdminRole) {
      return [...new Set([...base, ...COMPANY_ADMIN_PERMISSIONS])];
    }
    return base;
  }, [userRole, isCompanyAdminRole]);

  const rbac = useMemo(() => {
    return {
      // User info
      user,
      role: userRole,
      isAuthenticated: !!user,
      // Role checks
      isAdmin: isAdmin(userRole),
      isMember: isMember(userRole),
      isCompanyUser: isCompanyUser(user?.companyId),
      isCompanyAdmin: isCompanyAdminRole,

      // WhatsApp
      isWhatsappEnabled,

      // Permission checks
      hasPermission: (permission: Permission) =>
        effectivePermissions.includes(permission),

      hasAnyPermission: (permissions: Permission[]) =>
        permissions.some((p) => effectivePermissions.includes(p)),

      hasAllPermissions: (permissions: Permission[]) =>
        permissions.every((p) => effectivePermissions.includes(p)),

      // Route access
      canAccessRoute: (route: string) => {
        const requiredPermissions = getRoutePermissions(route);
        if (requiredPermissions.length === 0) return true;
        return requiredPermissions.some((p) =>
          effectivePermissions.includes(p),
        );
      },

      // Get all permissions
      permissions: effectivePermissions,
    };
  }, [user, userRole, isCompanyAdminRole, effectivePermissions, isWhatsappEnabled]);

  return rbac;
}

/**
 * Hook to check if user has specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const { hasPermission: checkPermission } = useRBAC();
  return checkPermission(permission);
}

/**
 * Hook to check if user can access a route
 */
export function useCanAccessRoute(route: string): boolean {
  const { canAccessRoute: checkRoute } = useRBAC();
  return checkRoute(route);
}

/**
 * Hook to get all user permissions
 */
export function useUserPermissions(): Permission[] {
  const { permissions } = useRBAC();
  return permissions;
}
