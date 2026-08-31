"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormHeader } from "@/app/(public)/(auth)/components/auth-form-header";
import {
  authFormInputClass,
  authFormLabelClass,
  authFormSubmitButtonClass,
} from "@/app/(public)/(auth)/components/auth-form.styles";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingText } from "@/components/ui/loading-text";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore } from "@/store/auth.store";

import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../schemas/reset-password.schema";

type Props = {
  token: string;
};

const passwordRequirements = [
  { label: "Minimum characters 8", test: (p: string) => p.length >= 8 },
  { label: "One uppercase character", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase character", test: (p: string) => /[a-z]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function ResetPasswordForm({ token }: Props) {
  const { resetPassword } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsLoading(true);
    try {
      await resetPassword({
        token: token ?? "",
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Password reset successfully");
      window.location.href = "/reset-password/success";
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid or expired token"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthFormHeader
        title="Change Password"
        subtitle="Enter a new password to access your account"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-2"
          aria-label="Reset password form"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authFormLabelClass}>
                  New Password *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your new password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
                      aria-describedby="password-error"
                      showLeftBorder={false}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0EA5E9]"
                      tabIndex={-1}
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage
                  id="password-error"
                  className="text-red-600"
                  aria-live="polite"
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authFormLabelClass}>
                  Confirm New Password *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Re-enter your new password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
                      aria-describedby="confirm-password-error"
                      showLeftBorder={false}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsConfirmPasswordVisible((prev) => !prev)
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0EA5E9]"
                      tabIndex={-1}
                      aria-label={
                        isConfirmPasswordVisible
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage
                  id="confirm-password-error"
                  className="text-red-600"
                  aria-live="polite"
                />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            {passwordRequirements.map((req, index) => {
              const isMet = req.test(passwordValue || "");
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isMet ? "bg-[#0EA5E9]" : "bg-[#D9D9D9]"
                    }`}
                  />
                  <span
                    className={`text-base sm:text-sm md:text-sm ${
                      isMet ? "text-auth-body" : "text-auth-muted"
                    }`}
                  >
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            className={authFormSubmitButtonClass}
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? <LoadingText text="Confirming..." /> : "Confirm"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
