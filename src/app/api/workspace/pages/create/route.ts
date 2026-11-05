import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getWorkspaceForClerkUser(userId)

  if (!result?.workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
  }
  const workspace = result.workspace

  const formData = await req.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string || ''

  if (!title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const db = getDb()
  const [page] = await db.insert(pages).values({
    workspaceId: workspace.id,
    title: title.trim(),
    content,
    parentId: null,
  }).returning()

  return NextResponse.redirect(new URL(`/workspace/pages/${page.id}`, req.url))
}