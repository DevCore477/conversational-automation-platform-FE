"use client";

import { PageHeader } from "@/components/ui/page-header";

import { SuperAdminCompanyScopePicker } from "../../components/super-admin-company-scope";

export function ConversationFlowSuperAdminLanding() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <PageHeader
        title="Conversation Flow"
        description="Design and manage conversation flows for intelligent interactions"
      />
      <SuperAdminCompanyScopePicker
        scopePath="/conversation-flow"
        title="Select a Company"
        description="Choose which company's conversation flows to view or edit."
      />
    </main>
  );
}
