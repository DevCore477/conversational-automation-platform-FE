"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { RBACGuard } from "@/components/auth";
import { FlowBuilder } from "@/components/flow";
import { withCompanyScope } from "@/lib/company-scope";
import { fromBackendPayload } from "@/lib/flow-backend";
import { getTemplateById } from "@/lib/flows/templates";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";
import { useConversationFlowStore } from "@/store/conversation-flow.store";
import { useFlowStore } from "@/store/flow.store";

/** True if id looks like a backend flow UUID (hex with dashes or long hex) */
function isFlowId(id: string): boolean {
  if (id === "new" || !id) {
    return false;
  }
  if (getTemplateById(id)) {
    return false;
  }
  return id.length >= 32 || /^[0-9a-f-]{36}$/i.test(id);
}

/**
 * Flow builder at /conversation-flow/[id].
 * - id === "new" → blank flow (save creates via API)
 * - id === template id (e.g. "support-sales") → load template in builder (save creates via API)
 * - id === flow UUID → load flow from API; save = PATCH, validate/publish available
 */
export default function ConversationFlowIdPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const companyIdFromUrl = searchParams.get("companyId");

  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const { company, fetchMyCompany, fetchCompanyById, setCompany } =
    useCompanyStore();
  const effectiveCompanyId =
    company?.id ?? (companyIdFromUrl || undefined) ?? undefined;

  const { setFlowData, initializeFlow, flow } = useFlowStore();
  const { getFlowById, fetchFlows } = useConversationFlowStore();

  const [loadError, setLoadError] = useState<string | null>(null);
  const [flowLoaded, setFlowLoaded] = useState(false);
  const [loadedFlowName, setLoadedFlowName] = useState<string | null>(null);

  useEffect(() => {
    if (isPlatformAdmin && companyIdFromUrl) {
      if (!company || company.id !== companyIdFromUrl) {
        void fetchCompanyById(companyIdFromUrl)
          .then(setCompany)
          .catch(() => {});
      }
      return;
    }
    if (!isPlatformAdmin && !company?.id) {
      void fetchMyCompany().catch(() => {});
    }
  }, [
    isPlatformAdmin,
    companyIdFromUrl,
    company,
    fetchMyCompany,
    fetchCompanyById,
    setCompany,
  ]);

  useLayoutEffect(() => {
    setLoadError(null);
    if (id === "new") {
      setLoadedFlowName(null);
      initializeFlow();
      setFlowLoaded(true);
      return;
    }

    const template = getTemplateById(id);
    if (template) {
      setLoadedFlowName(template.name);
      const flowData = fromBackendPayload(template.payload, flow.metadata);
      flowData.metadata = { ...flowData.metadata, flowId: id };
      setFlowData(flowData);
      setFlowLoaded(true);
      return;
    }

    if (isFlowId(id) && effectiveCompanyId) {
      fetchFlows(effectiveCompanyId)
        .then(() => {
          const flowFromApi = getFlowById(id);
          if (flowFromApi) {
            setLoadedFlowName(flowFromApi.name);
            const flowData = fromBackendPayload(
              flowFromApi.flow,
              flow.metadata,
            );
            flowData.metadata = { ...flowData.metadata, flowId: id };
            setFlowData(flowData);
            setFlowLoaded(true);
          } else {
            setLoadError("Flow not found.");
          }
        })
        .catch(() => {
          setLoadError("Failed to load flow.");
        });
      return;
    }

    if (isFlowId(id) && !effectiveCompanyId) {
      setLoadError("Loading company…");
      return;
    }

    initializeFlow();
    setFlowLoaded(true);
  }, [
    id,
    effectiveCompanyId,
    setFlowData,
    initializeFlow,
    fetchFlows,
    getFlowById,
  ]);

  const handleClose = useCallback(() => {
    router.push(withCompanyScope("/conversation-flow", effectiveCompanyId));
  }, [router, effectiveCompanyId]);

  const initialName =
    loadedFlowName ??
    (id === "new"
      ? "New Conversation Flow"
      : (getTemplateById(id)?.name ?? "Conversation Flow"));

  const flowId = isFlowId(id) ? id : null;

  const isLoadingFlow =
    isFlowId(id) && effectiveCompanyId && !flowLoaded && !loadError;

  return (
    <RBACGuard route="/conversation-flow" redirectTo="/dashboard">
      <div className="h-screen w-full">
        {loadError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-md bg-destructive/10 text-destructive px-4 py-2 text-sm">
            {loadError}
          </div>
        )}
        {isLoadingFlow ? (
          <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
            <span className="animate-pulse">Loading flow…</span>
          </div>
        ) : (
          <FlowBuilder
            key={id}
            onClose={handleClose}
            initialFlowName={initialName}
            flowId={flowId}
            companyId={effectiveCompanyId}
            onFlowCreated={(newFlowId) =>
              router.push(
                withCompanyScope(
                  `/conversation-flow/${newFlowId}`,
                  effectiveCompanyId,
                ),
              )
            }
          />
        )}
      </div>
    </RBACGuard>
  );
}
