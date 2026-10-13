import type { Config } from '@react-router/dev/config'
import manifest from './app/Custom/content/import.json'
const config = {
  ssr: true,
  prerender: manifest.pages.map((page) => page.path),
  routeDiscovery: { mode: 'initial' },
} satisfies Config
export { config as default }
