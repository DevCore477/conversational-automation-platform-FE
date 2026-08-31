import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCompany, getCompanyById, getCurrentUser } from "@/lib/data";
import {
  decodeAuthTokenPayload,
  isPlatformAdminPayload,
} from "@/lib/server-auth-token";

import { AgentsPageClient } from "./components/agents-page-client";

export const metadata: Metadata = {
  title: "Agents | Hexa AI",
  description: "Manage voice agents and their conversation flows or scripts",
};

export const dynamic = "force-dynamic";

interface AgentsPageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
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
      console.error("[AgentsPage] Failed to fetch company:", error);
    }
  }

  if (!isPlatformAdmin && !company) {
    redirect("/dashboard");
  }

  return (
    <AgentsPageClient
      initialCompany={company}
      superAdminMustPickCompany={isPlatformAdmin && !company}
    />
  );
}
