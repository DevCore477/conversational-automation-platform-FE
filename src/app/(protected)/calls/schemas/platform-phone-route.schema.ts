import { z } from "zod";

const routingMode = z.enum([
  "agent",
  "flow",
  "script",
  "database_default",
]);

export const platformPhoneRouteFormSchema = z
  .object({
    platformCompanyId: z.string().uuid("Select a company"),
    phoneNumber: z
      .string()
      .min(4, "Phone number must be at least 4 characters")
      .max(32, "Phone number must be at most 32 characters")
      .regex(/^[+]?[0-9]{4,31}$/, {
        message: "Phone number must be an E.164 number",
      }),
    routingMode: routingMode,
    agentId: z.string().uuid().optional().nullable(),
    flowId: z.string().uuid().optional().nullable(),
    scriptId: z.string().uuid().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.routingMode === "agent" && !data.agentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select an agent when routing mode is Agent",
        path: ["agentId"],
      });
    }
    if (data.routingMode === "flow" && !data.flowId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a flow when routing mode is Flow",
        path: ["flowId"],
      });
    }
    if (data.routingMode === "script" && !data.scriptId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a script when routing mode is Script",
        path: ["scriptId"],
      });
    }
  });

export type PlatformPhoneRouteFormValues = z.infer<
  typeof platformPhoneRouteFormSchema
>;