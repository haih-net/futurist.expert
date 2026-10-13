import type { ContentPage, PageData, PageSummary } from './interfaces'

const modules = import.meta.glob<ContentPage>('./content/*.json', {
  eager: true,
  import: 'default',
})
export const pages: ContentPage[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/import.json'))
  .map(([, page]) => page)
const concepts: PageSummary[] = pages
  .filter((page) => page.path.startsWith('/concepts/'))
  .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
  .map(({ path, heading, intro, updatedAt }) => ({
    path,
    heading,
    intro,
    updatedAt,
  }))
export const getPage = (path: string): PageData => {
  const page = pages.find((entry) => entry.path === path)
  if (!page) throw new Response('Страница не найдена', { status: 404 })
  return { page, concepts }
}
