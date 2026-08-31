// app/providers/auth-provider.tsx
"use client";

import { useEffect } from "react";

import { useAuthStore, subscribeToAuthEvents } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { useThemeStore } from "@/store/theme.store";

/**
 * AuthProvider - Single source of truth for auth initialization
 *
 * Responsibilities:
 * 1. Rehydrate auth state from storage on mount
 * 2. Load current user if authenticated
 * 3. Subscribe to auth events for cross-store communication
 * 4. NO direct store-to-store coupling - use events only
 */
const PUBLIC_ROUTES = [
  "/",
  "/about-us",
  "/careers",
  "/integrations",
  "/connect-us",
  "/privacy-policy",
  "/terms-of-service",
  "/use-cases",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/accept-invite",
];

const isPublicRoute = () => {
  if (typeof window === "undefined") return true;
  const pathname = window.location.pathname;
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((state) => state.loadUser);
  const fetchTheme = useThemeStore((state) => state.fetchTheme);
  const clearTheme = useThemeStore((state) => state.clearTheme);
  const fetchMyCompany = useCompanyStore((state) => state.fetchMyCompany);

  // Subscribe to auth events for cross-store communication
  useEffect(() => {
    if (isPublicRoute()) return;

    const unsubscribe = subscribeToAuthEvents((event) => {
      switch (event.type) {
        case "LOGIN":
          if (event.user.companyId) {
            void fetchTheme().catch(() => {});
            void fetchMyCompany({ force: true }).catch(() => {});
          }
          break;
        case "USER_LOADED":
          if (event.user.companyId) {
            void fetchTheme().catch(() => {});
            void fetchMyCompany().catch(() => {});
          }
          break;
        case "LOGOUT":
          clearTheme();
          useCompanyStore.getState().reset();
          break;
        case "AUTH_ERROR":
          console.warn("Auth error:", event.error);
          break;
      }
    });

    return unsubscribe;
  }, [fetchTheme, fetchMyCompany, clearTheme]);

  // Initialize auth on mount (skip on public pages)
  useEffect(() => {
    if (isPublicRoute()) return;

    const initAuth = async () => {
      await useAuthStore.persist.rehydrate();
      try {
        await loadUser();
      } catch (err) {
        console.warn("[AuthProvider] loadUser error:", err);
      }
    };

    void initAuth();
  }, [loadUser]);

  return <>{children}</>;
}
