"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneIncoming, Plus, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  platformPhoneRouteFormSchema,
  type PlatformPhoneRouteFormValues,
} from "@/app/(protected)/calls/schemas/platform-phone-route.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRBAC } from "@/hooks/use-rbac";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { companyService } from "@/service/company.service";
import { flowService } from "@/service/flow.service";
import { platformInboundVoiceService } from "@/service/platform-inbound-voice.service";
import { useThemeStore } from "@/store/theme.store";
import { type Agent } from "@/types/agent.types";
import { type Company } from "@/types/company.types";
import { type ConversationFlow } from "@/types/flow.types";
import {
  type PlatformInboundPhoneRoute,
  type PlatformInboundRoutingMode,
} from "@/types/platform-inbound-voice.types";
import { type CallScript } from "@/types/script.types";

const routingModeOptions: {
  value: PlatformInboundRoutingMode;
  label: string;
}[] = [
  { value: "script", label: "Script" },
  { value: "flow", label: "Conversation Flow" },
  { value: "agent", label: "Voice agent" },
];

const defaultValues: PlatformPhoneRouteFormValues = {
  platformCompanyId: "",
  phoneNumber: "",
  routingMode: "script",
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

function truncateText(text: string, maxLength: number = 20) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export function PlatformPhoneRouteSettingsForm() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const [routes, setRoutes] = useState<PlatformInboundPhoneRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [publishedFlows, setPublishedFlows] = useState<ConversationFlow[]>([]);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [routeToDelete, setRouteToDelete] =
    useState<PlatformInboundPhoneRoute | null>(null);

  const form = useForm<PlatformPhoneRouteFormValues>({
    resolver: zodResolver(platformPhoneRouteFormSchema),
    defaultValues,
  });

  const platformCompanyId = form.watch("platformCompanyId");
  const routingMode = form.watch("routingMode");

  const inboundScripts = scripts.filter(
    (s) => s.isActive && (s.callType === "inbound" || s.callType === "both"),
  );

  const loadRoutes = useCallback(async () => {
    try {
      setRoutesLoading(true);
      const list = await platformInboundVoiceService.listPhoneRoutes();
      setRoutes(list.filter((route) => route.isActive !== false));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load phone routes"));
    } finally {
      setRoutesLoading(false);
    }
  }, []);

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
        } else {
          const [agentList, allFlows] = await Promise.all([
            agentsService.findAll(),
            flowService.listAll(),
          ]);
          setAgents(agentList.filter((a) => a.isPublished));
          setPublishedFlows(allFlows.filter((f) => f.status === "published"));
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
    [],
  );

  useEffect(() => {
    if (!isPlatformAdmin) return;
    let cancelled = false;

    async function init() {
      await Promise.all([loadCompanies(), loadScripts(null)]);
      if (cancelled) return;
    }
    loadRoutes();
    void init();

    return () => {
      cancelled = true;
    };
  }, [isPlatformAdmin, loadRoutes, loadCompanies, loadScripts]);

  useEffect(() => {
    if (!isPlatformAdmin) return;
    const scopeId = platformCompanyId || null;
    void loadAgentsAndFlows(scopeId);
    void loadScripts(scopeId);
  }, [isPlatformAdmin, platformCompanyId, loadAgentsAndFlows, loadScripts]);

  const { theme, fetchTheme } = useThemeStore();
  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  const onSubmit = async (values: PlatformPhoneRouteFormValues) => {
    setSaving(true);
    try {
      const payload = {
        phoneNumber: values.phoneNumber,
        platformCompanyId: values.platformCompanyId,
        routingMode: values.routingMode,
        agentId: values.routingMode === "agent" ? values.agentId ?? null : null,
        flowId: values.routingMode === "flow" ? values.flowId ?? null : null,
        scriptId:
          values.routingMode === "script" ? values.scriptId ?? null : null,
      };
      await platformInboundVoiceService.upsertPhoneRoute(payload);
      toast.success("Phone route saved");
      form.reset(defaultValues);
      await loadRoutes();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save phone route"));
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (routeId: string) => {
    setDeletingId(routeId);
    try {
      await platformInboundVoiceService.deactivatePhoneRoute(routeId);
      toast.success("Phone route deactivated");
      await loadRoutes();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not deactivate phone route"));
    } finally {
      setDeletingId(null);
    }
  };

  const routeToDeleteName = routeToDelete ? routeToDelete.phoneNumber : "";

  if (!isPlatformAdmin) {
    return null;
  }

  const companyName = (id: string | null) =>
    companies.find((c) => c.id === id)?.name ?? "—";
  const routeTargetName = (route: PlatformInboundPhoneRoute) => {
    switch (route.routingMode) {
      case "agent":
        return route.agent?.name ?? "—";
      case "flow":
        return route.flow?.name ?? "—";
      case "script":
        return route.callScript?.name ?? "—";
      default:
        return "Database default";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-text-dark dark:text-accent-foreground lg:text-xl 2xl:text-2xl font-medium">
              Phone number routes
            </h2>
            <p className="text-sm 3xl:text-base text-muted-foreground">
              Route specific Telnyx phone numbers to an inbound agent, flow, or
              script before tenant routing.
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
            <CardTitle>Phone number route configuration</CardTitle>
            <CardDescription>
              Assign a company, phone number, and routing template. Saving
              overwrites any existing route for that number.
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-sidebar pt-6 pb-8 rounded-b-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6">
                  <FormField
                    control={form.control}
                    name="platformCompanyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(v) =>
                            field.onChange(v === "" ? "" : v)
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

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+3197010269438"
                            disabled={saving}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="routingMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Type</FormLabel>
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
                            {routingModeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) =>
                              field.onChange(v === "" ? null : v)
                            }
                            disabled={agentsLoading || !platformCompanyId}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    agentsLoading
                                      ? "Loading agents…"
                                      : platformCompanyId
                                        ? "Select a published agent"
                                        : "Select a company first"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {agents.length === 0 ? (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  No published agents for this company
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
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
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
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) =>
                              field.onChange(v === "" ? null : v)
                            }
                            disabled={flowsLoading || !platformCompanyId}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    flowsLoading
                                      ? "Loading flows…"
                                      : platformCompanyId
                                        ? "Select a published flow"
                                        : "Select a company first"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {publishedFlows.length === 0 ? (
                                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                  No published flows for this company
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
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
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
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) =>
                              field.onChange(v === "" ? null : v)
                            }
                            disabled={scriptsLoading}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    scriptsLoading
                                      ? "Loading scripts…"
                                      : "Select an inbound script"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
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
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
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
                      {saving ? "Saving…" : "Save phone route"}
                    </Button>
                  </div>
                </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className="gap-1 w-full border rounded-2xl bg-surface-soft-light p-[5px]">
          <CardHeader className="bg-sidebar px-4 py-4 rounded-t-2xl">
            <CardTitle>Existing phone routes</CardTitle>
            <CardDescription>
              List of per-company Telnyx number routes.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-sidebar pt-4 pb-4 rounded-b-2xl">
            {routesLoading ? (
              <p className="text-sm text-muted-foreground py-4">
                Loading phone routes…
              </p>
            ) : routes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No phone routes configured yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {routes.map((route) => (
                  <li
                    key={route.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PhoneIncoming className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium font-mono">
                          {route.phoneNumber}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {companyName(route.platformCompanyId)} ·{" "}
                          {routingModeOptions.find(
                            (r) => r.value === route.routingMode,
                          )?.label ?? route.routingMode}{" "}
                          · {routeTargetName(route)} · Updated{" "}
                          {formatDate(route.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={deletingId === route.id}
                      onClick={() => setRouteToDelete(route)}
                    >
                      <Trash2
                        className={`h-4 w-4 ${deletingId === route.id ? "animate-pulse" : ""}`}
                      />
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={!!routeToDelete}
        onOpenChange={(open) => {
          if (!open) setRouteToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phone Route</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{routeToDeleteName}</span>? This
              will stop routing calls to this number. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deletingId !== null}
              onClick={() => setRouteToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deletingId !== null}
              onClick={() => {
                if (routeToDelete?.id) void handleDelete(routeToDelete.id);
              }}
            >
              {deletingId !== null ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}