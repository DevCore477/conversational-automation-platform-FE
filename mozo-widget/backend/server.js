// Minimal backend for a Mozo App Store app.
//
// Responsibilities:
//   1. Hold the OAuth client_id / client_secret server-side.
//   2. Exchange them for an app access token, cache it per venue, and refresh on expiry.
//   3. Proxy a couple of authenticated calls to the Mozo App Store API.
//   4. Receive webhooks and verify the HMAC signature.
//
// Run with `npm start`. See README.md for the full setup.

import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

const {
  MOZO_API_URL = "http://localhost:4000",
  MOZO_CLIENT_ID = "",
  MOZO_CLIENT_SECRET = "",
  MOZO_WEBHOOK_SECRET = "",
  PORT = "3001",
  ALLOWED_ORIGINS = "http://localhost:5175",
  // HexaAI API key auth — CONFIRM these against the real backend before relying
  // on them. Defaults assume `Authorization: Bearer <key>`, same as the JWT
  // session header; flip HEXAAI_API_KEY_HEADER/HEXAAI_API_KEY_PREFIX in .env
  // if the real scheme differs (e.g. a dedicated `X-API-Key` header).
  HEXAAI_API_URL = "https://api.gethexa.ai",
  HEXAAI_API_KEY_HEADER = "Authorization",
  HEXAAI_API_KEY_PREFIX = "Bearer"
} = process.env;

const ALLOWED = new Set(ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean));

const app = express();

// --- CORS (small and explicit) -----------------------------------------------

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// --- Token cache -------------------------------------------------------------
// One token per venue. Refreshed automatically when within 60s of expiry.

const tokenCache = new Map(); // venue_id -> { access_token, expires_at }

async function getAppAccessToken(venueId) {
  const cached = tokenCache.get(venueId);
  if (cached && cached.expires_at - Date.now() > 60_000) return cached.access_token;

  if (!MOZO_CLIENT_ID || !MOZO_CLIENT_SECRET) {
    throw new Error("MOZO_CLIENT_ID / MOZO_CLIENT_SECRET not set in .env");
  }

  const res = await fetch(`${MOZO_API_URL}/v4/app-store/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: MOZO_CLIENT_ID,
      client_secret: MOZO_CLIENT_SECRET,
      venue_id: venueId
    })
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
    throw new Error(`token exchange failed: ${msg}`);
  }

  const data = json?.data || {};
  const ttl  = (data.expires_in ?? 3600) * 1000;
  tokenCache.set(venueId, {
    access_token: data.access_token,
    expires_at:   Date.now() + ttl
  });
  return data.access_token;
}

async function mozoFetch(path, { venueId, method = "GET", body } = {}) {
  const token = await getAppAccessToken(venueId);
  const res = await fetch(`${MOZO_API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json?.data ?? null;
}

// --- HexaAI account linking ---------------------------------------------------
// Maps a Mozo venue to a HexaAI company API key (generated from the HexaAI
// /api-keys page). In-memory only — same caveat as the token cache: restart
// wipes it, and a real deployment needs durable storage, not a Map.

const hexaaiKeys = new Map(); // venue_id -> api_key

async function hexaaiFetch(path, { venueId } = {}) {
  const apiKey = hexaaiKeys.get(venueId);
  if (!apiKey) {
    throw new Error("No HexaAI API key linked for this venue yet. Connect one first.");
  }

  const headers = { "Content-Type": "application/json" };
  headers[HEXAAI_API_KEY_HEADER] = HEXAAI_API_KEY_PREFIX
    ? `${HEXAAI_API_KEY_PREFIX} ${apiKey}`
    : apiKey;

  const res = await fetch(`${HEXAAI_API_URL}${path}`, { headers });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message || json?.error?.message || `HTTP ${res.status}`;
    throw new Error(`HexaAI API request failed: ${msg}`);
  }
  return json;
}

function requireVenue(req, res) {
  const venueId = req.body?.venue_id || req.query?.venue_id;
  if (!venueId) {
    res.status(400).json({ error: "venue_id is required" });
    return null;
  }
  return String(venueId);
}

// --- Routes ------------------------------------------------------------------

app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Frontend (admin-config) calls this to "connect" — it tells the backend which
// venue to operate on, and confirms credentials work. The token never crosses
// the wire to the browser.
app.post("/api/auth/token", express.json(), async (req, res) => {
  const venueId = requireVenue(req, res);
  if (!venueId) return;

  try {
    await getAppAccessToken(venueId);
    res.json({ connected: true, venue_id: venueId });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/menu", async (req, res) => {
  const venueId = requireVenue(req, res);
  if (!venueId) return;

  try {
    const data = await mozoFetch("/v4/app-store/api/menu", { venueId });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  const venueId = requireVenue(req, res);
  if (!venueId) return;

  try {
    const data = await mozoFetch("/v4/app-store/api/orders", { venueId });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Admin-config calls this once the user pastes in a HexaAI API key generated
// from their own /api-keys page. The key never reaches Mozo.
app.post("/api/hexaai/connect", express.json(), (req, res) => {
  const venueId = requireVenue(req, res);
  if (!venueId) return;

  const apiKey = req.body?.api_key;
  if (!apiKey) return res.status(400).json({ error: "api_key is required" });

  hexaaiKeys.set(venueId, apiKey);
  res.json({ connected: true, venue_id: venueId });
});

app.get("/api/hexaai/dashboard", async (req, res) => {
  const venueId = requireVenue(req, res);
  if (!venueId) return;

  try {
    const data = await hexaaiFetch("/dashboard-stats/overview", { venueId });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// --- Webhook receiver --------------------------------------------------------
// Mozo signs every delivery as HMAC_SHA256(timestamp + "." + raw_body) using
// the signing_secret you registered with PUT /v4/app-store/app/:app_id/webhook.

app.post(
  "/webhooks/mozo",
  express.raw({ type: "application/json" }),
  (req, res) => {
    if (!MOZO_WEBHOOK_SECRET) {
      console.warn("[webhook] MOZO_WEBHOOK_SECRET is not set; refusing delivery");
      return res.status(500).json({ error: "webhook secret not configured" });
    }

    const rawBody   = req.body.toString("utf8");
    const timestamp = req.header("x-mozo-timestamp") || "";
    const signature = req.header("x-mozo-signature") || "";
    const eventType = req.header("x-mozo-event")     || "";

    const expected = createHmac("sha256", MOZO_WEBHOOK_SECRET)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "utf8");
    const expBuf = Buffer.from(expected,  "utf8");
    const valid  = sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf);

    if (!valid) {
      console.warn(`[webhook] invalid signature for event=${eventType}`);
      return res.status(401).json({ error: "invalid signature" });
    }

    let payload = null;
    try { payload = JSON.parse(rawBody); } catch { /* ignore */ }
    console.log(`[webhook] received event=${eventType}`, payload);

    res.status(200).json({ received: true });
  }
);

// --- Start -------------------------------------------------------------------

app.listen(Number(PORT), () => {
  console.log(`Mozo minimal backend listening on http://localhost:${PORT}`);
  console.log(`  Allowed origins: ${[...ALLOWED].join(", ") || "(none)"}`);
  console.log(`  Mozo API:        ${MOZO_API_URL}`);
});
