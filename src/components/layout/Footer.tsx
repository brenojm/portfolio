import { CodeMark } from '@/components/ui/CodeMark'
import { useI18n } from '@/i18n/context'
import { profile } from '@/lib/content'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  const { l } = useI18n()
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-xs text-fg-subtle sm:flex-row">
        <p className="flex items-center gap-2">
          <CodeMark className="h-3 w-3.5 text-accent" />© {new Date().getFullYear()} {profile.name}{' '}
          · {l(profile.location)}
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}
