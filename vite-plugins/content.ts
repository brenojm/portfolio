import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { z } from 'zod'
import { ProfileSchema, PublicationsSchema } from '../src/content/schema.ts'

const VIRTUAL_ID = 'virtual:content'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const WORDS_PER_MINUTE = 220

/**
 * Lê `src/content/*.json`, valida com Zod e expõe o resultado como o módulo
 * `virtual:content`. Conteúdo inválido quebra o build (e mostra o overlay de
 * erro no dev) com o caminho exato do campo problemático.
 *
 * No build, também gera `sitemap.xml` com a home e as publicações internas.
 */
export function content(): Plugin {
  let dir = ''
  let sitemap = ''

  return {
    name: 'portfolio-content',
    configResolved(config) {
      dir = resolve(config.root, 'src/content')
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const read = (file: string) => {
        const path = resolve(dir, file)
        this.addWatchFile(path)
        return JSON.parse(readFileSync(path, 'utf8'))
      }

      const minutes = (text = '') =>
        Math.max(1, Math.round(text.split(/\s+/).length / WORDS_PER_MINUTE))

      const profile = parse('profile.json', ProfileSchema, read('profile.json'))
      const publications = parse('publications.json', PublicationsSchema, read('publications.json'))
        .map((p) => ({
          ...p,
          readingMinutes: { pt: minutes(p.content?.pt), en: minutes(p.content?.en) },
        }))
        .sort((a, b) => b.date.localeCompare(a.date))

      sitemap = buildSitemap(profile.url, publications)

      return [
        `export const profile = ${JSON.stringify(profile)}`,
        `export const publications = ${JSON.stringify(publications)}`,
      ].join('\n')
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

function buildSitemap(
  siteUrl: string,
  publications: { slug: string; date: string; content?: unknown }[],
) {
  const internal = publications.filter((p) => p.content)
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${siteUrl}/` },
    ...(publications.length > 0
      ? [{ loc: `${siteUrl}/publicacoes`, lastmod: internal[0]?.date }]
      : []),
    ...internal.map((p) => ({ loc: `${siteUrl}/publicacoes/${p.slug}`, lastmod: p.date })),
  ]
  const entries = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

function parse<T extends z.ZodType>(file: string, schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`Conteúdo inválido em src/content/${file}:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}
