import { index, route, type RouteConfig } from '@react-router/dev/routes'
const routes = [
  index('routes/futurist-home.tsx'),
  route('concepts', 'routes/futurist-concepts.tsx'),
  route('concepts/:slug', 'routes/futurist-concept.tsx'),
  route('en/*', 'routes/futurist-redirect.tsx'),
  route('*', 'routes/futurist-missing.tsx'),
] satisfies RouteConfig
export { routes as default }
