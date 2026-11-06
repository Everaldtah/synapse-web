import 'dotenv/config'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../src/lib/db/schema'
import fs from 'fs'
import path from 'path'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql, { schema })

  console.log('Pushing schema to database...')

  // Read and execute migration files manually using sql for raw SQL
  const migrationsDir = './drizzle'
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  for (const file of files) {
    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    console.log(`Executing ${file}...`)
    // Split by statement-breakpoint and execute each statement
    const statements = sqlContent.split('--> statement-breakpoint').filter(s => s.trim())
    for (const statement of statements) {
      if (statement.trim()) {
        // Use ordinary function call syntax for raw SQL (compatible with @neondatabase/serverless 0.10.4)
        await sql(statement.trim(), [])
      }
    }
  }

  console.log('Schema pushed successfully!')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})