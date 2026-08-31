"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneCall, PhoneIncoming, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  platformInboundVoiceFormSchema,
  type PlatformInboundVoiceFormValues,
} from "@/app/(protected)/calls/schemas/platform-inbound-voice.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRBAC } from "@/hooks/use-rbac";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { companyService } from "@/service/company.service";
import { flowService } from "@/service/flow.service";
import { platformInboundVoiceService } from "@/service/platform-inbound-voice.service";
import { type Agent } from "@/types/agent.types";
import { type Company } from "@/types/company.types";
import { type ConversationFlow } from "@/types/flow.types";
import { type PlatformInboundVoiceConfig } from "@/types/platform-inbound-voice.types";
import { type CallScript } from "@/types/script.types";
import { useThemeStore } from "@/store/theme.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const defaultValues: PlatformInboundVoiceFormValues = {
  tenantScope: "global",
  platformCompanyId: null,
  routingMode: "database_default",
  agentId: null,
  flowId: null,
  scriptId: null,
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PlatformInboundVoiceSettingsForm() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const [savedConfig, setSavedConfig] =
    useState<PlatformInboundVoiceConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [publishedFlows, setPublishedFlows] = useState<ConversationFlow[]>([]);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PlatformInboundVoiceFormValues>({
    resolver: zodResolver(platformInboundVoiceFormSchema),
    defaultValues,
  });

  const tenantScope = form.watch("tenantScope");
  const platformCompanyId = form.watch("platformCompanyId");
  const routingMode = form.watch("routingMode");

  const inboundScripts = scripts.filter(
    (s) => s.isActive && (s.callType === "inbound" || s.callType === "both"),
  );

  const loadCompanies = useCallback(async () => {
    try {
      setCompaniesLoading(true);
      const list = await companyService.admin.getAllCompanies();
      setCompanies(list);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load companies"));
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  const loadScripts = useCallback(async (scopeCompanyId: string | null) => {
    try {
      setScriptsLoading(true);
      const response = await api.get<CallScript[]>(
        scopeCompanyId
          ? `/call-scripts/company/${scopeCompanyId}`
          : "/call-scripts",
      );
      setScripts(response.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load scripts"));
    } finally {
      setScriptsLoading(false);
    }
  }, []);

  const loadAgentsAndFlows = useCallback(
    async (scopeCompanyId: string | null) => {
      try {
        setAgentsLoading(true);
        setFlowsLoading(true);

        if (scopeCompanyId) {
          const [agentList, flowList] = await Promise.all([
            agentsService.findAll(scopeCompanyId),
            flowService.getPublished(scopeCompanyId),
          ]);
          const publishedAgents = agentList.filter((a) => a.isPublished);
          setAgents(publishedAgents);
          setPublishedFlows(flowList);

          const aid = form.getValues("agentId");
          if (aid && !publishedAgents.some((a) => a.id === aid)) {
            form.setValue("agentId", null);
          }
          const fid = form.getValues("flowId");
          if (fid && !flowList.some((f) => f.id === fid)) {
            form.setValue("flowId", null);
          }
        } else {
          const [agentList, allFlows] = await Promise.all([
            agentsService.findAll(),
            flowService.listAll(),
          ]);
          const publishedAgents = agentList.filter((a) => a.isPublished);
          const flows = allFlows.filter((f) => f.status === "published");
          setAgents(publishedAgents);
          setPublishedFlows(flows);

          const aid = form.getValues("agentId");
          if (aid && !publishedAgents.some((a) => a.id === aid)) {
            form.setValue("agentId", null);
          }
          const fid = form.getValues("flowId");
          if (fid && !flows.some((f) => f.id === fid)) {
            form.setValue("flowId", null);
          }
        }
      } catch (err) {
        toast.error(
          getErrorMessage(err, "Failed to load agents or conversation flows"),
        );
        setAgents([]);
        setPublishedFlows([]);
      } finally {
        setAgentsLoading(false);
        setFlowsLoading(false);
      }
    },
    [form],
  );

  useEffect(() => {
    if (!isPlatformAdmin) return;

    let cancelled = false;

    async function loadConfig() {
      setConfigLoading(true);
      try {
        const c = await platformInboundVoiceService.getConfig();
        if (cancelled) return;
        setSavedConfig(c);
        if (c) {
          form.reset({
            tenantScope: c.platformCompanyId ? "tenant" : "global",
            platformCompanyId: c.platformCompanyId,
            routingMode: c.routingMode,
            agentId: c.agentId,
            flowId: c.flowId,
            scriptId: c.scriptId,
          });
        } else {
          form.reset(defaultValues);
        }
      } catch (err) {
        toast.error(
          getErrorMessage(err, "Failed to load platform inbound settings"),
        );
      } finally {
        if (!cancelled) setConfigLoading(false);
      }
    }

    void loadConfig();
    void loadCompanies();
    void loadScripts(null);

    return () => {
      cancelled = true;
    };
  }, [form, isPlatformAdmin, loadCompanies, loadScripts]);

  useEffect(() => {
    if (!isPlatformAdmin || configLoading) return;
    const scopeId =
      tenantScope === "tenant" ? (platformCompanyId ?? null) : null;
    if (tenantScope === "tenant" && !platformCompanyId) {
      setAgents([]);
      setPublishedFlows([]);
      setScripts([]);
      return;
    }
    void loadAgentsAndFlows(scopeId);
    void loadScripts(scopeId);
  }, [
    configLoading,
    isPlatformAdmin,
    tenantScope,
    platformCompanyId,
    loadAgentsAndFlows,
    loadScripts,
  ]);

  const { theme, fetchTheme } = useThemeStore();

  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, []);

  const onSubmit = async (values: PlatformInboundVoiceFormValues) => {
    setSaving(true);
    try {
      const platformCompanyIdResolved =
        values.tenantScope === "global" ? null : values.platformCompanyId;

      const payload = {
        platformCompanyId: platformCompanyIdResolved,
        routingMode: values.routingMode,
        agentId:
          values.routingMode === "agent" ? (values.agentId ?? null) : null,
        flowId: values.routingMode === "flow" ? (values.flowId ?? null) : null,
        scriptId:
          values.routingMode === "script" ? (values.scriptId ?? null) : null,
      };

      const updated = await platformInboundVoiceService.upsert(payload);
      setSavedConfig(updated);
      form.reset({
        tenantScope: updated.platformCompanyId ? "tenant" : "global",
        platformCompanyId: updated.platformCompanyId,
        routingMode: updated.routingMode,
        agentId: updated.agentId,
        flowId: updated.flowId,
        scriptId: updated.scriptId,
      });
      toast.success("Platform inbound routing saved");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save inbound settings"));
    } finally {
      setSaving(false);
    }
  };

  if (!isPlatformAdmin) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="flex flex-col w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2">
          {/*<PhoneIncoming className="h-5 w-5 text-muted-foreground" />*/}
          <div>
            <h2 className="text-text-dark dark:text-accent-foreground lg:text-xl 2xl:text-2xl font-medium">
              Platform Incoming calls
            </h2>
            <p className="text-sm 3xl:text-base text-muted-foreground">
              Handle Incoming calls at the platform level, before tenant
              routing. {/*Global routing uses flow or resource IDs alone;*/}
              {/*tenant-scoped routing resolves flows under that company.*/}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="gap-1 w-full border rounded-2xl bg-surface-soft-light p-[5px]">
          <CardHeader className="bg-sidebar px-4 py-4 rounded-t-2xl">
            <CardTitle>Inbound routing configuration</CardTitle>
            <CardDescription>
              View and update how platform-level incoming calls are handled.
              {/*Only platform administrators can change these settings.*/}
            </CardDescription>
            {savedConfig?.id && (
              <p className="text-muted-foreground text-xs">
                Updated {formatDate(savedConfig.updatedAt)}
              </p>
            )}
            {/* {!configLoading && !savedConfig && (
              <p className="text-sm text-amber-600 dark:text-amber-500 pt-1">
                No active configuration yet. Choose routing options and save to
                create one.
              </p>
            )} */}
          </CardHeader>

          <CardContent className="bg-sidebar pt-6 pb-8 rounded-b-2xl">
            {configLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading inbound settings…
              </p>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6">
                    <FormField
                      control={form.control}
                      name="tenantScope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              if (v === "global") {
                                form.setValue("platformCompanyId", null);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full max-w-60 xs:max-w-full">
                                <SelectValue placeholder="Select scope" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="global">
                                Global (default platform routing)
                              </SelectItem>
                              <SelectItem value="tenant">
                                Tenant (company-scoped)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {/* <FormDescription>
                          Global omits tenant scope; scoped routing sets{" "}
                          <code className="text-xs">platformCompanyId</code> for
                          resolution.
                        </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {tenantScope === "tenant" && (
                      <FormField
                        control={form.control}
                        name="platformCompanyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(v) =>
                                field.onChange(v === "" ? null : v)
                              }
                              disabled={companiesLoading}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      companiesLoading
                                        ? "Loading companies…"
                                        : "Select a company"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {companies.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="routingMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing mode</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              form.setValue("agentId", null);
                              form.setValue("flowId", null);
                              form.setValue("scriptId", null);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="database_default">
                                Database default
                              </SelectItem>
                              <SelectItem value="agent">Voice agent</SelectItem>
                              <SelectItem value="flow">
                                Conversation flow
                              </SelectItem>
                              <SelectItem value="script">Script</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* <FormDescription>
                          How inbound calls are routed after the webhook runs.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {routingMode === "agent" && (
                    <FormField
                      control={form.control}
                      name="agentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice agent</FormLabel>
                          <div className="flex gap-2">
                            <FormControl className="flex-1">
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) =>
                                  field.onChange(v === "" ? null : v)
                                }
                                disabled={
                                  agentsLoading ||
                                  (tenantScope === "tenant" &&
                                    !platformCompanyId)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      agentsLoading
                                        ? "Loading agents…"
                                        : "Select a published agent"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {agents.length === 0 ? (
                                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                      No published agents for this scope
                                    </div>
                                  ) : (
                                    agents.map((a) => (
                                      <SelectItem key={a.id} value={a.id}>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="truncate block w-full text-start">
                                                {truncateText(a.agentName, 25)}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="w-full max-w-60">
                                              {a.agentName}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        {/* {a.agentName} */}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                void loadAgentsAndFlows(
                                  tenantScope === "tenant"
                                    ? (platformCompanyId ?? null)
                                    : null,
                                )
                              }
                              disabled={agentsLoading}
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${agentsLoading ? "animate-spin" : ""}`}
                              />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {routingMode === "flow" && (
                    <FormField
                      control={form.control}
                      name="flowId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conversation flow</FormLabel>
                          <div className="flex gap-2">
                            <FormControl className="flex-1">
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) =>
                                  field.onChange(v === "" ? null : v)
                                }
                                disabled={
                                  flowsLoading ||
                                  (tenantScope === "tenant" &&
                                    !platformCompanyId)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      flowsLoading
                                        ? "Loading flows…"
                                        : "Select a published flow"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {publishedFlows.length === 0 ? (
                                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                      No published flows for this scope
                                    </div>
                                  ) : (
                                    publishedFlows.map((f) => (
                                      <SelectItem key={f.id} value={f.id}>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="truncate block w-full text-start">
                                                {truncateText(f.name, 25)}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="w-full max-w-60">
                                              {f.name}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        {/* {f.name} */}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                void loadAgentsAndFlows(
                                  tenantScope === "tenant"
                                    ? (platformCompanyId ?? null)
                                    : null,
                                )
                              }
                              disabled={flowsLoading}
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${flowsLoading ? "animate-spin" : ""}`}
                              />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {routingMode === "script" && (
                    <FormField
                      control={form.control}
                      name="scriptId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Script</FormLabel>
                          <div className="flex gap-2">
                            <FormControl className="flex-1">
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(v) =>
                                  field.onChange(v === "" ? null : v)
                                }
                                disabled={scriptsLoading}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      scriptsLoading
                                        ? "Loading scripts…"
                                        : "Select an inbound script"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {inboundScripts.length === 0 ? (
                                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                      No active inbound scripts
                                    </div>
                                  ) : (
                                    inboundScripts.map((s) => (
                                      <SelectItem key={s.id} value={s.id}>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="truncate block w-full text-start">
                                                {truncateText(s.name, 25)}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="w-full max-w-60">
                                              {s.name}
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        {/* {s.name} */}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                void loadScripts(
                                  tenantScope === "tenant"
                                    ? (platformCompanyId ?? null)
                                    : null,
                                )
                              }
                              disabled={scriptsLoading}
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${scriptsLoading ? "animate-spin" : ""}`}
                              />
                            </Button>
                          </div>
                          <FormDescription>
                            Scripts marked for inbound or both calls.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  </div>

                  <div className="grid mt-6 grid-cols-1 lg:grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      showWave
                      waveColor={theme?.primaryColor}
                      className="w-full gap-2 py-5 font-semibold"
                    >
                      {saving ? "Saving…" : "Save inbound routing"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
