import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Rótulo de seção escrito como uma tag: <SOBRE />. Os sinais são decorativos. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow', className)}>
      <span aria-hidden="true" className="text-fg-subtle">
        &lt;
      </span>
      {children}
      <span aria-hidden="true" className="text-fg-subtle">
        {' '}
        /&gt;
      </span>
    </p>
  )
}
