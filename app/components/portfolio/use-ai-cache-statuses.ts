'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Locale } from '@/i18n/config'
import type { AiModelId } from '@/i18n/ai-models'

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
        if (data) setStatuses(data)
      },
    )
    return () => controller.abort()
  }, [namespace, lang])

  const refresh = useCallback(async () => {
    const data = await fetchCacheStatuses(namespace, lang)
    if (data) setStatuses(data)
  }, [namespace, lang])

  return { statuses, refresh }
}
