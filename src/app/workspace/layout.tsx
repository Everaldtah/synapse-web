import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, Plus, Search, Star, Trash2, LayoutDashboard, Settings, ChevronLeft, Menu } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link href="/workspace" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#6E56CF]" />
            <span className="text-xl font-bold gradient-text">Synapse</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/workspace" className="synapse-page-tree-item flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Home</span>
          </Link>
          <Link href="/workspace/search" className="synapse-page-tree-item flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Search</span>
          </Link>
          <Link href="/workspace/favorites" className="synapse-page-tree-item flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Favorites</span>
          </Link>
          <Link href="/workspace/trash" className="synapse-page-tree-item flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Trash</span>
          </Link>
          <Link href="/workspace/settings" className="synapse-page-tree-item flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <UserButton
                        appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-full',
                userButtonPopoverCard: 'synapse-card',
              },
            }}
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link href="/workspace" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#6E56CF]" />
            <span className="text-xl font-bold gradient-text">Synapse</span>
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

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}