'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, FileText, X, ChevronRight } from 'lucide-react'

export default function SearchClient({ pages, workspaceId }: { pages: any[]; workspaceId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const matches = pages.filter(page =>
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      (page.content && page.content.toLowerCase().includes(query.toLowerCase()))
    )
    setResults(matches)
  }, [query, pages])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="synapse-card p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          id="search-input"
          placeholder="Search pages, titles, content... (⌘K to focus)"
          className="synapse-input pl-12 py-4 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
          <button
            onClick={() => setQuery('')}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      )}

      {results.length === 0 && query ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map(page => (
            <Link
              key={page.id}
              href={`/workspace/pages/${page.id}`}
              className="synapse-page-tree-item group flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#6E56CF] transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-[#6E56CF] transition-colors">
                  {page.title}
                </p>
                {page.content && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {page.content.slice(0, 100)}...
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6E56CF] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}