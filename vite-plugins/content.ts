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
 */
export function content(): Plugin {
  let dir = ''

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

      return [
        `export const profile = ${JSON.stringify(profile)}`,
        `export const publications = ${JSON.stringify(publications)}`,
      ].join('\n')
    },
  }
}

function parse<T extends z.ZodType>(file: string, schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`Conteúdo inválido em src/content/${file}:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}
