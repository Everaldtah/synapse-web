import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { LayoutTemplate, ArrowLeft, FileText, BookOpen, Calendar, CheckSquare, Lightbulb, Target, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function NewTemplatePage() {
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
      id: 'meeting-notes',
      name: 'Meeting Notes',
      description: 'Structured template for meeting notes with action items',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      category: 'Work'
    },
    {
      id: 'project-plan',
      name: 'Project Plan',
      description: 'Comprehensive project planning with milestones and tasks',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      category: 'Work'
    },
    {
      id: 'daily-journal',
      name: 'Daily Journal',
      description: 'Daily reflection with gratitude, goals, and notes',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      category: 'Personal'
    },
    {
      id: 'weekly-review',
      name: 'Weekly Review',
      description: 'End-of-week reflection and planning template',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      category: 'Personal'
    },
    {
      id: 'meeting-1on1',
      name: '1:1 Meeting',
      description: 'Template for effective 1:1 meetings with team members',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      category: 'Work'
    },
    {
      id: 'decision-log',
      name: 'Decision Log',
      description: 'Record and track important decisions with context',
      icon: Lightbulb,
      color: 'from-pink-500 to-rose-500',
      category: 'Work'
    },
    {
      id: 'okr',
      name: 'OKR Planning',
      description: 'Objectives and Key Results planning template',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
      category: 'Work'
    },
    {
      id: 'research-notes',
      name: 'Research Notes',
      description: 'Structured template for research with sources and insights',
      icon: FileText,
      color: 'from-teal-500 to-cyan-500',
      category: 'Learning'
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
            <LayoutTemplate className="w-7 h-7 text-purple-500" />
            Templates
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Start with a pre-built structure</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Link
            key={template.id}
            href={`/workspace/pages/create?template=${template.id}`}
            className="synapse-card p-6 group hover:border-[#6E56CF] transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <template.icon className="w-7 h-7 text-white" />
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full self-start">
                {template.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}