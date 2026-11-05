import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { Database, ArrowLeft, Table, List, Calendar, Users, Target } from 'lucide-react'
import Link from 'next/link'

export default async function NewDatabasePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const result = await getWorkspaceForClerkUser(userId)

  if (!result?.workspace) {
    redirect('/workspace')
  }
  const workspace = result.workspace

  const templates = [
    {
      id: 'tasks',
      name: 'Task Tracker',
      description: 'Kanban-style task management with status, priority, assignee',
      icon: List,
      color: 'from-blue-500 to-cyan-500',
      columns: ['Title', 'Status', 'Priority', 'Assignee', 'Due Date']
    },
    {
      id: 'projects',
      name: 'Project Tracker',
      description: 'Track projects with progress, timeline, and team',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      columns: ['Project', 'Status', 'Progress', 'Owner', 'Deadline']
    },
    {
      id: 'crm',
      name: 'Simple CRM',
      description: 'Contacts, companies, deals, and pipeline stages',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      columns: ['Name', 'Company', 'Email', 'Stage', 'Value', 'Last Contact']
    },
    {
      id: 'content',
      name: 'Content Calendar',
      description: 'Plan and track content across channels',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      columns: ['Title', 'Type', 'Channel', 'Status', 'Publish Date', 'Author']
    },
    {
      id: 'inventory',
      name: 'Inventory Manager',
      description: 'Track items, quantities, locations, and reorder points',
      icon: Table,
      color: 'from-indigo-500 to-blue-500',
      columns: ['Item', 'SKU', 'Category', 'Quantity', 'Location', 'Reorder At']
    },
    {
      id: 'blank',
      name: 'Blank Database',
      description: 'Start with a clean slate - add your own columns',
      icon: Database,
      color: 'from-gray-500 to-gray-600',
      columns: []
    }
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/workspace/new" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Database className="w-7 h-7 text-green-500" />
            New Database
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Choose a template or start blank</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Link
            key={template.id}
            href={`/workspace/databases/create?template=${template.id}`}
            className="synapse-card p-6 group hover:border-[#6E56CF] transition-colors"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <template.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{template.description}</p>
            {template.columns.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {template.columns.map((col, i) => (
                  <span key={col} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                    {col}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}