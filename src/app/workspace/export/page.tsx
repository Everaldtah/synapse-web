import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { pages, agentProfiles, preferences } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { Download, FileJson, FileText, Database, AlertCircle } from 'lucide-react'

export default async function ExportPage() {
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

  const allAgents = await db
    .select()
    .from(agentProfiles)
    .where(eq((agentProfiles as any).workspaceId, workspace.id))

  const allPrefs = await db
    .select()
    .from(preferences)
    .where(eq((preferences as any).userId, result.user.id))

  const exportData = {
    workspace: { id: workspace.id, name: workspace.name },
    pages: allPages,
    agents: allAgents,
    preferences: allPrefs,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }

  const json = JSON.stringify(exportData, null, 2)

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Download className="w-7 h-7 text-[#6E56CF]" />
            Export Data
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Download a complete backup of your workspace.
          </p>
        </div>
      </div>

      <div className="synapse-card p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allPages.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Agents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allAgents.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preferences</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{allPrefs.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Export Preview</h3>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto max-h-64">
            {json.slice(0, 2000)}{json.length > 2000 ? '...' : ''}
          </pre>
        </div>

        <div className="flex gap-4">
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`}
            download={`synapse-export-${workspace.name}-${new Date().toISOString().split('T')[0]}.json`}
            className="synapse-button-primary inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(json)}
            className="synapse-button-secondary inline-flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  )
}