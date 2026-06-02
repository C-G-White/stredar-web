# Data Fetching

## Principles

- **Server Components fetch directly** — no API round-trip. Use `sql` from `@/lib/db` inside async Server Components.
- **Client Components poll the public API** — never import `sql` in a `'use client'` file. Use `fetch('/api/data?...')` instead.
- **No third-party data library** — no SWR, no React Query. Server Component fetching and `useEffect`/`setInterval` polling cover all current use cases.
- **`force-dynamic` for live data pages** — any page that must not be statically cached at build time exports `export const dynamic = 'force-dynamic'`.

---

## Server Component Pattern

Import `sql` directly. Cast the result to the expected type from `@/lib/types`.

```ts
// components/dashboard/SiteGrid.tsx (Server Component — no 'use client')
import sql from '@/lib/db'
import type { SiteSummary } from '@/lib/types'

async function getSites(): Promise<SiteSummary[]> {
  const rows = await sql`
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
  `
  return rows as SiteSummary[]
}
```

Always cast with `as YourType[]` — the Neon driver returns `Record<string, unknown>[]`.

### Single-row lookups

```ts
async function getSite(id: string): Promise<Site | null> {
  const rows = await sql`SELECT * FROM sites WHERE id = ${id} AND active = true LIMIT 1`
  return (rows[0] as Site) ?? null
}
```

Return `null` on not-found and handle it with Next.js `notFound()` in the page component.

---

## Preventing Static Caching

Pages that query live data must opt out of static generation:

```ts
// At the top of the page file, after imports
export const dynamic = 'force-dynamic'
```

Required on: `/data` (site grid), `/data/[siteId]` (site detail). Not required on marketing pages — they contain no live data.

---

## Client-Side Polling Pattern

Used in `LiveAnalytics` — polling `/api/data?site_id=` every 30 seconds.

```ts
'use client'

const POLL_INTERVAL = 30_000

export default function LiveAnalytics({ siteId, speedLimitMph }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/data?site_id=${siteId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const readings = await res.json()
      setStats(compute(readings, speedLimitMph))
      setLastUpdated(new Date())
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [siteId, speedLimitMph])

  useEffect(() => {
    fetchData()
    const poll = setInterval(fetchData, POLL_INTERVAL)
    return () => clearInterval(poll)
  }, [fetchData])
  // ...
}
```

**Rules for client polling:**
- Always pass `{ cache: 'no-store' }` to `fetch` to bypass the browser cache.
- Always clean up the interval in the `useEffect` return.
- Wrap `fetchData` in `useCallback` with its dependencies to prevent stale closures and unnecessary re-subscriptions.
- Show a `"Updated X seconds ago"` indicator — see the `secondsAgo` pattern in `LiveAnalytics.tsx`.

---

## API Route (`/api/data`)

The public data API serves both the client polling and any external consumers.

| Request | Response |
|---|---|
| `GET /api/data` | All active sites with aggregated stats (avg speed, reading count, last reading) |
| `GET /api/data?site_id=<uuid>` | Last 1,000 readings for one site, ordered `recorded_at DESC` |

Cache headers are set on the response — not on the route itself:

```ts
return NextResponse.json(rows, {
  headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
})
```

- Site list: `s-maxage=60, stale-while-revalidate=120`
- Per-site readings: `s-maxage=30, stale-while-revalidate=60`

These allow Vercel's edge cache to serve stale data while revalidating, reducing Neon connections at scale.

---

## SQL Safety

The `neon()` tagged template literal parameterises all values automatically — there is no string interpolation of user input. Always write queries as tagged templates:

```ts
// Correct — parameterised
const rows = await sql`SELECT * FROM sites WHERE id = ${siteId}`

// Never do this — SQL injection risk
const rows = await sql(`SELECT * FROM sites WHERE id = '${siteId}'`)
```

Never build query strings by concatenation.
