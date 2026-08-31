"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import {
  type AddUserToCompanyDto,
  type UpdateUserRoleDto,
  type UpdateCompanyDto,
  type UpdateCompanyThemeDto,
  type Company,
  type CompanyUser,
  type CompanyUsersResponse,
  type ActionResponse,
} from "@/types/company.types";

/**
 * Server Actions for Admin Company Management
 *
 * These actions handle admin-level company mutations:
 * - Get all companies
 * - Get company by ID
 * - Get company users
 * - Add user to company
 * - Update user role in company
 * - Remove user from company
 *
 * All actions automatically revalidate the /admin/companies page
 */

/**
 * Get all companies (Admin only)
 */
export async function getAllCompaniesAdmin(): Promise<{
  success: boolean;
  data?: Company[];
  error?: string;
}> {
  try {
    const companies = (await serverApi.get<Company[]>(`/companies`)).data;
    return { success: true, data: companies };
  } catch (error) {
    console.error("[getAllCompaniesAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch companies",
    };
  }
}

/**
 * Get company by ID (Admin only)
 * GET /companies/admins/:companyId
 */
export async function getCompanyByIdAdmin(companyId: string): Promise<{
  success: boolean;
  data?: Company;
  error?: string;
}> {
  try {
    const company = (
      await serverApi.get<Company>(`/companies/admins/${companyId}`)
    ).data;
    return { success: true, data: company };
  } catch (error) {
    console.error("[getCompanyByIdAdmin] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch company",
    };
  }
}

/**
 * Get company users (Admin only)
 * GET /companies/admins/:companyId/users
 */
export async function getCompanyUsersAdmin(companyId: string): Promise<{
  success: boolean;
  data?: CompanyUsersResponse;
  error?: string;
}> {
  try {
    const users = (
      await serverApi.get<CompanyUsersResponse>(
        `/companies/admins/${companyId}/users`,
      )
    ).data;
    return { success: true, data: users };
  } catch (error) {
    console.error("[getCompanyUsersAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch company users",
    };
  }
}

/**
 * Add user to company (Admin only)
 * POST /companies/admins/:companyId/users
 */
export async function addUserToCompanyAdmin(
  companyId: string,
  payload: AddUserToCompanyDto,
): Promise<{ success: boolean; data?: CompanyUser; error?: string }> {
  try {
    const newUser = (
      await serverApi.post<CompanyUser>(
        `/companies/admins/${companyId}/users`,
        payload,
      )
    ).data;

    revalidatePath(`/admin/companies/${companyId}`);

    return { success: true, data: newUser };
  } catch (error) {
    console.error("[addUserToCompanyAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add user to company",
    };
  }
}

/**
 * Update user role in company (Admin only)
 * PATCH /companies/admins/:companyId/users/:userId/role
 */
export async function updateUserRoleAdmin(
  companyId: string,
  userId: string,
  payload: UpdateUserRoleDto,
): Promise<{ success: boolean; data?: CompanyUser; error?: string }> {
  try {
    const updated = (
      await serverApi.patch<CompanyUser>(
        `/companies/admins/${companyId}/users/${userId}/role`,
        payload,
      )
    ).data;

    revalidatePath(`/admin/companies/${companyId}`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateUserRoleAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

/**
 * Remove user from company (Admin only)
 * DELETE /companies/admins/:companyId/users/:userId
 */
export async function removeUserFromCompanyAdmin(
  companyId: string,
  userId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/companies/admins/${companyId}/users/${userId}`);

    revalidatePath(`/admin/companies/${companyId}`);

    return { success: true };
  } catch (error) {
    console.error("[removeUserFromCompanyAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove user from company",
    };
  }
}

/**
 * Update company information (Admin only)
 * PATCH /companies/company/:companyId
 */
export async function updateCompanyAdmin(
  companyId: string,
  payload: UpdateCompanyDto,
): Promise<{ success: boolean; data?: Company; error?: string }> {
  try {
    const updated = (
      await serverApi.patch(`/companies/company/${companyId}`, payload)
    ).data;

    revalidatePath(`/admin/companies/${companyId}`);
    revalidatePath(`/company-settings`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateCompanyAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update company",
    };
  }
}

/**
 * Update company theme (Admin only)
 * PATCH /companies/company/:companyId/theme
 */
export async function updateCompanyThemeAdmin(
  companyId: string,
  payload: UpdateCompanyThemeDto,
): Promise<{ success: boolean; data?: Company; error?: string }> {
  try {
    const updated = (
      await serverApi.patch(`/companies/company/${companyId}/theme`, payload)
    ).data;

    revalidatePath(`/admin/companies/${companyId}`);
    revalidatePath(`/company-settings`);

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateCompanyThemeAdmin] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update company theme",
    };
  }
}
