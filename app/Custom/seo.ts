import type { MetaDescriptor } from 'react-router'
import type { PageData } from './interfaces'

const origin = 'https://futurist.expert'
export const unavailableMeta = (): MetaDescriptor[] => [
  { title: 'Страница не найдена — Futurist.expert' },
  {
    name: 'description',
    content:
      'Запрошенная страница недоступна. Перейдите к каталогу концептов Futurist.expert.',
  },
  { name: 'robots', content: 'noindex, follow' },
]
export const pageMeta = ({ page, concepts }: PageData): MetaDescriptor[] => {
  const url = origin + page.path
  const article = page.path.startsWith('/concepts/')
  const title = page.title.includes('Futurist.expert')
    ? page.title
    : `${page.title} — Futurist.expert`
  const breadcrumbs = [
    { name: 'Главная', path: '/' },
    ...(page.path !== '/' ? [{ name: 'Концепты', path: '/concepts' }] : []),
    ...(article ? [{ name: page.heading, path: page.path }] : []),
  ]
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: 'Futurist.expert',
      inLanguage: 'ru',
    },
    {
      '@type': article
        ? 'Article'
        : page.path === '/concepts'
          ? 'CollectionPage'
          : 'WebPage',
      '@id': `${url}#page`,
      url,
      name: title,
      headline: page.heading,
      description: page.description,
      inLanguage: 'ru',
      isPartOf: { '@id': `${origin}/#website` },
      ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
      ...(article && page.author?.name
        ? {
            creditText: `${page.author.name}${page.author.isAiAgent ? ' — AI-агент' : ''}`,
          }
        : {}),
      ...(page.path !== '/'
        ? { breadcrumb: { '@id': `${url}#breadcrumbs` } }
        : {}),
    },
  ]
  if (page.path !== '/')
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: origin + crumb.path,
      })),
    })
  if (page.path === '/concepts')
    graph.push({
      '@type': 'ItemList',
      numberOfItems: concepts.length,
      itemListElement: concepts.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.heading,
        url: origin + entry.path,
      })),
    })
  return [
    { title },
    { name: 'description', content: page.description },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:site_name', content: 'Futurist.expert' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:type', content: article ? 'article' : 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: page.description },
    ...(article && page.updatedAt
      ? [{ property: 'article:modified_time', content: page.updatedAt }]
      : []),
    { 'script:ld+json': { '@context': 'https://schema.org', '@graph': graph } },
  ]
}
