import type * as React from 'react'
import { useLoaderData, type MetaFunction } from 'react-router'
import { getPage } from '../Custom/content.server'
import { ConceptsPage } from '../Custom/pages/ConceptsPage'
import { pageMeta, unavailableMeta } from '../Custom/seo'
import type { PageData } from '../Custom/interfaces'
export const loader = (): PageData => getPage('/concepts')
export const meta: MetaFunction<typeof loader> = ({ loaderData, error }) =>
  loaderData && !error ? pageMeta(loaderData) : unavailableMeta()
const Page: React.FC = () => (
  <ConceptsPage {...useLoaderData<typeof loader>()} />
)
export { Page as default }
