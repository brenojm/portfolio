import { Reveal } from '@/components/motion/Reveal'
import { Terminal } from '@/components/motion/Terminal'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/cn'
import { profile } from '@/lib/content'

export function Stack() {
  const { t, l } = useI18n()
  const all = profile.stack.flatMap((g) => g.items)

  return (
    <>
      <Marquee items={all} />
      <Section
        id="stack"
        eyebrow={t.stack.eyebrow}
        title={t.stack.title}
        className="pt-16 sm:pt-24"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <Terminal title={t.stack.terminal} className="h-full" />
          </Reveal>

          {profile.stack.map((group, i) => (
            <Reveal key={l(group.group)} delay={0.06 * i}>
              <SpotlightCard className="h-full p-7">
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{l(group.group)}</h3>
                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-fg-muted">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="after:ml-3 after:text-border after:content-['/'] last:after:content-none"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}

          {profile.languages.length > 0 && (
            <Reveal delay={0.24} className="lg:col-span-3">
              <SpotlightCard className="flex h-full flex-col gap-5 p-7 sm:flex-row sm:items-center sm:gap-12">
                <h3 className="text-xl font-semibold tracking-tight">{t.stack.languages}</h3>
                <dl className="flex flex-col gap-3 sm:flex-row sm:gap-12">
                  {profile.languages.map((lang) => (
                    <div key={l(lang.name)} className="flex items-baseline justify-between gap-4">
                      <dt>{l(lang.name)}</dt>
                      <dd className="font-mono text-xs text-fg-subtle">{l(lang.level)}</dd>
                    </div>
                  ))}
                </dl>
              </SpotlightCard>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  )
}

/** Duas faixas de tecnologias deslizando em sentidos opostos. */
function Marquee({ items }: { items: string[] }) {
  return (
    <div aria-hidden="true" className="overflow-hidden mask-fade-x py-6 select-none">
      {[false, true].map((reverse) => (
        <div
          key={String(reverse)}
          className={cn(
            'flex w-max animate-marquee gap-10 py-2 hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className={cn(
                'text-5xl font-semibold tracking-tighter whitespace-nowrap sm:text-7xl',
                i % 3 === 1
                  ? 'text-gradient'
                  : 'text-transparent [-webkit-text-stroke:1px_var(--fg-subtle)]',
              )}
            >
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
