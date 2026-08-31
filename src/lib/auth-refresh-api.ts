import { type AuthResponse } from "@/types/auth.types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai";

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return typeof Reflect.get(value, "accessToken") === "string";
}

/**
 * POST /auth/refresh — fetch only, safe for Edge middleware and Node RSC.
 */
export async function fetchAuthRefresh(
  refreshToken: string,
): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${baseURL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data: unknown = await res.json();
    if (!isAuthResponse(data)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
