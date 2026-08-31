import type { Metadata } from "next";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";

import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell showBackButton backHref="/login">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
