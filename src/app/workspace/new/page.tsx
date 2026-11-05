import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { FileText, Database, LayoutTemplate, Upload, ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function NewPage() {
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
        <Link href="/workspace" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create New</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Choose what you want to create</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/workspace/new/page" className="synapse-card p-6 flex flex-col items-center text-center gap-4 group hover:border-[#6E56CF] transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6E56CF] to-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New Page</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Blank page for notes</p>
          </div>
        </Link>

        <Link href="/workspace/new/database" className="synapse-card p-6 flex flex-col items-center text-center gap-4 group hover:border-[#6E56CF] transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New Database</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Structured data tables</p>
          </div>
        </Link>

        <Link href="/workspace/new/template" className="synapse-card p-6 flex flex-col items-center text-center gap-4 group hover:border-[#6E56CF] transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <LayoutTemplate className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">From Template</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pre-built structures</p>
          </div>
        </Link>

        <Link href="/workspace/import" className="synapse-card p-6 flex flex-col items-center text-center gap-4 group hover:border-[#6E56CF] transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Import</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">From file or URL</p>
          </div>
        </Link>
      </div>

      <div className="synapse-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Create</h2>
        <form action="/workspace/pages/create" method="POST" className="flex gap-3">
          <input
            type="text"
            name="title"
            placeholder="Page title..."
            className="synapse-input flex-1"
            required
          />
          <button type="submit" className="synapse-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </button>
        </form>
      </div>
    </div>
  )
}