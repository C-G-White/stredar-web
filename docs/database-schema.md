# Database Schema

## Connection

**Provider:** Neon Postgres (serverless)  
**Database name:** `stredar` — NOT the default `neondb`  
**Client:** `@neondatabase/serverless` via the `neon()` tagged template literal

```ts
// lib/db.ts — the single connection module
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(process.env.DATABASE_URL)
export default sql
```

Import `sql` from `@/lib/db` wherever queries are needed. Do not instantiate `neon()` elsewhere.

**Critical:** `DATABASE_URL` must always come from the environment. Never hardcode it — the credentials were committed to the public repo once and Neon auto-revoked them immediately. The pooled endpoint changes when credentials are rotated.

---

## Schema

Run `lib/schema.sql` once against the database to create tables and indexes.

```bash
psql $DATABASE_URL -f lib/schema.sql
```

### `sites`

Represents a physical Stredar deployment location.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK, `gen_random_uuid()` |
| `name` | `TEXT NOT NULL` | Display name, e.g. "Station Road" |
| `description` | `TEXT` | Optional extended description |
| `address` | `TEXT NOT NULL` | Human-readable address including county |
| `lat` | `DOUBLE PRECISION NOT NULL` | WGS 84 latitude |
| `lng` | `DOUBLE PRECISION NOT NULL` | WGS 84 longitude |
| `speed_limit_mph` | `INTEGER NOT NULL` | Posted speed limit for this road |
| `active` | `BOOLEAN NOT NULL DEFAULT true` | Only active sites are shown publicly |
| `api_key` | `TEXT UNIQUE` | Per-device secret (reserved — not yet enforced) |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | Provisioning timestamp |

### `readings`

One row per vehicle pass recorded by a device.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK, `gen_random_uuid()` |
| `site_id` | `UUID NOT NULL` | FK → `sites.id` |
| `speed_mph` | `INTEGER NOT NULL` | Measured vehicle speed |
| `direction` | `SMALLINT` | `1` = inbound, `-1` = outbound, `NULL` = unknown |
| `recorded_at` | `TIMESTAMPTZ NOT NULL` | Device-local timestamp of the pass |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | Server receipt timestamp |

---

## Indexes

```sql
-- Per-site time-ordered queries (most common access pattern)
CREATE INDEX readings_site_recorded ON readings (site_id, recorded_at DESC);

-- National aggregate queries (site grid page)
CREATE INDEX readings_recorded_at ON readings (recorded_at DESC);
```

Both indexes are covering for their respective query shapes. Do not remove them — the site grid query (`GROUP BY s.id` with `COUNT/AVG` over all readings) and the per-site reading list (`WHERE site_id = $1 ORDER BY recorded_at DESC LIMIT 1000`) both rely on them for acceptable performance.

---

## TypeScript Types

Types live in `lib/types.ts` and map directly to the schema:

```ts
export type Site = {
  id: string
  name: string
  description: string | null
  address: string
  lat: number
  lng: number
  speed_limit_mph: number
  active: boolean
  created_at: string
}

export type Reading = {
  id: string
  site_id: string
  speed_mph: number
  direction: 1 | -1 | null
  recorded_at: string
  created_at: string
}

export type SiteSummary = Site & {
  reading_count: number
  avg_speed_mph: number | null
  last_reading_at: string | null
}
```

`SiteSummary` is the result of the site grid aggregate query — `Site` columns plus three computed columns.

The Neon driver returns `Record<string, unknown>[]`. Always cast with `as Site[]` or `as SiteSummary[]` after a query — do not use `any`.

---

## Query Patterns

### Site grid (all active sites with aggregates)

```sql
SELECT
  s.id, s.name, s.address, s.lat, s.lng,
  s.speed_limit_mph, s.active, s.created_at,
  COUNT(r.id)::int             AS reading_count,
  ROUND(AVG(r.speed_mph))::int AS avg_speed_mph,
  MAX(r.recorded_at)           AS last_reading_at
FROM sites s
LEFT JOIN readings r ON r.site_id = s.id
WHERE s.active = true
GROUP BY s.id
ORDER BY s.name
```

Uses the `readings_site_recorded` index via the JOIN.

### Per-site reading history (latest 1,000)

```sql
SELECT speed_mph, direction, recorded_at
FROM readings
WHERE site_id = $1
ORDER BY recorded_at DESC
LIMIT 1000
```

Uses the `readings_site_recorded` composite index.

### Insert a reading (device ingest)

```sql
INSERT INTO readings (site_id, speed_mph, direction, recorded_at)
VALUES ($1, $2, $3, $4)
```

No `RETURNING` needed — the device only needs `{ ok: true }`.

---

## Demo Data

The database is seeded with 5 Norfolk demo sites and ~1,200 readings. To re-seed:

```bash
node scripts/seed-demo.mjs
```

The script reads `DATABASE_URL` from `.env.local`. It deletes all existing demo readings before inserting fresh ones. Do not run against production without verifying intent — it uses `DELETE FROM readings WHERE site_id IN (SELECT id FROM sites WHERE address ILIKE '%Norfolk%')`.

---

## Schema Migrations

There is no migration framework. The schema is simple and changes infrequently.

When a schema change is needed:
1. Add the DDL to `lib/schema.sql` (idempotent: use `IF NOT EXISTS`, `IF NOT EXISTS` for indexes, or `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`)
2. Run it against production via `psql $DATABASE_URL -f lib/schema.sql` or the Neon SQL editor
3. Update `lib/types.ts` to match
4. Commit both files together

For destructive changes (dropping columns, changing types), coordinate with any live queries that reference the column before running the DDL.
