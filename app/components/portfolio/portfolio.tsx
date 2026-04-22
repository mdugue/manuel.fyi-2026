import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { SocialProofObject } from '@/i18n/social-proof-schema'
import { Hero } from './hero'
import { SelfPresentation } from './self-presentation'
import { Documents } from './documents'
import { SocialProof } from './social-proof'
import { SiteFooter } from './footer'
import { SideRail, MobileBar } from './side-rail'

export function Portfolio({
  lang,
  dict,
  initialSelf,
  initialProof,
}: {
  lang: Locale
  dict: Dictionary['portfolio']
  initialSelf: string | null
  initialProof: SocialProofObject | null
}) {
  return (
    <>
      <SideRail lang={lang} spine={dict.spine} />
      <MobileBar lang={lang} />
      <main className="px-(--pad-x) pl-[calc(var(--pad-x)+60px)] max-w-[1380px] mx-auto relative max-[900px]:pl-(--pad-x)">
        <Hero hero={dict.hero} />
        <SelfPresentation
          lang={lang}
          self={dict.self}
          initialText={initialSelf ?? dict.hero.lede}
        />
        <Documents lang={lang} docs={dict.docs} />
        <SocialProof
          lang={lang}
          proof={dict.proof}
          initialTestimonials={initialProof?.testimonials ?? null}
        />
      </main>
      <SiteFooter lang={lang} footer={dict.footer} />
    </>
  )
}
