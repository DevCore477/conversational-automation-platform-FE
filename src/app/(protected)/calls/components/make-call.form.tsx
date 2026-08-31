"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  makeCallSchema,
  type MakeCallSchema,
} from "@/app/(protected)/calls/schemas/make-call.schema";
import { OpenAIModel } from "@/common/enums/model.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VoiceSelector } from "@/components/ui/voice-selector";
import { useRBAC } from "@/hooks/use-rbac";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { companyService } from "@/service/company.service";
import { flowService } from "@/service/flow.service";
import { useCallState } from "@/store/call.store";
import { useCompanyStore } from "@/store/company.store";
import { useThemeStore } from "@/store/theme.store";
import { useVoiceStore } from "@/store/voice.store";
import { type Agent, responseEngineLabel } from "@/types/agent.types";
import { type PartialMakeCall } from "@/types/call.types";
import { type ConversationFlow } from "@/types/flow.types";
import { type CallScript } from "@/types/script.types";



export function MakeCallForm() {
  const { makeCall, isLoading, clearError } = useCallState();
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const [scripts, setScripts] = useState<(CallScript & { companyName?: string })[]>([]);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [flowList, setFlowList] = useState<(ConversationFlow & { companyName?: string })[]>([]);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const { theme, fetchTheme } = useThemeStore();
  const {
    voices,
    defaultVoiceId,
    fetchVoices,
    isLoading: voicesLoading,
  } = useVoiceStore();

  const { company, fetchMyCompany } = useCompanyStore();
  const companyId = company?.id;

  const defaultFormValues: MakeCallSchema = {
    to: "",
    useSavedScript: true,
    templateType: "script",
    scriptId: undefined,
    flowId: undefined,
    agentId: undefined,
    callerName: undefined,
    callerEmail: undefined,
    script: "",
    model: OpenAIModel.GPT_4O_MINI,
    voiceId: undefined,
  };

  const form = useForm<MakeCallSchema>({
    resolver: zodResolver(makeCallSchema),
    defaultValues: defaultFormValues,
  });

  // Watch the useSavedScript value from form
  const useSavedScript = form.watch("useSavedScript");
  const templateType = form.watch("templateType");

  // Fetch active scripts, agents, and voices on mount
  useEffect(() => {
    loadScripts();
    loadVoices();
    loadCompanyAndFlows();
    void loadAgents();
    if (!theme?.primaryColor) {
      fetchTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default voice when voices are loaded and no voice is selected
  useEffect(() => {
    if (defaultVoiceId && !form.getValues("voiceId")) {
      form.setValue("voiceId", defaultVoiceId);
    }
  }, [defaultVoiceId, form]);

  const loadScripts = async () => {
    try {
      setScriptsLoading(true);

      let list: (CallScript & { companyName?: string })[] = [];

      if (isPlatformAdmin) {
        // Super admin: show ALL scripts across every company, tagged by company.
        const allCompanies = await companyService.admin.getAllCompanies();
        const grouped: (CallScript & { companyName?: string })[] = [];
        await Promise.allSettled(
          allCompanies.map(async (c) => {
            try {
              const res = await api.get<CallScript[]>(`/call-scripts/company/${c.id}`);
              (res.data || []).forEach((s) =>
                grouped.push({ ...s, companyName: c.name }),
              );
            } catch {
              /* skip companies that fail individually */
            }
          }),
        );
        list = grouped;
      } else {
        let currentCompanyId =
          companyId ?? useCompanyStore.getState().company?.id;

        if (!currentCompanyId) {
          await fetchMyCompany();
          currentCompanyId = useCompanyStore.getState().company?.id;
        }

        const response = await api.get<CallScript[]>(
          currentCompanyId
            ? `/call-scripts/company/${currentCompanyId}`
            : "/call-scripts",
        );
        list = response.data || [];
      }

      const active = list.filter(
        (s) =>
          s.isActive && (s.callType === "outbound" || s.callType === "both"),
      );
      setScripts(active);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load scripts"));
    } finally {
      setScriptsLoading(false);
    }
  };

  const loadVoices = async () => {
    try {
      await fetchVoices();
    } catch (err) {
      toast.error(getErrorMessage(err, "Voices could not be loaded"));
    }
  };

  const loadCompanyAndFlows = async () => {
    try {
      setFlowsLoading(true);

      if (isPlatformAdmin) {
        // Super admin: show ALL published flows across every company, tagged by company.
        const allCompanies = await companyService.admin.getAllCompanies();
        const grouped: (ConversationFlow & { companyName?: string })[] = [];
        await Promise.allSettled(
          allCompanies.map(async (c) => {
            try {
              const flows = await flowService.getPublished(c.id);
              flows.forEach((f) => grouped.push({ ...f, companyName: c.name }));
            } catch {
              /* skip companies that fail individually */
            }
          }),
        );
        setFlowList(grouped.filter((f) => f.status === "published"));
        return;
      }

      let currentCompanyId =
        companyId ?? useCompanyStore.getState().company?.id;

      if (!currentCompanyId) {
        await fetchMyCompany();
        currentCompanyId = useCompanyStore.getState().company?.id;
      }

      const flows = currentCompanyId
        ? await flowService.getPublished(currentCompanyId)
        : [];
      setFlowList(flows);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load conversation flows"));
    } finally {
      setFlowsLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      setAgentsLoading(true);
      let currentCompanyId =
        companyId ?? useCompanyStore.getState().company?.id;

      if (!currentCompanyId) {
        await fetchMyCompany();
        currentCompanyId = useCompanyStore.getState().company?.id;
      }

      const list = await agentsService.findAll(currentCompanyId ?? "");
      setAgents(list.filter((a) => a.isPublished));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load agents"));
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Filter only active scripts for outbound/both
  const activeScripts = scripts.filter(
    (s) => s.isActive && (s.callType === "outbound" || s.callType === "both"),
  );

  // For super admins, group scripts by company name; company users get a flat list.
  const scriptGroups = useMemo(() => {
    if (!isPlatformAdmin) {
      return [{ label: null as string | null, scripts: activeScripts }];
    }
    const map = new Map<string, (CallScript & { companyName?: string })[]>();
    for (const s of activeScripts) {
      const key = s.companyName ?? "Unassigned";
      const existing = map.get(key) ?? [];
      existing.push(s);
      map.set(key, existing);
    }
    return [...map.entries()].map(([label, scripts]) => ({ label, scripts }));
  }, [activeScripts, isPlatformAdmin]);

  // For super admins, group flows by company name; company users get a flat list.
  const flowGroups = useMemo(() => {
    if (!isPlatformAdmin) {
      return [{ label: null as string | null, flows: flowList }];
    }
    const map = new Map<string, (ConversationFlow & { companyName?: string })[]>();
    for (const f of flowList) {
      const key = f.companyName ?? "Unassigned";
      const existing = map.get(key) ?? [];
      existing.push(f);
      map.set(key, existing);
    }
    return [...map.entries()].map(([label, flows]) => ({ label, flows }));
  }, [flowList, isPlatformAdmin]);

  const onSubmit = async (data: MakeCallSchema) => {
    clearError();
    try {
      const payload: PartialMakeCall = {
        to: data.to,
        callerName: data.callerName,
        callerEmail: data.callerEmail,
      };

      if (data.useSavedScript) {
        if (data.templateType === "agent" && data.agentId) {
          payload.agentId = data.agentId;
        } else if (data.templateType === "script" && data.scriptId) {
          payload.scriptId = data.scriptId;
        } else if (data.templateType === "flow" && data.flowId) {
          payload.flowId = data.flowId;
        }
        if (data.templateType !== "agent" && data.voiceId) {
          payload.voiceId = data.voiceId;
        }
      } else if (!data.useSavedScript && data.script && data.model) {
        payload.script = data.script;
        payload.model = data.model;
        if (data.voiceId) {
          payload.voiceId = data.voiceId;
        }
      }

      const res = await makeCall(payload);
      if (!res?.success) {
        throw new Error();
      }

      toast.success("Call initiated successfully");
      form.reset(defaultFormValues, { keepDefaultValues: false });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to initiate call"));
    }
  };

  const handleScriptToggle = (checked: boolean) => {
    if (checked) {
      form.setValue("script", "");
    } else {
      form.setValue("scriptId", undefined);
      form.setValue("flowId", undefined);
      form.setValue("agentId", undefined);
    }
  };

  return (
    <div className="flex flex-col w-full ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-text-dark dark:text-accent-foreground text-lg lg:text-xl 2xl:text-2xl font-medium">Make a Call</h2>
        <p className="text-sm 3xl:text-base text-muted-foreground">
          Create and trigger AI-powered calls using scripts, conversation flows,
          or voice agents.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* <div className="bg-pink-100 p-1 border-1 border-[#DEDEDE] rounded-2xl"> */}
          <Card className=" gap-1 w-full border rounded-2xl  bg-surface-soft-light p-[5px]">
          <CardHeader className="bg-sidebar px-4 py-4 rounded-t-2xl">
            <CardTitle>Call Configuration</CardTitle>
            <CardDescription>
              Fill in the details below to initiate a call.
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-sidebar pt-6 pb-8 rounded-b-2xl">
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 w-full"
              >
                {/* Row 1: Phone | AI Model */}
                <div className="grid grid-cols-1 gap-x-6 gap-6 lg:grid-cols-2 items-start">
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+15551234567" />
                        </FormControl>
                        <FormDescription>
                          Include country code (e.g., +1 for US)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Model {!useSavedScript && "*"}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={useSavedScript}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={OpenAIModel.GPT_4O_MINI}>
                                GPT-4o Mini
                              </SelectItem>
                              <SelectItem value={OpenAIModel.GPT_5_NANO}>
                                GPT-5 Nano
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {/* <FormDescription className="invisible select-none">
                          {"\u00A0"}
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2 items-start">
                {/* Row 2: Voice (not when using a saved agent) | Use Saved Template */}
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-x-4 items-center">
                  {useSavedScript && templateType === "agent" ? (
                    <div className="md:col-span-2">
                      <FormItem>
                      <FormLabel className="text-xs text-muted-foreground font-normal w-full">
                        Voice, model, and script or flow are taken from the
                        selected agent — no extra choices needed here.
                      </FormLabel>
                      {/* <FormDescription className="invisible select-none">
                        {"\u00A0"}
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                    </div>
                  ) : (
                     <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="voiceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice (Optional)</FormLabel>
                          <FormControl>
                            <VoiceSelector 
                              voices={voices}
                              defaultVoiceId={defaultVoiceId}
                              value={field.value}
                              onValueChange={(value) =>
                                field.onChange(
                                  value === "default" ? undefined : value,
                                )
                              }
                              disabled={voicesLoading}
                              placeholder={
                                voicesLoading
                                  ? "Loading voices..."
                                  : "Default voice"
                              }
                              showDefault
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="useSavedScript"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <div className={`flex h-10 w-full ${ field.value ? templateType === "agent" ? "items-center" : "items-end " : "items-end " } gap-2 rounded-md ring-0 focus-within:ring-0 focus-within:ring-offset-0`}>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                field.onChange(isChecked);
                                handleScriptToggle(isChecked);
                              }}
                            />
                          </FormControl>

                          <FormLabel className="m-0 leading-none text-muted-foreground">
                            Use Saved Template
                          </FormLabel>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Template Type + Script/Flow OR Custom Script */}
                {useSavedScript ? (
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="templateType"
                      render={({ field }) => (
                        <FormItem className="w-full ">
                          <FormLabel>Template Type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                form.setValue("scriptId", undefined);
                                form.setValue("flowId", undefined);
                                form.setValue("agentId", undefined);
                                if (value === "agent") {
                                  form.setValue("voiceId", undefined);
                                }
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select template type" />
                              </SelectTrigger>
                              <SelectContent >
                                <SelectItem value="script">Script</SelectItem>
                                <SelectItem value="flow">
                                  Conversation Flow
                                </SelectItem>
                                <SelectItem value="agent">
                                  Voice agent
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="script"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Call Script</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={8}
                            placeholder="Write your custom call script here..."
                          />
                        </FormControl>
                        {/* <FormDescription>
                          Enter your custom script (minimum 10 characters)
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                </div>
                <div className="grid gap-6 lg:grid-cols-2 items-start">
                  {useSavedScript && (
                    <>
                    {templateType === "script" ? (
                      <FormField
                        control={form.control}
                        name="scriptId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Select Script</FormLabel>
                            <div className="flex gap-2">
                              <FormControl className="flex-1">
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={(v) =>
                                    field.onChange(v === "" ? undefined : v)
                                  }
                                  disabled={scriptsLoading}
                                >
                                  <SelectTrigger className="w-full max-w-48 xs:max-w-full">
                                     <SelectValue
                                      placeholder={ scriptsLoading ? "Loading scripts..." : "Select a script"}
                                    />                                    
                                  </SelectTrigger>
                                  <SelectContent>
                                    {scriptsLoading ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        Loading scripts...
                                      </div>
                                    ) : activeScripts.length === 0 ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        No active scripts available
                                      </div>
                                    ) : (
                                      scriptGroups.map((group, gi) => (
                                        <Fragment key={gi}>
                                          {group.label && (
                                            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                              {group.label}
                                            </div>
                                          )}
                                          {group.scripts.map((script) => (
                                            <SelectItem
                                              key={script.id}
                                              value={script.id}
                                            >
                                              <div className="flex items-center align-middle justify-between w-full">
                                                <span>{script.name}</span>
                                                <span className="text-xs text-muted-foreground ml-2 capitalize">
                                                  {script.callType}
                                                </span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </Fragment>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={loadScripts}
                                disabled={scriptsLoading}
                              >
                                <RefreshCw
                                  className={`h-4 w-4 ${scriptsLoading ? "animate-spin" : ""}`}
                                />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : templateType === "flow" ? (
                      <FormField
                        control={form.control}
                        name="flowId"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Select Conversation Flow</FormLabel>
                            <div className="flex gap-2">
                              <FormControl className="flex-1">
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={(v) =>
                                    field.onChange(v === "" ? undefined : v)
                                  }
                                  disabled={flowsLoading}
                                >
                                  <SelectTrigger className="w-full max-w-48 xs:max-w-60 sm:max-w-full">
                                     <SelectValue
                                      placeholder={
                                        flowsLoading
                                          ? "Loading conversation flows..."
                                          : "Select a conversation flow"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {flowsLoading ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        Loading conversation flows...
                                      </div>
                                    ) : flowList.length === 0 ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        No published conversation flows
                                        available
                                      </div>
                                    ) : (
                                      flowGroups.map((group, gi) => (
                                        <Fragment key={gi}>
                                          {group.label && (
                                            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                              {group.label}
                                            </div>
                                          )}
                                          {group.flows.map((flow) => (
                                            <SelectItem
                                              key={flow.id}
                                              value={flow.id}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span>{flow.name}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </Fragment>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={loadCompanyAndFlows}
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
                    ) : (
                      <FormField
                        control={form.control}
                        name="agentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Voice Agent</FormLabel>
                            <div className="flex gap-2">
                              <FormControl className="flex-1">
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={(v) =>
                                    field.onChange(v === "" ? undefined : v)
                                  }
                                  disabled={agentsLoading}
                                >
                                  <SelectTrigger className="w-full max-w-48 xs:max-w-full">
                                    <SelectValue
                                      placeholder={
                                        agentsLoading
                                          ? "Loading agents..."
                                          : "Select an agent"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {agentsLoading ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        Loading agents...
                                      </div>
                                    ) : agents.length === 0 ? (
                                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        No published agents available
                                      </div>
                                    ) : (
                                      agents.map((agent) => (
                                        <SelectItem
                                          key={agent.id}
                                          value={agent.id}
                                        >
                                          <div className="flex flex-row justify-center items-center gap-1 w-full py-0.5">
                                            <span className="font-medium">
                                              {agent.agentName}
                                            </span>
                                            {agent.responseEngine && (
                                              <span className="text-xs text-muted-foreground">
                                                (
                                                {responseEngineLabel(
                                                  agent.responseEngine,
                                                )}
                                                )
                                              </span>
                                            )}
                                          </div>
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
                                onClick={() => void loadAgents()}
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
                    </>
                  )}
                </div>
                {/* Submit */}
                <div className="grid mt-6 grid-cols-1 lg:grid-cols-2 gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  showWave
                  waveColor={theme?.primaryColor}
                  className="w-full gap-2 py-5 font-semibold"
                >
                  {isLoading ? "Calling..." : "Make a Call"}
                </Button>
                </div>
              </motion.form>
            </Form>
          </CardContent>
        </Card>
        {/* </div> */}
      </motion.div>
    </div>
  );
}
