import { profile, publications } from 'virtual:content'

// Conteúdo já validado em build pelo plugin `vite-plugins/content.ts`.
// Para editar, mexa em `src/content/profile.json` e `src/content/publications.json`.

export type { Experience, Profile, Publication } from '@/content/schema'
export { profile, publications }

export const allTags = [...new Set(publications.flatMap((p) => p.tags))].sort((a, b) =>
  a.localeCompare(b, 'pt-BR'),
)

export function getPublication(slug: string) {
  return publications.find((p) => p.slug === slug)
}
