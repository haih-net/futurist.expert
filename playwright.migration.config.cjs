// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests/migration',
  testMatch: 'browser.spec.mjs',
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:45137',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: 'mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:45137',
    env: {
      PORT: '45137',
      METRICS_PORT: '',
      AGENTS_CENTER_ENDPOINT: '',
      AGENTS_CENTER_TOKEN: '',
    },
    reuseExistingServer: false,
    timeout: 30000,
  },
}
module.exports = config
