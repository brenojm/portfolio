import { z } from 'zod'

/**
 * Schemas do conteúdo do site. São executados apenas em build/dev pelo plugin
 * `vite-plugins/content.ts` — o navegador recebe só os dados já validados, e
 * este arquivo contribui apenas com tipos para o código da aplicação.
 */

export const LOCALES = ['pt', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Texto traduzível. No JSON pode ser uma string (igual nos dois idiomas, ex.: nomes
 * de tecnologias) ou `{ "pt": "...", "en": "..." }`. Sempre normalizado para o objeto.
 */
const localized = z
  .union([z.string(), z.object({ pt: z.string(), en: z.string() })])
  .transform((v) => (typeof v === 'string' ? { pt: v, en: v } : v))

const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'Use AAAA ou AAAA-MM')

const RoleSchema = z.object({
  title: localized,
  start: yearMonth,
  end: yearMonth.nullable(),
})

const ExperienceSchema = z.object({
  company: z.string(),
  /** Nome curto para títulos grandes, ex.: "Transpetro". */
  short: z.string(),
  /** Vínculo, ex.: "Terceirizado" quando alocado por outra empresa. */
  engagement: localized.optional(),
  location: localized.optional(),
  /** Cargos na empresa, do mais recente para o mais antigo. */
  roles: z.array(RoleSchema).min(1),
  description: localized,
  highlights: z.array(localized).default([]),
  tech: z.array(z.string()).default([]),
})

export const ProfileSchema = z.object({
  name: z.string(),
  /** URL pública do site, sem barra final (canonical e sitemap). */
  url: z.url().refine((u) => !u.endsWith('/'), 'Sem barra no final'),
  avatar: z.string().optional(),
  headline: localized,
  location: localized,
  /** Frases que se escrevem sozinhas no topo da página. */
  typewriter: z.object({ pt: z.array(z.string()), en: z.array(z.string()) }),
  /** Texto curto revelado palavra por palavra durante o scroll. */
  statement: localized,
  about: z.array(localized),
  social: z.object({
    linkedin: z.url().optional(),
    github: z.url().optional(),
    email: z.email().optional(),
  }),
  experience: z.array(ExperienceSchema),
  education: z.array(
    z.object({
      institution: z.string(),
      short: z.string(),
      degree: localized,
      start: yearMonth,
      end: yearMonth.nullable(),
    }),
  ),
  certifications: z.array(z.string()).default([]),
  stack: z.array(z.object({ group: localized, items: z.array(z.string()) })),
  languages: z.array(z.object({ name: localized, level: localized })).default([]),
})

const PublicationSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug deve ser kebab-case'),
    title: localized,
    summary: localized,
    date: z.iso.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Imagem ou GIF de capa (caminho em /public ou URL). */
    cover: z.string().optional(),
    /** Corpo em Markdown. */
    content: localized.optional(),
    /** Se presente (e sem `content`), o card leva para este link externo. */
    externalUrl: z.url().optional(),
  })
  .refine((p) => p.content || p.externalUrl, {
    message: 'Publicação precisa de `content` ou `externalUrl`',
  })

export const PublicationsSchema = z
  .array(PublicationSchema)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, {
    message: 'Existem publicações com o mesmo slug',
  })

export type Localized = { pt: string; en: string }
export type Profile = z.infer<typeof ProfileSchema>
export type Experience = Profile['experience'][number]
export type Publication = z.infer<typeof PublicationSchema> & {
  readingMinutes: Record<Locale, number>
}
