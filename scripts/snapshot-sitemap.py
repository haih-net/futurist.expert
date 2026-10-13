"""Сохранить sitemap и построить файловый контракт переноса futurist.expert."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'tests/migration/fixtures/sitemap'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'x': 'http://www.w3.org/1999/xhtml'}
ORIGIN = 'https://futurist.expert'


def local_path(url):
    parsed = urlsplit(url)
    if parsed.scheme != 'https' or parsed.netloc != 'futurist.expert' or parsed.query or parsed.fragment:
        raise ValueError(f'Неожиданный адрес: {url}')
    return parsed.path or '/'


def snapshot():
    pending = [ORIGIN + '/sitemap.xml']
    documents = {}
    pages = {}
    while pending:
        url = pending.pop(0)
        local_path(url)
        if url in documents:
            continue
        with urlopen(url, timeout=30) as response:
            local_path(response.url)
            raw = response.read()
        tree = ET.fromstring(raw)
        documents[url] = raw
        if tree.tag == '{' + NS['s'] + '}sitemapindex':
            pending.extend(node.text.strip() for node in tree.findall('s:sitemap/s:loc', NS))
        elif tree.tag == '{' + NS['s'] + '}urlset':
            for node in tree.findall('s:url', NS):
                source = local_path(node.find('s:loc', NS).text.strip())
                english = source == '/en' or source.startswith('/en/')
                if english:
                    translations = [link.attrib['href'] for link in node.findall('x:link', NS)
                                    if link.attrib.get('hreflang') == 'ru']
                    if len(translations) != 1:
                        raise ValueError(f'Нет однозначного русского аналога: {source}')
                    target = local_path(translations[0])
                else:
                    target = source
                entry = {'path': source, 'status': 301 if english else 200, 'target': target}
                if source in pages and pages[source] != entry:
                    raise ValueError(f'Противоречие: {source}')
                pages[source] = entry
        else:
            raise ValueError(f'Неизвестный формат sitemap: {url}')
    if not pages or '/' not in pages:
        raise ValueError('Sitemap пуст или не содержит главную')
    for entry in pages.values():
        if entry['status'] == 301 and pages.get(entry['target'], {}).get('status') != 200:
            raise ValueError(f'Нет русской страницы: {entry}')
    DEST.mkdir(parents=True, exist_ok=True)
    sources = []
    for index, (url, raw) in enumerate(documents.items()):
        name = f'{index:02d}-{Path(urlsplit(url).path).name}'
        (DEST / name).write_bytes(raw)
        sources.append({'url': url, 'file': name, 'sha256': hashlib.sha256(raw).hexdigest()})
    manifest = {'source': ORIGIN + '/sitemap.xml',
                'capturedAt': datetime.now(timezone.utc).isoformat(),
                'sources': sources, 'pages': sorted(pages.values(), key=lambda page: page['path'])}
    (DEST / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f"Сохранено документов: {len(documents)}, URL: {len(pages)}, русских: {sum(p['status'] == 200 for p in pages.values())}")


if __name__ == '__main__':
    snapshot()
