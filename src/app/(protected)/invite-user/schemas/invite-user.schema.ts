import { z } from "zod";

import { UserRole } from "@/common/enums/user.types";

export const inviteUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.nativeEnum(UserRole).optional(),
  expiresInHours: z
    .number()
    .min(1, "Minimum 1 hour")
    .max(24 * 14, "Maximum 14 days")
    .optional(),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;
