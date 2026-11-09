import type * as React from 'react'
import { createElement } from 'react'
import { Link } from 'react-router'
import type { ContentNode, PageSummary } from '../../interfaces'
import { Catalog } from '../SiteLayout/styles'

function renderNodes(nodes: (ContentNode | string)[]): React.ReactNode[] {
  const occurrences = new Map<string, number>()
  return nodes.map((node) => {
    const content = JSON.stringify(node)
    const occurrence = occurrences.get(content) ?? 0
    occurrences.set(content, occurrence + 1)
    return <Node key={`${content}:${occurrence}`} node={node} />
  })
}

const Node: React.FC<{ node: ContentNode | string }> = ({ node }) => {
  if (typeof node === 'string') {
    return <>{node}</>
  }
  const children = renderNodes(node.children)
  const { colspan, rowspan, ...attrs } = node.attrs
  const props = {
    ...attrs,
    ...(colspan ? { colSpan: Number(colspan) } : {}),
    ...(rowspan ? { rowSpan: Number(rowspan) } : {}),
  }
  if (
    node.tag === 'a' &&
    attrs.href?.startsWith('/') &&
    !attrs.href.startsWith('//')
  ) {
    return <Link to={attrs.href}>{children}</Link>
  }
  return createElement(node.tag, props, ...children)
}
export const Content: React.FC<{ nodes: (ContentNode | string)[] }> = ({
  nodes,
}) => <div className="prose">{renderNodes(nodes)}</div>

export const ConceptCards: React.FC<{
  pages: PageSummary[]
  title?: string
}> = ({ pages, title = 'Концепты' }) => (
  <Catalog>
    <div className="section-title">
      <h2>{title}</h2>
      <span>{pages.length} материалов</span>
    </div>
    <div className="cards">
      {pages.map((page, index) => (
        <article className="card" key={page.path}>
          <span className="number">
            {String(index + 1).padStart(2, '0')} / КОНЦЕПТ
          </span>
          <h3>
            <Link to={page.path}>{page.heading}</Link>
          </h3>
          <p>{page.intro}</p>
          <Link
            className="text-link"
            to={page.path}
            aria-label={`Читать: ${page.heading}`}
          >
            Читать ↗
          </Link>
        </article>
      ))}
    </div>
  </Catalog>
)
