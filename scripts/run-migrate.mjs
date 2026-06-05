import { Pool } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

const migrate = readFileSync(join(__dir, '../lib/migrate.sql'), 'utf8')

// Strip comment-only lines and split on semicolons
const statements = migrate
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.replace(/--[^\n]*/g, '').trim().length === 0)

for (const stmt of statements) {
  const clean = stmt.replace(/--[^\n]*/g, '').trim()
  if (!clean) continue
  try {
    await client.query(stmt)
    process.stdout.write('.')
  } catch (e) {
    console.error('\nFailed:', stmt.slice(0, 100))
    console.error(e.message)
    client.release()
    await pool.end()
    process.exit(1)
  }
}

client.release()
await pool.end()
console.log('\nMigration complete.')
