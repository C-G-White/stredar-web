export type Site = {
  id: string
  name: string
  description: string | null
  address: string
  lat: number
  lng: number
  speed_limit_mph: number
  active: boolean
  device_type: 'SC-1' | 'SC-2'
  created_at: string
}

export type Reading = {
  id: string
  site_id: string
  speed_mph: number
  direction: 1 | -1 | null  // 1 = inbound, -1 = outbound
  entry_speed_mph?: number | null  // display mode inbound only: speed on first detection
  exit_speed_mph?: number | null   // display mode inbound only: speed as vehicle left
  recorded_at: string
  created_at: string
}

export type SiteSummary = Site & {
  reading_count: number
  max_speed_mph: number | null
  last_reading_at: string | null
}

export type DeviceConfig = {
  site_id: string
  mode: 'auto' | 'monitor' | 'display'
  speed_limit_mph: number
  under_speed_mph: number
  auto_monitor_mins: number
  auto_display_mins: number
  text_slow_down: string
  text_thank_you: string
  updated_at: string
}

export type Telemetry = {
  id: string
  site_id: string
  cpu_temp_c: number | null
  ambient_temp_c: number | null
  battery_mv: number | null
  uptime_s: number | null
  mem_used_pct: number | null
  radar_connected: boolean | null
  mode: string | null
  firmware_version: string | null
  signal_rssi: number | null
  recorded_at: string
}

export type Command = {
  id: string
  site_id: string
  command: 'SET_MODE' | 'SET_THRESHOLDS' | 'SET_AUTO_TIMER' | 'SET_TEXTS' | 'REBOOT'
  params: Record<string, unknown>
  status: 'pending' | 'sent' | 'acked' | 'failed'
  created_at: string
  sent_at: string | null
  acked_at: string | null
}

// ── Scenario comparison reports ──────────────────────────────────────────────

export type Scenario = {
  id: string
  site_id: string
  name: string
  description: string | null
  starts_at: string
  ends_at: string | null  // null = ongoing (uses now() when a report is generated)
  created_at: string
}

export type DirectionStats = {
  count: number
  mean_speed_mph: number
  p85_speed_mph: number
}

export type ScenarioStats = {
  scenario_id: string
  name: string
  starts_at: string
  ends_at: string | null
  duration_days: number
  total_passes: number
  passes_per_day: number
  mean_speed_mph: number | null
  median_speed_mph: number | null
  p85_speed_mph: number | null
  max_speed_mph: number | null
  pct_over_limit: number | null
  by_direction: { inbound: DirectionStats | null; outbound: DirectionStats | null } | null
  display_effectiveness: {
    count: number
    mean_entry_mph: number
    mean_exit_mph: number
    mean_delta_mph: number
  } | null
}

export type ScenarioComparison = {
  a_scenario_id: string
  b_scenario_id: string
  delta_mean_speed_mph: number | null
  delta_p85_speed_mph: number | null
  delta_pct_over_limit: number | null
  delta_passes_per_day: number | null
  significant: boolean | null
  p_value: number | null
}

export type ReportStatsPayload = {
  speed_limit_mph: number
  scenarios: ScenarioStats[]
  comparisons: ScenarioComparison[]
}

export type Report = {
  id: string
  site_id: string
  title: string
  scenario_ids: string[]
  scenarios_snapshot: Scenario[]
  stats: ReportStatsPayload
  narrative: string
  generated_by: string | null
  created_at: string
}
