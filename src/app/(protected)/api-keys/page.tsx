import { Metadata } from "next";

import { getApiKeysData } from "@/lib/data";
import { ApiKeysPageClient } from "./components/api-keys-page-client";

export const metadata: Metadata = {
  title: "API Keys | Hexa AI",
  description: "Manage your API keys for programmatic access",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

/**
 * API Keys Page (Admin Only) - Server Component
 *
 * This page demonstrates:
 * - Server-side data fetching
 * - Parallel data fetching with Promise.all
 * - Server Actions for mutations (in components)
 */
export default async function ApiKeysPage() {
  // Fetch API keys and stats in parallel
  const apiKeysData = await getApiKeysData();

  return (
    <ApiKeysPageClient
      initialApiKeys={apiKeysData.apiKeys}
      initialStats={apiKeysData.stats}
    />
  );
}
