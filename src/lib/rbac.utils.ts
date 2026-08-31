import {
  type Permission,
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
  ADMIN_ONLY_ROUTES,
} from "@/common/constants/rbac.constant";
import { UserRole } from "@/common/enums/user.types";

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (!role) {
    return false;
  }
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) || false;
}

/**
 * Check if a role has any of the required permissions
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[],
): boolean {
  if (!role || !permissions?.length) {
    return false;
  }
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the required permissions
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  if (!role || !permissions?.length) {
    return false;
  }
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  if (!role) {
    return false;
  }

  // Check if it's an admin-only route
  if (ADMIN_ONLY_ROUTES.some((adminRoute) => route.startsWith(adminRoute))) {
    return role === UserRole.ADMIN;
  }

  // Check route-specific permissions
  const requiredPermissions = getRoutePermissions(route);
  if (requiredPermissions.length === 0) {
    // No specific permissions required, allow if authenticated
    return true;
  }

  return hasAnyPermission(role, requiredPermissions);
}

/**
 * Get required permissions for a route
 */
export function getRoutePermissions(route: string): Permission[] {
  // Find the most specific matching route
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find((routeKey) =>
    route.startsWith(routeKey),
  );

  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute];
  }

  return [];
}

/**
 * Check if a user is an admin
 */
export function isAdmin(role?: string | null): boolean {
  return role === UserRole.ADMIN;
}

/**
 * Hexa **platform** admin: `role` is admin and there is **no** tenant (`companyId`).
 * Company organization admins also use `role: admin` but always have a `companyId`;
 * they must not be treated as global platform admins (e.g. must use `/companies/me/*`).
 */
export function isGlobalPlatformAdmin(user: {
  role?: string | null;
  companyId?: string | null;
} | null | undefined): boolean {
  if (!user?.role || user.role !== UserRole.ADMIN) {
    return false;
  }
  const cid = user.companyId;
  return cid === undefined || cid === null || String(cid).trim() === "";
}

/**
 * Check if a user is a team member
 */
export function isMember(role?: string | null): boolean {
  return role === UserRole.USER;
}

/**
 * Check if a user is a company user (either admin or member)
 */
export function isCompanyUser(companyId?: string | null): boolean {
  return companyId !== null && companyId !== undefined;
}

/**
 * Check if a user is a company admin
 */
export function isCompanyAdmin(companyRole?: string | null): boolean {
  return companyRole === "admin" || companyRole === "owner";
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Filter menu items based on user role and permissions
 */
export function filterMenuItemsByRole<T extends { url: string }>(
  items: T[],
  role: UserRole,
): T[] {
  return items.filter((item) => canAccessRoute(role, item.url));
}
