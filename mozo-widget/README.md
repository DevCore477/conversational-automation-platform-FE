# Mozo App Store Widget

Minimal Mozo App Store app: a plain HTML/JS iframe frontend plus a tiny
Express backend that holds the OAuth secrets. Lives alongside the main
HexaAI-FE app but is otherwise standalone (own `package.json` files, own
`node_modules`).

```
mozo-widget/
├── frontend/          # what you build, zip, and upload
│   ├── src/
│   │   ├── widget/index.html        # iframe slot (e.g. guest-header)
│   │   └── admin-config/index.html  # admin-config slot
│   ├── build.mjs       # copies src/ → dist/, then zips dist/ → app-bundle.zip
│   ├── dev.mjs         # static dev server on :5175
│   └── package.json
└── backend/            # what you run yourself (your server, your secrets)
    ├── server.js        # Express: token proxy + API proxy + webhook receiver
    ├── .env.example
    └── package.json
```

## Quick start

### 1. Run the backend

```bash
cd mozo-widget/backend
cp .env.example .env
# Fill in MOZO_CLIENT_ID, MOZO_CLIENT_SECRET, MOZO_WEBHOOK_SECRET, MOZO_API_URL
npm install
npm run dev
# → Mozo minimal backend listening on http://localhost:3001
```

Requires Node 20+ (uses `node --env-file`).

### 2. Run the frontend (dev)

```bash
cd mozo-widget/frontend
npm run dev
# → Widget:       http://localhost:5175/widget/index.html
# → Admin config: http://localhost:5175/admin-config/index.html
# → Host sim:     http://localhost:5175/host-simulator.html
```

In the admin-config UI, set **Backend URL** to `http://localhost:3001`, type
your venue ID, and hit **Connect**.

`host-simulator.html` is dev-only (lives outside `src/`, not part of the
upload bundle) — it iframes the real widget and simulates the Mozo host's
`mozo:init` postMessage, since the widget does nothing useful when opened
standalone.

The widget itself only does anything useful when it's actually embedded in
the Mozo host — it waits for a `postMessage({ type: "mozo:init", payload: { session } })`
from the parent frame before it can call the backend. Opening
`widget/index.html` standalone will show "Running standalone" in the log.

### 3. Build the upload bundle

```bash
cd mozo-widget/frontend
npm run build
# → frontend/app-bundle.zip
```

Requires the `zip` CLI (present by default on macOS/Linux).

Upload `app-bundle.zip` via `POST /v4/app-store/app/:app_id/bundle`. The
backend is not uploaded — host it yourself and register its public URL with
Mozo for webhooks, and point the admin-config UI at it.

## Backend API surface

| Method | Path                   | Purpose                                                    |
| ------ | ---------------------- | ----------------------------------------------------------- |
| `GET`  | `/healthz`             | Liveness probe.                                              |
| `POST` | `/auth/token`          | Confirms Mozo credentials work for a venue. Caches the token. |
| `GET`  | `/hexaai/activity`     | Proxies recent call activity from the one HexaAI company this app represents. |
| `GET`  | `/hexaai/embed-session` | Mints a real HexaAI session and returns the URL to open the actual app, logged in. |
| `POST` | `/webhooks/mozo`       | Receives Mozo webhook deliveries. Verifies HMAC signature.   |

If you're pointing the widget at a backend mounted under a prefix (e.g. your
main API's `/mozo/*`, as documented below), set `BACKEND_URL` to include that
prefix — the paths above are relative to whatever `BACKEND_URL` resolves to.

`/auth/token` requires a `venue_id` (it's per-venue Mozo OAuth). The two
`/hexaai/*` routes don't — this is a single-tenant app (see below), so there's
nothing venue-specific to look up. Mozo tokens are cached per venue and
refreshed automatically when within 60s of expiry.

Webhook signatures are verified as `HMAC_SHA256(timestamp + "." + raw_body)`
using `MOZO_WEBHOOK_SECRET`, checked against the `x-mozo-signature` header
(with `x-mozo-timestamp` supplying the timestamp).

CORS is locked down via `ALLOWED_ORIGINS` (comma-separated) in `.env` — add
your deployed frontend origin there once it's not just `localhost:5175`.

## Using your own HexaAI app as the widget content

**This is a single-tenant app**: every Mozo venue that installs it sees the
same one HexaAI company's data. There is no "connect your account" step, no
per-venue API key, nothing to paste into admin-config. That's a deliberate
choice, not a shortcut — a general-purpose company API key was never the
right credential for "let a stranger's iframe log someone into the product,"
so this doesn't use one. Instead:

- The bridge backend holds one fixed value, `MOZO_BRIDGE_SHARED_SECRET` — a
  secret shared only between this bridge and your HexaAI backend, never
  exposed in any UI, never handed to a venue owner.
- As soon as the Mozo host hands the widget a session, it **automatically**
  mints an embedded HexaAI session for your company and takes the user
  straight into the real app — no click, no login, no key. If that fails
  (misconfigured secret, HexaAI API unreachable), it falls back to a
  lightweight activity feed via `GET /hexaai/activity`.

### Opening the real app, not a custom-built page

The widget's default behavior gives users the actual HexaAI-FE app instead of
a hand-built summary. This needed one real constraint to work around: the
app's login cookies are `SameSite=strict`, so they never reach a cross-site
iframe — a plain `<iframe src="https://app.gethexa.ai/dashboard">` would just
show a login screen.

The fix, in three pieces:

1. **HexaAI backend** (not this repo): `POST /auth/embedded-session`, guarded
   by `X-Mozo-Bridge-Secret` (not an API key — see above), mints a short-lived
   (20 min) real session for your one company. Scoped to a restricted
   `member`-role synthetic user, not full admin.
2. **This bridge** (`server.js`, or your own backend's equivalent route):
   `GET /hexaai/embed-session` calls that endpoint and returns
   `{ embedUrl: "<HEXAAI_APP_URL>/mozo-embed?token=...&redirect=/dashboard" }`.
3. **HexaAI-FE app**: `src/app/mozo-embed/route.ts` — a bootstrap route (not
   gated by the normal auth middleware) that takes that token, sets it as the
   app's normal session cookie but with `SameSite=none; Secure` (scoped to
   *this one route*; `/login`'s cookie policy is untouched), then redirects to
   `/dashboard` or `/calls`. From there, every existing page renders exactly
   as it already does — no page-level changes.

**Known limitation:** the embedded session has the same read/write reach as
any invited "member" over calls/scripts/agents — there's no true read-only
JWT tier yet. Don't point `redirect` at a page with destructive actions.
Sessions also don't refresh (no refresh token is issued) — after 20 minutes
the user is bounced to `/login` inside the iframe and needs to reopen the
widget to get a fresh one.

## Known gaps

- **The one that matters most now**: with no per-venue credential at all, the
  only thing that should stand between "a real Mozo request" and "anyone who
  finds this URL" is verifying the iframe session token the widget sends as
  `Authorization: Bearer <token>` against Mozo's public key
  (`GET {MOZO_API_URL}/v4/app-store/auth/public-key`). That verification
  **isn't implemented yet** — this backend currently treats that token as a
  trusted hint. Fine for local testing against a backend only you can reach;
  **do not deploy this publicly until that's fixed**, since right now anyone
  who discovers the bridge's URL could mint themselves a live session.
- Token cache is in-memory; restarting the backend wipes it.
- No persistence, no Docker, no CI.
