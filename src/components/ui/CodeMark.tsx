import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

// Geometria do símbolo </>, compartilhada com public/favicon.svg.
const LEFT = 'M10 7 L3 16 L10 25'
const SLASH = 'M19.5 4 L14.5 28'
const RIGHT = 'M24 7 L31 16 L24 25'

type CodeMarkProps = {
  className?: string
  /** Desenha os traços ao montar (usado no hero). */
  animated?: boolean
  /** Traço em gradiente azul; senão usa a cor do texto. */
  gradient?: boolean
  strokeWidth?: number
}

/** O símbolo </>, marca visual do site. */
export function CodeMark({
  className,
  animated = false,
  gradient = false,
  strokeWidth = 2.75,
}: CodeMarkProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const stroke = gradient ? `url(#code-${id})` : 'currentColor'

  const draw = (i: number) =>
    animated
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.7, delay: 0.1 + i * 0.18, ease: [0.16, 1, 0.3, 1] as const },
        }
      : {}

  return (
    <svg
      viewBox="0 0 34 32"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {gradient && (
        <defs>
          <linearGradient id={`code-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
            <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
          </linearGradient>
        </defs>
      )}
      <motion.path d={LEFT} {...draw(0)} />
      <motion.path d={SLASH} {...draw(1)} />
      <motion.path d={RIGHT} {...draw(2)} />
    </svg>
  )
}
