import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import GraphView, { type PageNode } from './GraphView'

export default async function GraphPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const result = await getWorkspaceForClerkUser(userId)
  if (!result?.workspace) {
    redirect('/workspace')
  }
  const workspace = result.workspace

  const db = getDb()
  const allPages = await db
    .select()
    .from(pages)
    .where(eq((pages as any).workspaceId, workspace.id))
    .orderBy(desc((pages as any).updatedAt))

  return <GraphView pages={allPages as unknown as PageNode[]} workspaceId={workspace.id} />
}