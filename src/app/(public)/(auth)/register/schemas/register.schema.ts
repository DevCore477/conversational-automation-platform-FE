import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First Name must not exceed 30 characters"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last Name must not exceed 30 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Invalid email address")),

    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
