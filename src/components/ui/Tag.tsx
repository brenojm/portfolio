import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Tag({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-xs text-fg-muted',
        className,
      )}
      {...props}
    />
  )
}
