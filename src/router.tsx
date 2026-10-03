import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

// A home entra no bundle principal; as demais rotas são carregadas sob demanda
// (a página de publicação, por exemplo, é a única que precisa do parser de Markdown).
export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'publicacoes',
        lazy: async () => ({ Component: (await import('@/pages/PublicationsPage')).default }),
      },
      {
        path: 'publicacoes/:slug',
        lazy: async () => ({ Component: (await import('@/pages/PublicationPage')).default }),
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
