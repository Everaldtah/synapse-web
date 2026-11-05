import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Trash2,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  GitGraph,
  Bot,
} from 'lucide-react'

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <aside className="fixed left-0 top-16 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-40 hidden lg:flex transform transition-transform duration-300">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <Link href="/workspace" className="flex items-center gap-2 group">
            <BookOpen className="w-7 h-7 text-[#6E56CF] group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-tight gradient-text">Synapse</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link href="/workspace" className={`synapse-page-tree-item ${true ? 'active' : ''} flex items-center gap-3`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link href="/workspace/models" className="synapse-page-tree-item flex items-center gap-3">
            <Bot className="w-5 h-5 text-[#6E56CF]" />
            <span>Models</span>
          </Link>
          <Link href="/workspace/agents" className="synapse-page-tree-item flex items-center gap-3">
            <Bot className="w-5 h-5" />
            <span>Agents</span>
          </Link>
          <Link href="/workspace/graph" className="synapse-page-tree-item flex items-center gap-3">
            <GitGraph className="w-5 h-5" />
            <span>Graph View</span>
          </Link>
          <Link href="/workspace/search" className="synapse-page-tree-item flex items-center gap-3">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link href="/workspace/favorites" className="synapse-page-tree-item flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Favorites</span>
          </Link>
          <Link href="/workspace/trash" className="synapse-page-tree-item flex items-center gap-3">
            <Trash2 className="w-5 h-5" />
            <span>Trash</span>
          </Link>
          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
          <Link href="/workspace/settings" className="synapse-page-tree-item flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 rounded-full',
                userButtonPopoverCard: 'synapse-card',
                userButtonPopoverTriggerButton: 'w-full flex items-center justify-between px-3 py-2',
              },
            }}
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="lg:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 z-20">
          <button className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/workspace" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#6E56CF]" />
            <span className="text-lg font-bold tracking-tight gradient-text">Synapse</span>
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-full',
                userButtonPopoverCard: 'synapse-card',
              },
            }}
          />
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50">
          {children}
        </main>
      </div>
    </div>
  )
}
