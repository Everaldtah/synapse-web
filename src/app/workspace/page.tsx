import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, BookOpen, Database, Clock, Star, FileText, FolderOpen, Search } from 'lucide-react'

export default async function WorkspaceHomePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Workspace</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your workspace overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/workspace/new" className="synapse-button-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Page
          </Link>
          <Link href="/workspace/new/database" className="synapse-button-primary flex items-center gap-2">
            <Database className="w-4 h-4" />
            New Database
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#6E56CF]" />
              Recent Pages
            </h2>
            <div className="synapse-card p-4">
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent pages yet. Create your first page to get started!
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Favorites
            </h2>
            <div className="synapse-card p-4">
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No favorites yet. Star pages to see them here.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#6E56CF]" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/workspace/new" className="synapse-page-tree-item group">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" />
                <span>New Page</span>
              </Link>
              <Link href="/workspace/new/database" className="synapse-page-tree-item group">
                <Database className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" />
                <span>New Database</span>
              </Link>
              <Link href="/workspace/new/template" className="synapse-page-tree-item group">
                <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" />
                <span>New from Template</span>
              </Link>
              <Link href="/workspace/import" className="synapse-page-tree-item group">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" />
                <span>Import Notes</span>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#6E56CF]" />
              AI Features
            </h2>
            <div className="space-y-2">
              <Link href="/workspace/agents" className="synapse-page-tree-item group">
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>AI Agents</span>
              </Link>
              <Link href="/workspace/models" className="synapse-page-tree-item group">
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#6E56CF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                <span>Free Models</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}