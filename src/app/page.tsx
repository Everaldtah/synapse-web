import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  BookOpen,
  Database,
  Bot,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Layers,
  Code2,
  Smartphone,
  Monitor,
  GitGraph,
  Brain,
  Search,
  Terminal,
  FileText,
  Link as LinkIcon,
} from 'lucide-react'
import Image from 'next/image'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/workspace')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <nav className="fixed top-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#6E56CF]" />
            <span className="text-xl font-bold tracking-tight gradient-text">Synapse</span>
          </Link>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="synapse-button-ghost text-sm px-4">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="synapse-button-primary text-sm px-4 py-2">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      <div className="pt-16 relative overflow-hidden">
        {/* Hero section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6E56CF]/10 border border-[#6E56CF]/20 text-[#6E56CF] text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6E56CF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6E56CF]"></span>
                </span>
                Live on TestFlight — iOS app coming soon
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-gray-900 dark:text-gray-100">
                Your <span className="gradient-text">second brain</span>, rebuilt.
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Nested pages, powerful databases, AI agents, and 16+ free models — all in your browser.
                No installation. Your data stays private and synced across every device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <button className="synapse-button-primary text-lg px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto">
                    Start Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignUpButton>
                <a
                  href="https://testflight.apple.com/join/SYNAPSE_TESTERS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="synapse-button-secondary text-lg px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Download className="w-5 h-5" />
                  iOS App
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6E56CF]/20 to-[#E2A7F0]/20 rounded-3xl blur-3xl"></div>
                <div className="relative z-10 glass rounded-3xl p-1 border border-white/50 shadow-card">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
                    <AppPreviewCard icon={BookOpen} title="Pages" subtitle="Nested, linked pages" color="text-[#6E56CF]" />
                    <AppPreviewCard icon={Database} title="Databases" subtitle="Table, board, gallery views" color="text-[#6E56CF]" />
                    <AppPreviewCard icon={Bot} title="AI Agents" subtitle="Web search, shell, file tools" color="text-[#E2A7F0]" />
                    <AppPreviewCard icon={Zap} title="Instant Sync" subtitle="Across all your devices" color="text-[#6E56CF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / social proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between gap-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trusted by knowledge workers</p>
            <div className="hidden md:flex items-center gap-8 opacity-60 grayscale">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Notion</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Obsidian</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Roam</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Craft</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Logseq</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">Everything you need to think, write, and build</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Powerful blocks, databases, and AI — designed for how your mind actually works.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              title="Nested Pages & Blocks"
              description="Infinite hierarchies of pages with rich blocks — headings, toggles, callouts, code, tables, and more. Wiki-style links and backlinks connect your thoughts."
              color="text-[#6E56CF]"
            />
            <FeatureCard
              icon={Database}
              title="Powerful Databases"
              description="Notion-style databases with multiple views — table, board, list, gallery, calendar. Properties, formulas, relations, filters, and sorts."
              color="text-[#E2A7F0]"
            />
            <FeatureCard
              icon={Bot}
              title="AI Agents & Free Models"
              description="16+ free tier providers (Groq, Gemini, NVIDIA, OpenRouter, Mistral, and more). Build custom agents with web search, shell, and file tools."
              color="text-[#6E56CF]"
            />
            <FeatureCard
              icon={Shield}
              title="Private by Default"
              description="Email verification required. Your workspace is encrypted at rest. No third-party tracking. You own your data — export anytime."
              color="text-[#E2A7F0]"
            />
            <FeatureCard
              icon={Code2}
              title="Works Everywhere"
              description="Runs in any modern browser on Windows, Mac, Linux, iPad, or phone. Responsive design with offline-capable caching."
              color="text-[#6E56CF]"
            />
            <FeatureCard
              icon={Smartphone}
              title="iOS & Mobile"
              description="Native iOS app via TestFlight. Same workspace, same data, offline-first — pick up right where you left off."
              color="text-[#E2A7F0]"
            />
          </div>
        </section>

        {/* AI Hub / All Models / Agents / Graph View preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 bg-white dark:bg-gray-950">
          <div className="text-center max-w-3xl mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">AI Hub — All models, agents, and tools in one place</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Switch between 16+ free providers, paid models, and on-device AI. Build custom agents with web search, shell, and file tools. Visualize your knowledge with Obsidian-style Graph View.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <AIFeatureCard
              icon={Brain}
              title="AI Hub"
              description="Unified chat interface with all your models. Switch providers mid-conversation. Stream responses, manage contexts, and use tools."
              color="text-[#6E56CF]"
            />
            <AIFeatureCard
              icon={Globe}
              title="16+ Free Providers"
              description="Groq, Gemini, NVIDIA, OpenRouter, Mistral, Cloudflare, Z.ai, Cohere, OVH, LLM7, Kilo, Requesty, Vercel AI Gateway, SambaNova, Ollama, Pollinations."
              color="text-[#E2A7F0]"
            />
            <AIFeatureCard
              icon={Terminal}
              title="Custom Agents"
              description="Build agents with web search, shell execution, and file tools. Define capabilities, system prompts, and connect to any model."
              color="text-[#6E56CF]"
            />
            <AIFeatureCard
              icon={GitGraph}
              title="Obsidian Graph View"
              description="Force-directed graph visualization of your pages and links. Zoom, pan, search, filter by tags, and explore your knowledge network."
              color="text-[#E2A7F0]"
            />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <ProviderCardList title="Paid Providers" providers={['xAI', 'DeepSeek', 'Moonshot', 'Cerebras', 'Together', 'Fireworks', 'HuggingFace', 'DashScope', 'OpenAI']} color="text-amber-500" />
            <ProviderCardList title="On-Device Models" providers={['Apple Foundation', 'Apple Speech', 'Synapse Alpha 1.0 (MLX)', 'Qwen3-4B', 'Llama-3.2-3B', 'Phi-4-mini', 'Qwen3-1.7B']} color="text-green-500" />
            <ProviderCardList title="Agent Capabilities" providers={['Web Search', 'Shell Commands', 'File Read/Write', 'Code Execution', 'API Calls', 'Data Analysis']} color="text-blue-500" />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-auto text-center border border-white/60 dark:border-gray-800/60 shadow-glow">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">Ready to organize your thinking?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              Join thousands using Synapse for notes, projects, research, and AI-powered workflows. Free to start, forever private.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="synapse-button-primary text-lg px-8 py-3.5 flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="synapse-button-secondary text-lg px-8 py-3.5 flex items-center gap-2">
                  Sign in
                </button>
              </SignInButton>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              TestFlight is internal-only. Public App Store release coming soon.
            </p>
          </div>
        </section>

        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-[#6E56CF]" />
              <span className="text-lg font-bold tracking-tight gradient-text">Synapse</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Built with Next.js 15, Clerk, Neon, and Vercel Blob.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="https://github.com/Everaldtah/synapse" target="_blank" rel="noopener noreferrer" className="hover:text-[#6E56CF] transition-colors">
                GitHub
              </a>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <a href="/privacy" className="hover:text-[#6E56CF] transition-colors">Privacy</a>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <a href="/terms" className="hover:text-[#6E56CF] transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}) {
  return (
    <div className="synapse-card p-8 h-full hover:shadow-card transition-all duration-300 group">
      <div className="w-12 h-12 bg-[#6E56CF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#6E56CF]/20 transition-colors">
        <Icon className="w-6 h-6 text-[#6E56CF] group-hover:text-[#6E56CF] transition-colors" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

function AppPreviewCard({
  icon: Icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  color: string
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-[#6E56CF]/10">
        <Icon className="w-4 h-4 text-[#6E56CF]" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}

function AIFeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}) {
  return (
    <div className="synapse-card p-6 h-full hover:shadow-card transition-all duration-300 group">
      <div className="w-12 h-12 bg-[#6E56CF]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#6E56CF]/20 transition-colors">
        <Icon className="w-6 h-6 text-[#6E56CF] group-hover:text-[#6E56CF] transition-colors" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

function ProviderCardList({ title, providers, color }: { title: string; providers: string[]; color: string }) {
  return (
    <div className="synapse-card p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        {title}
      </h3>
      <ul className="space-y-2">
        {providers.map((provider, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
            {provider}
          </li>
        ))}
      </ul>
    </div>
  )
}
