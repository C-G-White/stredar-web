import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dir, '..', '.env.local')
try {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
  }
} catch { /* env already set */ }

const sql = neon(process.env.DATABASE_URL)

// Show current sites
const before = await sql`SELECT id, name, address, active FROM sites ORDER BY name`
console.log('Before:')
before.forEach(s => console.log(`  [${s.active ? 'ACTIVE' : 'inactive'}] ${s.name} — ${s.address}`))

// Deactivate demo sites (everything that isn't the real SC-1 unit)
const result = await sql`
  UPDATE sites
  SET active = false
  WHERE name NOT LIKE 'SC-1%'
`
console.log(`\nDeactivated ${result.count} demo sites`)

const after = await sql`SELECT id, name, address, active FROM sites ORDER BY name`
console.log('\nAfter:')
after.forEach(s => console.log(`  [${s.active ? 'ACTIVE' : 'inactive'}] ${s.name} — ${s.address}`))
