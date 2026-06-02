'use client'

import { useEffect, useRef } from 'react'
import type { SiteSummary } from '@/lib/types'

type Props = { sites: SiteSummary[] }

function markerColor(avg: number | null, limit: number) {
  if (avg == null) return '#9AA2AB'
  if (avg > limit) return '#F0463C'
  if (avg > limit * 0.9) return '#FFC21A'
  return '#19C37D'
}

export default function SpeedMap({ sites }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let map: import('leaflet').Map

    import('leaflet').then(({ default: L }) => {
      // Centre on England; leaflet requires a real DOM element
      map = L.map(containerRef.current!).setView([52.5, -1.5], 6)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      sites.forEach(site => {
        const color = markerColor(site.avg_speed_mph, site.speed_limit_mph)
        const icon = L.divIcon({
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,.8);box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        L.marker([site.lat, site.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<strong style="font-family:sans-serif">${site.name}</strong><br>` +
            `<span style="font-family:monospace">${site.avg_speed_mph ?? '–'} mph avg / ${site.speed_limit_mph} mph limit</span>`
          )
      })
    })

    return () => { map?.remove() }
  }, [sites])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
