import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Bot,
  Brain,
  Search,
  Globe,
  Terminal,
  FileText,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { agentProfiles, agentChats } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export default async function AgentsPage() {
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
  const agents = await db
    .select()
    .from(agentProfiles)
    .where(eq(agentProfiles.workspaceId, workspace.id))
    .orderBy(desc(agentProfiles.createdAt))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            AI Agents
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Custom agents with web search, shell, and file tools.
          </p>
        </div>
        <Link
          href="/workspace/agents/new"
          className="synapse-button-primary flex items-center gap-2 px-5 py-2.5"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <section className="synapse-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#6E56CF]/10 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-[#6E56CF]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No agents yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first custom agent with web search, shell, and file tools.
          </p>
          <Link
            href="/workspace/agents/new"
            className="synapse-button-primary inline-flex items-center gap-2 px-5 py-2.5"
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </Link>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AgentCard({ agent }: { agent: any }) {
  const capabilities = Array.isArray(agent.capabilities) ? agent.capabilities : []

  return (
    <Link
      href={`/workspace/agents/${agent.id}`}
      className="synapse-card p-5 hover:border-accent transition-colors group flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#6E56CF]/10 flex items-center justify-center text-[#6E56CF] group-hover:bg-[#6E56CF]/20 transition-colors">
          <Brain className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-[#6E56CF] bg-[#6E56CF]/10 px-2.5 py-0.5 rounded">
          Custom
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-[#6E56CF] transition-colors">
        {agent.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
        {agent.instructions}
      </p>
      <div className="flex items-center gap-2 mb-3">
        {capabilities.includes('web') && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Globe className="w-3 h-3" /> Web
          </span>
        )}
        {capabilities.includes('shell') && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Terminal className="w-3 h-3" /> Shell
          </span>
        )}
        {capabilities.includes('files') && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <FileText className="w-3 h-3" /> Files
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {agent.model}
        </span>
        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#6E56CF] transition-colors" />
      </div>
    </Link>
  )
}
