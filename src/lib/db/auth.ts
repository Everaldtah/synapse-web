import { getDb } from './index'
import { users, workspaces } from './schema'
import { eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

export async function getWorkspaceForClerkUser(clerkId: string) {
  const db = getDb()

  let [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)

  if (!user) {
    // Webhook may not have fired (or DB was reset). Hydrate from Clerk.
    const clerkUser = await currentUser()
    const primaryEmail =
      clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses[0]?.emailAddress

    if (!primaryEmail) return null

    await db
      .insert(users)
      .values({
        clerkId,
        email: primaryEmail,
        name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || null,
        imageUrl: clerkUser?.imageUrl || null,
        emailVerified: clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.verification?.status === 'verified'
          ? new Date()
          : null,
      })
      .onConflictDoNothing()

    const [existing] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
    user = existing
    if (!user) return null
  }

  let [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId, user.id)).limit(1)

  if (!workspace) {
    await db.insert(workspaces).values({ userId: user.id, name: 'My Workspace' }).onConflictDoNothing()
    const [w] = await db.select().from(workspaces).where(eq(workspaces.userId, user.id)).limit(1)
    workspace = w
  }

  if (!workspace) return null
  return { user, workspace }
}
