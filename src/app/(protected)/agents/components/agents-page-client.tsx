"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { RobotIcn } from "@/assets/icons/Icons";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { toast } from "sonner";

import { SuperAdminCompanyScopePicker } from "@/app/(protected)/components/super-admin-company-scope";
import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getResponseEngineFromAgentLike } from "@/lib/agent-normalize";
import { formatEngineBindingSubtitle } from "@/lib/agent-ui-utils";
import { getErrorMessage } from "@/lib/get-error-message";
import { useRBAC } from "@/hooks/use-rbac";
import { agentsService } from "@/service/agents.service";
import { useCompanyStore } from "@/store/company.store";
import { useConversationFlowStore } from "@/store/conversation-flow.store";
import { type Agent } from "@/types/agent.types";
import { type Company } from "@/types/company.types";
import { type CallScript } from "@/types/script.types";

import { getScriptsByCompanyId } from "../../scripts/actions";
import { AgentConfigPanel } from "./agent-config-panel";
import { CreateAgentDialog } from "./create-agent-dialog";
import { ResponseEnginePreview } from "./response-engine-preview";
import GifButton from "@/components/GifButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

type AgentsPageClientProps = {
  /** From server: `/companies/me` or admin `getCompanyById` — avoids relying on client fetch alone */
  initialCompany?: Company | null;
  /** Platform admin on `/agents` without `?companyId=` — show company picker */
  superAdminMustPickCompany?: boolean;
};

export function AgentsPageClient({
  initialCompany = null,
  superAdminMustPickCompany = false,
}: AgentsPageClientProps) {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const { company, fetchMyCompany, setCompany } = useCompanyStore();

  /** Store first, then server-provided company until effects run */
  const effectiveCompanyId = company?.id ?? initialCompany?.id ?? null;

  const { flows, fetchFlows } = useConversationFlowStore();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedId) ?? null;
  const router = useRouter();
  const loadAll = useCallback(async () => {
    if (!effectiveCompanyId) {
      return;
    }
    setLoading(true);
    try {
      const [agentList, scriptsRes] = await Promise.all([
        agentsService.findAll(effectiveCompanyId),
        getScriptsByCompanyId(effectiveCompanyId),
      ]);
      setAgents(agentList);
      if (scriptsRes.success && scriptsRes.data) {
        setScripts(scriptsRes.data);
      }
      await fetchFlows(effectiveCompanyId);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load agents"));
    } finally {
      setLoading(false);
    }
  }, [effectiveCompanyId, fetchFlows]);

  /** Keep flows + scripts fresh when editing/creating so IDs resolve to names. */
  const refreshFlowsAndScripts = useCallback(async () => {
    if (!effectiveCompanyId) {
      return;
    }
    try {
      const scriptsRes = await getScriptsByCompanyId(effectiveCompanyId);
      if (scriptsRes.success && scriptsRes.data) {
        setScripts(scriptsRes.data);
      }
      await fetchFlows(effectiveCompanyId);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to refresh flows and scripts"));
    }
  }, [effectiveCompanyId, fetchFlows]);

  useLayoutEffect(() => {
    if (initialCompany) {
      setCompany(initialCompany);
    }
  }, [initialCompany, setCompany]);

  useEffect(() => {
    if (isPlatformAdmin) {
      return;
    }
    if (initialCompany) {
      return;
    }
    void fetchMyCompany();
  }, [isPlatformAdmin, initialCompany, fetchMyCompany]);

  useEffect(() => {
    if (effectiveCompanyId) {
      void loadAll();
    }
  }, [effectiveCompanyId, loadAll]);

  useEffect(() => {
    if (!effectiveCompanyId) {
      return;
    }
    if (createOpen || selectedId) {
      void refreshFlowsAndScripts();
    }
  }, [effectiveCompanyId, createOpen, selectedId, refreshFlowsAndScripts]);

  const handleAgentCreated = (agent: Agent) => {
    setAgents((prev) => [agent, ...prev]);
    setSelectedId(agent.id);
  };

  const handleAgentUpdated = (agent: Agent) => {
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? agent : a)));
  };

  const handleAgentDeleted = () => {
    setAgents((prev) => prev.filter((a) => a.id !== selectedId));
    setSelectedId(null);
  };

  const getSlidesPerView = (max: number) => {
    return Math.min(max, agents.length || 1);
  };

  if (superAdminMustPickCompany) {
    return (
      <RBACGuard route="/agents" redirectTo="/dashboard">
        <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
          <PageHeader
            title="Agents"
            description="Voice agents tied to conversation flows or scripts — configure behavior alongside your content."
          />
          <SuperAdminCompanyScopePicker
            scopePath="/agents"
            title="Select a Company"
            description="Choose which company's agents to view or edit."
          />
        </main>
      </RBACGuard>
    );
  }

  if (!effectiveCompanyId) {
    return (
      <RBACGuard route="/agents" redirectTo="/dashboard">
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading company…</p>
        </main>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard route="/agents" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          title="Agents"
          description="Voice agents tied to conversation flows or scripts — configure behavior alongside your content."
          action={
            <GifButton
              label="New Agent"
              onClick={() => router.push("/agents/new-agent")}
            />
          }
        />

        {/* Super Admin Company Scope Picker */}
        <SuperAdminCompanyScopePicker
          scopePath="/scripts"
          title="Select a Company"
          description="Choose which company's scripts to view or edit."
        />
        {loading ? (
          <div className="space-y-6">
            <div className="border rounded-2xl bg-surface-soft-light py-1 px-6">
              <div className="bg-sidebar p-0.5 rounded-2xl">
                <div className="flex gap-2 overflow-hidden rounded-2xl">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 p-5">
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-3 w-32 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-3">
              <div className="min-h-[320px] rounded-lg border bg-card p-4 lg:col-span-2">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <div className="min-h-[320px] rounded-lg border bg-card p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Your agents ({agents.length}) */}
            {/* Agents Tabs Slider */}
            <div className="border rounded-2xl bg-surface-soft-light py-1 px-6 min-w-0 relative">
              <button className="swiper-button-prev-custom text-white absolute -left-1 top-1/2 z-10 -translate-y-1/2">
                <ChevronLeft size={32} />
              </button>

              <button className="swiper-button-next-custom text-white absolute -right-1 top-1/2 z-10 -translate-y-1/2">
                <ChevronRight size={32} />
              </button>
              <div className="bg-sidebar p-0.5 rounded-2xl min-w-0">
                <Swiper
                  className="w-full overflow-hidden rounded-2xl"
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".swiper-button-prev-custom",
                    nextEl: ".swiper-button-next-custom",
                  }}
                  spaceBetween={4}
                  breakpoints={{
                    0: { slidesPerView: getSlidesPerView(1) },
                    640: { slidesPerView: getSlidesPerView(2) },
                    768: { slidesPerView: getSlidesPerView(3) },
                    1024: { slidesPerView: getSlidesPerView(5) },
                  }}
                  // slidesPerView={agents.length > 5 ? 5 : agents.length}
                >
                  {agents.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No agents yet. Create one to bind a flow or script.
                    </div>
                  ) : (
                    agents.map((a) => (
                      <SwiperSlide key={a.id} className="!h-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedId(a.id)}
                          className={cn(
                            "flex w-full h-full flex-col gap-0.5 p-5 text-left text-sm lg:text-base rounded-0 transition-colors",
                            selectedId === a.id
                              ? "bg-sidebar text-primary"
                              : "hover:bg-muted bg-muted",
                          )}
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <RobotIcn className="size-5 shrink-0" />
                            <span className="text-text-dark dark:text-sidebar-accent-foreground cursor-pointer">
                              {a.agentName.charAt(0).toUpperCase() + a.agentName.slice(1)}
                            </span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatEngineBindingSubtitle(
                              getResponseEngineFromAgentLike(a),
                              flows,
                              scripts,
                            )}
                            {a.isPublished ? " · Published" : ""}
                          </span>
                        </button>
                      </SwiperSlide>
                    ))
                  )}
                </Swiper>
              </div>
            </div>

            {/* Agent Config and Script */}
            <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-3">
              <section className="flex min-h-[320px] min-w-0 flex-col rounded-lg border bg-card p-4 lg:min-h-0 xl:col-span-2">
                {selectedAgent ? (
                  <AgentConfigPanel
                    key={selectedAgent.id}
                    agent={selectedAgent}
                    flows={flows}
                    scripts={scripts}
                    onUpdated={handleAgentUpdated}
                    onDeleted={handleAgentDeleted}
                  />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <RobotIcn className="h-10 w-10 opacity-40" />
                    <p className="text-sm">
                      Select an agent to edit its configuration, or create a new
                      one.
                    </p>
                  </div>
                )}
              </section>

              <section className="min-h-[320px] min-w-0 lg:min-h-0">
                <ResponseEnginePreview
                  agent={selectedAgent}
                  flows={flows}
                  scripts={scripts}
                  companyId={effectiveCompanyId}
                />
              </section>
            </div>
          </div>
        )}

        <CreateAgentDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          companyId={effectiveCompanyId}
          flows={flows}
          scripts={scripts}
          onSuccess={handleAgentCreated}
        />
      </main>
    </RBACGuard>
  );
}
