import { Monitor, Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme, type ThemePreference } from '@/hooks/useTheme'
import { useI18n } from '@/i18n/context'

const NEXT: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const ICON = { system: Monitor, light: Sun, dark: Moon }

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  const { t } = useI18n()
  const Icon = ICON[preference]
  const label = t.theme[preference]

  return (
    <button
      type="button"
      onClick={() => setPreference(NEXT[preference])}
      className="grid size-8 place-items-center overflow-hidden rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={`${label} (${t.theme.toggle})`}
      title={label}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={preference}
          initial={{ y: -14, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 14, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.25 }}
        >
          <Icon className="size-4" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
