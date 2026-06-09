'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'

type SitePin = { id: string; name: string; address: string; lat: number; lng: number; isLive: boolean }

type Props = { sites: SitePin[] }

export default function AllSitesMap({ sites }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const router = useRouter()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const valid = sites.filter(s => s.lat !== 0 || s.lng !== 0)
    if (valid.length === 0) return

    import('leaflet').then(L => {
      const map = L.map(containerRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      const bounds: [number, number][] = []

      valid.forEach(site => {
        const color = site.isLive ? '#4ade80' : '#FF6B1A'
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:12px;height:12px;
            background:${color};
            border:2px solid #fff;
            border-radius:50%;
            box-shadow:0 0 0 3px ${color}55;
            cursor:pointer;
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })

        L.marker([site.lat, site.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:system-ui;min-width:160px">
              <div style="font-size:11px;color:#999;margin-bottom:2px">${site.address}</div>
              <strong style="font-size:13px">${site.name}</strong><br/>
              <a href="/data/${site.id}" style="font-size:12px;color:#FF6B1A">View data →</a>
            </div>
          `)
          .on('click', () => router.push(`/data/${site.id}`))

        bounds.push([site.lat, site.lng])
      })

      if (bounds.length === 1) {
        map.setView(bounds[0], 15)
      } else {
        map.fitBounds(bounds, { padding: [40, 40] })
      }
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove(): void }).remove()
        mapRef.current = null
      }
    }
  }, [sites, router])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '360px',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        border: 'var(--bd-dark)',
        background: 'var(--asphalt-700)',
        marginBottom: 'var(--sp-8)',
      }}
    />
  )
}
