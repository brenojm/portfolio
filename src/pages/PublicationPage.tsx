import { ArrowLeft } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import Markdown from 'react-markdown'
import { Link, useParams } from 'react-router'
import remarkGfm from 'remark-gfm'
import { Seo } from '@/components/ui/Seo'
import { Tag } from '@/components/ui/Tag'
import { Cover } from '@/features/publications/Cover'
import { useI18n } from '@/i18n/context'
import { getPublication, profile } from '@/lib/content'
import { formatDate } from '@/lib/format'
import NotFoundPage from './NotFoundPage'

export default function PublicationPage() {
  const { t, l, locale } = useI18n()
  const { slug = '' } = useParams()
  const publication = getPublication(slug)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  if (!publication?.content) return <NotFoundPage />

  return (
    <>
      <Seo title={l(publication.title)} description={l(publication.summary)} />
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-13 z-50 h-0.5 origin-left bg-linear-to-r from-accent to-accent-2"
      />

      <article className="container-page max-w-3xl animate-fade-in pt-32 pb-24 sm:pt-40">
        <Link
          to="/publicacoes"
          className="group mb-10 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          {t.publications.back}
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap gap-1.5">
            {publication.tags.map((tag) => (
              <Link key={tag} to={`/publicacoes?tag=${encodeURIComponent(tag)}`}>
                <Tag className="transition-colors hover:border-accent hover:text-accent">{tag}</Tag>
              </Link>
            ))}
          </div>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tighter text-balance sm:text-6xl">
            {l(publication.title)}
          </h1>
          <p className="mt-5 text-xl text-fg-muted">{l(publication.summary)}</p>
          <p className="mt-6 font-mono text-xs text-fg-subtle">
            {profile.name} ·{' '}
            <time dateTime={publication.date}>{formatDate(publication.date, locale)}</time> ·{' '}
            {t.publications.readingTime(publication.readingMinutes[locale])}
          </p>
        </header>

        <div className="mb-14 aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <Cover slug={publication.slug} src={publication.cover} alt={l(publication.title)} />
        </div>

        <div className="prose prose-lg max-w-none prose-zinc dark:prose-invert prose-headings:tracking-tight prose-a:text-accent prose-blockquote:border-accent prose-code:rounded prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-surface prose-pre:text-fg prose-img:rounded-2xl">
          <Markdown remarkPlugins={[remarkGfm]}>{l(publication.content)}</Markdown>
        </div>
      </article>
    </>
  )
}
