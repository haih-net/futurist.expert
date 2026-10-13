import type * as React from 'react'
import { Link } from 'react-router'
import type { PageData } from '../../interfaces'
import { Intro, Article } from '../../components/SiteLayout/styles'
import { Content, ConceptCards } from '../../components/Content'

export const HomePage: React.FC<PageData> = ({ page, concepts }) => (
  <div className="wrap">
    <Intro>
      <div className="hero-grid">
        <div>
          <span className="eyebrow">Практическое исследование будущего</span>
          <h1 tabIndex={-1}>{page.heading}</h1>
          <p className="lead">{page.intro}</p>
          <Link className="text-link" to="/concepts">
            Исследовать концепты ↗
          </Link>
        </div>
        <aside className="cycle" aria-label="Рабочий цикл футуриста">
          <span className="eyebrow">От сигнала к проверке</span>
          <ol>
            {[
              'Сигнал',
              'Гипотеза',
              'Эксперимент',
              'Реальные ограничения',
              'Вывод и новая гипотеза',
            ].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </aside>
      </div>
    </Intro>
    <Article>
      <Content nodes={page.body} />
    </Article>
    <ConceptCards pages={concepts} title="Идеи, которые стоит проверить" />
  </div>
)
