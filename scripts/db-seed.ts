import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../src/lib/db/schema'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql, { schema })

  console.log('Seeding database...')
  // Add seed data here if needed
  console.log('Seeding complete!')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})