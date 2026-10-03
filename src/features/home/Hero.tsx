import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { SocialLinks } from '@/components/layout/SocialLinks'
import { StreamCanvas } from '@/components/motion/StreamCanvas'
import { Typewriter } from '@/components/motion/Typewriter'
import { CodeMark } from '@/components/ui/CodeMark'
import { useI18n } from '@/i18n/context'
import { profile } from '@/lib/content'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const { t, l, locale } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Ao rolar, o conteúdo recua e esmaece enquanto o fundo continua — profundidade.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])

  const [first, ...rest] = profile.name.split(' ')

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex h-dvh min-h-[640px] items-center overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <StreamCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg)_85%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
      </div>

      <motion.div style={{ scale, opacity, y }} className="container-page text-center">
        <div className="relative mx-auto mb-8 w-fit">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-full bg-accent/25 blur-2xl dark:bg-accent/30"
          />
          <CodeMark
            animated
            gradient
            strokeWidth={2.4}
            className="relative h-12 w-14 sm:h-16 sm:w-[4.5rem]"
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="eyebrow"
        >
          {l(profile.headline)}
        </motion.p>

        <h1
          id="hero-title"
          className="mt-6 text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
        >
          {[first, rest.join(' ')].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block text-chrome"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mx-auto mt-8 min-h-[2.6em] max-w-3xl text-xl font-medium tracking-tight text-fg-muted sm:min-h-[1.3em] sm:text-3xl"
        >
          {t.hero.prefix}{' '}
          <Typewriter key={locale} phrases={profile.typewriter[locale]} className="text-gradient" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/#contato"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-[transform,box-shadow] hover:scale-[1.03] hover:shadow-[0_0_40px_-6px_var(--accent)] active:scale-[0.98] dark:text-accent-fg"
          >
            {t.hero.cta}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            to="/#experiencia"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            {t.hero.secondary}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex justify-center"
        >
          <SocialLinks />
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-widest text-fg-subtle uppercase"
      >
        {t.hero.scroll}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  )
}
