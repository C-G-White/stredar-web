import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dir, '..', '.env.local')
try {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
  }
} catch { /* env already set */ }

const sql = neon(process.env.DATABASE_URL)

await sql`ALTER TABLE reports ADD COLUMN IF NOT EXISTS user_context TEXT`

const cols = await sql`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'reports'
  ORDER BY ordinal_position
`
console.log('reports columns after migration:')
cols.forEach(c => console.log(' ', c.column_name, '·', c.data_type))
