"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { getFormString, getFormBoolean } from "@/lib/action-utils";
import { serverApi } from "@/lib/server-api";
import {
  type CreateScriptDto,
  type UpdateScriptDto,
  type CallScript,
  type ScriptStats,
} from "@/types/script.types";

function decodeToken(token: string): { companyId?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function getCompanyId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.companyId || null;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  script?: CallScript;
}

export async function getScripts(): Promise<{
  success: boolean;
  data?: CallScript[];
  error?: string;
}> {
  try {
    const scripts = (await serverApi.get<CallScript[]>("/call-scripts")).data;
    return { success: true, data: scripts };
  } catch (error) {
    console.error("[getScripts] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch scripts",
    };
  }
}

export async function getScriptsByCompanyId(companyId: string): Promise<{
  success: boolean;
  data?: CallScript[];
  error?: string;
}> {
  try {
    const scripts = (
      await serverApi.get<CallScript[]>(`/call-scripts/company/${companyId}`)
    ).data;
    return { success: true, data: scripts };
  } catch (error) {
    console.error("[getScriptsByCompanyId] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch scripts",
    };
  }
}

export async function getActiveScripts(): Promise<{
  success: boolean;
  data?: CallScript[];
  error?: string;
}> {
  try {
    const scripts = (await serverApi.get<CallScript[]>("/call-scripts/active"))
      .data;
    return { success: true, data: scripts };
  } catch (error) {
    console.error("[getActiveScripts] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch active scripts",
    };
  }
}

export async function getScriptStatsAction(): Promise<{
  success: boolean;
  data?: ScriptStats;
  error?: string;
}> {
  try {
    const stats = (await serverApi.get<ScriptStats>("/call-scripts/stats"))
      .data;
    return { success: true, data: stats };
  } catch (error) {
    console.error("[getScriptStats] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch script stats",
    };
  }
}

/**
 * Server Actions for Script Management
 *
 * These actions handle all script mutations:
 * - Create
 * - Update
 * - Delete
 * - Toggle Active
 * - Set Default
 *
 * All actions automatically revalidate the /scripts page
 * to ensure fresh data is displayed.
 */

function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { status?: number; data?: unknown } })
      .response;
    if (res?.data && typeof res.data === "object" && "message" in res.data) {
      const msg = (res.data as { message?: string }).message;
      if (typeof msg === "string") return msg;
    }
    if (res?.status === 401)
      return "Unauthorized. Please sign in again or refresh the page.";
    if (res?.status === 403) return "You don't have permission to do this.";
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

/**
 * Create a new script
 */
export async function createScript(
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const name = getFormString(formData, "name", true);
    const description = getFormString(formData, "description") || "";
    const script = getFormString(formData, "script", true);
    const firstMessage = getFormString(formData, "firstMessage");
    const callType = getFormString(formData, "callType", true) as
      | "inbound"
      | "outbound"
      | "both";
    const isActive = getFormBoolean(formData, "isActive");
    const model = getFormString(formData, "model") || "gpt-4";
    const voiceId = getFormString(formData, "voiceId") || undefined;
    const isDefault = getFormBoolean(formData, "isDefault");
    const companyIdFromForm = getFormString(formData, "companyId");
    const companyId = companyIdFromForm || (await getCompanyId());

    if (!companyId) {
      return { success: false, error: "Company not found" };
    }

    const dto: CreateScriptDto = {
      name: name!,
      description,
      script: script!,
      firstMessage: firstMessage || undefined,
      model,
      voiceId,
      callType: callType!,
      isActive,
      isDefault,
      companyId,
    };

    const createdScript = (await serverApi.post("/call-scripts", dto)).data;

    revalidatePath("/scripts");

    return { success: true, script: createdScript };
  } catch (error) {
    console.error("[createScript] Error:", error);
    return {
      success: false,
      error: getApiErrorMessage(error),
    };
  }
}

/**
 * Update an existing script
 */
export async function updateScript(
  scriptId: string,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const name = getFormString(formData, "name", true);
    const description = getFormString(formData, "description") || "";
    const script = getFormString(formData, "script", true);
    const firstMessage = getFormString(formData, "firstMessage");
    const callType = getFormString(formData, "callType", true) as
      | "inbound"
      | "outbound"
      | "both";
    const isActive = getFormBoolean(formData, "isActive");
    const model = getFormString(formData, "model") || undefined;
    const voiceId = getFormString(formData, "voiceId") || undefined;

    const dto: UpdateScriptDto = {
      name: name!,
      description,
      script: script!,
      firstMessage: firstMessage || undefined,
      model,
      voiceId,
      callType: callType!,
      isActive,
    };

    await serverApi.patch(`/call-scripts/${scriptId}`, dto);

    revalidatePath("/scripts");

    return { success: true };
  } catch (error) {
    console.error("[updateScript] Error:", error);
    return {
      success: false,
      error: getApiErrorMessage(error),
    };
  }
}

/**
 * Delete a script
 */
export async function deleteScript(scriptId: string): Promise<ActionResponse> {
  try {
    await serverApi.delete(`/call-scripts/${scriptId}`);

    // Revalidate the scripts page
    revalidatePath("/scripts");

    return { success: true };
  } catch (error) {
    console.error("[deleteScript] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete script",
    };
  }
}

/**
 * Toggle script active status
 */
export async function toggleScriptActive(
  scriptId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.patch(`/call-scripts/${scriptId}/toggle-active`);

    // Revalidate the scripts page
    revalidatePath("/scripts");

    return { success: true };
  } catch (error) {
    console.error("[toggleScriptActive] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle script status",
    };
  }
}

/**
 * Set script as default
 */
export async function setDefaultScript(
  scriptId: string,
): Promise<ActionResponse> {
  try {
    await serverApi.post(`/call-scripts/set-default`, { scriptId });

    // Revalidate the scripts page
    revalidatePath("/scripts");

    return { success: true };
  } catch (error) {
    console.error("[setDefaultScript] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to set default script",
    };
  }
}
