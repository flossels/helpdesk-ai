export const DEFAULT_MODEL = 'openai/gpt-5.6-terra'

export type AvailableModel = {
  id: string
  label: string
  provider: string
  description: string
}

export const AVAILABLE_MODELS: AvailableModel[] = [
  {
    id: 'openai/gpt-5.6-terra',
    label: 'GPT 5.6 Terra',
    provider: 'OpenAI',
    description: 'Balanced flagship. Best for reply drafts and the copilot.'
  },
  {
    id: 'openai/gpt-5.6-luna',
    label: 'GPT 5.6 Luna',
    provider: 'OpenAI',
    description: 'Ten times cheaper, same context window. Good for high volume.'
  },
  {
    id: 'anthropic/claude-sonnet-5',
    label: 'Claude Sonnet 5',
    provider: 'Anthropic',
    description: 'Second provider, comparable tier. Strong long-context work.'
  },
  {
    id: 'google/gemini-3.6-flash',
    label: 'Gemini 3.6 Flash',
    provider: 'Google',
    description: 'Third provider. Fast, with a one-million-token context.'
  }
]

export const EMBEDDING_CONFIG = {
  model: 'openai/text-embedding-3-small',
  dimensions: 1536,
  maxChunkTokens: 500,
  overlapTokens: 50,
  topK: 5,
  similarityThreshold: 0.3
}
