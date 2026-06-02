-- Run once against your Neon database to initialise the schema.
-- psql $DATABASE_URL -f lib/schema.sql

CREATE TABLE IF NOT EXISTS sites (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT            NOT NULL,
  description     TEXT,
  address         TEXT            NOT NULL,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  speed_limit_mph INTEGER         NOT NULL,
  active          BOOLEAN         NOT NULL DEFAULT true,
  api_key         TEXT            UNIQUE,  -- per-device secret for ingest auth
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS readings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID        NOT NULL REFERENCES sites(id),
  speed_mph   INTEGER     NOT NULL,
  direction   SMALLINT,   -- 1 = inbound, -1 = outbound, NULL = unknown
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Covering index for per-site time-ordered queries
CREATE INDEX IF NOT EXISTS readings_site_recorded
  ON readings (site_id, recorded_at DESC);

-- Index for national aggregate queries
CREATE INDEX IF NOT EXISTS readings_recorded_at
  ON readings (recorded_at DESC);
