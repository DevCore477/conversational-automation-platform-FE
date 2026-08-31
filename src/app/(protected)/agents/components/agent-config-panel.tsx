"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { VoiceSelector } from "@/components/ui/voice-selector";
import { getResponseEngineFromAgentLike } from "@/lib/agent-normalize";
import { describeExtraFlowIdList } from "@/lib/agent-ui-utils";
import { getErrorMessage } from "@/lib/get-error-message";
import { agentsService } from "@/service/agents.service";
import { useVoiceStore } from "@/store/voice.store";
import { type ConversationFlow } from "@/types/flow.types";
import { type Agent, type ResponseEngine } from "@/types/agent.types";
import { type CallScript } from "@/types/script.types";

import { AgentExecutionFields } from "./agent-execution-fields";
import { AgentLanguagePicker } from "./agent-language-picker";
import { FlowListPicker, ScriptListPicker } from "./agent-response-engine-section";
import {
  createAgentFormSchema,
  type CreateAgentFormValues,
} from "../schemas/agent.schema";
import {verifiedLanguagesElevenLabs, Voice} from "@/types/voice.types";
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

function agentToFormValues(agent: Agent): CreateAgentFormValues {
  const responseEngine = getResponseEngineFromAgentLike(agent);
  return {
    agentName: agent.agentName,
    channel: agent.channel,
    responseEngine,
    language: agent.language,
    voiceId: agent.voiceId,
    maxCallDurationMs: agent.maxCallDurationMs,
    interruptionSensitivity: agent.interruptionSensitivity,
    dataStorageSetting: agent.dataStorageSetting,
    isPublished: agent.isPublished,
    postCallAnalysisModel: agent.postCallAnalysisModel,
    mode: agent.mode,
    globalPrompt: agent.globalPrompt,
  };
}

interface AgentConfigPanelProps {
  agent: Agent;
  flows: ConversationFlow[];
  scripts: CallScript[];
  onUpdated: (agent: Agent) => void;
  onDeleted: () => void;
}

export function AgentConfigPanel({
  agent,
  flows,
  scripts,
  onUpdated,
  onDeleted,
}: AgentConfigPanelProps) {
  const {
    voices,
    defaultVoiceId,
    fetchVoices,
    isLoading: voicesLoading,
  } = useVoiceStore();
  const [extraFlowIdsInput, setExtraFlowIdsInput] = useState("");
  const lastConversationFlowIdRef = useRef<string | null>(null);
  const lastScriptIdRef = useRef<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentFormSchema),
    shouldUnregister: false,
    defaultValues: agentToFormValues(agent),
  });

  const watchedEngineType = useWatch({
    control: form.control,
    name: "responseEngine.type",
  }) as ResponseEngine["type"] | undefined;
  const engineType =
    watchedEngineType ?? form.getValues("responseEngine")?.type;
  const watchedVoiceId = form.watch("voiceId");

  useEffect(() => {
    if (voices.length === 0 && !voicesLoading) {
      fetchVoices().catch(() => {});
    }
  }, [voices.length, voicesLoading, fetchVoices]);

  useEffect(() => {
    form.reset(agentToFormValues(agent));
    const engine = getResponseEngineFromAgentLike(agent);
    if (engine.type === "conversation-flow") {
      lastConversationFlowIdRef.current = engine.conversation_flow_id;
      lastScriptIdRef.current = null;
      setExtraFlowIdsInput(
        engine.conversation_flow_ids?.join(", ") ?? "",
      );
    } else if (engine.type === "script") {
      lastScriptIdRef.current = engine.script_id;
      lastConversationFlowIdRef.current = null;
      setExtraFlowIdsInput("");
    } else {
      lastConversationFlowIdRef.current = null;
      lastScriptIdRef.current = null;
      setExtraFlowIdsInput("");
    }
  }, [agent, form]);

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
      current.responseEngine ?? getResponseEngineFromAgentLike(agent);
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
    setSaving(true);
    try {
      let responseEngine = values.responseEngine;
      if (responseEngine.type === "conversation-flow") {
        const extra = parseExtraFlowIds(extraFlowIdsInput);
        responseEngine = {
          ...responseEngine,
          conversation_flow_ids: extra,
        };
      }

      const updated = await agentsService.update(agent.id, {
        agentName: values.agentName,
        channel: values.channel,
        responseEngine,
        language: values.language,
        voiceId: values.voiceId,
        maxCallDurationMs: values.maxCallDurationMs,
        interruptionSensitivity: values.interruptionSensitivity,
        dataStorageSetting: values.dataStorageSetting || "everything",
        isPublished: true, // values.isPublished,
        postCallAnalysisModel: values.postCallAnalysisModel || null,
        ...(responseEngine.type === "conversation-flow"
          ? { conversationFlowMode: values.mode, globalPrompt: values.globalPrompt }
          : {}),
      });
      toast.success("Agent saved");
      onUpdated(updated);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save agent"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await agentsService.remove(agent.id);
      toast.success("Agent deleted");
      setShowDelete(false);
      onDeleted();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete agent"));
    } finally {
      setDeleting(false);
    }
  };

  const { theme, fetchTheme } = useThemeStore();
    useEffect(() => {
      if (!theme?.primaryColor) {
        fetchTheme();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <h3 className="text-lg text-text-dark dark:text-accent-foreground font-semibold">Agent Configuration</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
            // className="grid grid-cols-1 md:grid-cols-2  gap-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <SelectItem  value="script" disabled={scripts.length === 0}>
                    Script
                  </SelectItem>
                  {/*<SelectItem value="llm">LLM</SelectItem>*/}
                </SelectContent>
              </Select>
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
              <div>
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
              <div>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> 
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
                              resetPlaybackWhen={`${agent.id}-${watchedVoiceId ?? ""}`}
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
              </div>
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

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button type="button" variant="destructive" className="gap-1 px-6 rounded-full"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button type="submit" disabled={saving} showWave waveColor={theme?.primaryColor}
                className="rounded-full">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>

      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Calls referencing this agent may need to be
              updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-500 rounded-full"
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
