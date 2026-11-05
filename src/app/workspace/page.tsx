import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  BookOpen,
  Database,
  Clock,
  Star,
  FileText,
  FolderOpen,
  Search,
  Sparkles,
  Bot,
  Globe,
  CheckCircle,
  Shield,
  Layers,
} from 'lucide-react'

export default async function WorkspaceHomePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Workspace</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Welcome back. Pick up where you left off or create something new.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/workspace/new" className="synapse-button-secondary flex items-center gap-2 px-5 py-2.5">
            <Plus className="w-4 h-4" />
            New Page
          </Link>
          <Link href="/workspace/new/database" className="synapse-button-primary flex items-center gap-2 px-5 py-2.5">
            <Database className="w-4 h-4" />
            New Database
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentPages />
          <Favorites />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <AIHub />
        </div>
      </div>
    </div>
  )
}

function RecentPages() {
  return (
    <section className="synapse-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#6E56CF]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Pages</h2>
        </div>
        <Link href="/workspace/search" className="text-sm text-[#6E56CF] hover:text-[#5B4BC4] font-medium">
          View all
        </Link>
      </div>
      <div className="synapse-card p-4 border-none">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 opacity-50" />
          No recent pages yet — create your first page to get started!
        </p>
      </div>
    </section>
  )
}

function Favorites() {
  return (
    <section className="synapse-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Favorites</h2>
        </div>
        <Link href="/workspace/favorites" className="text-sm text-[#6E56CF] hover:text-[#5B4BC4] font-medium">
          View all
        </Link>
      </div>
      <div className="synapse-card p-4 border-none">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 flex items-center justify-center gap-2">
          <Star className="w-5 h-5 opacity-50 text-yellow-500" />
          No favorites yet — star pages to see them here.
        </p>
      </div>
    </section>
  )
}

function QuickActions() {
  return (
    <section className="synapse-card p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-[#6E56CF]" />
        Quick Actions
      </h2>
      <div className="space-y-2">
        <QuickActionLink
          href="/workspace/new"
          icon={<FileText className="w-5 h-5" />}
          title="New Page"
          subtitle="Start a blank page with rich blocks"
        />
        <QuickActionLink
          href="/workspace/new/database"
          icon={<Database className="w-5 h-5" />}
          title="New Database"
          subtitle="Table, board, list, or gallery view"
        />
        <QuickActionLink
          href="/workspace/new/template"
          icon={<BookOpen className="w-5 h-5" />}
          title="New from Template"
          subtitle="Quick-start with a pre-built layout"
        />
        <QuickActionLink
          href="/workspace/import"
          icon={<Search className="w-5 h-5" />}
          title="Import Notes"
          subtitle="Obsidian, Notion, Markdown, or ZIP"
        />
      </div>
    </section>
  )
}

function QuickActionLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Link
      href={href}
      className="synapse-page-tree-item group flex items-center gap-3 p-3"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6E56CF] bg-[#6E56CF]/10 group-hover:bg-[#6E56CF]/20 transition-colors">
        {icon}
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#6E56CF] transition-colors">
          {title}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </Link>
  )
}

function AIHub() {
  return (
    <section className="synapse-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E2A7F0]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Hub</h2>
        </div>
        <Link href="/workspace/models" className="text-sm text-[#6E56CF] hover:text-[#5B4BC4] font-medium">
          All models
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AICard
          icon={<Bot className="w-5 h-5 text-[#6E56CF]" />}
          title="AI Agents"
          description="Custom agents with web search, shell, and file tools."
          href="/workspace/agents"
        />
        <AICard
          icon={<Globe className="w-5 h-5 text-[#E2A7F0]" />}
          title="Free Models"
          description="16+ free providers: Groq, Gemini, NVIDIA, OpenRouter, Mistral, and more."
          href="/workspace/models"
        />
      </div>
    </section>
  )
}

function AICard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="synapse-block group hover:border-gray-200 dark:hover:border-gray-700"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#6E56CF]/10 text-[#6E56CF]">
          {icon}
        </div>
        <span className="text-xs text-[#6E56CF] font-medium">Open</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </Link>
  )
}
