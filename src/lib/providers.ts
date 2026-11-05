export interface APIProviderInfo {
  id: string
  name: string
  baseURL: string
  keyURL: string
  isFree: boolean
  verified: boolean
  listsModels: boolean
  transcriptionModel?: string
  freeSuffix?: string
  extraHeaders?: Record<string, string>
  placeholders?: Record<string, string>
  keyOptional?: boolean
  custom?: boolean
  models: Array<{
    id: string
    contextTokens: number
    tools: boolean
    vision: boolean
    note?: string
  }>
}

export const FREE_PROVIDERS: APIProviderInfo[] = [
  {
    id: 'groq',
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    keyURL: 'https://console.groq.com/keys',
    isFree: true,
    verified: true,
    listsModels: true,
    transcriptionModel: 'whisper-large-v3-turbo',
    models: [
      { id: 'openai/gpt-oss-120b', contextTokens: 131072, tools: true, vision: false },
      { id: 'qwen/qwen3.8-27b', contextTokens: 131072, tools: true, vision: false },
      { id: 'llama-3.3-70b-versatile', contextTokens: 131072, tools: true, vision: false },
      { id: 'llama-3.1-8b-instant', contextTokens: 131072, tools: true, vision: false },
      { id: 'minimaxai/minimax-m2.7', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    keyURL: 'https://aistudio.google.com/apikey',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'gemini-3.8-flash', contextTokens: 1048576, tools: true, vision: true },
      { id: 'gemini-3.6-flash', contextTokens: 1048576, tools: true, vision: true },
      { id: 'gemini-3.5-flash-lite', contextTokens: 1048576, tools: true, vision: true },
      { id: 'gemini-3-flash-preview', contextTokens: 1048576, tools: true, vision: true },
    ],
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    keyURL: 'https://build.nvidia.com/explore/discover',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'z-ai/glm-5.3', contextTokens: 131072, tools: true, vision: false },
      { id: 'moonshotai/kimi-k2.6', contextTokens: 131072, tools: true, vision: true },
      { id: 'deepseek-ai/deepseek-v4.1-flash', contextTokens: 131072, tools: true, vision: false },
      { id: 'nvidia/nemotron-3.5-super-vl-120b-a12b', contextTokens: 131072, tools: true, vision: true },
      { id: 'minimaxai/minimax-m3.1-flash', contextTokens: 131072, tools: true, vision: false },
      { id: 'google/gemma-4-31b-it', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    keyURL: 'https://openrouter.ai/keys',
    isFree: true,
    verified: true,
    listsModels: true,
    freeSuffix: ':free',
    extraHeaders: {
      'HTTP-Referer': 'https://github.com/Everaldtah/synapse',
      'X-Title': 'Synapse',
    },
    models: [
      { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', contextTokens: 131072, tools: true, vision: false },
      { id: 'google/gemma-4-31b-it:free', contextTokens: 131072, tools: true, vision: false },
      { id: 'thinkingmachines/inkling:free', contextTokens: 131072, tools: true, vision: false },
      { id: 'nvidia/nemotron-3.5-super-vl:free', contextTokens: 131072, tools: true, vision: true },
      { id: 'poolside/laguna-s-2.1:free', contextTokens: 131072, tools: true, vision: false },
      { id: 'openrouter/free', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral',
    baseURL: 'https://api.mistral.ai/v1',
    keyURL: 'https://console.mistral.ai/api-keys',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'mistral-small-latest', contextTokens: 32768, tools: true, vision: false },
      { id: 'mistral-medium-latest', contextTokens: 32768, tools: true, vision: false },
      { id: 'codestral-latest', contextTokens: 32768, tools: true, vision: false },
    ],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    baseURL: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1',
    keyURL: 'https://dash.cloudflare.com/profile/api-tokens',
    isFree: true,
    verified: true,
    listsModels: false,
    placeholders: { account_id: 'Cloudflare Account ID' },
    models: [
      { id: '@cf/openai/gpt-oss-120b', contextTokens: 131072, tools: true, vision: false },
      { id: '@cf/google/gemma-4-26b-a4b-it', contextTokens: 131072, tools: true, vision: false },
      { id: '@cf/meta/llama-4-scout-17b-16e-instruct', contextTokens: 131072, tools: true, vision: false },
      { id: '@cf/zai-org/glm-4.7-flash', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'zai',
    name: 'Z.ai',
    baseURL: 'https://api.z.ai/api/paas/v4',
    keyURL: 'https://z.ai/api',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'glm-4.7-flash', contextTokens: 131072, tools: true, vision: false },
      { id: 'glm-4.6v-flash', contextTokens: 131072, tools: true, vision: true },
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    baseURL: 'https://api.cohere.ai/compatibility/v1',
    keyURL: 'https://dashboard.cohere.com/api-keys',
    isFree: true,
    verified: true,
    listsModels: false,
    transcriptionModel: 'cohere-transcribe-03-2026',
    models: [
      { id: 'command-a-plus-05-2026', contextTokens: 262144, tools: true, vision: false },
      { id: 'command-a-03-2025', contextTokens: 262144, tools: true, vision: false },
      { id: 'command-a-reasoning-08-2025', contextTokens: 262144, tools: true, vision: false },
    ],
  },
  {
    id: 'ovh',
    name: 'OVHcloud AI Endpoints',
    baseURL: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: true,
    keyOptional: true,
    transcriptionModel: 'whisper-large-v3-turbo',
    models: [
      { id: 'gpt-oss-120b', contextTokens: 131072, tools: true, vision: false },
      { id: 'Qwen3.8-27B', contextTokens: 131072, tools: true, vision: false },
      { id: 'Qwen3.5-397B-A17B', contextTokens: 131072, tools: true, vision: false },
      { id: 'Mistral-Small-3.2-24B-Instruct-2506', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'llm7',
    name: 'LLM7',
    baseURL: 'https://api.llm7.io/v1',
    keyURL: 'https://llm7.io',
    isFree: true,
    verified: true,
    listsModels: true,
    keyOptional: true,
    models: [
      { id: 'gpt-oss:20b', contextTokens: 131072, tools: true, vision: false },
      { id: 'minimax-m2.7', contextTokens: 131072, tools: true, vision: false },
      { id: 'nemotron-3-nano:30b', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'kilo',
    name: 'Kilo',
    baseURL: 'https://api.kilo.ai/api/gateway',
    keyURL: 'https://kilo.ai',
    isFree: true,
    verified: false,
    listsModels: true,
    keyOptional: true,
    models: [
      { id: 'kilo-auto/free', contextTokens: 131072, tools: true, vision: false },
      { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', contextTokens: 131072, tools: true, vision: false },
      { id: 'nvidia/nemotron-3.5-super-vl:free', contextTokens: 131072, tools: true, vision: true },
    ],
  },
  {
    id: 'requesty',
    name: 'Requesty',
    baseURL: 'https://router.requesty.ai/v1',
    keyURL: 'https://requesty.ai',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'nvidia/nemotron-3-ultra-550b-a55b', contextTokens: 131072, tools: true, vision: false },
      { id: 'google/gemma-4-31b-it', contextTokens: 131072, tools: true, vision: false },
      { id: 'nvidia/nemotron-3-super-120b-a12b', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel AI Gateway',
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    keyURL: 'https://vercel.com/dashboard/ai-gateway',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'nvidia/nemotron-3.5-lightning-free', contextTokens: 131072, tools: true, vision: false },
      { id: 'reflection/beam-free', contextTokens: 131072, tools: true, vision: false },
      { id: 'poolside/laguna-s-2.1-free', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'sambanova',
    name: 'SambaNova',
    baseURL: 'https://api.sambanova.ai/v1',
    keyURL: 'https://cloud.sambanova.ai',
    isFree: true,
    verified: true,
    listsModels: true,
    models: [
      { id: 'gpt-oss-120b', contextTokens: 131072, tools: true, vision: false },
      { id: 'MiniMax-M3.1-Flash', contextTokens: 131072, tools: true, vision: false },
      { id: 'DeepSeek-V3.2', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    baseURL: 'https://ollama.com/v1',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: true,
    keyOptional: true,
    models: [
      { id: 'gpt-oss:120b', contextTokens: 131072, tools: true, vision: false },
      { id: 'nemotron-3-ultra', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'pollinations',
    name: 'Pollinations',
    baseURL: 'https://text.pollinations.ai/openai',
    keyURL: '',
    isFree: true,
    verified: false,
    listsModels: false,
    keyOptional: true,
    models: [
      { id: 'openai', contextTokens: 4096, tools: false, vision: false },
    ],
  },
]

export const PAID_PROVIDERS: APIProviderInfo[] = [
  {
    id: 'xai',
    name: 'xAI',
    baseURL: 'https://api.x.ai/v1',
    keyURL: 'https://console.x.ai',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'grok-4', contextTokens: 131072, tools: true, vision: false },
      { id: 'grok-3', contextTokens: 131072, tools: true, vision: false },
      { id: 'grok-3-mini', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    keyURL: 'https://platform.deepseek.com/api_keys',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'deepseek-chat', contextTokens: 65536, tools: true, vision: false },
      { id: 'deepseek-reasoner', contextTokens: 65536, tools: true, vision: false },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    baseURL: 'https://api.moonshot.cn/v1',
    keyURL: 'https://platform.moonshot.cn',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'kimi-k2', contextTokens: 131072, tools: true, vision: true },
      { id: 'kimi-k2-vl', contextTokens: 131072, tools: true, vision: true },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    keyURL: 'https://cloud.cerebras.ai',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'llama-4-scout-17b-16e-instruct', contextTokens: 131072, tools: true, vision: false },
      { id: 'llama-4-maverick-17b-128e-instruct', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    baseURL: 'https://api.together.xyz/v1',
    keyURL: 'https://api.together.xyz/settings/api-keys',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', contextTokens: 131072, tools: true, vision: false },
      { id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct-FP8', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    baseURL: 'https://api.fireworks.ai/inference/v1',
    keyURL: 'https://fireworks.ai/account/api-keys',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'accounts/fireworks/models/llama-4-maverick-17b-128e-instruct', contextTokens: 131072, tools: true, vision: false },
      { id: 'accounts/fireworks/models/llama-4-scout-17b-16e-instruct', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    baseURL: 'https://router.huggingface.co/v1',
    keyURL: 'https://huggingface.co/settings/tokens',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'openai/gpt-oss-120b', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'dashscope',
    name: 'DashScope (Alibaba)',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    keyURL: 'https://dashscope.aliyuncs.com',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'qwen3-235b-a22b', contextTokens: 131072, tools: true, vision: false },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    keyURL: 'https://platform.openai.com/api-keys',
    isFree: false,
    verified: true,
    listsModels: true,
    models: [
      { id: 'gpt-4o', contextTokens: 128000, tools: true, vision: true },
      { id: 'gpt-4o-mini', contextTokens: 128000, tools: true, vision: true },
      { id: 'o1-preview', contextTokens: 128000, tools: true, vision: false },
      { id: 'o1-mini', contextTokens: 128000, tools: true, vision: false },
    ],
  },
]

export const ON_DEVICE_MODELS: APIProviderInfo[] = [
  {
    id: 'apple-foundation',
    name: 'Apple Foundation Models',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'apple-foundation-3b', contextTokens: 4096, tools: false, vision: false, note: 'iOS 26+ only, ~3B/2-bit' },
    ],
  },
  {
    id: 'apple-speech',
    name: 'Apple Speech Transcription',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    transcriptionModel: 'apple-speech',
    models: [],
  },
  {
    id: 'mlx-synapse-alpha',
    name: 'Synapse Alpha 1.0 (MLX)',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'mlx.synapse-alpha-1.0', contextTokens: 16000, tools: true, vision: false, note: 'Qwen3.5-2B fine-tune, 4-bit' },
    ],
  },
  {
    id: 'mlx-qwen3-4b',
    name: 'Qwen3-4B-Instruct (MLX)',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'mlx-community/Qwen3-4B-Instruct-2507-4bit', contextTokens: 8192, tools: true, vision: false },
    ],
  },
  {
    id: 'mlx-llama-3.2-3b',
    name: 'Llama-3.2-3B-Instruct (MLX)',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'mlx-community/Llama-3.2-3B-Instruct-4bit', contextTokens: 8192, tools: true, vision: false },
    ],
  },
  {
    id: 'mlx-phi-4-mini',
    name: 'Phi-4-mini-instruct (MLX)',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'mlx-community/Phi-4-mini-instruct-4bit', contextTokens: 8192, tools: true, vision: false },
    ],
  },
  {
    id: 'mlx-qwen3-1.7b',
    name: 'Qwen3-1.7B (MLX)',
    baseURL: 'on-device',
    keyURL: '',
    isFree: true,
    verified: true,
    listsModels: false,
    custom: true,
    models: [
      { id: 'mlx-community/Qwen3-1.7B-4bit', contextTokens: 8192, tools: true, vision: false },
    ],
  },
]

export function getAllProviders(): APIProviderInfo[] {
  return [...FREE_PROVIDERS, ...PAID_PROVIDERS, ...ON_DEVICE_MODELS]
}

export function getFreeProviders(): APIProviderInfo[] {
  return FREE_PROVIDERS
}

export function getProviderById(id: string): APIProviderInfo | undefined {
  return getAllProviders().find(p => p.id === id)
}

export function isOnDeviceProvider(id: string): boolean {
  return ON_DEVICE_MODELS.some(p => p.id === id)
}

export function getOnDeviceProviders(): APIProviderInfo[] {
  return ON_DEVICE_MODELS
}