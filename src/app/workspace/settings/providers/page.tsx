import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { preferences } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { Key, Eye, EyeOff, Save, Check, AlertCircle } from 'lucide-react'
import { FREE_PROVIDERS, PAID_PROVIDERS, ON_DEVICE_MODELS } from '@/lib/providers'

export default async function SettingsProvidersPage() {
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

  // Get saved API keys from preferences
  const savedKeys = await db
    .select()
    .from(preferences)
    .where(and(
      eq((preferences as any).userId, userId),
      eq((preferences as any).key, 'api_keys')
    ))
    .limit(1)

  let apiKeys: Record<string, string> = {}
  if (savedKeys.length > 0 && savedKeys[0].value) {
    try {
      apiKeys = JSON.parse(savedKeys[0].value as string)
    } catch {
      apiKeys = {}
    }
  }

  const allProviders = [
    ...FREE_PROVIDERS.map(p => ({ ...p, category: 'free' })),
    ...PAID_PROVIDERS.map(p => ({ ...p, category: 'paid' })),
    ...ON_DEVICE_MODELS.map(p => ({ ...p, category: 'local' })),
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Key className="w-7 h-7 text-[#6E56CF]" />
            AI Providers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Configure API keys for AI providers. Keys are stored encrypted.
          </p>
        </div>
      </div>

      <div className="synapse-card p-6 space-y-8">
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            API keys are stored in your user preferences and never logged.
            For production, consider using environment variables on Vercel.
          </p>
        </div>

        <ProviderSection
          title="Free Providers"
          description="No API key required or free tier available"
          providers={allProviders.filter(p => p.category === 'free')}
          apiKeys={apiKeys}
        />

        <ProviderSection
          title="Paid Providers"
          description="Require API key with paid credits"
          providers={allProviders.filter(p => p.category === 'paid')}
          apiKeys={apiKeys}
        />

        <ProviderSection
          title="Local / On-Device"
          description="Run locally via MLX, Ollama, or Apple Intelligence"
          providers={allProviders.filter(p => p.category === 'local')}
          apiKeys={apiKeys}
        />
      </div>

      <ProviderKeysForm apiKeys={apiKeys} />
    </div>
  )
}

function ProviderSection({ title, description, providers, apiKeys }: {
  title: string
  description: string
  providers: any[]
  apiKeys: Record<string, string>
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            apiKey={apiKeys[provider.id] || ''}
          />
        ))}
      </div>
    </div>
  )
}

function ProviderCard({ provider, apiKey }: { provider: any; apiKey: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {provider.icon ? (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6E56CF] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-bold text-lg">{provider.name.charAt(0)}</span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 font-bold">{provider.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{provider.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{provider.models?.slice(0, 2).join(', ')}...</p>
          </div>
        </div>
        {provider.requiresKey && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
            API Key
          </span>
        )}
      </div>

      {provider.requiresKey && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            API Key
          </label>
          <div className="relative">
            <input
              type={apiKey ? 'password' : 'text'}
              placeholder={apiKey ? '••••••••' : `Enter ${provider.name} API key`}
              defaultValue={apiKey}
              className="synapse-input pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Get your key at {provider.keyUrl || 'provider dashboard'}
          </p>
        </div>
      )}

      {!provider.requiresKey && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">No API key required</span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            This provider works out of the box.
          </p>
        </div>
      )}
    </div>
  )
}

function ProviderKeysForm({ apiKeys }: { apiKeys: Record<string, string> }) {
  return (
    <div className="synapse-card p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Save className="w-5 h-5" />
        Save API Keys
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter your API keys below and click Save. Keys are stored in your encrypted preferences.
      </p>
      <form id="provider-keys-form" className="space-y-4">
        {Object.entries(apiKeys).map(([providerId, key]) => (
          <div key={providerId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
              {providerId.replace(/-/g, ' ')} API Key
            </label>
            <input
              type="password"
              name={providerId}
              defaultValue={key}
              placeholder={`Enter ${providerId} API key`}
              className="synapse-input"
            />
          </div>
        ))}
        <button
          type="submit"
          className="synapse-button-primary inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save All Keys
        </button>
      </form>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('provider-keys-form')?.addEventListener('submit', async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const keys: Record<string, string> = {};
              for (const [key, value] of formData.entries()) {
                if (value) keys[key] = value;
              }
              await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'api_keys', value: keys })
              });
            });
          `,
        }}
      />
    </div>
  )
}