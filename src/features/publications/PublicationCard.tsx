import { ArrowUpRight, Star } from 'lucide-react'
import { Link } from 'react-router'
import { Tag } from '@/components/ui/Tag'
import { useI18n } from '@/i18n/context'
import type { Publication } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { Cover } from './Cover'

export function PublicationCard({ publication: p }: { publication: Publication }) {
  const { t, l, locale } = useI18n()
  const external = !!p.externalUrl && !p.content
  const linkClass = 'after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none'

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-500 ease-out-expo focus-within:ring-2 focus-within:ring-accent hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10">
      <div className="aspect-[16/9] overflow-hidden border-b border-border">
        <Cover
          slug={p.slug}
          src={p.cover}
          className="transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-fg-subtle">
          <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
          {p.featured && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Star className="size-3 fill-current" aria-hidden="true" />
              {t.publications.featured}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl leading-snug font-semibold tracking-tight">
          {external ? (
            <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {l(p.title)}
              <ArrowUpRight
                className="ml-1 inline size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">{t.publications.newTab}</span>
            </a>
          ) : (
            <Link to={`/publicacoes/${p.slug}`} className={linkClass}>
              {l(p.title)}
            </Link>
          )}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg-muted">
          {l(p.summary)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {p.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {!external && (
            <span className="ml-auto font-mono text-xs text-fg-subtle">
              {t.publications.readingTime(p.readingMinutes[locale])}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
