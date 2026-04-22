import { streamText, Output } from 'ai'
import { hasLocale, type Locale } from '@/i18n/config'
import { readMarkdown } from '@/app/components/markdown-source'
import { isAiModelId } from '@/i18n/ai-models'
import { socialProofSchema } from '@/i18n/social-proof-schema'
import { buildSocialProofPrompt } from '@/i18n/social-proof-prompt'
import { readAiCacheText, writeAiCacheText } from '@/app/lib/ai-cache'

export const maxDuration = 60

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return new Response('bad json', { status: 400 })
  }

  const { lang, model } = payload as { lang?: unknown; model?: unknown }

  if (typeof lang !== 'string' || !hasLocale(lang)) {
    return new Response('bad lang', { status: 400 })
  }
  if (!isAiModelId(model)) {
    return new Response('unknown model', { status: 400 })
  }

  const locale: Locale = lang
  const namespace = 'social-proof' as const

  const cached = await readAiCacheText({ namespace, locale, model })
  if (cached) {
    return new Response(cached.text, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-cache': 'HIT',
      },
    })
  }

  const skills = await readMarkdown('skill-profile', locale)

  const result = streamText({
    model,
    system: buildSocialProofPrompt(locale),
    prompt: `<skill-profile>\n${skills}\n</skill-profile>`,
    output: Output.object({ schema: socialProofSchema }),
    temperature: 0.85,
    onFinish: async ({ text }) => {
      await writeAiCacheText({ namespace, locale, model, text })
    },
  })

  const response = result.toTextStreamResponse()
  response.headers.set('x-cache', 'MISS')
  return response
}
