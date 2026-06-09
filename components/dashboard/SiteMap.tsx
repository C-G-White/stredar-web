'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

type Props = { lat: number; lng: number; label: string }

export default function SiteMap({ lat, lng, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:14px;height:14px;
          background:var(--hivis-500,#FF6B1A);
          border:2px solid #fff;
          border-radius:50%;
          box-shadow:0 0 0 3px rgba(255,107,26,0.35);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<strong style="font-family:monospace">${label}</strong>`)
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove(): void }).remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, label])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '280px',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        border: 'var(--bd-dark)',
        background: 'var(--asphalt-700)',
      }}
    />
  )
}
