"""Импортировать опубликованные русские страницы в проверяемые JSON-файлы."""
import json
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlsplit
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'app/Custom/content'
CACHE = ROOT / '.cache/content-source'
ORIGIN = 'https://futurist.expert'

class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag': 'root', 'attrs': {}, 'children': []}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'children': []}
        self.stack[-1]['children'].append(node)
        if tag not in {'img','meta','link','br','hr','input','source','wbr','area','base','embed','param','track','col'}:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i]['tag'] == tag:
                self.stack = self.stack[:i]
                return
    def handle_data(self, data):
        self.stack[-1]['children'].append(data)

def walk(node):
    if isinstance(node, dict):
        yield node
        for child in node['children']:
            yield from walk(child)

ALLOWED = {'p','h2','h3','h4','h5','h6','ul','ol','li','strong','em','b','i','del','blockquote','pre','code','a','br','hr','table','thead','tbody','tr','th','td','img','sup','sub'}

def clean(node):
    if isinstance(node, str): return node
    tag = 'h2' if node['tag'] == 'h1' else node['tag']
    if tag not in ALLOWED:
        raise ValueError(f'Нужен ручной разбор тега: {tag}')
    attrs = {k: v for k,v in node['attrs'].items() if k in {'href','src','alt','title','colspan','rowspan','start','id'}}
    if 'href' in attrs:
        href = attrs['href']
        parsed = urlsplit(href)
        if parsed.scheme not in {'','https','http','mailto','tel'}:
            raise ValueError(f'Небезопасная ссылка: {href}')
        if parsed.netloc == 'futurist.expert':
            attrs['href'] = ('/' if parsed.path == '/concepts/futurist' else parsed.path) + ('?' + parsed.query if parsed.query else '') + ('#' + parsed.fragment if parsed.fragment else '')
    if attrs.get('href') == '/concepts/futurist':
        attrs['href'] = '/'
    if tag == 'img': raise ValueError('Изображение в тексте требует локального переноса')
    return {'tag': tag, 'attrs': attrs, 'children': [clean(child) for child in node['children']]}

def fetch(path):
    slug = 'home' if path == '/' else path.rsplit('/',1)[-1]
    with urlopen(ORIGIN + path, timeout=40) as response:
        html = response.read().decode('utf-8')
    (CACHE / f'{slug}.html').write_text(html)
    tree = Tree(); tree.feed(html)
    metas = [n for n in walk(tree.root) if n['tag'] == 'meta']
    title = next(n for n in walk(tree.root) if n['tag']=='title')['children'][0]
    description = next((n['attrs']['content'] for n in metas if n['attrs'].get('name')=='description'), '')
    result = {'path': path, 'title': title, 'description': description, 'source': ORIGIN+path}
    if path != '/concepts':
        raw = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>',html,re.S)[1]
        state = json.loads(raw)['props']['pageProps']['initialApolloState']
        concept = next(v for k,v in state.items() if k.startswith('KBConcept:') and v.get('uri')==path)
        bodies = [n for n in walk(tree.root) if 'sc-393fa0b6-0' in n['attrs'].get('class','').split()]
        if len(bodies)!=1: raise ValueError(f'{path}: неоднозначное тело страницы ({len(bodies)})')
        author = state.get(concept.get('CreatedBy',{}).get('__ref',''), {})
        result['description'] = description or concept['description'] or concept['intro']
        result.update({'heading': concept['name'], 'intro': concept.get('intro') or concept['description'],
                       'updatedAt': concept['updatedAt'],
                       'author': {'name': author.get('fullname') or author.get('username',''), 'isAiAgent': author.get('isAiAgent',False)},
                       'body': [clean(child) for child in bodies[0]['children']]})
        (DEST / f'{slug}.source.md').write_text(concept['content'].replace('\\n','\n')+'\n')
    else:
        result['title'] = 'Концепты — Futurist.expert'
        result['description'] = description or 'Концепты практического футуризма: системное мышление, искусственный интеллект, технологические изменения и проверка гипотез на практике.'
        result.update({'heading':'Концепты', 'intro': result['description'], 'body': []})
    (DEST / f'{slug}.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    return {'path': path, 'file': f'{slug}.json'}

if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True); CACHE.mkdir(parents=True, exist_ok=True)
    sitemap = json.loads((ROOT / 'tests/migration/fixtures/sitemap/manifest.json').read_text())
    paths = [p['path'] for p in sitemap['pages'] if p['status']==200]
    # Статья найдена по внутренним ссылкам; опубликована, но отсутствует в старом sitemap.
    paths.append('/concepts/intuitsiya-futurista-trebuet-mekhanizma-oproverzheniya')
    with ThreadPoolExecutor(max_workers=4) as pool:
        pages=list(pool.map(fetch, paths))
    (DEST/'import.json').write_text(json.dumps({'capturedAt':datetime.now(timezone.utc).isoformat(), 'pages':pages},ensure_ascii=False,indent=2)+'\n')
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for page in pages:
        xml += '  <url><loc>' + escape(ORIGIN + page['path']) + '</loc></url>\n'
    (ROOT / 'public/sitemap.xml').write_text(xml + '</urlset>\n')
    print(f'Импортировано русских страниц: {len(pages)}')
