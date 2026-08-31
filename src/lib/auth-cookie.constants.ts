/** Cookie names — shared by client, middleware, and server (no js-cookie import). */
export const AUTH_TOKEN_COOKIE_KEY = "auth-token";
export const AUTH_REFRESH_TOKEN_COOKIE_KEY = "auth-refresh-token";

/**
 * Middleware forwards a freshly refreshed access token on the request so SSR
 * can authorize before Set-Cookie from this response is visible to `cookies()`.
 */
export const SSR_ACCESS_TOKEN_HEADER = "x-hexa-ssr-access-token";
