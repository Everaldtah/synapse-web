import { getDb } from './index'
import { users, workspaces } from './schema'
import { eq } from 'drizzle-orm'

export async function getWorkspaceForClerkUser(clerkId: string) {
  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  if (!user) return null
  const [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId, user.id)).limit(1)
  return { user, workspace }
}
