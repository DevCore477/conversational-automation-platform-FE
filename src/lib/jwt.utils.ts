type JwtPayloadWithExp = {
  exp?: number;
};

function decodeJwtPayload<T extends JwtPayloadWithExp>(
  token: string,
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob !== "undefined"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** True when the JWT is missing `exp` or is within `bufferSeconds` of expiry. */
export function isAccessTokenExpired(
  token: string,
  bufferSeconds = 30,
): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }
  return Date.now() >= payload.exp * 1000 - bufferSeconds * 1000;
}
