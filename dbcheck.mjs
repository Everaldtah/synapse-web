import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
console.log('TABLES:', tables.map(t => t.table_name).join(', '))
const u = await sql`SELECT id, clerk_id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 10`
console.log('USERS:', JSON.stringify(u, null, 2))
const w = await sql`SELECT id, user_id, name FROM workspaces LIMIT 10`
console.log('WORKSPACES:', JSON.stringify(w, null, 2))
