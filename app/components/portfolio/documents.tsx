import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { DocumentCard } from './document-card'
import { SectionHead } from './section-head'

type DocCard = Dictionary['portfolio']['docs']['cv']

export function Documents({
  lang,
  docs,
}: {
  lang: Locale
  docs: Dictionary['portfolio']['docs']
}) {
  const entries: Array<{ slug: 'curriculum-vitae' | 'skill-profile'; card: DocCard }> = [
    { slug: 'curriculum-vitae', card: docs.cv },
    { slug: 'skill-profile', card: docs.profile },
  ]

  return (
    <section id="docs" className="py-[clamp(60px,9vw,130px)]">
      <SectionHead label={docs.label} heading={docs.heading} sub={docs.sub} />
      <div className="grid grid-cols-2 gap-6 max-w-[900px] max-[720px]:grid-cols-1">
        {entries.map(({ slug, card }) => (
          <DocumentCard key={slug} lang={lang} slug={slug} card={card} />
        ))}
      </div>
    </section>
  )
}
