import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { Section } from '@/components/ui/Section'
import { PublicationCard } from '@/features/publications/PublicationCard'
import { useI18n } from '@/i18n/context'
import { publications } from '@/lib/content'

const LIMIT = 3

export function LatestPublications() {
  const { t } = useI18n()
  if (publications.length === 0) return null

  // Destaques primeiro, depois as mais recentes.
  const items = [...publications]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, LIMIT)

  return (
    <Section
      id="publicacoes"
      eyebrow={t.publications.eyebrow}
      title={t.publications.latest}
      action={
        <Link
          to="/publicacoes"
          className="group inline-flex items-center gap-1.5 text-sm text-accent hover:underline hover:underline-offset-4"
        >
          {t.publications.seeAll}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      }
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {items.map((p, i) => (
          <li key={p.slug} className="flex">
            <Reveal delay={i * 0.08} className="flex w-full">
              <PublicationCard publication={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
