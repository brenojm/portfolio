import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { useI18n } from '@/i18n/context'
import { Footer } from './Footer'
import { Header } from './Header'

export function RootLayout() {
  const { t } = useI18n()
  useHashScroll()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        {t.nav.skip}
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
    </MotionConfig>
  )
}

/** Rola até a âncora (#sobre, #contato…) ao navegar entre rotas com hash. */
function useHashScroll() {
  const { hash, key } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [hash, key])
}
