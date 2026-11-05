import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Upload, FileText, FolderOpen, ArrowUpDown, AlertCircle, CheckCircle } from 'lucide-react'

export default async function ImportPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Import Notes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bring your existing knowledge into Synapse. Supports Markdown, Obsidian, Notion exports, and ZIP archives.
        </p>
      </div>

      <div className="synapse-card p-6 space-y-6">
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Drag & drop or click to select</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Supports: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">.md</code>,
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">.markdown</code>,
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">.txt</code>,
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">.zip</code>
          </p>
          <input
            type="file"
            multiple
            accept=".md,.markdown,.txt,.zip"
            className="sr-only"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="synapse-button-secondary inline-flex items-center gap-2 cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
            Choose Files
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImportFormatCard
            icon={FileText}
            title="Markdown Files"
            description="Import individual .md files or folders of Markdown notes. Frontmatter and wiki-links preserved."
          />
          <ImportFormatCard
            icon={FolderOpen}
            title="Obsidian Vault"
            description="Import entire Obsidian vaults with folder structure, attachments, and internal links intact."
          />
          <ImportFormatCard
            icon={FileText}
            title="Notion Export"
            description="Import Notion Markdown & CSV exports. Page hierarchy and databases converted automatically."
          />
          <ImportFormatCard
            icon={Upload}
            title="Synapse ZIP Export"
            description="Full-fidelity import from Synapse iOS app export. Preserves all blocks, databases, history, and assets."
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Import Notes</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Trashed pages and templates can be included optionally</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Assets (images, files) are uploaded to private Vercel Blob storage</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Wiki-style links [[Page Name]] are resolved to internal page references</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Database schemas, views, and rows are fully reconstructed</li>
            <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" /> Large imports (over 100MB) may take several minutes</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">iPhone Synapse Users</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Export from the iOS app: Settings → Import/Export → Export Workspace → Save to Files → Upload the ZIP here.
          Your notes, databases, history, and attachments will be restored with full fidelity.
        </p>
      </div>
    </div>
  )
}

function ImportFormatCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-[#6E56CF]" />
      </div>
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}