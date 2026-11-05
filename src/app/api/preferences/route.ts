import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { preferences } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
      userId,
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

  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  const db = getDb()

  if (key) {
    const [pref] = await db
      .select()
      .from(preferences)
      .where(and(eq((preferences as any).userId, userId), eq((preferences as any).key, key)))
      .limit(1)
    return NextResponse.json({ preference: pref })
  }

  const prefs = await db
    .select()
    .from(preferences)
    .where(eq((preferences as any).userId, userId))

  return NextResponse.json({ preferences: prefs })
}