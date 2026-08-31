/* eslint-disable no-console */
import { type NextRequest, NextResponse } from "next/server";

import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "@/common/constants/rbac.constant";
import { type UserRole } from "@/common/enums/user.types";
import {
  AUTH_REFRESH_TOKEN_COOKIE_KEY,
  AUTH_TOKEN_COOKIE_KEY,
  SSR_ACCESS_TOKEN_HEADER,
} from "@/lib/auth-cookie.constants";
import { fetchAuthRefresh } from "@/lib/auth-refresh-api";
import { isAccessTokenExpired } from "@/lib/jwt.utils";
import { canAccessRoute } from "@/lib/rbac.utils";
import { type AuthResponse } from "@/types/auth.types";

const isProduction = process.env.NODE_ENV === "production";

function applySessionCookies(res: NextResponse, session: AuthResponse): void {
  res.cookies.set(AUTH_TOKEN_COOKIE_KEY, session.accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict",
    secure: isProduction,
  });
  if (session.refreshToken) {
    res.cookies.set(AUTH_REFRESH_TOKEN_COOKIE_KEY, session.refreshToken, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "strict",
      secure: isProduction,
    });
  }
}

/**
 * Decode JWT token payload without verification
 * Note: This is safe in middleware as we're only using it for routing decisions
 * The API will still verify the token properly
 */
function decodeToken(token: string): {
  role?: string;
  userId?: string;
  companyId?: string;
  companyRole?: string;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded) as {
      role?: string;
      userId?: string;
      companyId?: string;
      companyRole?: string;
    } | null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

const COMPANY_ADMIN_ROUTES = ["/api-keys", "/whatsapp"];

type SessionRefreshState = {
  refreshedSession: AuthResponse | null;
  token: string | undefined;
};

type SessionRefreshContext = {
  req: NextRequest;
  path: string;
  state: SessionRefreshState;
  isProtectedRoute: boolean;
  hasRefreshToken: boolean;
};

async function tryApplySessionRefresh(
  ctx: SessionRefreshContext,
): Promise<NextResponse | null> {
  const { req, path, state, isProtectedRoute, hasRefreshToken } = ctx;
  if (!isProtectedRoute || !hasRefreshToken) {
    return null;
  }
  if (state.token && !isAccessTokenExpired(state.token)) {
    return null;
  }
  const rawRefresh = req.cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)?.value;
  if (!rawRefresh) {
    return null;
  }
  const session = await fetchAuthRefresh(rawRefresh);
  if (!session?.accessToken) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("redirect", path);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(AUTH_TOKEN_COOKIE_KEY);
    res.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE_KEY);
    return res;
  }
  state.refreshedSession = session;
  state.token = session.accessToken;
  return null;
}

function buildContinueResponse(
  req: NextRequest,
  refreshedSession: AuthResponse | null,
): NextResponse {
  if (!refreshedSession?.accessToken) {
    return NextResponse.next();
  }
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(SSR_ACCESS_TOKEN_HEADER, refreshedSession.accessToken);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  applySessionCookies(res, refreshedSession);
  return res;
}

function redirectWithSessionCookies(
  url: URL,
  refreshedSession: AuthResponse | null,
): NextResponse {
  const res = NextResponse.redirect(url);
  if (refreshedSession) {
    applySessionCookies(res, refreshedSession);
  }
  return res;
}

function evaluateProtectedRbac(
  req: NextRequest,
  path: string,
  token: string,
  refreshedSession: AuthResponse | null,
): NextResponse {
  const continueRequest = () => buildContinueResponse(req, refreshedSession);
  const redirectWithCookies = (url: URL) =>
    redirectWithSessionCookies(url, refreshedSession);

  const decodedToken = decodeToken(token);
  const userRole = decodedToken?.role as UserRole | undefined;
  const companyRole = decodedToken?.companyRole;

  if (!userRole) {
    console.warn(
      "[middleware] missing userRole in token, allowing request to proceed",
      { path },
    );
    return continueRequest();
  }

  if (COMPANY_ADMIN_ROUTES.some((route) => path.startsWith(route))) {
    const isPlatformAdmin = !decodedToken?.companyId;
    if (isPlatformAdmin) {
      return continueRequest();
    }
    if (companyRole !== "admin" && companyRole !== "owner") {
      const dashboardUrl = new URL("/dashboard", req.nextUrl);
      dashboardUrl.searchParams.set("error", "unauthorized");
      return redirectWithCookies(dashboardUrl);
    }
    return continueRequest();
  }

  if (!canAccessRoute(userRole, path)) {
    const dashboardUrl = new URL("/dashboard", req.nextUrl);
    dashboardUrl.searchParams.set("error", "unauthorized");
    return redirectWithCookies(dashboardUrl);
  }

  return continueRequest();
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const state: SessionRefreshState = {
    refreshedSession: null,
    token:
      req.cookies.get(AUTH_TOKEN_COOKIE_KEY)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", ""),
  };

  const hasRefreshToken = !!req.cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route));

  const refreshRedirect = await tryApplySessionRefresh({
    req,
    path,
    state,
    isProtectedRoute,
    hasRefreshToken,
  });
  if (refreshRedirect) {
    return refreshRedirect;
  }

  if (isProtectedRoute && !state.token && !hasRefreshToken) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && state.token && path !== "/") {
    return redirectWithSessionCookies(
      new URL("/dashboard", req.nextUrl),
      state.refreshedSession,
    );
  }

  if (isProtectedRoute && state.token) {
    return evaluateProtectedRbac(
      req,
      path,
      state.token,
      state.refreshedSession,
    );
  }

  return buildContinueResponse(req, state.refreshedSession);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/calls/:path*",
    "/campaigns/:path*",
    "/invite-user/:path*",
    "/scripts/:path*",
    "/conversation-flow/:path*",
    "/agents/:path*",
    "/company-settings/:path*",
    "/api-keys/:path*",
    "/rewards/:path*",
    "/profile/:path*",
    "/admin/team/:path*",
    "/admin/companies/:path*",
    "/admin/inbound-insights/:path*",
    "/admin/outbound-insights/:path*",
    "/admin/requests/:path*",
    "/admin/whatsapp-config/:path*",
    "/whatsapp/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/accept-invite",
  ],
};
