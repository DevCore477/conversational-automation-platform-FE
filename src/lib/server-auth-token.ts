import "server-only";

import { cookies } from "next/headers";

import { isGlobalPlatformAdmin } from "@/lib/rbac.utils";

export type AuthTokenPayload = {
  companyId?: string;
  role?: string;
};

export function decodeAuthTokenPayload(
  token: string,
): AuthTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded) as AuthTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Global admin without a tenant in the JWT — must not call `/companies/me`
 * (returns 403). Prefer this over `/users/me` when that endpoint is missing.
 */
export function isPlatformAdminPayload(
  decoded: AuthTokenPayload | null,
): boolean {
  return isGlobalPlatformAdmin(decoded);
}

export async function getAuthTokenPayloadFromCookies(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return null;
  }
  return decodeAuthTokenPayload(token);
}
