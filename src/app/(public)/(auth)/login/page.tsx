import type { Metadata } from "next";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";

import { LoginForm } from "./components/login-form";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  );
}
