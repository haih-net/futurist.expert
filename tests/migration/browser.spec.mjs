import { test, expect } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
const folder = new URL('../../app/Custom/content/', import.meta.url)
const pages = readdirSync(folder)
  .filter((file) => file.endsWith('.json') && file !== 'import.json')
  .map((file) => JSON.parse(readFileSync(new URL(file, folder), 'utf8')))

for (const source of pages) {
  test(`Контент, гидратация и ширина: ${source.path}`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    const response = await page.goto(source.path)
    expect(response.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText(source.heading)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      source.source,
    )
    if (source.body.length) {
      const strings = (nodes) =>
        nodes
          .map((node) =>
            typeof node === 'string' ? node : strings(node.children),
          )
          .join('')
      const normalize = (text) => text.replace(/\s+/g, ' ').trim()
      expect(normalize(await page.locator('.prose').textContent())).toBe(
        normalize(strings(source.body)),
      )
    }
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true)
    await page
      .getByRole('navigation', { name: 'Основная навигация' })
      .getByRole('link', { name: 'Концепты' })
      .click()
    await expect(page).toHaveURL(/\/concepts$/)
    await expect(page.locator('h1')).toHaveText('Концепты')
    expect(errors).toEqual([])
  })
}

test('SPA-переходы, метаданные, история и скриншот', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.__migrationMarker = 'same-document'
  })
  const article = page.locator('.card h3 a').first()
  const href = await article.getAttribute('href')
  await article.click()
  await expect(page).toHaveURL(new RegExp(href + '$'))
  await expect(page.locator('h1')).toBeFocused()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://futurist.expert' + href,
  )
  expect(await page.evaluate(() => window.__migrationMarker)).toBe(
    'same-document',
  )
  await page.screenshot({
    path: testInfo.outputPath('article.png'),
    fullPage: true,
  })
  await page.goBack()
  await expect(page.locator('h1')).toHaveText('Футурист')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://futurist.expert/',
  )
  await page.screenshot({
    path: testInfo.outputPath('home.png'),
    fullPage: true,
  })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: testInfo.outputPath('home-viewport.png') })
})
