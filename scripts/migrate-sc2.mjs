// Adds device_type column to sites for SC-2 data-only unit support.
// Run once: node scripts/migrate-sc2.mjs

import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

await sql`
  ALTER TABLE sites
  ADD COLUMN IF NOT EXISTS device_type TEXT NOT NULL DEFAULT 'SC-1'
`
console.log('Done: device_type column added to sites (existing rows default to SC-1)')
