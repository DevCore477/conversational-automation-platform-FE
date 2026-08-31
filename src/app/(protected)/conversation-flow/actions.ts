"use server";

import { revalidatePath } from "next/cache";

import { serverApi } from "@/lib/server-api";
import {
  type CreateFlowDto,
  type UpdateFlowDto,
  type ConversationFlow,
} from "@/types/flow.types";

/**
 * Server Actions for Conversation Flow Management
 *
 * These actions handle all flow mutations:
 * - Create
 * - Update
 * - Delete
 * - Activate
 * - Archive
 * - Publish
 *
 * All actions automatically revalidate the /conversation-flow page
 * to ensure fresh data is displayed.
 */

export interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Create a new flow
 */
export async function createFlow(
  companyId: string,
  dto: CreateFlowDto,
): Promise<{ success: boolean; data?: ConversationFlow; error?: string }> {
  try {
    const created = (await serverApi.post(`/flows/company/${companyId}`, dto))
      .data;

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true, data: created };
  } catch (error) {
    console.error("[createFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create flow",
    };
  }
}

/**
 * Update a flow
 */
export async function updateFlow(
  flowId: string,
  companyId: string,
  dto: UpdateFlowDto,
): Promise<{ success: boolean; data?: ConversationFlow; error?: string }> {
  try {
    const updated = (
      await serverApi.patch(`/flows/${flowId}/company/${companyId}`, dto)
    ).data;

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update flow",
    };
  }
}

/**
 * Delete a flow
 */
export async function deleteFlow(
  flowId: string,
  companyId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/flows/${flowId}/company/${companyId}`);

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true };
  } catch (error) {
    console.error("[deleteFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete flow",
    };
  }
}

/**
 * Activate a flow (set status to published)
 */
export async function activateFlow(
  flowId: string,
  companyId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.post(
      `/flows/${flowId}/company/${companyId}/status/published`,
    );

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true };
  } catch (error) {
    console.error("[activateFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to activate flow",
    };
  }
}

/**
 * Archive a flow
 */
export async function archiveFlow(
  flowId: string,
  companyId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.post(
      `/flows/${flowId}/company/${companyId}/status/archived`,
    );

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true };
  } catch (error) {
    console.error("[archiveFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to archive flow",
    };
  }
}

/**
 * Publish a flow
 */
export async function publishFlow(
  flowId: string,
  companyId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.post(
      `/flows/${flowId}/company/${companyId}/status/published`,
    );

    // Revalidate the conversation-flow page
    revalidatePath("/conversation-flow");

    return { success: true };
  } catch (error) {
    console.error("[publishFlow] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish flow",
    };
  }
}
