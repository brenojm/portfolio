import { useI18n } from '@/i18n/context'
import { profile } from '@/lib/content'

type SeoProps = {
  title?: string
  description?: string
}

/**
 * React 19 eleva <title> e <meta> para o <head> automaticamente,
 * então não precisamos de react-helmet.
 */
export function Seo({ title, description }: SeoProps) {
  const { t, l } = useI18n()
  const fullTitle = title ? `${title} · ${profile.name}` : `${profile.name} | ${t.meta.role}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? l(profile.statement)} />
    </>
  )
}
