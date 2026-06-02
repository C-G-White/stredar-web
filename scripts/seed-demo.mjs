// Seed the database with demo data derived from the operator dashboard fixture data.
// Run once: node scripts/seed-demo.mjs

import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set. Add it to .env.local first.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

const SITES = [
  { name: 'High Street',   address: 'High Street, Fakenham, Norfolk',     lat: 52.8268, lng: 0.8473, limit: 30 },
  { name: 'Mill Road',     address: 'Mill Road, Swaffham, Norfolk',        lat: 52.6506, lng: 0.6841, limit: 30 },
  { name: 'Dereham Road',  address: 'Dereham Road, East Dereham, Norfolk', lat: 52.6802, lng: 0.9393, limit: 40 },
  { name: 'School Lane',   address: 'School Lane, Holt, Norfolk',          lat: 52.9063, lng: 1.0874, limit: 20 },
  { name: 'Yarmouth Road', address: 'Yarmouth Road, Aylsham, Norfolk',     lat: 52.7944, lng: 1.2562, limit: 50 },
]

// Histogram counts per bin [well under → well over] — from design system fixture data
const HIST = [
  [60,  240, 520, 340, 90,  34 ],  // High St  — mostly compliant
  [10,  60,  180, 320, 250, 142],  // Mill Rd  — significant speeding
  [40,  180, 420, 760, 480, 226],  // Dereham  — mixed, busy road
  [220, 210, 80,  22,  6,   2  ],  // School   — very good compliance
  [],                               // Yarmouth — offline, no readings
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function speedForBin(limit, bin) {
  const ranges = [
    [Math.max(5, limit - 20), limit - 11],
    [limit - 10, limit - 6],
    [limit - 5,  limit - 1],
    [limit,      limit + 4],
    [limit + 5,  limit + 9],
    [limit + 10, limit + 18],
  ]
  const [min, max] = ranges[bin]
  return randInt(min, max)
}

function randomTimestamp() {
  const now = Date.now()
  const dayMs = 86400000
  const daysAgo = Math.floor(Math.random() * 7)
  const peaks = [[7, 9], [12, 13], [16, 18]]
  const [hMin, hMax] = peaks[randInt(0, 2)]
  const d = new Date(now - daysAgo * dayMs)
  d.setHours(randInt(hMin, hMax), randInt(0, 59), randInt(0, 59), 0)
  return d.toISOString()
}

async function main() {
  console.log('Clearing existing Norfolk demo data…')
  const existing = await sql`SELECT id FROM sites WHERE address LIKE '%, Norfolk'`
  for (const row of existing) {
    await sql`DELETE FROM readings WHERE site_id = ${row.id}`
  }
  await sql`DELETE FROM sites WHERE address LIKE '%, Norfolk'`

  console.log('Inserting demo sites…')
  const siteIds = []
  for (const s of SITES) {
    const rows = await sql`
      INSERT INTO sites (name, address, lat, lng, speed_limit_mph, active)
      VALUES (${s.name}, ${s.address}, ${s.lat}, ${s.lng}, ${s.limit}, true)
      RETURNING id
    `
    siteIds.push(rows[0].id)
    console.log(`  ${s.name} → ${rows[0].id}`)
  }

  console.log('Generating readings…')
  let total = 0
  for (let i = 0; i < SITES.length; i++) {
    const hist = HIST[i]
    if (!hist.length) { console.log(`  ${SITES[i].name} — offline, skipping`); continue }

    const histTotal = hist.reduce((a, b) => a + b, 0)
    const target = 300

    const readings = []
    for (let bin = 0; bin < hist.length; bin++) {
      const n = Math.round((hist[bin] / histTotal) * target)
      for (let k = 0; k < n; k++) {
        readings.push({
          site_id: siteIds[i],
          speed_mph: speedForBin(SITES[i].limit, bin),
          direction: Math.random() > 0.5 ? 1 : -1,
          recorded_at: randomTimestamp(),
        })
      }
    }

    for (const r of readings) {
      await sql`
        INSERT INTO readings (site_id, speed_mph, direction, recorded_at)
        VALUES (${r.site_id}, ${r.speed_mph}, ${r.direction}, ${r.recorded_at})
      `
    }
    total += readings.length
    console.log(`  ${SITES[i].name} — ${readings.length} readings`)
  }

  console.log(`\nDone. ${total} total readings inserted.`)
}

main().catch(err => { console.error(err); process.exit(1) })
