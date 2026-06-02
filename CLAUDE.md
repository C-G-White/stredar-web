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
- `app/globals.css` — full Stredar design token set + base reset
- `components/dashboard/SpeedMap.tsx` — client component, lazy-loads Leaflet

## Design conventions

Design tokens live in `globals.css` (synced from `../stredar/colors_and_type.css`). Use CSS custom properties directly in inline styles; no Tailwind. Key patterns:

- `--bd-accent` (3px hi-vis left border) on active/alerting cards
- `--font-led` + `--led-amber` for speed number display
- `--over-500` / `--warn-500` / `--ok-500` for speed state colours
- `t-label` class for all caps mono eyebrows and metadata
