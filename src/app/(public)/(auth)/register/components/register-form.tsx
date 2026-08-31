"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormHeader } from "@/app/(public)/(auth)/components/auth-form-header";
import {
  authFormIconClass,
  authFormInputClass,
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
import { type RegisterUser } from "@/types/auth.types";

import { registerSchema } from "../schemas/register.schema";

type RegisterSchema = RegisterUser;

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);
    try {
      await register(data);
      toast.success("Registration successful");
      router.push("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthFormHeader
        title="Create Your Account"
        subtitle="Fill in your details to get started"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-2"
          aria-label="Sign up form"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={authFormLabelClass}>
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John"
                      className={authFormInputClass}
                      autoComplete="given-name"
                      showLeftBorder={false}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={authFormLabelClass}>
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Doe"
                      className={authFormInputClass}
                      autoComplete="family-name"
                      showLeftBorder={false}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          </div>

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
              <FormItem>
                <FormLabel className={authFormLabelClass}>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
                      showLeftBorder={false}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0EA5E9]"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authFormLabelClass}>
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
                      showLeftBorder={false}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0EA5E9]"
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={authFormSubmitButtonClass}
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? <LoadingText text="Signing up..." /> : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="px-2 text-center text-base text-auth-body sm:text-sm md:text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#0EA5E9] hover:underline"
        >
          Sign In
        </Link>
      </p>

      <p className="px-2 text-center text-xs text-auth-body opacity-80">
        By signing up, you agree to our{" "}
        <Link href="#" className="text-[#0EA5E9] underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-[#0EA5E9] underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
