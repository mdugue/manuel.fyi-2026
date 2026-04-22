'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Locale } from '@/i18n/config'
import type { AiModelId } from '@/i18n/ai-models'
import { AI_CACHE_TTL_MS } from '@/app/lib/ai-cache-shared'

export type AiCacheClientStatus = {
  cachedAt: number
  expiresAt: number
} | null

export type AiCacheClientStatuses = Partial<
  Record<AiModelId, AiCacheClientStatus>
>

export type AiCacheNamespace = 'self-presentation' | 'social-proof'

async function fetchCacheStatuses(
  namespace: AiCacheNamespace,
  lang: Locale,
  signal?: AbortSignal,
): Promise<AiCacheClientStatuses | null> {
  try {
    const res = await fetch(
      `/api/ai-cache-status?namespace=${namespace}&lang=${lang}`,
      { cache: 'no-store', signal },
    )
    if (!res.ok) return null
    return (await res.json()) as AiCacheClientStatuses
  } catch {
    return null
  }
}

export function useAiCacheStatuses(
  namespace: AiCacheNamespace,
  lang: Locale,
) {
  const [statuses, setStatuses] = useState<AiCacheClientStatuses>({})

  useEffect(() => {
    const controller = new AbortController()
    void fetchCacheStatuses(namespace, lang, controller.signal).then(
      (data) => {
        if (!data) return
        // Merge server snapshot under any newer local marks so we don't
        // downgrade a just-generated model to stale server state.
        setStatuses((prev) => {
          const merged: AiCacheClientStatuses = { ...data }
          for (const key of Object.keys(prev) as AiModelId[]) {
            const local = prev[key]
            const remote = merged[key]
            if (local && (!remote || local.cachedAt > remote.cachedAt)) {
              merged[key] = local
            }
          }
          return merged
        })
      },
    )
    return () => controller.abort()
  }, [namespace, lang])

  const markGenerated = useCallback((model: AiModelId) => {
    const cachedAt = Date.now()
    setStatuses((prev) => ({
      ...prev,
      [model]: { cachedAt, expiresAt: cachedAt + AI_CACHE_TTL_MS },
    }))
  }, [])

  return { statuses, markGenerated }
}
