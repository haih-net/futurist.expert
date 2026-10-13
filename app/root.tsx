import { Statistics } from './components/Statistics'
import { errorPageStatusCode } from './components/Statistics/status'
import type * as React from 'react'
import { DocumentStyled as HtmlStyled } from './Custom/components/SiteLayout/styles'
import { Meta as SeoHeaders } from 'react-router'
import { unavailableMeta as unavailableSeoMeta } from './Custom/seo'

export const meta = unavailableSeoMeta
import type { ReactNode } from 'react'
import { SiteLayout } from './Custom/components/SiteLayout'
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'

const betterlyticsId = import.meta.env.BETTERLYTICS_SITE_ID

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <HtmlStyled lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <SeoHeaders />
        <Links />
        {betterlyticsId && (
          <script
            async
            src="https://panel.betterlytics.ru/analytics.js"
            data-site-id={betterlyticsId}
            data-server-url="https://panel.betterlytics.ru/event"
          />
        )}
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
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
