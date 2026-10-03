import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'
import { Eyebrow } from './Eyebrow'

type SectionProps = {
  id: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  action?: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, children, action, className }: SectionProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('container-page py-24 sm:py-36', className)}
    >
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={headingId}
            className="mt-4 max-w-3xl text-4xl leading-[1.02] font-semibold tracking-tighter text-balance sm:text-6xl lg:text-7xl"
          >
            {title}
          </h2>
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  )
}
