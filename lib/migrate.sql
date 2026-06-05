-- Incremental migration — run once to add device management tables.
-- psql $DATABASE_URL -f lib/migrate.sql
--
-- Safe to re-run: all statements use IF NOT EXISTS / DO NOTHING.

-- ── device_config ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_config (
  site_id           UUID     PRIMARY KEY REFERENCES sites(id) ON DELETE CASCADE,
  mode              TEXT     NOT NULL DEFAULT 'display',
  speed_limit_mph   INTEGER  NOT NULL DEFAULT 30,
  under_speed_mph   INTEGER  NOT NULL DEFAULT 5,
  auto_monitor_mins INTEGER  NOT NULL DEFAULT 10,
  auto_display_mins INTEGER  NOT NULL DEFAULT 5,
  text_slow_down    TEXT     NOT NULL DEFAULT 'SLOW DOWN',
  text_thank_you    TEXT     NOT NULL DEFAULT 'THANK YOU',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── telemetry ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS telemetry (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          UUID    NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  cpu_temp_c       REAL,
  ambient_temp_c   REAL,
  battery_mv       INTEGER,
  uptime_s         INTEGER,
  mem_used_pct     REAL,
  radar_connected  BOOLEAN,
  mode             TEXT,
  firmware_version TEXT,
  signal_rssi      INTEGER,
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS telemetry_site_recorded
  ON telemetry (site_id, recorded_at DESC);

-- ── commands ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commands (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id    UUID    NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  command    TEXT    NOT NULL,
  params     JSONB   NOT NULL DEFAULT '{}',
  status     TEXT    NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at    TIMESTAMPTZ,
  acked_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS commands_site_status
  ON commands (site_id, status, created_at);

-- ── Per-device api_key: generate for any site that doesn't have one ───────────
UPDATE sites
SET api_key = encode(gen_random_bytes(24), 'hex')
WHERE api_key IS NULL;

-- ── Seed device_config defaults for all existing sites ───────────────────────
INSERT INTO device_config (site_id, speed_limit_mph)
SELECT s.id, s.speed_limit_mph
FROM sites s
WHERE NOT EXISTS (
  SELECT 1 FROM device_config dc WHERE dc.site_id = s.id
);
