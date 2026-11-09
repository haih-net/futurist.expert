import nunito400Url from '@fontsource/nunito/400.css?url'
import nunito600Url from '@fontsource/nunito/600.css?url'
import nunito700Url from '@fontsource/nunito/700.css?url'
import { loadRoot } from './request/rootLoader.server'
import { requestMiddleware } from './request/context.server'
import { App as CustomApp } from './Custom/components/pages/_App'
import { Statistics } from './components/Statistics'
import { errorPageStatusCode } from './components/Statistics/status'
import type * as React from 'react'
import { DocumentStyled as HtmlStyled } from './Custom/components/SiteLayout/styles'
import { Meta as SeoHeaders } from 'react-router'
import { unavailableMeta as unavailableSeoMeta } from './Custom/seo'

export const links = () => [
  { rel: 'stylesheet', href: nunito400Url },
  { rel: 'stylesheet', href: nunito600Url },
  { rel: 'stylesheet', href: nunito700Url },
]

export const middleware = [requestMiddleware]
export const loader = loadRoot
// Refresh runtime configuration when leaving a prerendered page.
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => defaultShouldRevalidate || currentUrl.pathname !== nextUrl.pathname
export const meta = unavailableSeoMeta
import type { ReactNode } from 'react'
import { SiteLayout } from './Custom/components/SiteLayout'
import type { ShouldRevalidateFunction } from 'react-router'
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from 'react-router'

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const rootData = useRouteLoaderData<typeof loader>('root')
  return (
    <HtmlStyled lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <SeoHeaders />
        <Links />
      </head>
      <body>
        <CustomApp initialApolloState={rootData?.initialApolloState}>
          <SiteLayout>{children}</SiteLayout>
        </CustomApp>
        <ScrollRestoration />
        <Scripts />
      </body>
    </HtmlStyled>
  )
}
const App: React.FC = () => {
  return (
    <>
      <Outlet />
      <Statistics />
    </>
  )
}

export { App as default }

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError()
  return (
    <>
      <Statistics statusCode={errorPageStatusCode(error)} />
      <h1 tabIndex={-1}>
        {isRouteErrorResponse(error)
          ? `${error.status} — Страница недоступна`
          : 'Не удалось открыть страницу'}
      </h1>
      <p>Обновите страницу или перейдите к каталогу концептов.</p>
      <a href="/">На главную</a>
    </>
  )
}
