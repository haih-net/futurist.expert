import type * as React from 'react'
import type { PageData } from '../../interfaces'
import { Intro } from '../../components/SiteLayout/styles'
import { ConceptCards } from '../../components/Content'
export const ConceptsPage: React.FC<PageData> = ({ page, concepts }) => (
  <div className="wrap">
    <Intro>
      <span className="eyebrow">Библиотека идей</span>
      <h1 tabIndex={-1}>{page.heading}</h1>
      <p className="lead">{page.intro}</p>
    </Intro>
    <ConceptCards pages={concepts} title="Все материалы" />
  </div>
)
