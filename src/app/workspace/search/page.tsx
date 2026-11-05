import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import SearchClient from './SearchClient'

export default async function SearchPage() {
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

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Search</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Search across all your pages and databases.
          </p>
        </div>
      </div>

      <SearchClient pages={allPages as any} workspaceId={workspace.id} />
    </div>
  )
}