import { MapPin } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { ScrollRevealText } from '@/components/motion/ScrollRevealText'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useI18n } from '@/i18n/context'
import { profile } from '@/lib/content'

export function About() {
  const { t, l } = useI18n()

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative overflow-x-clip py-24 sm:py-40"
    >
      <div className="container-page">
        <Eyebrow>{t.about.eyebrow}</Eyebrow>
        <h2 id="sobre-title" className="sr-only">
          {t.about.eyebrow}
        </h2>
        <ScrollRevealText
          text={l(profile.statement)}
          className="mt-6 max-w-5xl text-3xl leading-[1.12] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        />
      </div>

      <div className="container-page mt-24 grid items-center gap-14 sm:mt-36 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Portrait />

        <div>
          <div className="space-y-5 text-lg leading-relaxed text-fg-muted">
            {profile.about.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{l(paragraph)}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-fg-subtle">
              <MapPin className="size-4 text-accent" aria-hidden="true" />
              {l(profile.location)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Foto com moldura em gradiente, anel orbitando e leve parallax. */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4])

  if (!profile.avatar) return null

  return (
    <Reveal className="relative mx-auto w-full max-w-sm">
      <motion.div ref={ref} style={{ y, rotate }} className="relative aspect-[4/5]">
        {/* Halo */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_65%)] blur-2xl"
        />
        {/* Anel orbitando */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 ring-orbit rounded-[2.4rem] opacity-70"
        />
        <div className="absolute -inset-[3px] rounded-[2.1rem] bg-bg" aria-hidden="true" />
        <img
          src={profile.avatar}
          alt={profile.name}
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
          className="relative size-full rounded-[2rem] object-cover grayscale-[15%] transition duration-700 hover:grayscale-0"
        />
      </motion.div>
    </Reveal>
  )
}
