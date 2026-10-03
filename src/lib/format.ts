import type { Locale } from '@/content/schema'

const BCP47: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US' }

/** "2026-09-20" → "20 de set. de 2026" / "Sep 20, 2026" */
export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** "2024-01" → "jan 2024" / "Jan 2024"; "2024" → "2024"; null → `presentLabel` */
export function formatPeriod(value: string | null, locale: Locale, presentLabel: string) {
  if (value === null) return presentLabel
  if (/^\d{4}$/.test(value)) return value
  const month = new Intl.DateTimeFormat(BCP47[locale], { month: 'short', timeZone: 'UTC' })
    .format(new Date(`${value}-01`))
    .replace('.', '')
  return `${month} ${value.slice(0, 4)}`
}
