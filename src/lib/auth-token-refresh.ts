import Cookies from "js-cookie";

import {
  AUTH_REFRESH_TOKEN_COOKIE_KEY,
  AUTH_TOKEN_COOKIE_KEY,
} from "@/lib/auth-cookie.constants";
import { fetchAuthRefresh } from "@/lib/auth-refresh-api";
import { isAccessTokenExpired } from "@/lib/jwt.utils";
import { type AuthResponse } from "@/types/auth.types";

export { AUTH_REFRESH_TOKEN_COOKIE_KEY, AUTH_TOKEN_COOKIE_KEY } from "@/lib/auth-cookie.constants";

const PUBLIC_AUTH_PATH_FRAGMENTS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/invite",
  "/auth/accept-invite",
] as const;

/**
 * Auth endpoints that must not trigger access-token refresh (wrong-password 401, etc.).
 */
export function isPublicAuthApiPath(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  try {
    const path = url.startsWith("http") ? new URL(url).pathname : url;
    return PUBLIC_AUTH_PATH_FRAGMENTS.some((fragment) => path.includes(fragment));
  } catch {
    return PUBLIC_AUTH_PATH_FRAGMENTS.some((fragment) => url.includes(fragment));
  }
}

function applyAuthCookies(data: AuthResponse): void {
  if (data.accessToken) {
    Cookies.set(AUTH_TOKEN_COOKIE_KEY, data.accessToken, {
      path: "/",
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  if (data.refreshToken) {
    Cookies.set(AUTH_REFRESH_TOKEN_COOKIE_KEY, data.refreshToken, {
      path: "/",
      expires: 30,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}

let refreshInFlight: Promise<AuthResponse | null> | null = null;
let isLoggingOut = false;

/**
 * Clears auth cookies and redirects to login once (guards against concurrent logouts).
 */
export function clearAuthSessionAndRedirect(): void {
  if (typeof window === "undefined" || isLoggingOut) {
    return;
  }
  isLoggingOut = true;
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY, { path: "/" });
  Cookies.remove(AUTH_REFRESH_TOKEN_COOKIE_KEY, { path: "/" });
  window.location.href = "/login";
}

/**
 * Exchanges refresh cookie for a new session via POST /auth/refresh.
 * Single-flight: concurrent callers share one in-flight refresh.
 */
export async function refreshAuthSessionFromCookie(): Promise<AuthResponse | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  const refreshToken = Cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY);
  if (!refreshToken) {
    return null;
  }

  refreshInFlight = (async (): Promise<AuthResponse | null> => {
    try {
      const data = await fetchAuthRefresh(refreshToken);
      if (!data?.accessToken) {
        return null;
      }
      applyAuthCookies(data);
      return data;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/**
 * Returns a usable access token, refreshing proactively when missing or near expiry.
 */
export async function resolveClientAccessToken(): Promise<string | undefined> {
  let token = Cookies.get(AUTH_TOKEN_COOKIE_KEY);
  const refreshCookie = Cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY);

  if (token && !isAccessTokenExpired(token)) {
    return token;
  }

  if (!refreshCookie) {
    return token;
  }

  const session = await refreshAuthSessionFromCookie();
  return session?.accessToken ?? Cookies.get(AUTH_TOKEN_COOKIE_KEY) ?? token;
}
