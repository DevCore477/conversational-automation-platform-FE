/**
 * Extract a user-facing error message from an unknown error (e.g. axios or thrown).
 * Use this in stores and UI for consistent error handling.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (error === null || error === undefined) {
    return fallback;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object") {
    const obj = error as Record<string, unknown>;
    const msg = (obj.response as { data?: { message?: string } } | undefined)
      ?.data?.message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
    const direct = obj.message;
    if (typeof direct === "string" && direct.trim()) {
      return direct;
    }
  }
  return fallback;
}
