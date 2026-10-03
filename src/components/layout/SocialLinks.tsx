import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { cn } from '@/lib/cn'
import { profile } from '@/lib/content'

export function SocialLinks({ className }: { className?: string }) {
  const { linkedin, github, email } = profile.social
  const links = [
    linkedin && { href: linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    github && { href: github, label: 'GitHub', Icon: GithubIcon },
    email && { href: `mailto:${email}`, label: 'E-mail', Icon: Mail },
  ].filter((l) => !!l)

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <Icon className="size-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
