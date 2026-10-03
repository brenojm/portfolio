import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type Line = { kind: 'cmd' | 'out' | 'ok' | 'info' | 'banner'; text: string; delay?: number }

const SCRIPT: Line[] = [
  { kind: 'cmd', text: './mvnw quarkus:dev' },
  { kind: 'banner', text: '__  ____  __  _____   ___  __ ____  ______ ', delay: 250 },
  { kind: 'banner', text: ' --/ __ \\/ / / / _ | / _ \\/ //_/ / / / __/ ', delay: 40 },
  { kind: 'banner', text: ' -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\\ \\   ', delay: 40 },
  { kind: 'banner', text: '--\\___\\_\\____/_/ |_/_/|_/_/|_|\\____/___/   ', delay: 40 },
  { kind: 'info', text: 'INFO  pipeline-guard 2.4.0 on JVM started in 0.812s', delay: 500 },
  { kind: 'info', text: 'INFO  Listening on: http://localhost:8080', delay: 120 },
  {
    kind: 'out',
    text: 'Kafka consumer subscribed → vehicle-positions [12 partitions]',
    delay: 400,
  },
  { kind: 'out', text: 'Cassandra session ready → keyspace: telemetry', delay: 250 },
  { kind: 'ok', text: '✓ 1,248 events/s · p99 14ms', delay: 600 },
]

const COLORS: Record<Line['kind'], string> = {
  cmd: 'text-[#f2f4f8]',
  banner: 'text-[#4d8dff]',
  info: 'text-[#7d869a]',
  out: 'text-[#a3abbd]',
  ok: 'text-[#4ade80]',
}

/** Terminal que "roda" um serviço em loop, como um GIF — mas nítido e leve. */
export function Terminal({ title, className }: { title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-40px' })
  const reduced = useReducedMotion()
  const [lineCount, setLineCount] = useState(0)
  const [typed, setTyped] = useState(0)

  const command = SCRIPT[0]!.text
  const done = reduced || lineCount >= SCRIPT.length

  useEffect(() => {
    if (reduced || !inView) return
    let id: number
    if (typed < command.length) {
      id = window.setTimeout(() => setTyped((n) => n + 1), 45 + Math.random() * 50)
    } else if (lineCount < SCRIPT.length) {
      const next = SCRIPT[lineCount]
      id = window.setTimeout(() => setLineCount((n) => n + 1), next?.delay ?? 200)
    } else {
      // Reinicia o loop após uma pausa.
      id = window.setTimeout(() => {
        setLineCount(0)
        setTyped(0)
      }, 4000)
    }
    return () => window.clearTimeout(id)
  }, [reduced, inView, typed, lineCount, command.length])

  const visible = reduced ? SCRIPT.slice(1) : SCRIPT.slice(1, Math.max(1, lineCount))

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-2xl border border-white/10 bg-[#070a12] shadow-2xl shadow-black/40',
        className,
      )}
      role="img"
      aria-label={`Terminal: ${command}`}
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#7d869a]">{title}</span>
      </div>
      <pre
        aria-hidden="true"
        className="h-72 overflow-hidden p-5 font-mono text-[11px] leading-relaxed sm:text-xs"
      >
        <span className={COLORS.cmd}>
          <span className="text-[#38d6f5]">~/pipeline-guard</span> ${' '}
          {reduced ? command : command.slice(0, typed)}
          {!done && typed < command.length && (
            <span className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-[#f2f4f8]" />
          )}
        </span>
        {'\n'}
        {visible.map((line, i) => (
          <span key={i} className={cn('block animate-fade-in', COLORS[line.kind])}>
            {line.text}
          </span>
        ))}
        {done && !reduced && (
          <span className="inline-block h-3.5 w-1.5 animate-blink bg-[#f2f4f8]" />
        )}
      </pre>
    </div>
  )
}
