import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";

import ResetPasswordFormClient from "./components/reset-password-form-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell showBackButton backHref="/login">
      <Suspense fallback={<div className="px-2 text-auth-body">Loading...</div>}>
        <ResetPasswordFormClient />
      </Suspense>
    </AuthPageShell>
  );
}
