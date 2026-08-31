import { z } from "zod";

import { OpenAIModel } from "@/common/enums/model.types";

const baseMakeCallSchema = z.object({
  to: z
    .string()
    .startsWith("+", "Phone number must start with +")
    .min(1, "Recipient number is required"),
  /**
   * When true, user selects from saved assets (script, flow, or agent).
   * When false, user writes a custom script + model.
   */
  useSavedScript: z.boolean(),
  /**
   * Type of saved asset when useSavedScript === true.
   */
  templateType: z.enum(["script", "flow", "agent"]),
  scriptId: z.string().uuid().optional(),
  /** Conversation flow ID when calling via flow */
  flowId: z.string().uuid().optional(),
  /** Voice agent — engine + voice are resolved from the agent */
  agentId: z.string().uuid().optional(),
  script: z.string().optional(),
  callerName: z.string().max(100, "Caller name must be less than 100 characters").optional(),
  callerEmail: z.string().email("Invalid email address").optional(),

  model: z.nativeEnum(OpenAIModel).optional(),
  voiceId: z
    .string()
    .max(100, "Voice ID must be less than 100 characters")
    .optional(),
});

export const makeCallSchema = baseMakeCallSchema.strict().refine(
  (data) => {
    if (data.useSavedScript) {
      if (data.templateType === "script") {
        return Boolean(data.scriptId);
      }
      if (data.templateType === "flow") {
        return Boolean(data.flowId);
      }
      if (data.templateType === "agent") {
        return Boolean(data.agentId);
      }
    }
    return Boolean(data.script && data.model);
  },
  {
    message:
      "Select a script, flow, or agent — or provide both custom script and model",
    path: ["script"],
  },
);

export type MakeCallSchema = z.infer<typeof makeCallSchema>;
