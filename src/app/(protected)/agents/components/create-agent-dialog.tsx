"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { AgentExecutionFields } from "./agent-execution-fields";
import { AgentLanguagePicker } from "./agent-language-picker";
import { FlowListPicker, ScriptListPicker } from "./agent-response-engine-section";
import { Checkbox } from "@/components/ui/checkbox";
import { VoiceSelector } from "@/components/ui/voice-selector";
import { describeExtraFlowIdList } from "@/lib/agent-ui-utils";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { useVoiceStore } from "@/store/voice.store";
import { type ConversationFlow } from "@/types/flow.types";
import { type Agent, type ResponseEngine } from "@/types/agent.types";
import { type CallScript } from "@/types/script.types";

import {
  createAgentFormSchema,
  type CreateAgentFormValues,
} from "../schemas/agent.schema";
import {verifiedLanguagesElevenLabs, Voice} from "@/types/voice.types";

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

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  flows: ConversationFlow[];
  scripts: CallScript[];
  onSuccess?: (agent: Agent) => void;
}

export function CreateAgentDialog({
  open,
  onOpenChange,
  companyId,
  flows,
  scripts,
  onSuccess,
}: CreateAgentDialogProps) {
  const {
    voices,
    defaultVoiceId,
    fetchVoices,
    isLoading: voicesLoading,
  } = useVoiceStore();

  const defaultEngine = useMemo((): ResponseEngine => {
    if (flows[0]) {
      return {
        type: "conversation-flow",
        conversation_flow_id: flows[0].id,
      };
    }
    if (scripts[0]) {
      return {
        type: "script",
        script_id: scripts[0].id,
      };
    }
    return {
      type: "llm",
      llm_id: "",
    };
  }, [flows, scripts]);

  const [extraFlowIdsInput, setExtraFlowIdsInput] = useState("");
  /** Remember last chosen flow/script when switching engine type so list selection is not cleared incorrectly. */
  const lastConversationFlowIdRef = useRef<string | null>(null);
  const lastScriptIdRef = useRef<string | null>(null);

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

  /** Watch nested type; fall back to current form values so the first paint isn’t blank before RHF subscribes. */
  const watchedEngineType = useWatch({
    control: form.control,
    name: "responseEngine.type",
  }) as ResponseEngine["type"] | undefined;
  const engineType =
    watchedEngineType ?? form.getValues("responseEngine")?.type;
  const watchedVoiceId = form.watch("voiceId");

  useEffect(() => {
    if (open && voices.length === 0 && !voicesLoading) {
      fetchVoices().catch(() => {});
    }
  }, [open, voices.length, voicesLoading, fetchVoices]);

  const wasDialogOpenRef = useRef(false);

  useEffect(() => {
    if (!open) {
      wasDialogOpenRef.current = false;
      return;
    }
    const isOpeningTransition = !wasDialogOpenRef.current;
    wasDialogOpenRef.current = true;

    if (isOpeningTransition) {
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
      return;
    }

    // Flows/scripts finished loading after open: keep user input (voice, name, etc.)
    const snapshot = form.getValues();
    form.reset({
      ...snapshot,
      responseEngine: defaultEngine,
    });
  }, [open, defaultEngine, form]);


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
    const prevEngine =
      current.responseEngine ?? ({ type: "llm", llm_id: "" } as ResponseEngine);
    const prevType = prevEngine.type;
    if (next === prevType) {
      return;
    }
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
      const restoreId =
        lastConversationFlowIdRef.current &&
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
      const restoreId =
        lastScriptIdRef.current &&
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
        isPublished: true, // values.isPublished
        postCallAnalysisModel: values.postCallAnalysisModel || null,
        ...(responseEngine.type === "conversation-flow"
          ? { conversationFlowMode: values.mode, globalPrompt: values.globalPrompt }
          : {}),
      };

      const created = await agentsService.create(payload);
      toast.success("Agent created");
      onSuccess?.(created);
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create agent"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create agent</DialogTitle>
          <DialogDescription>
            Bind a voice agent to a conversation flow, script.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

            
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent name</FormLabel>
                  <FormControl>
                    <Input placeholder="Support line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Response Engine Type</FormLabel>
              {/* <FormDescription>
                Conversation flow or script uses your existing flows/scripts.
              </FormDescription> */}
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
                  {/*<SelectItem value="llm">LLM</SelectItem>*/}
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
              <div key="engine-flow" className="space-y-4">
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
              <div key="engine-script">
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
              </div>
            )}

            {engineType === "llm" && (
              <div key="engine-llm">
              <FormField
                control={form.control}
                name="responseEngine.llm_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LLM</FormLabel>
                    <FormControl>
                      <Input placeholder="Model or provider id" {...field} />
                    </FormControl>
                    <FormDescription>
                      Identifier for the LLM this agent will use.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            )}

            {/*<div className="grid gap-4 sm:grid-cols-2">*/}
              {/*<FormField*/}
              {/*  control={form.control}*/}
              {/*  name="language"*/}
              {/*  render={({ field }) => (*/}
              {/*    <FormItem>*/}
              {/*      <FormLabel>Language</FormLabel>*/}
              {/*      <FormControl>*/}
              {/*        <Input {...field} />*/}
              {/*      </FormControl>*/}
              {/*      <FormMessage />*/}
              {/*    </FormItem>*/}
              {/*  )}*/}
              {/*/>*/}

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

                    // Filter out empty values and ensure unique values
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
                              resetPlaybackWhen={`${open}-${watchedVoiceId ?? ""}`}
                            />
                          </FormControl>
                          <FormDescription>
                            {selectedVoice
                                ? `Available languages for ${selectedVoice.name.split(' - ')[0]}`
                                : "Select a voice to see available languages"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                    );
                  }}
              />

            <div className="grid gap-4 sm:grid-cols-2">
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
            {/*</div>*/}

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


            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="dataStorageSetting"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Data storage</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="postCallAnalysisModel"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Post-call analysis model (optional)</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input*/}
            {/*          value={field.value ?? ""}*/}
            {/*          onChange={(e) =>*/}
            {/*            field.onChange(e.target.value || null)*/}
            {/*          }*/}
            {/*        />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="isPublished"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem className="flex flex-row items-center gap-2 space-y-0">*/}
            {/*      <FormControl>*/}
            {/*        <Checkbox*/}
            {/*          checked={field.value}*/}
            {/*          onCheckedChange={(c) => field.onChange(c === true)}*/}
            {/*        />*/}
            {/*      </FormControl>*/}
            {/*      <FormLabel className="!mt-0 font-normal">Published</FormLabel>*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
