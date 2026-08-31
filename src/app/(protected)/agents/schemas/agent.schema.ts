import { z } from "zod";

/** Empty string = user must pick from the list (after switching engine type). */
const uuidOrUnset = z.union([z.string().uuid(), z.literal("")]);

const ResponseEngineConversationFlowSchema = z.object({
  type: z.literal("conversation-flow"),
  version: z.number().optional(),
  conversation_flow_id: uuidOrUnset,
  conversation_flow_ids: z.array(z.string().uuid()).optional(),
});

const ResponseEngineScriptSchema = z.object({
  type: z.literal("script"),
  version: z.number().optional(),
  script_id: uuidOrUnset,
});

const ResponseEngineLlmSchema = z.object({
  type: z.literal("llm"),
  version: z.number().optional(),
  llm_id: z.string().min(1),
});

const ResponseEngineSchema = z.discriminatedUnion("type", [
  ResponseEngineConversationFlowSchema,
  ResponseEngineScriptSchema,
  ResponseEngineLlmSchema,
]);

/** Form schema (no Zod `.default()` — defaults live in `defaultValues` for RHF typing). */
export const createAgentFormSchema = z
  .object({
    agentName: z.string().min(1).max(255),
    channel: z.enum(["voice"]),
    responseEngine: ResponseEngineSchema,
    language: z.string().max(20),
    voiceId: z.string().max(100).optional().nullable(),
    maxCallDurationMs: z.number().int().min(0),
    interruptionSensitivity: z.number().min(0).max(1),
    dataStorageSetting: z.string().max(50),
    isPublished: z.boolean(),
    postCallAnalysisModel: z.string().max(80).optional().nullable(),
    mode: z.enum(["flex", "rigid"]),
    globalPrompt: z.string().max(6400),
  })
  .superRefine((data, ctx) => {
    const re = data.responseEngine;
    if (re.type === "conversation-flow" && re.conversation_flow_id === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a conversation flow",
        path: ["responseEngine", "conversation_flow_id"],
      });
    }
    if (re.type === "script" && re.script_id === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a call script",
        path: ["responseEngine", "script_id"],
      });
    }
  });

export type CreateAgentFormValues = z.infer<typeof createAgentFormSchema>;
