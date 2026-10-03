import { createContext, use } from 'react'
import type { Locale, Localized } from '@/content/schema'
import type { Dictionary } from './dictionaries'

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Textos da interface no idioma atual. */
  t: Dictionary
  /** Escolhe a versão no idioma atual de um texto vindo do conteúdo (JSON). */
  l: (text: Localized) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n() {
  const value = use(I18nContext)
  if (!value) throw new Error('useI18n precisa estar dentro de <I18nProvider>')
  return value
}
