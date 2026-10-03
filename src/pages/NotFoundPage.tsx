import { Link } from 'react-router'
import { Seo } from '@/components/ui/Seo'
import { useI18n } from '@/i18n/context'

export default function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="container-page flex min-h-[80vh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <Seo title={t.notFound.title} />
      <p className="text-chrome text-[clamp(6rem,25vw,14rem)] leading-none font-semibold tracking-tighter">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{t.notFound.title}</h1>
      <p className="mt-3 text-fg-muted">{t.notFound.text}</p>
      <Link
        to="/"
        className="mt-10 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] dark:text-accent-fg"
      >
        {t.notFound.back}
      </Link>
    </div>
  )
}
