import { motion } from 'motion/react'
import { LOCALES } from '@/content/schema'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/cn'

/** Seletor segmentado PT | EN com indicador deslizante. */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="radiogroup"
      aria-label={t.meta.language}
      className="relative flex rounded-full border border-border bg-surface-2/60 p-0.5 font-mono text-[11px]"
    >
      {LOCALES.map((code) => {
        const selected = code === locale
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={selected}
            lang={code === 'pt' ? 'pt-BR' : 'en'}
            onClick={() => setLocale(code)}
            className={cn(
              'relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors',
              selected ? 'text-bg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {selected && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-fg"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {code}
          </button>
        )
      })}
    </div>
  )
}
