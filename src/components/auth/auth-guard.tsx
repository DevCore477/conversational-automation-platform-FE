"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, requireAuth, router, pathname]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
