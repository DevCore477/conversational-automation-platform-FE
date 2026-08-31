"use client";

import { useEffect } from "react";

import { applyTheme } from "@/lib/apply-theme";
import { useThemeStore } from "@/store/theme.store";

/**
 * Applies persisted company branding (CSS variables) on auth routes.
 */
export function AuthThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const applyPersistedTheme = () => {
      const persisted = useThemeStore.getState().theme;
      if (persisted) {
        applyTheme(persisted);
      }
    };

    applyPersistedTheme();

    return useThemeStore.persist.onFinishHydration(applyPersistedTheme);
  }, []);

  return <>{children}</>;
}
