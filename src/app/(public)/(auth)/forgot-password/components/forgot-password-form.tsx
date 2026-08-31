"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormHeader } from "@/app/(public)/(auth)/components/auth-form-header";
import {
  authFormIconClass,
  authFormInputWithIconClass,
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
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/forgot-password.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      router.push("/forgot-password/success");
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthFormHeader
        title="Forgot Password"
        subtitle="Enter the email address you used to register"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-2"
          aria-label="Forgot password form"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authFormLabelClass}>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className={authFormIconClass} />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className={authFormInputWithIconClass}
                      autoComplete="email"
                      showLeftBorder={false}
                      aria-describedby="email-error"
                    />
                  </div>
                </FormControl>
                <FormMessage
                  id="email-error"
                  className="text-red-600"
                  aria-live="polite"
                />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={authFormSubmitButtonClass}
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? <LoadingText text="Submitting..." /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
