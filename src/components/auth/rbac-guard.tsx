"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { type Permission } from "@/common/constants/rbac.constant";
import { Alert } from "@/components/ui/alert";
import { useRBAC } from "@/hooks/use-rbac";
import { useAuthStore } from "@/store/auth.store";

interface RBACGuardProps {
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
   * Route to check access for
   */
  route?: string;
  /**
   * Custom fallback component
   */
  fallback?: ReactNode;
  /**
   * Redirect to this path if access denied (instead of showing fallback)
   */
  redirectTo?: string;

  /**
   * Require user to be part of a company
   */
  requireCompanyUser?: boolean;
  /**
   * Require user to be a company admin
   */
  requireCompanyAdmin?: boolean;
}

/**
 * RBAC Guard component to protect pages or components based on permissions
 *
 * Usage:
 * ```tsx
 * <RBACGuard requireAdmin>
 *   <AdminOnlyContent />
 * </RBACGuard>
 *
 * <RBACGuard permissions={[Permission.EDIT_SCRIPTS]}>
 *   <ScriptEditor />
 * </RBACGuard>
 *
 * <RBACGuard route="/scripts" redirectTo="/dashboard">
 *   <ScriptsPage />
 * </RBACGuard>
 * ```
 */
export function RBACGuard({
  children,
  permissions,
  requireAll = false,
  requireAdmin = false,
  route,
  fallback,
  redirectTo,
  requireCompanyUser = false,
  requireCompanyAdmin = false,
}: RBACGuardProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isAdmin: userIsAdmin,
    hasAnyPermission,
    hasAllPermissions,
    isCompanyUser,
    isCompanyAdmin,
    canAccessRoute,
  } = useRBAC();

  // Track when the component has mounted on the client to avoid running
  // redirect logic during the very first render before auth has a chance
  // to rehydrate and load the current user.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has access
  const hasAccess = (() => {
    if (!isAuthenticated) {
      return false;
    }

    const isPlatformAdmin = userIsAdmin && !isCompanyUser;

    if (requireCompanyAdmin) {
      // Platform admins should not access company admin resources
      if (isPlatformAdmin) {
        return false;
      }

      return isCompanyAdmin;
    }

    if (
      (requireAdmin && userIsAdmin) ||
      (requireCompanyUser && isCompanyUser)
    ) {
      return true;
    }

    // Check route access
    if (route && !canAccessRoute(route)) {
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

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [
    hasAccess,
    redirectTo,
    router,
    route,
    requireAdmin,
    requireCompanyAdmin,
    requireCompanyUser,
    permissions,
    requireAll,
    isAuthenticated,
    userIsAdmin,
    isCompanyUser,
    isCompanyAdmin,
    mounted,
  ]);

  // While mounting, avoid rendering either the protected content or the
  // "Access Denied" fallback to prevent flicker.
  if (!mounted) {
    return null;
  }

  // If user doesn't have access
  if (!hasAccess) {
    // If redirectTo is specified, show nothing while redirecting
    if (redirectTo) {
      return null;
    }

    // Show custom fallback or default message
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-0 p-8">
        <Alert className="max-w-xs max-h-xs w-full h-full flex items-center px-2 py-1">
          <div className="space-y-2 w-full h-full flex flex-col justify-center items-center">
            <h3 className="font-semibold text-lg text-center">Access Denied</h3>
            <p className="text-sm text-muted-foreground text-center">
              You don&apos;t have permission to access this content. Please
              contact your administrator if you believe this is an error.
            </p>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Higher-order component for RBAC protection
 */
export function withRBACGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RBACGuardProps, "children">,
) {
  return function WrappedComponent(props: P) {
    return (
      <RBACGuard {...guardProps}>
        <Component {...props} />
      </RBACGuard>
    );
  };
}
