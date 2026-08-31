import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Standard response type for Server Actions
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Revalidate multiple paths at once
 *
 * @param paths - Array of paths to revalidate
 */
export async function revalidatePaths(paths: string[]): Promise<void> {
  paths.forEach((path) => revalidatePath(path));
}

/**
 * Redirect after successful action
 *
 * @param path - Path to redirect to
 * @throws Always throws to trigger redirect
 */
export async function redirectTo(path: string): Promise<never> {
  redirect(path);
}

/**
 * Get value from FormData trying key and Next.js prefixed keys (e.g. "1_name").
 * Use this when FormData may come from Server Action serialization.
 */
function getFormValue(formData: FormData, key: string): FormDataEntryValue | null {
  let value = formData.get(key);
  if (value != null) return value;
  value = formData.get(`1_${key}`);
  if (value != null) return value;
  for (const [k, v] of formData.entries()) {
    if (k === key || k.endsWith(`_${key}`)) return v;
  }
  return null;
}

/**
 * Extract string value from FormData safely
 *
 * @param formData - The FormData object
 * @param key - The key to extract
 * @param required - Whether the field is required
 * @returns The string value or null/undefined
 * @throws Error if required field is missing
 */
export function getFormString(
  formData: FormData,
  key: string,
  required = false,
): string | null {
  const value = getFormValue(formData, key);

  if (
    required &&
    (!value || typeof value !== "string" || (value as string).trim() === "")
  ) {
    throw new Error(`${key} is required`);
  }

  return value instanceof File ? null : (value as string)?.toString() || null;
}

/**
 * Extract number value from FormData safely
 *
 * @param formData - The FormData object
 * @param key - The key to extract
 * @param required - Whether the field is required
 * @returns The number value or null
 * @throws Error if required field is missing or invalid
 */
export function getFormNumber(
  formData: FormData,
  key: string,
  required = false,
): number | null {
  const value = getFormValue(formData, key);

  if (!value || typeof value !== "string") {
    if (required) {
      throw new Error(`${key} is required`);
    }
    return null;
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    if (required) {
      throw new Error(`${key} must be a valid number`);
    }
    return null;
  }

  return num;
}

/**
 * Extract boolean value from FormData
 *
 * @param formData - The FormData object
 * @param key - The key to extract
 * @returns boolean value (true if present and "true", false otherwise)
 */
export function getFormBoolean(formData: FormData, key: string): boolean {
  const value = getFormValue(formData, key);
  const str = value?.toString();
  return str === "true" || str === "on";
}
