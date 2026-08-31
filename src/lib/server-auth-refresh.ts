import "server-only";

import { cookies, headers } from "next/headers";
import { cache } from "react";

import {
  AUTH_REFRESH_TOKEN_COOKIE_KEY,
  AUTH_TOKEN_COOKIE_KEY,
  SSR_ACCESS_TOKEN_HEADER,
} from "@/lib/auth-cookie.constants";
import { fetchAuthRefresh } from "@/lib/auth-refresh-api";
import { isAccessTokenExpired } from "@/lib/jwt.utils";

/**
 * Resolves a Bearer access token for server-side API calls:
 * 1) Middleware-refreshed token on the request (same navigation as Set-Cookie)
 * 2) auth-token cookie
 * 3) If only refresh cookie exists, POST /auth/refresh (deduped per request via cache)
 */
export const resolveServerAccessToken = cache(
  async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get(AUTH_TOKEN_COOKIE_KEY)?.value;
    if (fromCookie && !isAccessTokenExpired(fromCookie)) {
      return fromCookie;
    }

    const headerList = await headers();
    const fromMiddleware = headerList.get(SSR_ACCESS_TOKEN_HEADER);
    if (fromMiddleware) {
      return fromMiddleware;
    }

    const refresh = cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)?.value;
    if (!refresh) {
      return undefined;
    }

    const session = await fetchAuthRefresh(refresh);
    return session?.accessToken;
  },
);
