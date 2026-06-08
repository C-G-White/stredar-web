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

-- ── Device configuration (one row per site, upserted by admin) ───────────────
CREATE TABLE IF NOT EXISTS device_config (
  site_id           UUID     PRIMARY KEY REFERENCES sites(id) ON DELETE CASCADE,
  mode              TEXT     NOT NULL DEFAULT 'display', -- auto | monitor | display
  speed_limit_mph   INTEGER  NOT NULL DEFAULT 30,
  under_speed_mph   INTEGER  NOT NULL DEFAULT 5,
  auto_monitor_mins INTEGER  NOT NULL DEFAULT 10,
  auto_display_mins INTEGER  NOT NULL DEFAULT 5,
  text_slow_down    TEXT     NOT NULL DEFAULT 'SLOW DOWN',
  text_thank_you    TEXT     NOT NULL DEFAULT 'THANK YOU',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Device health telemetry (time-series, one row per push ≈ 60s) ────────────
CREATE TABLE IF NOT EXISTS telemetry (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          UUID    NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  cpu_temp_c       REAL,
  ambient_temp_c   REAL,     -- NULL until DS18B20 sensor fitted
  battery_mv       INTEGER,  -- NULL until INA219 sensor fitted
  uptime_s         INTEGER,
  mem_used_pct     REAL,
  radar_connected  BOOLEAN,
  mode             TEXT,
  firmware_version TEXT,
  signal_rssi      INTEGER,  -- NULL when 4G not present
  wifi_networks    TEXT[],   -- SSIDs visible to the unit at last scan
  wifi_ssid        TEXT,     -- SSID the unit is currently connected to (null if not on WiFi)
  connection_type  TEXT,     -- 'wifi' | '4g' | null
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS telemetry_site_recorded
  ON telemetry (site_id, recorded_at DESC);

-- ── Command queue (admin → Pi, polled every 10s) ─────────────────────────────
CREATE TABLE IF NOT EXISTS commands (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id    UUID    NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  command    TEXT    NOT NULL,  -- SET_MODE | SET_THRESHOLDS | SET_AUTO_TIMER | SET_TEXTS | REBOOT
  params     JSONB   NOT NULL DEFAULT '{}',
  status     TEXT    NOT NULL DEFAULT 'pending', -- pending | sent | acked | failed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at    TIMESTAMPTZ,
  acked_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS commands_site_status
  ON commands (site_id, status, created_at);
