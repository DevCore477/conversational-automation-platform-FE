import { Metadata } from "next";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import {
  getCompany,
  getCompanyById,
  getFlowData,
  getCurrentUser,
} from "@/lib/data";
import {
  decodeAuthTokenPayload,
  isPlatformAdminPayload,
} from "@/lib/server-auth-token";
import { ConversationFlowPageClient } from "./components/conversation-flow-page-client";
import { ConversationFlowSuperAdminLanding } from "./components/conversation-flow-super-admin-landing";

export const metadata: Metadata = {
  title: "Conversation Flow | Hexa AI",
  description:
    "Design and manage conversation flows for intelligent interactions",
};

export const dynamic = "force-dynamic";

interface ConversationFlowPageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function ConversationFlowPage({
  searchParams,
}: ConversationFlowPageProps) {
  const params = await searchParams;
  const companyIdFromUrl = params.companyId ?? null;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const jwtPayload = token ? decodeAuthTokenPayload(token) : null;

  const hasContext =
    isPlatformAdminPayload(jwtPayload) || !!jwtPayload?.companyId;

  if (!hasContext) {
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
      } catch (error) {
        console.error("[ConversationFlowPage] Failed to fetch company:", error);
      }
    }
  } else {
    try {
      company = await getCompany();
    } catch (error) {
      console.error("[ConversationFlowPage] Failed to fetch company:", error);
    }
  }

  if (!isPlatformAdmin && !company) {
    redirect("/dashboard");
  }

  if (isPlatformAdmin && !company) {
    return <ConversationFlowSuperAdminLanding />;
  }

  if (!company) {
    redirect("/dashboard");
  }

  let flowsData = null;
  try {
    flowsData = await getFlowData(company.id);
  } catch (error) {
    console.error("[ConversationFlowPage] Failed to fetch flows:", error);
    flowsData = {
      flows: [],
      publishedFlows: [],
      currentPublishedFlow: null,
    };
  }

  return (
    <ConversationFlowPageClient
      companyId={company.id}
      initialFlows={flowsData.flows}
      initialPublishedFlow={flowsData.currentPublishedFlow}
      company={company}
    />
  );
}
