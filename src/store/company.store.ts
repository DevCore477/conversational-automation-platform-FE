import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  COMPANY_PERSIST_KEY,
  companyPersistStorage,
} from "@/lib/company-persist-storage";
import { getErrorMessage } from "@/lib/get-error-message";
import { companyService } from "@/service/company.service";
import { useAuthStore } from "@/store/auth.store";
import {
  type Company,
  type CompanyStats,
  type CompanyUser,
  type CreateCompanyDto,
  type UpdateCompanyDto,
  type UpdateCompanyThemeDto,
  type AddUserToCompanyDto,
  type UpdateUserRoleDto,
  type UpdateUserDto,
  type PendingInvitation,
} from "@/types/company.types";

interface CompanyState {
  company: Company | null;
  stats: CompanyStats | null;
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
  allCompanies: Company[]; // For platform admins
  isLoading: boolean;
  error: string | null;
}

interface CompanyActions {
  // Company management
  createCompany: (payload: CreateCompanyDto) => Promise<Company>;
  fetchMyCompany: (opts?: { force?: boolean }) => Promise<void>;
  fetchMyCompanyStats: () => Promise<void>;
  updateMyCompany: (payload: UpdateCompanyDto) => Promise<void>;
  updateTheme: (payload: UpdateCompanyThemeDto) => Promise<void>;
  updateSettings: (settings: object) => Promise<void>;
  getBySlug: (slug: string) => Promise<Company>;

  // User management
  fetchMyCompanyUsers: () => Promise<void>;
  addUser: (payload: AddUserToCompanyDto) => Promise<void>;
  updateUser: (userId: string, payload: UpdateUserDto) => Promise<void>;
  updateUserRole: (userId: string, payload: UpdateUserRoleDto) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  removeInvitation: (invitationId: string) => Promise<void>;
  resendInvitation: (invitationId: string) => Promise<void>;

  // Platform admin actions
  fetchAllCompanies: () => Promise<void>;
  fetchCompanyById: (companyId: string) => Promise<Company>;
  fetchCompanyUsers: (companyId: string) => Promise<{
    users: CompanyUser[];
    pendingInvitations: PendingInvitation[];
  }>;
  addUserToCompany: (
    companyId: string,
    payload: AddUserToCompanyDto,
  ) => Promise<void>;
  updateUserRoleInCompany: (
    companyId: string,
    userId: string,
    payload: UpdateUserRoleDto,
  ) => Promise<void>;
  updateUserInCompany: (
    companyId: string,
    userId: string,
    payload: UpdateUserDto,
  ) => Promise<void>;
  removeUserFromCompany: (companyId: string, userId: string) => Promise<void>;
  removeInvitationFromCompany: (
    companyId: string,
    invitationId: string,
  ) => Promise<void>;
  resendInvitationFromCompany: (
    companyId: string,
    invitationId: string,
  ) => Promise<void>;
  updateCompanyAsAdmin: (
    companyId: string,
    payload: UpdateCompanyDto,
  ) => Promise<void>;
  updateThemeAsAdmin: (
    companyId: string,
    payload: UpdateCompanyThemeDto,
  ) => Promise<void>;

  // Utility
  setCompany: (company: Company | null) => void;
  clearError: () => void;
  reset: () => void;
}

type CompanyStore = CompanyState & CompanyActions;

const initialState: CompanyState = {
  company: null,
  stats: null,
  users: [],
  pendingInvitations: [],
  allCompanies: [],
  isLoading: false,
  error: null,
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      createCompany: async (payload: CreateCompanyDto) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.create(payload);
          const currentAllCompanies = get().allCompanies;
          set({
            company,
            allCompanies: [...currentAllCompanies, company],
            isLoading: false,
          });
          return company;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to create company"),
            isLoading: false,
          });
          throw err;
        }
      },

      fetchMyCompany: async (opts?: { force?: boolean }) => {
        const force = opts?.force ?? false;
        const user = useAuthStore.getState().user;
        let existing = get().company;

        if (existing && user?.companyId && existing.id !== user.companyId) {
          set({ company: null });
          existing = null;
        }

        if (
          !force &&
          existing &&
          user?.companyId &&
          existing.id === user.companyId
        ) {
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const company = await companyService.getMyCompany();
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch company"),
            isLoading: false,
            company: null,
          });
          throw err;
        }
      },

      fetchMyCompanyStats: async () => {
        try {
          set({ isLoading: true, error: null });
          const stats = await companyService.getMyCompanyStats();
          set({ stats, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch stats"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateMyCompany: async (payload: UpdateCompanyDto) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.updateMyCompany(payload);
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update company"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateTheme: async (payload: UpdateCompanyThemeDto) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.updateTheme(payload);
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update theme"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateSettings: async (settings: object) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.updateSettings(settings);
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update settings"),
            isLoading: false,
          });
          throw err;
        }
      },

      getBySlug: async (slug: string) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.getBySlug(slug);
          set({ isLoading: false });
          return company;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch company"),
            isLoading: false,
          });
          throw err;
        }
      },

      fetchMyCompanyUsers: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await companyService.getMyCompanyUsers();
          set({
            users: response.users,
            pendingInvitations: response.pendingInvitations,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch users"),
            isLoading: false,
          });
          throw err;
        }
      },

      addUser: async (payload: AddUserToCompanyDto) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.addUserToMyCompany(payload);
          // Refresh users list
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to add user"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateUserRole: async (userId: string, payload: UpdateUserRoleDto) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.updateUserRole(userId, payload);
          // Refresh users list
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update user role"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateUser: async (userId: string, payload: UpdateUserDto) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.updateUser(userId, payload);
          // Refresh users list
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update user"),
            isLoading: false,
          });
          throw err;
        }
      },

      removeUser: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.removeUser(userId);
          // Refresh users list
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to remove user"),
            isLoading: false,
          });
          throw err;
        }
      },

      removeInvitation: async (invitationId: string) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.removeInvitation(invitationId);
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to remove invitation"),
            isLoading: false,
          });
          throw err;
        }
      },

      resendInvitation: async (invitationId: string) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.resendInvitation(invitationId);
          await get().fetchMyCompanyUsers();
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to resend invitation"),
            isLoading: false,
          });
          throw err;
        }
      },

      // Platform admin actions
      fetchAllCompanies: async () => {
        try {
          set({ isLoading: true, error: null });
          const allCompanies = await companyService.admin.getAllCompanies();
          set({ allCompanies, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch companies"),
            isLoading: false,
          });
          throw err;
        }
      },

      fetchCompanyById: async (companyId: string) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.admin.getCompanyById(companyId);
          set({ isLoading: false });
          return company;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch company"),
            isLoading: false,
          });
          throw err;
        }
      },

      fetchCompanyUsers: async (
        companyId: string,
      ): Promise<{
        users: CompanyUser[];
        pendingInvitations: PendingInvitation[];
      }> => {
        try {
          set({ isLoading: true, error: null });
          const response =
            await companyService.admin.getCompanyUsers(companyId);
          set({ isLoading: false });
          return response;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to fetch users"),
            isLoading: false,
          });
          throw err;
        }
      },

      addUserToCompany: async (
        companyId: string,
        payload: AddUserToCompanyDto,
      ) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.addUserToCompany(companyId, payload);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to add user"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateUserRoleInCompany: async (
        companyId: string,
        userId: string,
        payload: UpdateUserRoleDto,
      ) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.updateUserRole(companyId, userId, payload);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update user role"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateUserInCompany: async (
        companyId: string,
        userId: string,
        payload: UpdateUserDto,
      ) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.updateUser(companyId, userId, payload);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update user"),
            isLoading: false,
          });
          throw err;
        }
      },

      removeUserFromCompany: async (companyId: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.removeUser(companyId, userId);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to remove user"),
            isLoading: false,
          });
          throw err;
        }
      },

      removeInvitationFromCompany: async (
        companyId: string,
        invitationId: string,
      ) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.removePendingInvitation(
            companyId,
            invitationId,
          );
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to remove invitation"),
            isLoading: false,
          });
          throw err;
        }
      },

      resendInvitationFromCompany: async (
        companyId: string,
        invitationId: string,
      ) => {
        try {
          set({ isLoading: true, error: null });
          await companyService.admin.resendInvitation(companyId, invitationId);
          await get().fetchCompanyUsers(companyId);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to resend invitation"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateCompanyAsAdmin: async (
        companyId: string,
        payload: UpdateCompanyDto,
      ) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.admin.updateCompany(
            companyId,
            payload,
          );
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update company"),
            isLoading: false,
          });
          throw err;
        }
      },

      updateThemeAsAdmin: async (
        companyId: string,
        payload: UpdateCompanyThemeDto,
      ) => {
        try {
          set({ isLoading: true, error: null });
          const company = await companyService.admin.updateTheme(
            companyId,
            payload,
          );
          set({ company, isLoading: false });
        } catch (err) {
          set({
            error: getErrorMessage(err, "Failed to update theme"),
            isLoading: false,
          });
          throw err;
        }
      },

      setCompany: (company: Company | null) => set({ company }),

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: COMPANY_PERSIST_KEY,
      storage: createJSONStorage(() => companyPersistStorage),
      partialize: (state) => ({ company: state.company }),
    },
  ),
);
