"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Bot, ArrowLeft, ChevronsLeft } from "lucide-react";
import Link from "next/link";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentExecutionFields } from "@/app/(protected)/agents/components/agent-execution-fields";
import { AgentLanguagePicker } from "@/app/(protected)/agents/components/agent-language-picker";
import { FlowListPicker, ScriptListPicker } from "@/app/(protected)/agents/components/agent-response-engine-section";
import { VoiceSelector } from "@/components/ui/voice-selector";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { useVoiceStore } from "@/store/voice.store";
import { useCompanyStore } from "@/store/company.store";
import { useConversationFlowStore } from "@/store/conversation-flow.store";
import { type ConversationFlow } from "@/types/flow.types";
import { type Agent, type ResponseEngine } from "@/types/agent.types";
import { type CallScript } from "@/types/script.types";
import { type Voice, type verifiedLanguagesElevenLabs } from "@/types/voice.types";
import { createAgentFormSchema, type CreateAgentFormValues } from "../../schemas/agent.schema";
import { useSearchParams } from "next/navigation";
import { useThemeStore } from "@/store/theme.store";


function parseExtraFlowIds(raw: string): string[] | undefined {
  const parts = raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    return undefined;
  }
  return parts;
}

export default function NewAgentPageContent() {
  const router = useRouter();
  const { company } = useCompanyStore();
  const { flows, fetchFlows } = useConversationFlowStore();
  const { voices, defaultVoiceId, fetchVoices, isLoading: voicesLoading } = useVoiceStore();
  
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [extraFlowIdsInput, setExtraFlowIdsInput] = useState("");
  
  const lastConversationFlowIdRef = useRef<string | null>(null);
  const lastScriptIdRef = useRef<string | null>(null);
  const searchParams = useSearchParams();
  const companyIdFromUrl = searchParams.get("companyId");

  const companyId = company?.id || companyIdFromUrl;
  const { theme, fetchTheme } = useThemeStore();

  // Fetch flows and scripts
  useEffect(() => {
    async function loadData() {
      if (!companyId) return;
      
      setLoading(true);
      try {
        await fetchFlows(companyId);
        
        // Fetch scripts - you may need to import getScripts from your scripts actions
        const { getScriptsByCompanyId } = await import("@/app/(protected)/scripts/actions");
        const scriptsRes = await getScriptsByCompanyId(companyId);
        if (scriptsRes.success && scriptsRes.data) {
          setScripts(scriptsRes.data);
        }
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load data"));
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [companyId, fetchFlows]);

  // Fetch voices when page opens
  useEffect(() => {
    if (voices.length === 0 && !voicesLoading) {
      fetchVoices().catch(() => {});
    }
  }, [voices.length, voicesLoading, fetchVoices]);

  const defaultEngine = useMemo((): ResponseEngine => {
    return {
      type: "conversation-flow",
      conversation_flow_id: flows[0]?.id || "",
    };
  }, [flows]);

  const form = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentFormSchema),
    shouldUnregister: false,
    defaultValues: {
      agentName: "",
      channel: "voice",
      responseEngine: defaultEngine,
      language: "en-US",
      voiceId: null,
      maxCallDurationMs: 3600000,
      interruptionSensitivity: 0.9,
      dataStorageSetting: "everything",
      isPublished: false,
      postCallAnalysisModel: null,
      mode: "flex",
      globalPrompt: "",
    },
  });

  const watchedEngineType = useWatch({
    control: form.control,
    name: "responseEngine.type",
  }) as ResponseEngine["type"] | undefined;
  
  const engineType = watchedEngineType ?? form.getValues("responseEngine")?.type;
  const watchedVoiceId = form.watch("voiceId");

  // Reset form when flows/scripts are loaded
  useEffect(() => {
    if (!loading && (flows.length > 0 || scripts.length > 0)) {
      lastConversationFlowIdRef.current = null;
      lastScriptIdRef.current = null;
      setExtraFlowIdsInput("");
      form.reset({
        agentName: "",
        channel: "voice",
        responseEngine: defaultEngine,
        language: "en-US",
        voiceId: null,
        maxCallDurationMs: 3600000,
        interruptionSensitivity: 0.9,
        dataStorageSetting: "everything",
        isPublished: false,
        postCallAnalysisModel: null,
        mode: "flex",
        globalPrompt: "",
      });
    }
  }, [loading, flows, scripts, defaultEngine, form]);

  // Handle voice language sync
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "voiceId" && value.voiceId) {
        const voice = voices.find((v) => v.voice_id === value.voiceId);
        if (voice) {
          const verifiedLangs = voice.verified_languages?.map((l) => l.locale || l.language) || [];
          const labelLang = voice.labels?.language;
          if (labelLang && !voice.verified_languages?.some((l) => l.language === labelLang)) {
            let labelsLocale: string | undefined;
            if (labelLang === 'ur') labelsLocale = 'ur-PK';
            verifiedLangs.push(labelsLocale || labelLang);
          }
          const currentLang = form.getValues("language");
          const hasCurrentLang = verifiedLangs.includes(currentLang);
          if (!hasCurrentLang && verifiedLangs.length > 0) {
            form.setValue("language", verifiedLangs[0]);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, voices]);

  const handleEngineTypeChange = (next: ResponseEngine["type"]) => {
    const current = form.getValues();
    const prevEngine = current.responseEngine ?? ({ type: "llm", llm_id: "" } as ResponseEngine);
    const prevType = prevEngine.type;
    
    if (next === prevType) return;
    
    if (prevEngine.type === "conversation-flow" && prevEngine.conversation_flow_id) {
      lastConversationFlowIdRef.current = prevEngine.conversation_flow_id;
    }
    if (prevEngine.type === "script" && prevEngine.script_id) {
      lastScriptIdRef.current = prevEngine.script_id;
    }
    
    if (next === "conversation-flow") {
      if (flows.length === 0) {
        toast.error("Create a conversation flow first.");
        return;
      }
      setExtraFlowIdsInput("");
      const restoreId = lastConversationFlowIdRef.current &&
        flows.some((f) => f.id === lastConversationFlowIdRef.current)
        ? lastConversationFlowIdRef.current
        : "";
      form.reset({
        ...current,
        responseEngine: {
          type: "conversation-flow",
          conversation_flow_id: restoreId,
        },
      });
      return;
    }
    
    if (next === "script") {
      if (scripts.length === 0) {
        toast.error("Create a call script first.");
        return;
      }
      setExtraFlowIdsInput("");
      const restoreId = lastScriptIdRef.current &&
        scripts.some((s) => s.id === lastScriptIdRef.current)
        ? lastScriptIdRef.current
        : "";
      form.reset({
        ...current,
        responseEngine: {
          type: "script",
          script_id: restoreId,
        },
      });
      return;
    }
    
    setExtraFlowIdsInput("");
    form.reset({
      ...current,
      responseEngine: {
        type: "llm",
        llm_id: prevEngine.type === "llm" ? prevEngine.llm_id : "",
      },
    });
  };

  function getUniqueLanguagesFromVoices(voices: Voice[]): {
    code: string;
    label: string;
    locale?: string;
    preview_url?: string;
  }[] {
    const languageMap = new Map<
      string,
      { code: string; label: string; locale?: string; preview_url?: string }
    >();

    voices.forEach((voice: Voice) => {
      voice.verified_languages?.forEach((lang: verifiedLanguagesElevenLabs) => {
        const key = lang.locale || lang.language;
        if (!languageMap.has(key)) {
          languageMap.set(key, {
            code: lang.language,
            label: `${lang.language.toUpperCase()}${lang.locale ? ` (${lang.locale})` : ''}${lang.accent ? ` - ${lang.accent}` : ''}`,
            locale: lang.locale,
            preview_url: lang.preview_url,
          });
        }
      });
      const labelLang = voice.labels?.language;
      if (labelLang && !voice.verified_languages?.some((vl) => vl.language === labelLang)) {
        let labelsLocale: string | undefined;
        if (labelLang === 'ur') labelsLocale = 'ur-PK';
        const key = labelsLocale || labelLang;
        if (!languageMap.has(key)) {
          languageMap.set(key, {
            code: labelLang,
            label: `${labelLang.toUpperCase()}${labelsLocale ? ` (${labelsLocale})` : ''}${voice.labels?.accent ? ` - ${voice.labels.accent}` : ''}`,
            locale: labelsLocale,
            preview_url: voice.preview_url,
          });
        }
      }
    });

    return Array.from(languageMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  const onSubmit = async (values: CreateAgentFormValues) => {
    if (!companyId) {
      toast.error("No company selected");
      return;
    }

    try {
      let responseEngine = values.responseEngine;

      if (responseEngine.type === "conversation-flow") {
        const extra = parseExtraFlowIds(extraFlowIdsInput);
        responseEngine = {
          ...responseEngine,
          conversation_flow_ids: extra,
        };
      }

      const payload = {
        agentName: values.agentName,
        companyId,
        channel: values.channel,
        responseEngine,
        language: values.language,
        voiceId: values.voiceId,
        maxCallDurationMs: values.maxCallDurationMs,
        interruptionSensitivity: values.interruptionSensitivity,
        dataStorageSetting: values.dataStorageSetting || "everything",
        isPublished: true,
        postCallAnalysisModel: values.postCallAnalysisModel || null,
        ...(responseEngine.type === "conversation-flow"
          ? { conversationFlowMode: values.mode, globalPrompt: values.globalPrompt }
          : {}),
      };

      const created = await agentsService.create(payload);
      toast.success("Agent created successfully");
      router.push(`/agents?companyId=${companyId}`);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create agent"));
    }
  };

  if (!companyId) {
    return (
      <RBACGuard route="/agents/new" redirectTo="/dashboard">
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Loading company...</p>
        </main>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard route="/agents/new" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <PageHeader
            title="Create Agent"
            description="Bling a voice agent to a conversation flow script."
          />
          <Link href={`/agents?companyId=${companyId}`}>
            <Button variant="outline" size="sm" className="rounded-full">
              <ChevronsLeft className="size-5"/>
              Back
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-1 flex-col gap-6 py-6">
            <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
              <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-5 gap-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
            <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-5 gap-y-6">
                    <FormField
                      control={form.control}
                      name="agentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Support line, Sales Agent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Response Engine Type</FormLabel>
                      <Select
                        value={engineType}
                        onValueChange={(v) =>
                          handleEngineTypeChange(v as ResponseEngine["type"])
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose engine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="conversation-flow"
                            disabled={flows.length === 0}
                          >
                            Conversation flow
                          </SelectItem>
                          <SelectItem value="script" disabled={scripts.length === 0}>
                            Script
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {flows.length === 0 && engineType === "conversation-flow" && (
                        <p className="text-xs text-amber-600 dark:text-amber-500">
                          Add a flow under Conversation Flow first.
                        </p>
                      )}
                    </FormItem>
                  </div>

                  {engineType === "conversation-flow" && (
                    <div className="space-y-4">
                      <AgentExecutionFields />
                      <FormField
                        control={form.control}
                        name="responseEngine.conversation_flow_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">
                              Conversation flow for this agent
                            </FormLabel>
                            <FormControl>
                              <FlowListPicker
                                flows={flows}
                                value={field.value}
                                onChange={field.onChange}
                                fallbackId={
                                  field.value &&
                                  !flows.some((f) => f.id === field.value)
                                    ? field.value
                                    : undefined
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {engineType === "script" && (
                    <FormField
                      control={form.control}
                      name="responseEngine.script_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Call script for this agent
                          </FormLabel>
                          <FormControl>
                            <ScriptListPicker
                              scripts={scripts}
                              value={field.value}
                              onChange={field.onChange}
                              fallbackId={
                                field.value &&
                                !scripts.some((s) => s.id === field.value)
                                  ? field.value
                                  : undefined
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="voiceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice</FormLabel>
                          <FormControl>
                            <VoiceSelector
                              voices={voices}
                              defaultVoiceId={defaultVoiceId}
                              value={field.value ?? undefined}
                              onValueChange={(v) => field.onChange(v || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => {
                        const selectedVoice = voices.find((v) => v.voice_id === form.watch("voiceId"));
                        const availableLanguages = selectedVoice
                          ? (() => {
                              const langs = selectedVoice.verified_languages?.map((l) => ({
                                value: l.locale || l.language,
                                label: `${l.language.toUpperCase()}${l.locale ? ` (${l.locale})` : ''}${l.accent ? ` - ${l.accent}` : ''}`,
                                preview_url: l.preview_url,
                              })) || [];
                              const labelLang = selectedVoice.labels?.language;
                              if (labelLang && !selectedVoice.verified_languages?.some((l) => l.language === labelLang)) {
                                let labelsLocale: string | undefined;
                                if (labelLang === 'ur') labelsLocale = 'ur-PK';
                                langs.push({
                                  value: labelsLocale || labelLang,
                                  label: `${labelLang.toUpperCase()}${labelsLocale ? ` (${labelsLocale})` : ''}${selectedVoice.labels?.accent ? ` - ${selectedVoice.labels.accent}` : ''}`,
                                  preview_url: selectedVoice.preview_url,
                                });
                              }
                              return langs;
                            })()
                          : getUniqueLanguagesFromVoices(voices).map((l) => ({
                            value: l.locale || l.code,
                            label: l.label,
                            preview_url: l.preview_url,
                          }));

                        const validLanguages = availableLanguages.filter((l) => l.value && l.value.trim() !== "");
                        const uniqueLanguages = validLanguages.filter((lang, index, self) =>
                          index === self.findIndex((l) => l.value === lang.value)
                        );

                        return (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <AgentLanguagePicker
                                options={uniqueLanguages}
                                value={field.value || undefined}
                                onValueChange={field.onChange}
                                disabled={!selectedVoice && voices.length === 0}
                                placeholder={
                                  selectedVoice
                                    ? "Select language for voice"
                                    : "Select a voice first"
                                }
                                emptyLabel="No languages available"
                                resetPlaybackWhen={`new-agent-${watchedVoiceId ?? ""}`}
                              />
                            </FormControl>
                            {/* <FormDescription>
                              {selectedVoice
                                ? `Available languages for ${selectedVoice.name.split(' - ')[0]}`
                                : "Select a voice to see available languages"}
                            </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                     <FormField
                      control={form.control}
                      name="maxCallDurationMs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max duration (ms)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interruptionSensitivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interruption sensitivity (0–1)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step={0.05}
                              min={0}
                              max={1}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Link href="/agents" className="">
                      <Button type="button" variant="outline" className="rounded-full">
                        Cancel
                      </Button>
                    </Link>
                    {/* <Button type="submit">Create Agent</Button> */}
                    <Button type="submit" showWave 
                      waveColor={theme?.primaryColor}
                      className="rounded-full">
                      Create Agent
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
    </RBACGuard>
  );
}