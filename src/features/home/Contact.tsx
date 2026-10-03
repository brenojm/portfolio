import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { Reveal } from '@/components/motion/Reveal'
import { StreamCanvas } from '@/components/motion/StreamCanvas'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useI18n } from '@/i18n/context'
import { profile } from '@/lib/content'

export function Contact() {
  const { t } = useI18n()
  const { email, linkedin, github } = profile.social

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="relative isolate overflow-hidden py-32 sm:py-48"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-60">
        <StreamCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_75%)]" />
      </div>

      <div className="container-page text-center">
        <Reveal>
          <Eyebrow>{t.contact.eyebrow}</Eyebrow>
          <h2
            id="contato-title"
            className="mx-auto mt-6 max-w-4xl text-5xl leading-[0.95] font-semibold tracking-tighter text-balance sm:text-7xl lg:text-8xl"
          >
            <span className="text-chrome">{t.contact.title}</span>{' '}
            <span className="text-gradient">{t.contact.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-fg-muted">{t.contact.text}</p>
        </Reveal>

        {email && (
          <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <a
              href={`mailto:${email}`}
              className="text-xl font-medium tracking-tight underline decoration-border decoration-2 underline-offset-8 transition-colors hover:decoration-accent sm:text-3xl"
            >
              {email}
            </a>
            <CopyButton value={email} />
          </Reveal>
        )}

        <Reveal delay={0.18} className="mt-10 flex flex-wrap justify-center gap-3">
          {linkedin && <ExternalButton href={linkedin} label="LinkedIn" Icon={LinkedinIcon} />}
          {github && <ExternalButton href={github} label="GitHub" Icon={GithubIcon} />}
        </Reveal>
      </div>
    </section>
  )
}

function CopyButton({ value }: { value: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard indisponível (contexto inseguro); o link mailto continua funcionando.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? t.contact.copied : t.contact.copy}
      title={t.contact.copy}
      className="grid size-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(copied)}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          {copied ? (
            <Check className="size-4 text-emerald-500" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? t.contact.copied : ''}
      </span>
    </button>
  )
}

function ExternalButton({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon: typeof LinkedinIcon
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-accent/50"
    >
      <Icon className="size-4" />
      {label}
      <ArrowUpRight
        className="size-3.5 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  )
}
