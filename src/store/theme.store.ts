import { create } from "zustand";
import { persist } from "zustand/middleware";

import { applyTheme } from "@/lib/apply-theme";
import { getErrorMessage } from "@/lib/get-error-message";
import { companyService } from "@/service/company.service";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import { type UpdateCompanyThemeDto } from "@/types/company.types";
import { type CompanyTheme } from "@/types/theme.types";

interface ThemeState {
  theme: CompanyTheme | null;
  isLoading: boolean;
  error: string | null;
}

interface ThemeActions {
  fetchTheme: () => Promise<void>;
  updateTheme: (dto: UpdateCompanyThemeDto) => Promise<void>;
  clearTheme: () => void;
  clearError: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: null,
      isLoading: false,
      error: null,

      fetchTheme: async () => {
        const user = useAuthStore.getState().user;
        const hasCompanyAccess = !!user?.companyId && !!user?.companyRole && user.companyRole.trim() !== "";

        if (!hasCompanyAccess) {
          set({ theme: null, isLoading: false });
          return;
        }

        const cachedCompany = useCompanyStore.getState().company;
        if (cachedCompany && cachedCompany.id === user.companyId) {
          const theme = {
            primaryColor: cachedCompany.primaryColor || "",
            secondaryColor: cachedCompany.secondaryColor || "",
            logo: cachedCompany.logo,
            icon: cachedCompany.logo,
          };
          set({ theme, isLoading: false, error: null });
          applyTheme(theme);
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const response = await companyService.getMyCompany();
          const theme = {
            primaryColor: response.primaryColor || "",
            secondaryColor: response.secondaryColor || "",
            logo: response.logo,
            icon: response.logo,
          };
          set({ theme, isLoading: false });
          applyTheme(theme); // 🔥 side-effect here
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to load theme"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateTheme: async (dto: UpdateCompanyThemeDto) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.updateTheme(dto);
          const updated = await companyService.getMyCompany();
          const updatedTheme = {
            primaryColor: updated.primaryColor || "",
            secondaryColor: updated.secondaryColor || "",
            icon: updated.icon,
            logo: updated.logo,
          };
          set({ theme: updatedTheme, isLoading: false });
          applyTheme(updatedTheme);
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update theme"),
            isLoading: false,
          });
          throw err;
        }
      },

      clearTheme: () => set({ theme: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "company-theme", // 🔒 persists across refresh
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);
