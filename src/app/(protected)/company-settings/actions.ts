"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import {
  type UpdateCompanyDto,
  type UpdateCompanyThemeDto,
  type AddUserToCompanyDto,
  type UpdateUserRoleDto,
  type Company,
  type CompanyStats,
  type CompanyUser,
  type PendingInvitation,
} from "@/types/company.types";

/**
 * Server Actions for Company Settings
 *
 * These actions handle company management mutations:
 * - Update company info
 * - Update theme
 * - Add user
 * - Update user role
 * - Remove user
 *
 * All actions automatically revalidate the /company-settings page
 */

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export interface CompanyUsersResponse {
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
}

/**
 * Update company information
 */
export async function updateCompany(
  payload: UpdateCompanyDto,
): Promise<{ success: boolean; data?: Company; error?: string }> {
  try {
    const updated = (await serverApi.patch(`/companies/me`, payload)).data;

    revalidatePath("/company-settings");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateCompany] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update company",
    };
  }
}

/**
 * Update company theme
 */
export async function updateCompanyTheme(
  payload: UpdateCompanyThemeDto,
): Promise<{ success: boolean; data?: Company; error?: string }> {
  try {
    const updated = (await serverApi.patch(`/companies/me/theme`, payload))
      .data;

    revalidatePath("/company-settings");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateCompanyTheme] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update company theme",
    };
  }
}

/**
 * Add user to company
 */
export async function addUserToCompany(
  payload: AddUserToCompanyDto,
): Promise<{ success: boolean; data?: CompanyUser; error?: string }> {
  try {
    const newUser = (await serverApi.post(`/companies/me/users`, payload)).data;

    revalidatePath("/company-settings");

    return { success: true, data: newUser };
  } catch (error) {
    console.error("[addUserToCompany] Error:", error);
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
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  payload: UpdateUserRoleDto,
): Promise<{ success: boolean; data?: CompanyUser; error?: string }> {
  try {
    const updated = (
      await serverApi.patch(`/companies/me/users/${userId}/role`, payload)
    ).data;

    revalidatePath("/company-settings");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateUserRole] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

/**
 * Remove user from company
 */
export async function removeUserFromCompany(
  userId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/companies/me/users/${userId}`);

    revalidatePath("/company-settings");

    return { success: true };
  } catch (error) {
    console.error("[removeUserFromCompany] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove user from company",
    };
  }
}
