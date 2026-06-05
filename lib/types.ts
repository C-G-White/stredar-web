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
  direction: 1 | -1 | null  // 1 = inbound, -1 = outbound
  recorded_at: string
  created_at: string
}

export type SiteSummary = Site & {
  reading_count: number
  avg_speed_mph: number | null
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
