import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Globe,
  Bot,
  Cpu,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { getFreeProviders, getOnDeviceProviders, PAID_PROVIDERS } from '@/lib/providers'

export default async function ModelsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const freeProviders = getFreeProviders()
  const paidProviders = PAID_PROVIDERS
  const onDeviceProviders = getOnDeviceProviders()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            AI Models
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Connect to 16+ free AI providers and run models in your browser or on-device.
          </p>
        </div>
        <Link
          href="/workspace/settings/providers"
          className="synapse-button-primary flex items-center gap-2 px-5 py-2.5"
        >
          <Sparkles className="w-4 h-4" />
          Manage Providers
        </Link>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#E2A7F0]" />
          Free Providers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} type="free" />
          ))}
        </div>
      </section>

      {paidProviders.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6E56CF]" />
            Paid Providers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paidProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} type="paid" />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#6E56CF]" />
          On-Device Models
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Run models locally on your device. No API key required.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {onDeviceProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} type="on-device" />
          ))}
        </div>
      </section>
    </div>
  )
}

function ProviderCard({
  provider,
  type,
}: {
  provider: { id: string; name: string; models: Array<{ id: string; contextTokens: number; tools: boolean; vision: boolean; note?: string }>; isFree: boolean; verified: boolean; listsModels: boolean; keyOptional?: boolean; keyURL?: string }
  type: 'free' | 'paid' | 'on-device'
}) {
  const typeColors = {
    free: 'text-green-500 bg-green-500/10',
    paid: 'text-[#6E56CF] bg-[#6E56CF]/10',
    'on-device': 'text-[#E2A7F0] bg-[#E2A7F0]/10',
  }
  const typeIcons = {
    free: <Globe className="w-4 h-4" />,
    paid: <ShieldCheck className="w-4 h-4" />,
    'on-device': <Cpu className="w-4 h-4" />,
  }

  const typeLabels = {
    free: 'Free',
    paid: 'Paid',
    'on-device': 'On-device',
  }

  const totalModels = provider.models.length
  const hasTools = provider.models.some((m) => m.tools)
  const hasVision = provider.models.some((m) => m.vision)

  return (
    <Link
      href={`/workspace/models/${provider.id}`}
      className="synapse-card p-5 hover:border-accent transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[type]}`}>
          {typeIcons[type]}
        </div>
        <span className={`text-xs font-medium ${typeColors[type] === 'text-green-500 bg-green-500/10' ? 'text-green-600' : 'text-[#6E56CF]'}`}>
          {typeLabels[type]}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {provider.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {totalModels} model{totalModels !== 1 ? 's' : ''} available
      </p>
      <div className="flex items-center gap-2 mb-3">
        {hasTools && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Bot className="w-3 h-3" /> Tools
          </span>
        )}
        {hasVision && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Smartphone className="w-3 h-3" /> Vision
          </span>
        )}
        {provider.keyOptional && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3" /> No key
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round((provider.models[0]?.contextTokens || 0) / 1024)}K context
        </span>
        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#6E56CF] transition-colors" />
      </div>
    </Link>
  )
}
