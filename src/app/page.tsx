import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, Database, Bot, Sparkles, Download, ArrowRight, CheckCircle, Globe } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/workspace')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-[#6E56CF]" />
          <span className="text-2xl font-bold gradient-text">Synapse</span>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="synapse-button-secondary">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="synapse-button-primary">Get Started</button>
          </SignUpButton>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
            Your personal <span className="gradient-text">knowledge workspace</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Nested pages, powerful databases, AI agents, and free models — all in your browser.
            No app download required. Your data stays private and synced to your account.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <SignUpButton mode="modal">
              <button className="synapse-button-primary text-lg px-8 py-3.5 flex items-center gap-2">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
            <a
              href="https://testflight.apple.com/join/SYNAPSE_TESTERS"
              target="_blank"
              rel="noopener noreferrer"
              className="synapse-button-secondary text-lg px-8 py-3.5 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              iOS App (TestFlight)
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            TestFlight is internal-only. Public App Store release coming soon.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BookOpen}
            title="Nested Pages & Blocks"
            description="Create infinite hierarchies of pages with rich blocks — headings, toggles, callouts, code, tables, and more. Wiki-style links and backlinks connect your thoughts."
          />
          <FeatureCard
            icon={Database}
            title="Powerful Databases"
            description="Build Notion-style databases with multiple views (table, board, list, gallery, calendar). Properties, formulas, relations, rollups, filters, and sorts."
          />
          <FeatureCard
            icon={Bot}
            title="AI Agents & Free Models"
            description="Chat with 16+ free tier providers (Groq, Gemini, NVIDIA, OpenRouter, Mistral, Cloudflare, and more). Build custom agents with web search, shell, and file tools."
          />
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Sparkles}
            title="Import & Export"
            description="Import from Obsidian, Notion, Markdown, and ZIP. Export to Markdown with assets. Full round-trip fidelity for your existing knowledge base."
          />
          <FeatureCard
            icon={Globe}
            title="Works Everywhere"
            description="Runs in any modern browser on Windows, Mac, Linux, iPad, or phone. Responsive design with offline-capable caching. No installation needed."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Private & Verified"
            description="Email verification required. Your workspace is encrypted at rest. No third-party tracking. You own your data — export anytime."
          />
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to organize your thinking?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands using Synapse for notes, projects, research, and AI-powered workflows.
          </p>
          <SignUpButton mode="modal">
            <button className="synapse-button-primary text-lg px-8 py-3.5 inline-flex items-center gap-2">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
        </div>
      </div>

      <footer className="mt-20 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Synapse Notes — Built with Next.js 15, Clerk, Neon, and Vercel Blob</p>
          <p className="mt-2">
            <a href="https://github.com/Everaldtah/synapse" target="_blank" rel="noopener noreferrer" className="hover:text-[#6E56CF] transition-colors">
              GitHub
            </a>
            {' · '}
            <a href="/privacy" className="hover:text-[#6E56CF] transition-colors">
              Privacy
            </a>
            {' · '}
            <a href="/terms" className="hover:text-[#6E56CF] transition-colors">
              Terms
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="synapse-card p-6 h-full">
      <div className="w-12 h-12 bg-[#6E56CF]/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#6E56CF]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}