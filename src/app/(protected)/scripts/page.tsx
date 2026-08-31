import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCompany, getCompanyById, getCurrentUser } from "@/lib/data";
import {
  decodeAuthTokenPayload,
  isPlatformAdminPayload,
} from "@/lib/server-auth-token";

import { type CallScript, type ScriptStats } from "@/types/script.types";
import { ScriptsPageClient } from "./components/scripts-page-client";
import { getScripts, getScriptsByCompanyId } from "./actions";

export const metadata: Metadata = {
  title: "Script Management | Hexa AI",
  description: "Create and manage conversation scripts for your AI calls",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ScriptsPageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function ScriptsPage({ searchParams }: ScriptsPageProps) {
  const params = await searchParams;
  const companyIdFromUrl = params.companyId ?? null;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const jwtPayload = token ? decodeAuthTokenPayload(token) : null;

  const hasCompanyContext =
    isPlatformAdminPayload(jwtPayload) || !!jwtPayload?.companyId;

  if (!hasCompanyContext) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();
  const isPlatformAdmin =
    isPlatformAdminPayload(jwtPayload) ||
    (currentUser?.role === "admin" &&
      (!currentUser?.companyId || currentUser.companyId === ""));

  let company = null;
  if (isPlatformAdmin) {
    if (companyIdFromUrl) {
      try {
        company = await getCompanyById(companyIdFromUrl);
      } catch {
        company = null;
      }
    }
  } else {
    try {
      company = await getCompany();
    } catch (error) {
      console.error("[ScriptsPage] Failed to fetch company:", error);
    }
  }

  // For platform admins, use companyIdFromUrl directly; for company users, use company.id
  const effectiveCompanyId = isPlatformAdmin
    ? companyIdFromUrl
    : (company?.id ?? null);

  let scripts: CallScript[] = [];
  let stats = {
    total: 0,
    active: 0,
    inactive: 0,
    byCallType: { inbound: 0, outbound: 0, both: 0 },
    hasDefault: false,
  };

  if (effectiveCompanyId) {
    try {
      const scriptsRes = await getScriptsByCompanyId(effectiveCompanyId);
      if (scriptsRes.success && scriptsRes.data) {
        scripts = scriptsRes.data;

        // Calculate stats only from this company's scripts
        stats = {
          total: scripts.length,
          active: scripts.filter((s) => s.isActive).length,
          inactive: scripts.filter((s) => !s.isActive).length,
          byCallType: {
            inbound: scripts.filter((s) => s.callType === "inbound").length,
            outbound: scripts.filter((s) => s.callType === "outbound").length,
            both: scripts.filter((s) => s.callType === "both").length,
          },
          hasDefault: scripts.some((s) => s.isDefault),
        };
      }
    } catch (error) {
      console.error("[ScriptsPage] Failed to fetch scripts:", error);
    }
  }

  return (
    <ScriptsPageClient
      initialScripts={scripts}
      initialStats={stats}
      initialCompany={company}
      superAdminMustPickCompany={isPlatformAdmin && !company}
      companyId={effectiveCompanyId}
    />
  );
}
