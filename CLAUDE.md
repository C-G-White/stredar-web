# stredar-web

Next.js 15 website for the Stredar community speed initiative. Two purposes on one domain: public marketing and live national speed data dashboard.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and INGEST_SECRET
npm run dev                  # http://localhost:3000
```

Requires a Neon Postgres database. Run `lib/schema.sql` against it once to create tables.

## Route structure

| Route | Group | Notes |
|---|---|---|
| `/` | `(marketing)` | Home page |
| `/how-it-works` | `(marketing)` | Device explainer |
| `/join` | `(marketing)` | Community sign-up |
| `/councils` | `(marketing)` | Local authority page |
| `/data` | `(dashboard)` | Grid of all active sites |
| `/data/[siteId]` | `(dashboard)` | Individual site stats + readings |

Route groups share their layout but share the root `app/layout.tsx` (fonts, globals). Marketing uses a light concrete background; dashboard uses dark asphalt.

## API routes

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/ingest` | `x-api-key: INGEST_SECRET` | Devices post speed readings |
| GET | `/api/data` | None | Public: all site summaries |
| GET | `/api/data?site_id=<uuid>` | None | Public: site reading history |

## Key files

- `lib/db.ts` — Neon serverless SQL client (tagged template literal)
- `lib/types.ts` — `Site`, `Reading`, `SiteSummary` types
- `lib/schema.sql` — one-time DB setup script
- `app/globals.css` — full Stredar design token set, typography helpers, responsive layout utilities
- `components/dashboard/LiveAnalytics.tsx` — client component, polls `/api/data` every 30s
- `components/dashboard/SpeedMap.tsx` — client component, lazy-loads Leaflet
- `components/dashboard/SiteGrid.tsx` — server component, direct SQL
- `app/actions/join.ts` / `app/actions/councils.ts` — Server Actions for form submissions
- `scripts/seed-demo.mjs` — seeds 5 Norfolk demo sites + ~1,200 readings from `.env.local`

## Standards documents

Full standards are in `docs/`. Read the relevant doc before making changes in that area.

| Topic | Document |
|---|---|
| Device auth, API keys, future user auth | [`docs/authentication.md`](docs/authentication.md) |
| Server Component SQL, client polling, cache headers | [`docs/data-fetching.md`](docs/data-fetching.md) |
| Server Actions, forms, Resend email, ingest API | [`docs/data-mutations.md`](docs/data-mutations.md) |
| Tables, indexes, types, query patterns, migrations | [`docs/database-schema.md`](docs/database-schema.md) |
| Design tokens, typography, responsive classes, card patterns | [`docs/ui-conventions.md`](docs/ui-conventions.md) |

## Design conventions (summary)

Full detail in [`docs/ui-conventions.md`](docs/ui-conventions.md). Key rules:

- Design tokens from `globals.css` via `var(--token)` in inline styles. No Tailwind.
- Responsive grids use CSS utility classes (`cols-2`, `cols-2-1`, `cols-4`, etc.) — not inline `gridTemplateColumns`.
- `--bd-accent` (3px hi-vis left/top border) on active, alerting, or first-in-sequence items.
- `--font-led` + colour token for any speed number display.
- `--over-500` / `--warn-500` / `--ok-500` for speed state semantics.
- `.t-label` for all-caps mono eyebrows and metadata.
