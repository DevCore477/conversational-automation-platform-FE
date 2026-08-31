import { z } from "zod";

const routingMode = z.enum([
  "agent",
  "flow",
  "script",
  "database_default",
]);

export const platformInboundVoiceFormSchema = z
  .object({
    tenantScope: z.enum(["global", "tenant"]),
    platformCompanyId: z.string().uuid().optional().nullable(),
    routingMode: routingMode,
    agentId: z.string().uuid().optional().nullable(),
    flowId: z.string().uuid().optional().nullable(),
    scriptId: z.string().uuid().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.tenantScope === "tenant") {
      if (!data.platformCompanyId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select a company for tenant-scoped routing",
          path: ["platformCompanyId"],
        });
      }
    }
    if (data.routingMode === "agent" && !data.agentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "agentId is required when routing mode is Agent",
        path: ["agentId"],
      });
    }
    if (data.routingMode === "flow" && !data.flowId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "flowId is required when routing mode is Flow",
        path: ["flowId"],
      });
    }
    if (data.routingMode === "script" && !data.scriptId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "scriptId is required when routing mode is Script",
        path: ["scriptId"],
      });
    }
  });

export type PlatformInboundVoiceFormValues = z.infer<
  typeof platformInboundVoiceFormSchema
>;
