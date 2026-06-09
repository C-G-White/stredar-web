'use client'

import dynamic from 'next/dynamic'

const SiteMap = dynamic(() => import('./SiteMap'), { ssr: false })

export default function SiteMapWrapper({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return <SiteMap lat={lat} lng={lng} label={label} />
}
