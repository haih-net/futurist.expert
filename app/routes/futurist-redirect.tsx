import { redirect, type LoaderFunctionArgs } from 'react-router'
import { pages } from '../Custom/content.server'
export const loader = ({ request }: LoaderFunctionArgs): Response => {
  const url = new URL(request.url)
  const path =
    url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') || '/'
  const target = pages.some((page) => page.path === path) ? path : '/'
  return redirect(target + url.search, 301)
}
