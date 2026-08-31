"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import {
  type ApiKey,
  type ApiKeyStats,
  type CreateApiKeyDto,
  type UpdateApiKeyDto,
  type ApiKeyCreateResponse,
} from "@/types/api-key.types";

/**
 * Server Actions for API Key Management
 *
 * These actions handle all API key mutations:
 * - Create
 * - Update
 * - Revoke
 * - Delete
 *
 * All actions automatically revalidate the /api-keys page
 * to ensure fresh data is displayed.
 */

export interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Get all API keys
 */
export async function getApiKeys(): Promise<{
  success: boolean;
  data?: ApiKey[];
  error?: string;
}> {
  try {
    const apiKeys = (await serverApi.get<ApiKey[]>(`/api-keys`)).data;
    return {
      success: true,
      data: apiKeys,
    };
  } catch (error) {
    console.error("[getApiKeys] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch API keys",
    };
  }
}

/**
 * Get API key statistics
 */
export async function getApiKeyStats(): Promise<{
  success: boolean;
  data?: ApiKeyStats;
  error?: string;
}> {
  try {
    const stats = (await serverApi.get<ApiKeyStats>(`/api-keys/stats`)).data;
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("[getApiKeyStats] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch API key stats",
    };
  }
}

/**
 * Create a new API key
 */
export async function createApiKey(
  payload: CreateApiKeyDto,
): Promise<{ success: boolean; data?: ApiKeyCreateResponse; error?: string }> {
  try {
    const response = (
      await serverApi.post<ApiKeyCreateResponse>(`/api-keys`, payload)
    ).data;

    // Revalidate the api-keys page
    revalidatePath("/api-keys");

    return { success: true, data: response };
  } catch (error) {
    console.error("[createApiKey] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create API key",
    };
  }
}

/**
 * Update an existing API key
 */
export async function updateApiKey(
  id: string,
  payload: UpdateApiKeyDto,
): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/api-keys/${id}`, payload);

    // Revalidate the api-keys page
    revalidatePath("/api-keys");

    return { success: true };
  } catch (error) {
    console.error("[updateApiKey] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update API key",
    };
  }
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(id: string): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/api-keys/${id}`, { isActive: false });
    revalidatePath("/api-keys");
    return { success: true };
  } catch (error) {
    console.error("[revokeApiKey] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke API key",
    };
  }
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(id: string): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/api-keys/${id}`);

    // Revalidate the api-keys page
    revalidatePath("/api-keys");

    return { success: true };
  } catch (error) {
    console.error("[deleteApiKey] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete API key",
    };
  }
}
