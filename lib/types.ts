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
