/**
 * Appends `companyId` as a query param for routes that need tenant scope
 * (e.g. platform admins without `/companies/me`).
 */
export function withCompanyScope(
  path: string,
  companyId?: string | null,
): string {
  if (!companyId) {
    return path;
  }
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}companyId=${encodeURIComponent(companyId)}`;
}
