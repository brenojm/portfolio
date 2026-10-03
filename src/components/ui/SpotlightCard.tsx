import type { ComponentProps, PointerEvent } from 'react'
import { cn } from '@/lib/cn'

/** Card com um brilho suave que segue o ponteiro. */
export function SpotlightCard({ className, children, ...props }: ComponentProps<'div'>) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        'group/spot relative overflow-hidden rounded-3xl border border-border bg-surface',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(400px circle at var(--x) var(--y), color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)',
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
