import { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminCompanyDetailPageClient } from "./components/admin-company-detail-client";
import { getCompanyByIdAdmin, getCompanyUsersAdmin } from "../actions";

export const metadata: Metadata = {
  title: "Company Details | Hexa AI",
  description: "View and manage company details",
};

export const dynamic = "force-dynamic";

interface AdminCompanyDetailPageProps {
  params: Promise<{ companyId: string }>;
}

export default async function AdminCompanyDetailPage({
  params,
}: AdminCompanyDetailPageProps) {
  const { companyId } = await params;

  const [companyResult, usersResult] = await Promise.all([
    getCompanyByIdAdmin(companyId),
    getCompanyUsersAdmin(companyId),
  ]);

  if (!companyResult.success || !companyResult.data) {
    notFound();
  }

  const company = companyResult.data;
  const users =
    usersResult.success && usersResult.data
      ? usersResult.data
      : { users: [], pendingInvitations: [] };

  return (
    <AdminCompanyDetailPageClient
      companyId={companyId}
      initialCompany={company}
      initialUsers={users}
    />
  );
}
