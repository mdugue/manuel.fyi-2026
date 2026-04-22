import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import {
  readCachedSelfPresentation,
  readCachedSocialProof,
} from '@/lib/ai-cache'
import { Portfolio } from '@/app/components/portfolio/portfolio'

export default async function Default({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale: Locale = lang
  const [dict, initialSelf, initialProof] = await Promise.all([
    getDictionary(locale),
    readCachedSelfPresentation(locale),
    readCachedSocialProof(locale),
  ])
  return (
    <Portfolio
      lang={locale}
      dict={dict.portfolio}
      initialSelf={initialSelf}
      initialProof={initialProof}
    />
  )
}
