import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { CodeMark } from '@/components/ui/CodeMark'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/cn'
import { profile, publications } from '@/lib/content'
import { LanguageSwitch } from './LanguageSwitch'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  // Fecha o menu mobile ao navegar.
  const [lastKey, setLastKey] = useState(location.key)
  if (lastKey !== location.key) {
    setLastKey(location.key)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const nav = [
    { to: '/#sobre', label: t.nav.about },
    { to: '/#experiencia', label: t.nav.experience },
    { to: '/#stack', label: t.nav.stack },
    // Publicações só aparecem no menu quando houver alguma.
    ...(publications.length > 0 ? [{ to: '/publicacoes', label: t.nav.publications }] : []),
    { to: '/#contato', label: t.nav.contact },
  ]

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500',
        scrolled || open
          ? 'border-b border-border/70 bg-bg/70 backdrop-blur-2xl backdrop-saturate-150'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex h-13 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2 text-sm font-semibold tracking-tight">
          <CodeMark
            gradient
            className="h-4 w-[18px] transition-transform duration-500 ease-out-expo group-hover:scale-110 group-hover:-rotate-6"
          />
          {profile.name}
        </Link>

        <nav aria-label={t.nav.main} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.to}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitch />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full text-fg-muted hover:bg-surface-2 hover:text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label={t.nav.main}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-page flex flex-col pt-2 pb-6">
              {nav.map((item, i) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-2xl font-semibold tracking-tight text-fg-muted hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  const className = 'rounded-full px-3 py-1.5 text-xs transition-colors'
  // Links com hash apontam para seções da home; NavLink não sabe marcá-los como ativos.
  if (to.includes('#')) {
    return (
      <Link to={to} className={cn(className, 'text-fg-muted hover:text-fg')}>
        {label}
      </Link>
    )
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(className, isActive ? 'text-fg' : 'text-fg-muted hover:text-fg')
      }
    >
      {label}
    </NavLink>
  )
}
