import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, Palette, Key, Database, Bot, Sparkles, Globe, Bell, Shield, Trash2 } from 'lucide-react'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Settings</h1>

      <div className="space-y-6">
        <SettingsSection title="Account" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <UserButton
                                    appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 rounded-full',
                      userButtonPopoverCard: 'synapse-card',
                    },
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Account Security</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage password, 2FA, and sessions</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Managed by Clerk</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-[#6E56CF]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">API Keys</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage API keys for AI providers</p>
                </div>
              </div>
              <a href="/workspace/settings/api-keys" className="synapse-button-secondary text-sm">Manage</a>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance" icon={Palette}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AppearanceOption value="system" label="System" description="Match OS setting" icon={<Palette className="w-5 h-5" />} />
            <AppearanceOption value="light" label="Light" description="Always light mode" icon={<span className="w-5 h-5">☀️</span>} />
            <AppearanceOption value="dark" label="Dark" description="Always dark mode" icon={<span className="w-5 h-5">🌙</span>} />
          </div>
        </SettingsSection>

        <SettingsSection title="AI Providers" icon={Bot}>
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400">
              Configure free and paid AI providers. 16+ free tier providers available including Groq, Gemini, NVIDIA, OpenRouter, and more.
            </p>
            <a href="/workspace/settings/providers" className="synapse-button-primary inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Manage Providers
            </a>
          </div>
        </SettingsSection>

        <SettingsSection title="Workspace" icon={Database}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#6E56CF]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Workspace Name</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">My Workspace</p>
                </div>
              </div>
              <button className="synapse-button-secondary text-sm">Rename</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Delete Workspace</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove all data</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Data & Privacy" icon={Globe}>
          <div className="space-y-4">
            <a href="/workspace/export" className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#6E56CF]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Export Workspace</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Download as Markdown ZIP with assets</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Coming soon</span>
            </a>

            <a href="/workspace/import" className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#6E56CF]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Import Notes</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From Obsidian, Notion, Markdown, or Synapse ZIP</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Open</span>
            </a>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="synapse-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#6E56CF]/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#6E56CF]" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function AppearanceOption({ value, label, description, icon }: { value: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <button className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#6E56CF] transition-colors text-left group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#6E56CF]/10 transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </button>
  )
}