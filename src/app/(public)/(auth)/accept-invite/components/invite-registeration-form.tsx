"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { inviteUserRegistrationSchema } from "@/app/(public)/(auth)/accept-invite/schemas/invite-user-registration.schema";
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
import { type InviteUserRegistration } from "@/types/auth.types";

type Props = {
  token: string;
};

export function InvitedRegisterForm({ token }: Props) {
  const router = useRouter();
  const { acceptInvitation } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<InviteUserRegistration>({
    resolver: zodResolver(inviteUserRegistrationSchema),
    defaultValues: {
      token: token ?? "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      router.replace("/register");
    }
  }, [token, router]);

  const onSubmit = async (data: InviteUserRegistration) => {
    setIsLoading(true);
    try {
      await acceptInvitation({
        ...data,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Invitation invalid or expired"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <AuthFormHeader
        title="You're invited 🎉"
        subtitle="Complete your account setup"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-2"
          aria-label="Accept invitation form"
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
                      placeholder="John"
                      className={authFormInputClass}
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
                      placeholder="Doe"
                      className={authFormInputClass}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authFormLabelClass}>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
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
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className={`${authFormInputClass} pr-14 pl-4`}
                      autoComplete="new-password"
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
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={authFormSubmitButtonClass}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingText text="Creating account..." />
            ) : (
              "Accept Invitation"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
