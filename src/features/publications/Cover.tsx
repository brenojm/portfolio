import { cn } from '@/lib/cn'

type CoverProps = { slug: string; src?: string; alt?: string; className?: string }

/**
 * Capa da publicação: usa `cover` (imagem ou GIF) quando existe; senão gera
 * uma arte determinística a partir do slug — cada post tem a sua.
 */
export function Cover({ slug, src, alt = '', className }: CoverProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn('size-full object-cover', className)}
      />
    )
  }

  const rand = seeded(hash(slug))
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 20 + i * 20 + rand() * 8
    const amp = 10 + rand() * 30
    const c1 = 80 + rand() * 120
    const c2 = 220 + rand() * 120
    return `M-10,${y} C${c1},${y - amp} ${c2},${y + amp} 410,${y + (rand() - 0.5) * 40}`
  })
  const dots = Array.from({ length: 5 }, () => ({ x: rand() * 400, y: 20 + rand() * 180 }))
  const id = `cover-${slug}`

  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn('size-full bg-surface-2', className)}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.7" cy="0.3" r="0.8">
          <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.25 }} />
          <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#${id}-glow)`} />
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
          strokeOpacity={0.25 + (i % 3) * 0.2}
          className="origin-center transition-transform duration-700 group-hover:scale-y-110"
        />
      ))}
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="2.5" className="fill-accent-2" />
      ))}
    </svg>
  )
}

function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

/** PRNG pequeno (mulberry32) para que a arte seja sempre a mesma por slug. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
