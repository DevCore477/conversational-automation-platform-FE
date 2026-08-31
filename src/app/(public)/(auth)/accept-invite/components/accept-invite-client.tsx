"use client";

import { useSearchParams } from "next/navigation";

import { InvitedRegisterForm } from "@/app/(public)/(auth)/accept-invite/components/invite-registeration-form";

export default function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <div>Invalid invite link</div>;
  }

  return <InvitedRegisterForm token={token} />;
}
