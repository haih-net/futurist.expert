import type * as React from 'react'
import { Link, data } from 'react-router'
import { unavailableMeta } from '../Custom/seo'
import { Intro } from '../Custom/components/SiteLayout/styles'
export const meta = unavailableMeta
export const loader = () => data({ statusCode: 404 }, { status: 404 })
const Page: React.FC = () => (
  <div className="wrap">
    <Intro>
      <span className="eyebrow">404</span>
      <h1 tabIndex={-1}>Страница не найдена</h1>
      <p>Такого адреса нет. Попробуйте найти материал в каталоге.</p>
      <Link to="/concepts">Все концепты →</Link>
    </Intro>
  </div>
)
export { Page as default }
