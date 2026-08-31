import { Metadata } from "next";

import { AdminCompaniesPageClient } from "./components/admin-companies-page-client";
import { getAllCompaniesAdmin } from "./actions";

export const metadata: Metadata = {
  title: "All Companies | Hexa AI",
  description: "Platform admin view - Manage all companies in the system",
};

export const dynamic = "force-dynamic";

/**
 * Admin Companies Page - Server Component
 */
export default async function AdminCompaniesPage() {
  const result = await getAllCompaniesAdmin();
  const companies = result.success ? result.data || [] : [];

  return <AdminCompaniesPageClient initialCompanies={companies} />;
}
