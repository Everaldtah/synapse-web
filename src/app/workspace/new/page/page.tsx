import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewPagePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const result = await getWorkspaceForClerkUser(userId)

  if (!result?.workspace) {
    redirect('/workspace')
  }
  const workspace = result.workspace

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/workspace/new" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#6E56CF]" />
            New Page
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create a blank page for notes</p>
        </div>
      </div>

      <div className="synapse-card p-6">
        <form action="/workspace/pages/create" method="POST" className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Untitled"
              className="synapse-input text-xl"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content (optional)
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Start writing..."
              className="synapse-input min-h-[300px] font-mono text-sm"
              rows={20}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link href="/workspace/new" className="synapse-button-secondary">
              Cancel
            </Link>
            <button type="submit" className="synapse-button-primary flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}