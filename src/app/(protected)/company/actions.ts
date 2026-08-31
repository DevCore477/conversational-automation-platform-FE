"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import {
  type Company,
  type CompanyUser,
  type CompanySettings,
  type UpdateCompanyDto,
  type UpdateCompanyThemeDto,
  type AddUserToCompanyDto,
  type UpdateUserRoleDto,
  type CompanyUsersResponse,
  type AddUserResponse,
  type ActionResponse,
} from "@/types/company.types";

/**
 * Server Actions for Company Management (Company Admin/Owner)
 *
 * These actions handle company-level operations:
 * - Update company theme (by companyId)
 * - Update company settings (by companyId)
 * - Get current user's company (/me)
 * - Update current user's company (/me)
 * - Update theme (/me)
 * - Update settings (/me)
 * - Get users (/me)
 * - Add user (/me)
 * - Update user role (/me)
 * - Remove user (/me)
 *
 * Company ID-based endpoints: /companies/company/:companyId
 * Current user endpoints: /companies/me
 */

/**
 * Update company theme (Company Admin)
 * PATCH /companies/company/:companyId/theme
 */
export async function updateCompanyTheme(
  companyId: string,
  payload: UpdateCompanyThemeDto,
): Promise<{
  success: boolean;
  data?: Company;
  error?: string;
}> {
  try {
    const company = (
      await serverApi.patch<Company>(
        `/companies/company/${companyId}/theme`,
        payload,
      )
    ).data;
    return { success: true, data: company };
  } catch (error) {
    console.error("[updateCompanyTheme] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}

/**
 * Update company settings (Company Admin)
 * PATCH /companies/company/:companyId/settings
 */
export async function updateCompanySettings(
  companyId: string,
  payload: CompanySettings,
): Promise<{
  success: boolean;
  data?: CompanySettings;
  error?: string;
}> {
  try {
    const settings = (
      await serverApi.patch<CompanySettings>(
        `/companies/company/${companyId}/settings`,
        payload,
      )
    ).data;
    return { success: true, data: settings };
  } catch (error) {
    console.error("[updateCompanySettings] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}

/**
 * Get current user's company
 * GET /companies/me
 */
export async function getMyCompany(): Promise<{
  success: boolean;
  data?: Company;
  error?: string;
}> {
  try {
    const company = (await serverApi.get<Company>(`/companies/me`)).data;
    return { success: true, data: company };
  } catch (error) {
    console.error("[getMyCompany] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch company",
    };
  }
}

/**
 * Update current user's company
 * PATCH /companies/me
 */
export async function updateMyCompany(payload: UpdateCompanyDto): Promise<{
  success: boolean;
  data?: Company;
  error?: string;
}> {
  try {
    const company = (await serverApi.patch<Company>(`/companies/me`, payload))
      .data;
    return { success: true, data: company };
  } catch (error) {
    console.error("[updateMyCompany] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update company",
    };
  }
}

/**
 * Update current company's theme
 * PATCH /companies/me/theme
 */
export async function updateMyTheme(payload: UpdateCompanyThemeDto): Promise<{
  success: boolean;
  data?: Company;
  error?: string;
}> {
  try {
    const company = (
      await serverApi.patch<Company>(`/companies/me/theme`, payload)
    ).data;
    return { success: true, data: company };
  } catch (error) {
    console.error("[updateMyTheme] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}

/**
 * Update current company's settings
 * PATCH /companies/me/settings
 */
export async function updateMySettings(payload: CompanySettings): Promise<{
  success: boolean;
  data?: CompanySettings;
  error?: string;
}> {
  try {
    const settings = (
      await serverApi.patch<CompanySettings>(`/companies/me/settings`, payload)
    ).data;
    return { success: true, data: settings };
  } catch (error) {
    console.error("[updateMySettings] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}

/**
 * Get current company's users
 * GET /companies/me/users
 */
export async function getMyCompanyUsers(): Promise<{
  success: boolean;
  data?: CompanyUsersResponse;
  error?: string;
}> {
  try {
    const users = (
      await serverApi.get<CompanyUsersResponse>(`/companies/me/users`)
    ).data;
    return { success: true, data: users };
  } catch (error) {
    console.error("[getMyCompanyUsers] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

/**
 * Add user to current company
 * POST /companies/me/users
 */
export async function addUserToMyCompany(
  payload: AddUserToCompanyDto,
): Promise<{
  success: boolean;
  data?: AddUserResponse;
  error?: string;
}> {
  try {
    const response = (
      await serverApi.post<AddUserResponse>(`/companies/me/users`, payload)
    ).data;

    revalidatePath("/team");

    return { success: true, data: response };
  } catch (error) {
    console.error("[addUserToMyCompany] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add user",
    };
  }
}

/**
 * Update user role in current company
 * PATCH /companies/me/users/:userId/role
 */
export async function updateMyCompanyUserRole(
  userId: string,
  payload: UpdateUserRoleDto,
): Promise<{
  success: boolean;
  data?: CompanyUser;
  error?: string;
}> {
  try {
    const updated = (
      await serverApi.patch<CompanyUser>(
        `/companies/me/users/${userId}/role`,
        payload,
      )
    ).data;

    revalidatePath("/team");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateMyCompanyUserRole] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

/**
 * Remove user from current company
 * DELETE /companies/me/users/:userId
 */
export async function removeUserFromMyCompany(
  userId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/companies/me/users/${userId}`);

    revalidatePath("/team");

    return { success: true };
  } catch (error) {
    console.error("[removeUserFromMyCompany] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove user",
    };
  }
}
