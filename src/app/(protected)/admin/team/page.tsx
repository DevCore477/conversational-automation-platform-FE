import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getTeamMembersData } from "@/lib/data";
import { TeamPageClient } from "./components/team-page-client";

export const metadata: Metadata = {
  title: "Team Members | Hexa AI",
  description: "Manage your team members and their roles",
};

// Force dynamic rendering for search params
export const dynamic = "force-dynamic";

interface TeamPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    companyId?: string;
  }>;
}

/**
 * Team Members Page (Admin Only) - Server Component
 *
 * This page demonstrates:
 * - Server-side data fetching with pagination
 * - Parallel data fetching
 * - Server Actions for mutations (in components)
 */
export default async function TeamMembersPage({ searchParams }: TeamPageProps) {
  // Parse search params
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const role = params.role || "all";
  const companyId = params.companyId || "";

  // Fetch team data server-side
  const teamData = await getTeamMembersData({
    page,
    limit: 10,
    search: search || undefined,
    role: role !== "all" ? role : undefined,
    companyId: companyId || undefined,
  });

  return (
    <TeamPageClient
      initialMembers={teamData.members}
      initialMeta={teamData.meta}
      initialStats={teamData.stats}
      initialSearch={search}
      initialRole={role}
      initialPage={page}
      initialCompanyId={companyId}
    />
  );
}
