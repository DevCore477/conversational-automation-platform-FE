import type { Metadata } from "next";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";

import { RegisterForm } from "./components/register-form";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <AuthPageShell showBackButton backHref="/login">
      <RegisterForm />
    </AuthPageShell>
  );
}
