# Authentication

## Overview

Stredar-web has two distinct authentication surfaces:

| Surface | Mechanism | Location |
|---|---|---|
| Device → platform ingest | Shared secret (`x-api-key` header) | `/api/ingest` |
| Per-device granular auth | `api_key` column on `sites` table | Not yet enforced — reserved |
| Admin / user sessions | None yet — not required at current scale | — |

There is intentionally no user-facing login. All speed data is public by design.

---

## Device Authentication (`/api/ingest`)

Devices authenticate with a static shared secret sent as an HTTP header:

```
POST /api/ingest
x-api-key: <INGEST_SECRET>
Content-Type: application/json
```

The server validates it against the `INGEST_SECRET` environment variable:

```ts
// app/api/ingest/route.ts
const apiKey = req.headers.get('x-api-key')
if (!apiKey || apiKey !== process.env.INGEST_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Rules:**
- `INGEST_SECRET` must be set in `.env.local` (local) and Vercel environment variables (production).
- Never hardcode the secret — the public GitHub repo caused an auto-revocation incident with Neon credentials. Apply the same discipline here.
- The value should be a random 32-byte hex string or similar. Generate with: `openssl rand -hex 32`

---

## Per-Device Key (Reserved)

The `sites` table has an `api_key TEXT UNIQUE` column. The intent is that each physical device gets its own secret, so a compromised unit can be revoked without affecting others. This is **not yet enforced** in `/api/ingest` — the shared `INGEST_SECRET` is used during the pilot phase when there is only one device.

When multiple devices are in the field, migrate to per-device auth:

```ts
// Future pattern — validate against sites.api_key
const row = await sql`
  SELECT id FROM sites WHERE api_key = ${apiKey} AND active = true LIMIT 1
`
if (!row[0]) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
const siteId = row[0].id
```

When this migration happens, remove `site_id` from the ingest payload — the device's identity determines the site.

---

## Public API (`/api/data`)

`GET /api/data` is unauthenticated. All speed data is publicly available by design. No API key or session is required.

---

## Adding User Auth (Future)

If a staff dashboard or admin interface is ever needed, use **NextAuth.js v5** (Auth.js) with the App Router adapter. Do not roll a custom session system. Key integration points:

- Wrap protected `(dashboard)` routes in a middleware check
- Store session in a JWT (stateless) — avoids adding a sessions table to Neon
- Use `auth()` from the NextAuth helper in Server Components; `useSession()` in Client Components

No user auth has been implemented. Do not add it unless there is a clear requirement.
