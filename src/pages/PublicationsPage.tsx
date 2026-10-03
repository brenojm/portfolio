import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Seo } from '@/components/ui/Seo'
import { PublicationCard } from '@/features/publications/PublicationCard'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/cn'
import { allTags, publications } from '@/lib/content'

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export default function PublicationsPage() {
  const { t, l } = useI18n()
  // Busca e filtro ficam na URL: compartilháveis e preservados no "voltar".
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const activeTag = params.get('tag')
  const deferredQuery = useDeferredValue(query)

  const updateParam = (key: string, value: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  const q = normalize(deferredQuery.trim())
  const filtered = publications.filter(
    (p) =>
      (!activeTag || p.tags.includes(activeTag)) &&
      (!q || normalize(`${l(p.title)} ${l(p.summary)} ${p.tags.join(' ')}`).includes(q)),
  )

  return (
    <div className="container-page pt-36 pb-24 sm:pt-44">
      <Seo title={t.publications.title} description={t.publications.metaDescription} />

      <header className="max-w-3xl animate-fade-in">
        <Eyebrow>{t.publications.eyebrow}</Eyebrow>
        <h1 className="mt-4 text-chrome text-6xl leading-[0.95] font-semibold tracking-tighter sm:text-8xl">
          {t.publications.title}
        </h1>
        <p className="mt-6 text-xl text-fg-muted">{t.publications.subtitle}</p>
      </header>

      <div
        hidden={publications.length === 0}
        className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <label className="relative block sm:w-72">
          <span className="sr-only">{t.publications.searchLabel}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => updateParam('q', e.target.value || null)}
            placeholder={t.publications.search}
            className="w-full rounded-full border border-border bg-surface py-2.5 pr-4 pl-10 text-sm placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
        </label>

        <div
          role="group"
          aria-label={t.publications.filterLabel}
          className="flex flex-wrap gap-1.5"
        >
          <FilterChip active={!activeTag} onClick={() => updateParam('tag', null)}>
            {t.publications.all}
          </FilterChip>
          {allTags.map((tag) => (
            <FilterChip
              key={tag}
              active={activeTag === tag}
              onClick={() => updateParam('tag', activeTag === tag ? null : tag)}
            >
              {tag}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t.publications.found(filtered.length)}
      </p>

      {publications.length === 0 ? (
        <p className="mt-14 rounded-3xl border border-dashed border-border p-12 text-center text-lg text-fg-muted">
          {t.publications.comingSoon}
        </p>
      ) : filtered.length > 0 ? (
        <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                <PublicationCard publication={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center text-fg-muted">
          {t.publications.empty}{' '}
          <button
            type="button"
            className="text-accent underline-offset-4 hover:underline"
            onClick={() => setParams({}, { replace: true })}
          >
            {t.publications.clear}
          </button>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
        active
          ? 'border-fg bg-fg text-bg'
          : 'border-border text-fg-muted hover:border-fg-subtle hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
