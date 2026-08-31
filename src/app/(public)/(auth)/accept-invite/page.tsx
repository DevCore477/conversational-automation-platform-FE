import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";

import AcceptInviteClient from "./components/accept-invite-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvitePage() {
  return (
    <AuthPageShell showBackButton backHref="/login">
      <Suspense fallback={<div className="px-2 text-auth-body">Loading invite...</div>}>
        <AcceptInviteClient />
      </Suspense>
    </AuthPageShell>
  );
}
