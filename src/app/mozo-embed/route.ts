import { NextRequest, NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE_KEY } from "@/lib/auth-cookie.constants";

// Entry point used only when this app is loaded inside the Mozo iframe.
// The Mozo-widget bridge backend mints a short-lived HexaAI session (see
// mozo-widget/backend/server.js: /api/hexaai/embed-session) and sends the
// browser here with the resulting access token. This route's only job is to
// land that token as a cookie and hand off to the real page — every existing
// protected page renders exactly as it already does for a normal login.
//
// The cookie must be SameSite=None (not the app's usual "strict") because the
// top-level browsing context here is Mozo's origin, not ours — browsers never
// send SameSite=Strict/Lax cookies from inside a third-party iframe. This is
// scoped to this one bootstrap route; /login's cookie policy is untouched.
//
// Deliberately not in middleware's matcher list (see src/middleware.ts), so
// it's reachable with no existing session.

const ALLOWED_REDIRECTS = new Set(["/dashboard", "/calls"]);

// Deliberately NOT derived from request.url/nextUrl — behind a reverse proxy
// (Cloudflare, etc.) Next.js sees the internal bind address (e.g.
// localhost:8086), not the public host, which sent every redirect there
// instead of the real domain. Set NEXT_PUBLIC_APP_URL to the real public
// origin in production.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const requestedRedirect = request.nextUrl.searchParams.get("redirect");
  const redirectTo = ALLOWED_REDIRECTS.has(requestedRedirect ?? "")
    ? (requestedRedirect as string)
    : "/dashboard";

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(redirectTo, APP_URL));
  response.cookies.set(AUTH_TOKEN_COOKIE_KEY, token, {
    maxAge: 60 * 20, // matches the backend's 20-minute embedded session TTL
    path: "/",
    sameSite: "none",
    secure: true,
  });
  return response;
}
