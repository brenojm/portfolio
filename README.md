# Breno Magrani — Portfólio

Portfólio pessoal com área de publicações, feito com React 19, Vite 8, TypeScript e Tailwind CSS 4.

## Rodando

```bash
npm install
npm run dev
```

| Script            | O que faz                                  |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Servidor de desenvolvimento com HMR        |
| `npm run build`   | Typecheck + build de produção em `dist/`   |
| `npm run preview` | Serve o build localmente                   |
| `npm run lint`    | ESLint (inclui regras de acessibilidade)   |
| `npm run format`  | Prettier (ordena classes Tailwind)         |
| `npm run og`      | Regenera `og.png` e `apple-touch-icon.png` |

## Editando conteúdo

Todo o conteúdo fica em `src/content/` — não é preciso mexer em componentes.

- **`profile.json`** — URL do site, headline, frases do typewriter, sobre, experiência, formação, stack e links.
- **`publications.json`** — lista de publicações.

Os dois arquivos são validados por Zod (`src/content/schema.ts`) em tempo de build. Um campo errado
quebra o build com o caminho exato do problema, e o Zod não vai para o bundle do navegador.

### Idiomas (PT / EN)

Qualquer texto do conteúdo pode ser uma string (igual nos dois idiomas, ex.: `"Kafka"`) ou um objeto
traduzido: `{ "pt": "Olá", "en": "Hello" }`. Os textos da interface ficam em
`src/i18n/dictionaries.ts`, e o TypeScript acusa erro se faltar alguma chave em inglês.
O idioma inicial segue o navegador e a escolha do visitante fica salva.

### Publicação

```json
{
  "slug": "meu-post",
  "title": { "pt": "Título", "en": "Title" },
  "summary": { "pt": "Resumo do card.", "en": "Card summary." },
  "date": "2026-10-03",
  "tags": ["Java"],
  "featured": true,
  "cover": "/covers/meu-post.gif",
  "content": { "pt": "Corpo em **Markdown**…", "en": "Body in **Markdown**…" }
}
```

- `cover` é opcional e aceita imagem ou **GIF** (coloque em `public/covers/`). Sem capa, o site gera uma
  arte única a partir do slug.
- Use `externalUrl` no lugar de `content` para apontar para um post fora do site (LinkedIn, Medium…).
- A página fica em `/publicacoes/<slug>` e o tempo de leitura é calculado automaticamente.

## Arquitetura

```
src/
  content/       JSONs + schemas Zod (fonte única de conteúdo)
  i18n/          dicionários PT/EN e provider de idioma
  lib/           acesso ao conteúdo, formatação
  hooks/         useTheme (claro/escuro/sistema, sem flash)
  components/
    layout/      Header, Footer, seletores de idioma e tema
    motion/      Typewriter, StreamCanvas, Terminal, ScrollRevealText, CountUp, Reveal
    ui/          primitivos: Section, Tag, SpotlightCard, Seo
  features/      seções da home (Hero, About, PipelineScene…) e publicações
  pages/         rotas (publicações carregadas sob demanda)
vite-plugins/
  content.ts     valida o conteúdo e expõe `virtual:content`
```

**Decisões**

- **Design tokens** semânticos em `src/index.css`: o tema escuro só reatribui variáveis, então os
  componentes não precisam de `dark:` para cores.
- **Acessibilidade**: skip link, HTML semântico, foco visível, `aria-*` nos controles, `eslint-plugin-jsx-a11y`
  e animações que respeitam `prefers-reduced-motion`.
- **Performance**: rotas com lazy loading (o parser de Markdown só carrega na página de post),
  vendors em chunks separados para cache, fontes self-hosted.
- **SEO**: `<title>`/`<meta>` por página usando o suporte nativo do React 19.
- Busca e filtro de publicações ficam na URL (`?q=` e `?tag=`), então dá para compartilhar o link.

## SEO e compartilhamento

- `public/og.png` é a prévia de links (LinkedIn, WhatsApp, X), gerada a partir de
  `scripts/og-image.html` com `npm run og`, que usa o Chrome ou Edge instalado.
- `sitemap.xml` é gerado no build a partir das publicações, e `robots.txt` aponta para ele.
- A URL do site fica em `profile.json` (`url`) e alimenta o canonical e o sitemap. As tags
  `og:*` e o JSON-LD em `index.html` são estáticos (crawlers sociais não executam JS).

## Deploy

Hospedado na **Vercel** (plano Hobby). Basta importar o repositório em vercel.com/new: o
`vercel.json` já define build, rewrites da SPA (para links diretos como `/publicacoes/meu-post`
não darem 404), cache imutável para `/assets` e cabeçalhos de segurança. Cada push na `main`
gera um deploy, e cada PR ganha uma URL de preview.

Requer Node ≥ 20.19 (veja `.nvmrc`).

Para usar a **Netlify** no lugar, crie `public/_redirects` com `/* /index.html 200`.
