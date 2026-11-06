import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { preferences } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getWorkspaceForClerkUser(userId)
  if (!result?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const dbUserId = result.user.id

  const body = await req.json()
  const { key, value } = body

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
  }

  const db = getDb()

  // Upsert preference
  const [pref] = await db
    .insert(preferences)
    .values({
      userId: dbUserId,
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    })
    .onConflictDoUpdate({
      target: [preferences.userId, preferences.key],
      set: { value: typeof value === 'string' ? value : JSON.stringify(value), updatedAt: new Date() },
    })
    .returning()

  return NextResponse.json({ success: true, preference: pref })
}

export async function GET(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getWorkspaceForClerkUser(userId)
  if (!result?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const dbUserId = result.user.id

  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  const db = getDb()

  if (key) {
    const [pref] = await db
      .select()
      .from(preferences)
      .where(and(eq((preferences as any).userId, dbUserId), eq((preferences as any).key, key)))
      .limit(1)
    return NextResponse.json({ preference: pref })
  }

  const prefs = await db
    .select()
    .from(preferences)
    .where(eq((preferences as any).userId, dbUserId))

  return NextResponse.json({ preferences: prefs })
}