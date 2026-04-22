import 'server-only'
import { getCache } from '@vercel/functions'
import type { Locale } from '@/i18n/config'
import { aiModels, type AiModelId } from '@/i18n/ai-models'

export const AI_CACHE_TTL_SECONDS = 60 * 60 * 24
const AI_CACHE_TTL_MS = AI_CACHE_TTL_SECONDS * 1000

export type AiCacheNamespace = 'self-presentation' | 'social-proof'

type StoredEntry = { text: string; cachedAt: number }

function parseStored(raw: unknown): StoredEntry | null {
  if (typeof raw !== 'string' || raw.length === 0) return null
  try {
    const obj: unknown = JSON.parse(raw)
    if (
      obj &&
      typeof obj === 'object' &&
      typeof (obj as { text?: unknown }).text === 'string' &&
      (obj as { text: string }).text.length > 0 &&
      typeof (obj as { cachedAt?: unknown }).cachedAt === 'number'
    ) {
      return obj as StoredEntry
    }
  } catch {
    // fall through to legacy handling
  }
  return { text: raw, cachedAt: 0 }
}

export type AiCacheStatus = {
  cachedAt: number
  expiresAt: number
} | null

export type AiCacheStatuses = Record<AiModelId, AiCacheStatus>

function statusFromEntry(entry: StoredEntry): AiCacheStatus {
  if (entry.cachedAt <= 0) return null
  return {
    cachedAt: entry.cachedAt,
    expiresAt: entry.cachedAt + AI_CACHE_TTL_MS,
  }
}

export async function readAiCacheText(params: {
  namespace: AiCacheNamespace
  locale: Locale
  model: AiModelId
}): Promise<{ text: string; status: AiCacheStatus } | null> {
  const { namespace, locale, model } = params
  const cache = getCache({ namespace })
  const raw = await cache.get(`${locale}:${model}`)
  const parsed = parseStored(raw)
  if (!parsed) return null
  return { text: parsed.text, status: statusFromEntry(parsed) }
}

export async function writeAiCacheText(params: {
  namespace: AiCacheNamespace
  locale: Locale
  model: AiModelId
  text: string
}): Promise<void> {
  const { namespace, locale, model, text } = params
  if (!text) return
  const cache = getCache({ namespace })
  const entry: StoredEntry = { text, cachedAt: Date.now() }
  await cache.set(`${locale}:${model}`, JSON.stringify(entry), {
    ttl: AI_CACHE_TTL_SECONDS,
    tags: [namespace, `${namespace}:${locale}`],
    name: `${namespace} · ${locale} · ${model}`,
  })
}

export async function readAiCacheStatuses(
  namespace: AiCacheNamespace,
  locale: Locale,
): Promise<AiCacheStatuses> {
  const entries = await Promise.all(
    aiModels.map(async ({ id }) => {
      const result = await readAiCacheText({ namespace, locale, model: id })
      return [id, result?.status ?? null] as const
    }),
  )
  return Object.fromEntries(entries) as AiCacheStatuses
}
