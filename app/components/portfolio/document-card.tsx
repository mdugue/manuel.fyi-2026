'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import { ViewTransition } from 'react'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

type DocCard = Dictionary['portfolio']['docs']['cv']

const linkClassName =
  'bg-paper border border-rule px-7 pt-7 pb-6 cursor-pointer relative transition-[transform,border-color] duration-[250ms] text-left text-inherit flex flex-col gap-5 min-h-[220px] hover:-translate-y-0.5 hover:border-accent focus-visible:-translate-y-0.5 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'

export function DocumentCard({
  lang,
  slug,
  card,
}: {
  lang: Locale
  slug: 'curriculum-vitae' | 'skill-profile'
  card: DocCard
}) {
  const pathname = usePathname()
  const modalOpenForThis = pathname === `/${lang}/${slug}`

  const markOrigin = () => {
    sessionStorage.setItem('doc-morph-from', slug)
  }

  const inner = (
    <Link
      href={`/${lang}/${slug}` as Route}
      prefetch
      onClick={markOrigin}
      className={linkClassName}
    >
      <div className="font-mono text-[10px] text-ink-faint tracking-[0.18em] uppercase">
        Document · {card.num}
      </div>
      {modalOpenForThis ? (
        <h3 className="font-display text-[28px] italic font-normal m-0 leading-[1.15]">
          {card.title}
        </h3>
      ) : (
        <ViewTransition name={`doc-title-${slug}`} share="morph">
          <h3 className="font-display text-[28px] italic font-normal m-0 leading-[1.15]">
            {card.title}
          </h3>
        </ViewTransition>
      )}
      <div className="text-sm text-ink-soft leading-[1.55] max-w-[34ch] flex-1">
        {card.desc}
      </div>
      <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.14em] text-accent border-t border-dashed border-rule pt-4">
        <span>{card.cta}</span>
        <span aria-hidden="true" className="text-sm">
          →
        </span>
      </div>
    </Link>
  )

  return modalOpenForThis ? (
    inner
  ) : (
    <ViewTransition name={`doc-card-${slug}`} share="morph">
      {inner}
    </ViewTransition>
  )
}
