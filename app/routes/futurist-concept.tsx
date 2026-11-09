import type * as React from 'react'
import {
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from 'react-router'
import { getPage } from '../Custom/content.server'
import { ConceptPage } from '../Custom/pages/ConceptPage'
import { pageMeta, unavailableMeta } from '../Custom/seo'
import type { PageData } from '../Custom/interfaces'
export const loader = ({ params, request }: LoaderFunctionArgs): PageData => {
  if (params.slug === 'futurist') {
    throw redirect('/' + new URL(request.url).search, 301)
  }
  return getPage(`/concepts/${params.slug}`)
}
export const meta: MetaFunction<typeof loader> = ({ loaderData, error }) =>
  loaderData && !error ? pageMeta(loaderData) : unavailableMeta()
const Page: React.FC = () => <ConceptPage {...useLoaderData<typeof loader>()} />
export { Page as default }
