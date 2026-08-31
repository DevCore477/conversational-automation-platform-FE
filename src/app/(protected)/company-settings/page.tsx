import { Metadata } from "next";

import {
  getCompanyData,
  getCompanyById,
  getCompanyUsersAdmin,
  getCurrentUser,
} from "@/lib/data";
import { isGlobalPlatformAdmin } from "@/lib/rbac.utils";
import type { CompanyStats } from "@/types/company.types";
import { CompanySettingsPageClient } from "./components/company-settings-page-client";

export const metadata: Metadata = {
  title: "Company Settings | Hexa AI",
  description: "Manage your company information and team members",
};

export const dynamic = "force-dynamic";

interface CompanySettingsPageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function CompanySettingsPage({
  searchParams,
}: CompanySettingsPageProps) {
  const params = await searchParams;
  const companyIdFromUrl = params.companyId ?? null;

  const currentUser = await getCurrentUser();

  /** Only true-global admins (no `companyId`). Company org admins also have role `admin`. */
  const isPlatformAdmin = isGlobalPlatformAdmin(currentUser);

  // Only tenant users (platform role `member`) use `/companies/me`.
  let companyData = null;
  if (!isPlatformAdmin) {
    companyData = await getCompanyData().catch(() => null);
  }

  // When companyId is in URL (e.g. super admin from All Companies), fetch that company via admin APIs.
  // Backend returns 403 if caller is not allowed; then we don't set adminCompanyData.
  let adminCompanyData: {
    company: Awaited<ReturnType<typeof getCompanyById>>;
    users: Awaited<ReturnType<typeof getCompanyUsersAdmin>>;
    stats: CompanyStats | null;
  } | null = null;
  if (!companyData && companyIdFromUrl) {
    try {
      const [company, users] = await Promise.all([
        getCompanyById(companyIdFromUrl),
        getCompanyUsersAdmin(companyIdFromUrl),
      ]);
      adminCompanyData = {
        company,
        users,
        stats: {
          totalUsers: company.totalUsers ?? 0,
          totalCalls: company.totalCalls ?? 0,
          totalScripts: 0,
          totalAPIKeys: 0,
          activeAPIKeys: 0,
        },
      };
    } catch {
      // 403/404 - don't leak; fall through to same error as others
    }
  }

  const hasAccess =
    Boolean(companyData) ||
    Boolean(adminCompanyData) ||
    isPlatformAdmin;

  if (!hasAccess) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No Company Found</h2>
          <p className="text-muted-foreground mt-2">
            You need to be part of a company to access this page.
          </p>
        </div>
      </div>
    );
  }

  const initialCompany =
    companyData?.company ?? adminCompanyData?.company ?? null;
  const initialUsers = companyData?.users ??
    adminCompanyData?.users ?? {
      users: [],
      pendingInvitations: [],
    };
  const initialStats = companyData?.stats ?? adminCompanyData?.stats ?? null;

  return (
    <CompanySettingsPageClient
      initialCompany={initialCompany}
      initialUsers={initialUsers}
      initialStats={initialStats}
      initialSelectedCompanyId={companyIdFromUrl}
    />
  );
}
