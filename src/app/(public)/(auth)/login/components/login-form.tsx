"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormHeader } from "@/app/(public)/(auth)/components/auth-form-header";
import {
  authFormIconClass,
  authFormInputWithIconClass,
  authFormInputWithToggleClass,
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
import { type LoginUser } from "@/types/auth.types";

import { loginSchema } from "../schemas/login.schema";

type LoginSchema = LoginUser;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthFormHeader
        title="Welcome Back!"
        subtitle="Sign in to access your portal"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
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
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={authFormLabelClass}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className={authFormIconClass} />
                      <Input
                        {...field}
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className={authFormInputWithToggleClass}
                        autoComplete="current-password"
                        showLeftBorder={false}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0EA5E9]"
                        tabIndex={-1}
                      >
                        {isPasswordVisible ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-base text-[#0EA5E9] hover:underline sm:text-sm md:text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className={authFormSubmitButtonClass}
            disabled={isLoading}
          >
            {isLoading ? <LoadingText text="Logging in..." /> : "Sign In"}
          </Button>
        </form>
      </Form>

      <p className="hidden text-center text-base text-auth-body sm:text-sm md:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#0EA5E9] hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
