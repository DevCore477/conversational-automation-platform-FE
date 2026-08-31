"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import type { Company } from "@/types/company.types";

interface CompanyData {
  company: Company;
}

export async function getCompanyForProfile(): Promise<Company | null> {
  try {
    const response = await serverApi.get<Company>("/companies/me");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return null;
  }
}

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface UpdateCompanyUserPayload {
  firstName?: string;
  lastName?: string;
  companyRole?: string;
  companyStatus?: string;
}

export async function updateCurrentUser(
  userId: string,
  isPlatformAdmin: boolean,
  payload: UpdateUserPayload | UpdateCompanyUserPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isPlatformAdmin) {
      await serverApi.patch(`/users/${userId}`, payload);
    } else {
      await serverApi.patch(`/companies/me/users/${userId}`, payload);
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}
