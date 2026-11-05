import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages, preferences } from '@/lib/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { Trash2, FileText, ChevronRight, RotateCcw, Trash } from 'lucide-react'

export default async function TrashPage() {
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

  // Get user's trashed page IDs from preferences
  const trashPref = await db
    .select()
    .from(preferences)
    .where(and(
      eq((preferences as any).userId, userId),
      eq((preferences as any).key, 'trash')
    ))
    .limit(1)

  let trashIds: string[] = []
  if (trashPref.length > 0 && trashPref[0].value) {
    try {
      trashIds = JSON.parse(trashPref[0].value as string)
    } catch {
      trashIds = []
    }
  }

  // Get the actual page data for trashed pages
  const trashedPages = trashIds.length > 0
    ? await db
        .select()
        .from(pages)
        .where(
          and(
            eq((pages as any).workspaceId, workspace.id),
            inArray((pages as any).id, trashIds)
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
            <Trash2 className="w-7 h-7 text-red-500" />
            Trash
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Deleted pages. Empty trash to permanently delete.
          </p>
        </div>
      </div>

      <div className="synapse-card">
        {trashedPages.length === 0 ? (
          <div className="p-12 text-center">
            <Trash2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Trash is empty</h3>
            <p className="text-gray-500 dark:text-gray-400">Deleted pages will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {trashedPages.map(page => (
              <div
                key={page.id}
                className="synapse-page-tree-item flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0" />
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
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}