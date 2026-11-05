import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages, preferences } from '@/lib/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { Star, FileText, ChevronRight } from 'lucide-react'

export default async function FavoritesPage() {
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

  // Get user's favorite page IDs from preferences
  const favPref = await db
    .select()
    .from(preferences)
    .where(and(
      eq((preferences as any).userId, userId),
      eq((preferences as any).key, 'favorites')
    ))
    .limit(1)

  let favoriteIds: string[] = []
  if (favPref.length > 0 && favPref[0].value) {
    try {
      favoriteIds = JSON.parse(favPref[0].value as string)
    } catch {
      favoriteIds = []
    }
  }

  // Get the actual page data for favorites
  const favoritePages = favoriteIds.length > 0
    ? await db
        .select()
        .from(pages)
        .where(
          and(
            eq((pages as any).workspaceId, workspace.id),
            inArray((pages as any).id, favoriteIds)
          )
        )
        .orderBy(desc((pages as any).updatedAt))
        .then(rows => rows as any[])
    : []

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Star className="w-7 h-7 text-yellow-500" />
            Favorites
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Quick access to your starred pages.
          </p>
        </div>
      </div>

      <div className="synapse-card">
        {favoritePages.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Star pages to see them here for quick access.</p>
            <Link href="/workspace" className="synapse-button-primary inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create a page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {favoritePages.map(page => (
              <Link
                key={page.id}
                href={`/workspace/pages/${page.id}`}
                className="synapse-page-tree-item flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {page.title}
                  </p>
                  {page.content && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {page.content.slice(0, 100)}...
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}