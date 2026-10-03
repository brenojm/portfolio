import { Award, GraduationCap } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Tag'
import type { Locale } from '@/content/schema'
import { useI18n } from '@/i18n/context'
import { profile, type Experience as ExperienceItem } from '@/lib/content'
import { formatPeriod } from '@/lib/format'

export function Experience() {
  const { t, l, locale } = useI18n()
  const period = (start: string, end: string | null) =>
    `${formatPeriod(start, locale, t.experience.present)} — ${formatPeriod(end, locale, t.experience.present)}`

  return (
    <Section id="experiencia" eyebrow={t.experience.eyebrow} title={t.experience.title}>
      <ol className="space-y-24 sm:space-y-36">
        {profile.experience.map((job, i) => (
          <li key={job.company}>
            <Chapter job={job} index={i} locale={locale} />
          </li>
        ))}
      </ol>

      <div className="mt-28 grid gap-4 sm:mt-40 md:grid-cols-2">
        {profile.education.map((edu) => (
          <Reveal
            key={edu.institution}
            className="rounded-3xl border border-border bg-surface p-8 sm:p-10"
          >
            <p className="flex items-center gap-2 text-sm text-fg-subtle">
              <GraduationCap className="size-4 text-accent" aria-hidden="true" />
              {t.experience.education}
            </p>
            <p className="mt-6 text-2xl font-semibold tracking-tight">{l(edu.degree)}</p>
            <p className="mt-2 text-fg-muted">{edu.institution}</p>
            <p className="mt-6 font-mono text-xs text-fg-subtle">{period(edu.start, edu.end)}</p>
          </Reveal>
        ))}
        {profile.certifications.length > 0 && (
          <Reveal delay={0.08} className="rounded-3xl border border-border bg-surface p-8 sm:p-10">
            <p className="flex items-center gap-2 text-sm text-fg-subtle">
              <Award className="size-4 text-accent" aria-hidden="true" />
              {t.experience.certifications}
            </p>
            <ul className="mt-6 space-y-2">
              {profile.certifications.map((c) => (
                <li key={c} className="text-2xl font-semibold tracking-tight">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </Section>
  )
}

function Chapter({ job, index, locale }: { job: ExperienceItem; index: number; locale: Locale }) {
  const { t, l } = useI18n()
  const first = job.roles[job.roles.length - 1]!
  const current = job.roles[0]!
  const fmt = (v: string | null) => formatPeriod(v, locale, t.experience.present)

  return (
    <article className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal>
          <p className="font-mono text-xs text-fg-subtle">
            0{index + 1} · {fmt(first.start)} — {fmt(current.end)}
          </p>
          <h3 className="mt-3 text-chrome text-6xl leading-[0.9] font-semibold tracking-tighter sm:text-8xl">
            {job.short}
          </h3>
          {job.engagement && (
            <p className="mt-5 inline-flex rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] tracking-wide text-accent uppercase">
              {l(job.engagement)}
            </p>
          )}
          <p className="mt-4 text-sm text-fg-muted">{job.company}</p>
          {job.location && <p className="mt-1 text-sm text-fg-subtle">{l(job.location)}</p>}
        </Reveal>
      </div>

      <div>
        {job.roles.length > 1 ? (
          <Progression job={job} locale={locale} />
        ) : (
          <Reveal>
            <p className="text-2xl font-semibold tracking-tight text-accent">{l(current.title)}</p>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <p className="mt-6 text-xl leading-relaxed text-fg">{l(job.description)}</p>
        </Reveal>

        <ul className="mt-8 space-y-4">
          {job.highlights.map((h, i) => (
            <li key={i}>
              <Reveal
                delay={0.05 * i}
                y={12}
                className="flex gap-4 border-t border-border pt-4 text-fg-muted"
              >
                <span className="font-mono text-xs leading-7 text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed">{l(h)}</span>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Tech">
            {job.tech.map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </article>
  )
}

/** Linha do tempo de cargos na mesma empresa, preenchida ao entrar na tela. */
function Progression({ job, locale }: { job: ExperienceItem; locale: Locale }) {
  const { t, l } = useI18n()
  const roles = [...job.roles].reverse() // do primeiro cargo ao atual

  return (
    <div>
      <p className="text-sm text-fg-subtle">{t.experience.progression}</p>
      <ol className="relative mt-6 space-y-6 pl-8">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
        <motion.span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-linear-to-b from-accent to-accent-2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {roles.map((role, i) => {
          const isCurrent = i === roles.length - 1
          return (
            <motion.li
              key={role.start}
              className="relative"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.3 + i * 0.3, duration: 0.6 }}
            >
              <span
                aria-hidden="true"
                className={
                  isCurrent
                    ? 'absolute top-1.5 -left-8 size-[15px] rounded-full border-4 border-bg bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_25%,transparent)]'
                    : 'absolute top-2 -left-[29px] size-[9px] rounded-full bg-fg-subtle'
                }
              />
              <p
                className={
                  isCurrent
                    ? 'text-2xl font-semibold tracking-tight text-accent'
                    : 'text-lg text-fg-muted'
                }
              >
                {l(role.title)}
              </p>
              <p className="mt-0.5 font-mono text-xs text-fg-subtle">
                {formatPeriod(role.start, locale, t.experience.present)} —{' '}
                {formatPeriod(role.end, locale, t.experience.present)}
              </p>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
