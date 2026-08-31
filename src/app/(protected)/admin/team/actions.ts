"use server";

import { revalidatePath } from "next/cache";

import { getFormString, getFormNumber } from "@/lib/action-utils";
import { serverApi } from "@/lib/server-api";
import { type GetTeamMembersParams, type TeamMember } from "@/types/team.types";

/**
 * Server Actions for Team Management
 *
 * These actions handle all team member mutations:
 * - Invite member
 * - Update role
 * - Delete/Remove member
 * - Reactivate member
 *
 * All actions automatically revalidate the /team page
 * to ensure fresh data is displayed.
 */

export interface ActionResponse {
  success: boolean;
  error?: string;
}

interface Company {
  id: string;
  name: string;
}

/**
 * Get all companies
 */
export async function getCompanies(): Promise<{
  success: boolean;
  data?: Company[];
  error?: string;
}> {
  try {
    const response = await serverApi.get<{ data: Company[] }>("/companies");

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error("[getCompanies] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch companies",
    };
  }
}

/**
 * Get team members with pagination and filters
 */
export async function getTeamMembers(
  params: GetTeamMembersParams = {},
): Promise<{
  success: boolean;
  data?: TeamMember[];
  meta?: {
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
    totalPages: number;
    counts?: {
      matchingSearchTotal: number;
      platformAdmin: number;
      platformMember: number;
      withCompany?: number;
      withoutCompany?: number;
    };
  };
  error?: string;
}> {
  try {
    const { page = 1, limit = 10, search, role, sortBy, sortOrder, companyId } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) queryParams.append("search", search);
    if (role) queryParams.append("role", role);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (companyId) queryParams.append("companyId", companyId);

    const response = await serverApi.get<{ data: TeamMember[]; meta: any }>(
      `/users/members?${queryParams.toString()}`,
    );
    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("[getTeamMembers] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch team members",
    };
  }
}

/**
 * Update team member role
 */
export async function updateMemberRole(
  memberId: string,
  role: string,
): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/users/${memberId}`, { role });

    // Revalidate the team page
    revalidatePath("/team");

    return { success: true };
  } catch (error) {
    console.error("[updateMemberRole] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update member role",
    };
  }
}

/**
 * Delete/Remove team member
 */
export async function deleteTeamMember(
  memberId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/users/${memberId}`);

    // Revalidate the team page
    revalidatePath("/team");

    return { success: true };
  } catch (error) {
    console.error("[deleteTeamMember] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove team member",
    };
  }
}

/**
 * Update team member details (for platform admin)
 */
export async function updateTeamMember(
  memberId: string,
  payload: {
    firstName?: string;
    lastName?: string;
    role?: string;
  },
): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/users/${memberId}`, payload);

    revalidatePath("/team");

    return { success: true };
  } catch (error) {
    console.error("[updateTeamMember] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update team member",
    };
  }
}

/**
 * Reactivate team member
 */
export async function reactivateTeamMember(
  memberId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/users/members/${memberId}/reactivate`);

    // Revalidate the team page
    revalidatePath("/team");

    return { success: true };
  } catch (error) {
    console.error("[reactivateTeamMember] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reactivate team member",
    };
  }
}