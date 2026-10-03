import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LOCALES, type Locale, type Localized } from '@/content/schema'
import { dictionaries } from './dictionaries'
import { I18nContext } from './context'

const STORAGE_KEY = 'locale'

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (LOCALES.includes(stored as Locale)) return stored as Locale
  } catch {
    // Storage indisponível — segue para a detecção pelo navegador.
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sem persistência — vale só para esta sessão.
    }
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      l: (text: Localized) => text[locale],
    }),
    [locale, setLocale],
  )

  return <I18nContext value={value}>{children}</I18nContext>
}
