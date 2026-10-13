import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createServer } from 'node:net'
import { spawn } from 'node:child_process'
import { once } from 'node:events'

const каталог = new URL('./fixtures/sitemap/', import.meta.url)
const снимок = JSON.parse(
  readFileSync(new URL('manifest.json', каталог), 'utf8'),
)
let сервер
let адрес
let журнал = ''

before(
  async () => {
    // ОС выбирает свободный порт; ошибка запуска приложения завершает проверку.
    const резерв = createServer()
    резерв.listen(0, '127.0.0.1')
    await once(резерв, 'listening')
    const порт = резерв.address().port
    await new Promise((resolve) => резерв.close(resolve))
    адрес = `http://127.0.0.1:${порт}`
    сервер = spawn(process.execPath, ['build/node/index.js'], {
      cwd: new URL('../../', import.meta.url),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: String(порт),
        METRICS_PORT: '',
        AGENTS_CENTER_ENDPOINT: '',
        AGENTS_CENTER_TOKEN: '',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    await new Promise((resolve, reject) => {
      const таймер = setTimeout(
        () => reject(new Error(`Сервер не запустился:\n${журнал}`)),
        30000,
      )
      сервер.once('error', (error) => {
        clearTimeout(таймер)
        reject(error)
      })
      сервер.once('exit', (code) => {
        clearTimeout(таймер)
        reject(new Error(`Сервер завершился с кодом ${code}:\n${журнал}`))
      })
      сервер.stderr.on('data', (chunk) => {
        журнал += chunk.toString()
      })
      сервер.stdout.on('data', (chunk) => {
        журнал += chunk.toString()
        if (журнал.includes('"event":"server_ready"')) {
          clearTimeout(таймер)
          resolve()
        }
      })
    })
  },
  { timeout: 35000 },
)

after(async () => {
  if (!сервер || сервер.exitCode !== null || сервер.signalCode !== null) return
  const завершение = once(сервер, 'exit')
  сервер.kill('SIGTERM')
  const таймер = setTimeout(() => сервер.kill('SIGKILL'), 6000)
  try {
    await завершение
  } finally {
    clearTimeout(таймер)
  }
})

const запрос = (path) =>
  fetch(new URL(path, адрес), {
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
  })

async function русскаяСтраница(path) {
  const ответ = await запрос(path)
  assert.equal(ответ.status, 200, `${path}: ожидается 200`)
  assert.match(ответ.headers.get('content-type') ?? '', /text\/html/i)
  const html = await ответ.text()
  assert.match(
    html,
    /<html\b[^>]*\blang=["']ru(?:-RU)?["']/i,
    `${path}: нужен русский HTML`,
  )
  assert.match(
    html,
    /<title[^>]*>[^<]*\S[^<]*<\/title>/i,
    `${path}: нужен title`,
  )
  assert.match(
    html,
    /<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i,
    `${path}: нужен h1`,
  )
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .filter((tag) => /\brel=["']canonical["']/i.test(tag))
  assert.equal(canonical.length, 1, `${path}: нужен один canonical`)
  const href = canonical[0].match(/\bhref=["']([^"']+)["']/i)?.[1]
  assert.equal(
    href,
    `https://futurist.expert${path}`,
    `${path}: canonical должен соответствовать странице`,
  )
}

test('Снимок sitemap полный, уникальный и с сохранёнными исходниками', () => {
  assert.ok(снимок.pages.length > 0)
  assert.equal(
    new Set(снимок.pages.map((p) => p.path)).size,
    снимок.pages.length,
  )
  const исходныеАдреса = new Set()
  for (const source of снимок.sources) {
    const xml = readFileSync(new URL(source.file, каталог))
    assert.equal(createHash('sha256').update(xml).digest('hex'), source.sha256)
    if (xml.toString().includes('<urlset')) {
      for (const [, url] of xml
        .toString()
        .matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
        исходныеАдреса.add(new URL(url.trim()).pathname)
      }
    }
  }
  assert.deepEqual(
    [...исходныеАдреса].sort(),
    снимок.pages.map((p) => p.path).sort(),
  )
  for (const page of снимок.pages) {
    const english = page.path === '/en' || page.path.startsWith('/en/')
    assert.equal(page.status, english ? 301 : 200)
    assert.ok(
      снимок.pages.some((p) => p.path === page.target && p.status === 200),
    )
  }
})

for (const page of снимок.pages) {
  test(`${page.status} ${page.path}${page.status === 301 ? ` → ${page.target}` : ''}`, async () => {
    if (page.status === 200) return русскаяСтраница(page.path)
    const ответ = await запрос(page.path)
    assert.equal(ответ.status, 301)
    const location = ответ.headers.get('location')
    assert.ok(location, 'Нужен заголовок Location')
    assert.equal(
      new URL(location, адрес).href,
      new URL(page.target, адрес).href,
      'Редирект должен вести на русский адрес этого же тестового сервера',
    )
    await русскаяСтраница(page.target)
  })
}

test('Неизвестная страница возвращает 404, а не заглушку с 200', async () => {
  assert.equal((await запрос('/__migration_missing_page_7f219')).status, 404)
})

test('/en без слеша перенаправляется на русскую главную', async () => {
  const ответ = await запрос('/en')
  assert.equal(ответ.status, 301)
  const location = ответ.headers.get('location')
  assert.ok(location)
  assert.equal(new URL(location, адрес).href, `${адрес}/`)
})

const каталогКонтента = new URL('../../app/Custom/content/', import.meta.url)
const страницы = readdirSync(каталогКонтента)
  .filter((name) => name.endsWith('.json') && name !== 'import.json')
  .map((name) =>
    JSON.parse(readFileSync(new URL(name, каталогКонтента), 'utf8')),
  )

for (const страница of страницы) {
  test(`SEO и сохранённый текст: ${страница.path}`, async () => {
    await русскаяСтраница(страница.path)
    const ответ = await запрос(страница.path)
    const html = await ответ.text()
    assert.equal([...html.matchAll(/<h1\b/gi)].length, 1)
    assert.ok(html.includes('property="og:locale" content="ru_RU"'))
    assert.ok(html.includes('application/ld+json'))
    assert.ok(!/hreflang=["']en/i.test(html))
    assert.ok(!/name="robots" content="noindex/i.test(html))
    const разметка = JSON.parse(
      html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      )[1],
    )
    assert.ok(разметка['@graph'].some((node) => node.url === страница.source))
    const текстовыеУзлы = (nodes) =>
      nodes.flatMap((node) =>
        typeof node === 'string' ? [node] : текстовыеУзлы(node.children),
      )
    const экранировать = (value) =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#x27;')
    for (const текст of текстовыеУзлы(страница.body).filter(
      (value) => value.trim().length > 30,
    )) {
      assert.ok(
        html.includes(экранировать(текст)),
        `Не найден фрагмент текста: ${текст.slice(0, 80)}`,
      )
    }
  })
}

test('Sitemap содержит все файловые страницы и только русские URL', async () => {
  const ответ = await запрос('/sitemap.xml')
  assert.equal(ответ.status, 200)
  const xml = await ответ.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, url]) => url)
    .sort()
  assert.deepEqual(urls, страницы.map((page) => page.source).sort())
  const robots = await (await запрос('/robots.txt')).text()
  assert.ok(robots.includes('Sitemap: https://futurist.expert/sitemap.xml'))
})

test('Старый адрес /concepts/futurist перенаправляется на главную', async () => {
  const ответ = await запрос('/concepts/futurist')
  assert.equal(ответ.status, 301)
  assert.equal(ответ.headers.get('location'), '/')
})

test('Ссылки в контенте ведут на существующие локальные страницы', async () => {
  const ссылки = new Set()
  const собрать = (nodes) => {
    for (const node of nodes) {
      if (typeof node === 'string') continue
      if (node.tag === 'a' && node.attrs.href.startsWith('/'))
        ссылки.add(node.attrs.href)
      собрать(node.children)
    }
  }
  страницы.forEach((page) => собрать(page.body))
  for (const path of ссылки)
    assert.equal((await запрос(path)).status, 200, path)
})
