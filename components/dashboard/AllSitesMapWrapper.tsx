'use client'

import dynamic from 'next/dynamic'

type SitePin = { id: string; name: string; address: string; lat: number; lng: number; isLive: boolean }

const AllSitesMap = dynamic(() => import('./AllSitesMap'), { ssr: false })

export default function AllSitesMapWrapper({ sites }: { sites: SitePin[] }) {
  return <AllSitesMap sites={sites} />
}
