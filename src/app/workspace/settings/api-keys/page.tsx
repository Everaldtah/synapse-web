import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { getWorkspaceForClerkUser } from '@/lib/db/auth'
import { preferences } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { Key, Plus, Trash2, Eye, EyeOff, Check, Copy, AlertCircle, Save } from 'lucide-react'

export default async function SettingsApiKeysPage() {
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

  // Get saved custom API keys from preferences
  const savedKeys = await db
    .select()
    .from(preferences)
    .where(and(
      eq((preferences as any).userId, userId),
      eq((preferences as any).key, 'custom_api_keys')
    ))
    .limit(1)

  let customKeys: Array<{ id: string; name: string; key: string; description?: string }> = []
  if (savedKeys.length > 0 && savedKeys[0].value) {
    try {
      customKeys = JSON.parse(savedKeys[0].value as string)
    } catch {
      customKeys = []
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Key className="w-7 h-7 text-[#6E56CF]" />
            Custom API Keys
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-balance">
            Add custom API keys for any service or integration.
          </p>
        </div>
      </div>

      <div className="synapse-card p-6 space-y-8">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Custom keys are stored encrypted in your preferences.
            Use for webhooks, integrations, or any service not in AI Providers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Your Keys
          </h2>

          {customKeys.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <Key className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No custom keys yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first API key for any service.</p>
              <AddKeyForm onAdd={(key) => {}} />
            </div>
          ) : (
            <div className="space-y-3">
              {customKeys.map((key, index) => (
                <CustomKeyCard key={key.id} keyData={key} index={index} />
              ))}
              <AddKeyForm onAdd={(key) => {}} />
            </div>
          )}
        </div>

        <SaveCustomKeysForm customKeys={customKeys} />
      </div>
    </div>
  )
}

function CustomKeyCard({ keyData, index }: { keyData: any; index: number }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6E56CF] to-[#8B5CF6] flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{keyData.name}</h3>
            {keyData.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{keyData.description}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              {keyData.key.slice(0, 8)}...{keyData.key.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AddKeyForm({ onAdd }: { onAdd: (key: any) => void }) {
  return (
    <form className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Key Name
          </label>
          <input
            type="text"
            placeholder="e.g., GitHub Token, Stripe Key"
            className="synapse-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            API Key
          </label>
          <input
            type="password"
            placeholder="sk-... or ghp_..."
            className="synapse-input"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optional)
        </label>
        <input
          type="text"
          placeholder="What this key is for..."
          className="synapse-input"
        />
      </div>
      <button
        type="submit"
        className="synapse-button-primary inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Key
      </button>
    </form>
  )
}

function SaveCustomKeysForm({ customKeys }: { customKeys: Array<{ id: string; name: string; key: string; description?: string }> }) {
  return (
    <div className="synapse-card p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Save className="w-5 h-5" />
        Save Custom Keys
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Edit your keys below and click Save. Keys are stored in your encrypted preferences.
      </p>
      <form id="custom-keys-form" className="space-y-4">
        {customKeys.map((keyData) => (
          <div key={keyData.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <input type="hidden" name={`id_${keyData.id}`} value={keyData.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Name</label>
                <input type="text" name={`name_${keyData.id}`} defaultValue={keyData.name} className="synapse-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                <input type="password" name={`key_${keyData.id}`} defaultValue={keyData.key} className="synapse-input" placeholder="sk-..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input type="text" name={`desc_${keyData.id}`} defaultValue={keyData.description || ''} className="synapse-input" placeholder="What this key is for..." />
            </div>
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
            document.getElementById('custom-keys-form')?.addEventListener('submit', async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const keys: Array<{ id: string; name: string; key: string; description?: string }> = [];
              const ids = new Set<string>();
              for (const [name, value] of formData.entries()) {
                if (name.startsWith('id_')) {
                  ids.add(value as string);
                }
              }
              for (const id of ids) {
                const name = formData.get('name_' + id) as string;
                const key = formData.get('key_' + id) as string;
                const desc = formData.get('desc_' + id) as string;
                if (name && key) keys.push({ id, name, key, description: desc || undefined });
              }
              await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'custom_api_keys', value: keys })
              });
            });
          `,
        }}
      />
    </div>
  )
}