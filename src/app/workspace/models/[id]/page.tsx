import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/providers'
import {
  ChevronLeft,
  Globe,
  Bot,
  Smartphone,
  ShieldCheck,
  Key,
  Clock,
  Sparkles,
} from 'lucide-react'

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const resolvedParams = await params
  const provider = getProviderById(resolvedParams.id)

  if (!provider) {
    return notFound()
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-10">
      <Link
        href="/workspace/models"
        className="synapse-button-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Models
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {provider.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            {provider.listsModels ? `${provider.models.length} models` : 'Model list'} available.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                provider.isFree
                  ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50'
                  : 'text-[#6E56CF] bg-[#6E56CF]/10'
              }`}
            >
              {provider.isFree ? 'Free' : 'Paid'}
            </span>
            {provider.verified && (
              <span className="text-xs flex items-center gap-1 text-green-500 bg-green-100/50 dark:text-green-400 dark:bg-green-900/20 px-2.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
        </div>
        {provider.keyURL && (
          <a
            href={provider.keyURL}
            target="_blank"
            rel="noopener noreferrer"
            className="synapse-button-primary flex items-center gap-2 px-5 py-2.5"
          >
            <Key className="w-4 h-4" />
            Get API Key
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {provider.listsModels && provider.models.length > 0 ? (
            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#6E56CF]" />
                Models
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.models.map((model) => (
                  <ModelCard key={model.id} model={model} provider={provider} />
                ))}
              </div>
            </section>
          ) : (
            <section className="synapse-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Configure Provider
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Enter your API key to connect {provider.name} to Synapse.
              </p>
              <div className="synapse-input space-y-3 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <input
                  type="password"
                  placeholder="API Key"
                  className="bg-transparent border-0 w-full focus:ring-0 dark:text-gray-100"
                />
                <button className="synapse-button-primary w-full flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Connect Provider
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <ProviderInfoCard provider={provider} />
        </div>
      </div>
    </div>
  )
}

function ModelCard({
  model,
  provider,
}: {
  model: { id: string; contextTokens: number; tools: boolean; vision: boolean; note?: string }
  provider: any
}) {
  return (
    <div className="synapse-card p-4 hover:border-accent transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#6E56CF] transition-colors truncate">
          {model.id}
        </h3>
        {model.note && (
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {model.note}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        {model.tools && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Bot className="w-3 h-3" /> Tools
          </span>
        )}
        {model.vision && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Smartphone className="w-3 h-3" /> Vision
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(model.contextTokens / 1024)}K context
        </span>
        <ChevronLeft className="w-3 h-3 text-gray-300" />
      </div>
    </div>
  )
}

function ProviderInfoCard({ provider }: { provider: any }) {
  return (
    <div className="synapse-card p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Provider Details
      </h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
          <span className="text-gray-500 dark:text-gray-400">Type</span>
          <span className="text-gray-900 dark:text-gray-100">
            {provider.isFree ? 'Free provider' : 'Paid provider'}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
          <span className="text-gray-500 dark:text-gray-400">Lists models</span>
          <span className="text-gray-900 dark:text-gray-100">
            {provider.listsModels ? 'Yes' : 'No — custom model entry'}
          </span>
        </div>
        {provider.transcriptionModel && (
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
            <span className="text-gray-500 dark:text-gray-400">Transcription</span>
            <span className="text-gray-900 dark:text-gray-100">
              {provider.transcriptionModel}
            </span>
          </div>
        )}
        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
          <span className="text-gray-500 dark:text-gray-400">API key required</span>
          <span className="text-gray-900 dark:text-gray-100">
            {provider.keyOptional ? 'No (optional)' : 'Yes'}
          </span>
        </div>
      </div>
      {provider.keyURL && (
        <a
          href={provider.keyURL}
          target="_blank"
          rel="noopener noreferrer"
          className="synapse-button-secondary w-full text-center text-sm flex items-center justify-center gap-2"
        >
          <Key className="w-4 h-4" />
          Get API Key
        </a>
      )}
    </div>
  )
}

function notFound() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-center py-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Model not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        The AI provider you requested doesn't exist.
      </p>
      <Link href="/workspace/models" className="synapse-button-primary px-5 py-2.5">
        Back to Models
      </Link>
    </div>
  )
}
