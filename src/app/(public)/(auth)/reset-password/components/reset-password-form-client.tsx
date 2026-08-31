"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ResetPasswordForm } from "@/app/(public)/(auth)/reset-password/components/reset-password-form";

export default function ResetPasswordFormClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return <ResetPasswordForm token={token} />;
}