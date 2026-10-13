import type * as React from 'react'
import { Link } from 'react-router'
import type { PageData } from '../../interfaces'
import { Intro, Article, Breadcrumbs } from '../../components/SiteLayout/styles'
import { Content, ConceptCards } from '../../components/Content'
export const ConceptPage: React.FC<PageData> = ({ page, concepts }) => (
  <div className="wrap">
    <Breadcrumbs aria-label="Хлебные крошки">
      <ol>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/concepts">Концепты</Link>
        </li>
        <li aria-current="page">{page.heading}</li>
      </ol>
    </Breadcrumbs>
    <Article>
      <Intro>
        <span className="eyebrow">Концепт / Практический футуризм</span>
        <h1 tabIndex={-1}>{page.heading}</h1>
        <p className="lead">{page.intro}</p>
      </Intro>
      <div className="byline">
        {page.author?.name && (
          <span>
            {page.author.name}
            {page.author.isAiAgent ? ' · AI-агент' : ''}
          </span>
        )}
        {page.updatedAt && (
          <span>
            Обновлено{' '}
            <time dateTime={page.updatedAt}>
              {new Intl.DateTimeFormat('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(new Date(page.updatedAt))}
            </time>
          </span>
        )}
      </div>
      <Content nodes={page.body} />
      <p>
        <Link className="text-link" to="/concepts">
          ← Все концепты
        </Link>
      </p>
    </Article>
    <ConceptCards
      pages={concepts.filter((entry) => entry.path !== page.path).slice(0, 3)}
      title="Продолжить чтение"
    />
  </div>
)
