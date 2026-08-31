import api from "@/lib/axios";
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

export interface CompanyUsersResponse {
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
}

export const companyService = {
  // Create a new company
  create: async (payload: CreateCompanyDto): Promise<Company> => {
    const response = await api.post<Company>("/companies", payload);
    return response.data;
  },

  // Get current user's company
  getMyCompany: async (): Promise<Company> => {
    const response = await api.get<Company>("/companies/me");
    return response.data;
  },

  // Get current company statistics
  getMyCompanyStats: async (): Promise<CompanyStats> => {
    const response = await api.get<CompanyStats>("/companies/me/stats");
    return response.data;
  },

  // Update current user's company
  updateMyCompany: async (payload: UpdateCompanyDto): Promise<Company> => {
    const response = await api.patch<Company>("/companies/me", payload);
    return response.data;
  },

  // Update company theme/branding
  updateTheme: async (payload: UpdateCompanyThemeDto): Promise<Company> => {
    const response = await api.patch<Company>("/companies/me/theme", payload);
    return response.data;
  },

  // Update company settings
  updateSettings: async (settings: object): Promise<Company> => {
    const response = await api.patch<Company>(
      "/companies/me/settings",
      settings,
    );
    return response.data;
  },

  // Get company by slug (public)
  getBySlug: async (slug: string): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${slug}`);
    return response.data;
  },

  // Get all users in current company
  getMyCompanyUsers: async (): Promise<CompanyUsersResponse> => {
    const response = await api.get<CompanyUsersResponse>("/companies/me/users");
    return response.data;
  },

  // Add user to current company
  addUserToMyCompany: async (
    payload: AddUserToCompanyDto,
  ): Promise<CompanyUser> => {
    const response = await api.post<CompanyUser>(
      "/companies/me/users",
      payload,
    );
    return response.data;
  },

  // Update user role in company
  updateUserRole: async (
    userId: string,
    payload: UpdateUserRoleDto,
  ): Promise<CompanyUser> => {
    const response = await api.patch<CompanyUser>(
      `/companies/me/users/${userId}/role`,
      payload,
    );
    return response.data;
  },

  // Update user in company
  updateUser: async (
    userId: string,
    payload: UpdateUserDto,
  ): Promise<CompanyUser> => {
    const response = await api.patch<CompanyUser>(
      `/companies/me/users/${userId}`,
      payload,
    );
    return response.data;
  },

  // Remove user from company
  removeUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/companies/me/users/${userId}`,
    );
    return response.data;
  },

  removeInvitation: async (
    invitationId: string,
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/companies/me/invitations/${invitationId}`,
    );
    return response.data;
  },

  resendInvitation: async (
    invitationId: string,
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/companies/me/invitations/${invitationId}/resend`,
    );
    return response.data;
  },

  // Platform Admin APIs
  admin: {
    // Get all companies (Platform Admin only)
    getAllCompanies: async (): Promise<Company[]> => {
      const response = await api.get<Company[]>("/companies");
      return response.data;
    },

    // Get company by ID (Platform Admin only)
    getCompanyById: async (companyId: string): Promise<Company> => {
      const response = await api.get<Company>(`/companies/admins/${companyId}`);
      return response.data;
    },

    // Get all users in a specific company (Platform Admin only)
    getCompanyUsers: async (
      companyId: string,
    ): Promise<CompanyUsersResponse> => {
      const response = await api.get<CompanyUsersResponse>(
        `/companies/admins/${companyId}/users`,
      );
      return response.data;
    },

    // Add user to specific company (Platform Admin only)
    addUserToCompany: async (
      companyId: string,
      payload: AddUserToCompanyDto,
    ): Promise<CompanyUser> => {
      const response = await api.post<CompanyUser>(
        `/companies/admins/${companyId}/users`,
        payload,
      );
      return response.data;
    },

    // Update user role in specific company (Platform Admin only)
    updateUserRole: async (
      companyId: string,
      userId: string,
      payload: UpdateUserRoleDto,
    ): Promise<CompanyUser> => {
      const response = await api.patch<CompanyUser>(
        `/companies/admins/${companyId}/users/${userId}/role`,
        payload,
      );
      return response.data;
    },

    // Update user in specific company (Platform Admin only)
    updateUser: async (
      companyId: string,
      userId: string,
      payload: UpdateUserDto,
    ): Promise<CompanyUser> => {
      const response = await api.patch<CompanyUser>(
        `/companies/admins/${companyId}/users/${userId}`,
        payload,
      );
      return response.data;
    },

    // Remove user from specific company (Platform Admin only)
    removeUser: async (
      companyId: string,
      userId: string,
    ): Promise<{ message: string }> => {
      const response = await api.delete<{ message: string }>(
        `/companies/admins/${companyId}/users/${userId}`,
      );
      return response.data;
    },

    // Remove pending invitation from specific company (Platform Admin only)
    removePendingInvitation: async (
      companyId: string,
      invitationId: string,
    ): Promise<{ message: string }> => {
      const response = await api.delete<{ message: string }>(
        `/companies/admins/${companyId}/invitations/${invitationId}`,
      );
      return response.data;
    },

    // Resend invitation for specific company (Platform Admin only)
    resendInvitation: async (
      companyId: string,
      invitationId: string,
    ): Promise<{ message: string }> => {
      const response = await api.post<{ message: string }>(
        `/companies/admins/${companyId}/invitations/${invitationId}/resend`,
      );
      return response.data;
    },

    // Update company (Platform Admin only)
    updateCompany: async (
      companyId: string,
      payload: UpdateCompanyDto,
    ): Promise<Company> => {
      const response = await api.patch<Company>(
        `/companies/company/${companyId}`,
        payload,
      );
      return response.data;
    },

    // Update company theme (Platform Admin only)
    updateTheme: async (
      companyId: string,
      payload: UpdateCompanyThemeDto,
    ): Promise<Company> => {
      const response = await api.patch<Company>(
        `/companies/company/${companyId}/theme`,
        payload,
      );
      return response.data;
    },

    // Deactivate company (Platform Admin only)
    deactivate: async (companyId: string): Promise<{ message: string }> => {
      const response = await api.post<{ message: string }>(
        `/companies/admins/${companyId}/deactivate`,
      );
      return response.data;
    },

    // Activate company (Platform Admin only)
    activate: async (companyId: string): Promise<{ message: string }> => {
      const response = await api.post<{ message: string }>(
        `/companies/admins/${companyId}/activate`,
      );
      return response.data;
    },
  },
};
