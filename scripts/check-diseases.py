"""Verify source coverage, public artifacts, navigation and optional local HTTP."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
# This public guideline filename is a publisher hash, not an imported private ID.
# Exempt only its exact href attribute; the same hash in prose still fails.
PUBLIC_HASH_HREFS = {
    'href="https://files.jspen.or.jp/2025/05/4617333a45dc371a5edd4ab71424ae61.pdf#page=95"',
}

def has_source_marker(source):
    for href in PUBLIC_HASH_HREFS:
        source=source.replace(href,'href="verified-public-reference"')
    return bool(re.search(r'\{\{|[a-f0-9]{32}|Notion|IMG_|[A-Z]:\\|元ノート',source))

assert not has_source_marker(next(iter(PUBLIC_HASH_HREFS)))
assert has_source_marker('4617333a45dc371a5edd4ab71424ae61')
assert has_source_marker('href="https://example.org/4617333a45dc371a5edd4ab71424ae61"')
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.ids=[]; self.links=[]; self.tags=[]; self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.tags.append((tag,attrs))
        if 'id' in attrs: self.ids.append(attrs['id'])
        for attr in ('href','src'):
            if attr in attrs: self.links.append(attrs[attr])

def has_embedded_media(parsed):
    """Disease illustrations are authored inline vectors, not imported media."""
    forbidden = {'img', 'image', 'picture', 'iframe', 'foreignobject',
                 'object', 'embed', 'video', 'audio', 'source'}
    for tag, attrs in parsed.tags:
        if tag in forbidden:
            return True
        # Local SVG marker references are allowed; external SVG reuse is not.
        if tag == 'use' and any(not value.startswith('#') for key, value in attrs.items()
                                if key in ('href', 'xlink:href')):
            return True
        if 'srcset' in attrs or 'poster' in attrs:
            return True
        style_urls = re.findall(r'url\(([^)]*)\)', attrs.get('style', ''), re.I)
        if any(not value.strip().strip('\'"').startswith('#') for value in style_urls):
            return True
    return False

assert has_embedded_media(Page('<svg><image href="private.png"/></svg>'))
assert has_embedded_media(Page('<object data="private.svg"></object>'))
assert has_embedded_media(Page('<svg><use href="private.svg#figure"/></svg>'))
assert has_embedded_media(Page('<div style="background:url(private.png)"></div>'))
assert not has_embedded_media(Page('<svg><use href="#figure"/></svg>'))
assert not has_embedded_media(Page('<path style="marker-end:url(\'#arrow\')"/>'))

inventory=json.loads((ROOT/'content/disease-inventory.json').read_text(encoding='utf-8-sig'))
manifest=json.loads((ROOT/'content/disease-page-manifest.json').read_text(encoding='utf-8'))
catalog=json.loads((ROOT/'data/disease-catalog.js').read_text(encoding='utf-8').split('=',1)[1].strip().removesuffix(';'))
expected=len(inventory)
assert len(manifest)==len(catalog['rows'])==expected
assert {x['name'] for x in inventory}=={x['sourceName'] for x in manifest}
assert len({x['slug'] for x in manifest})==expected
assert len(catalog['systems'])==10
system_order=list(catalog['systems'])
assert system_order==['救急','呼吸器','循環器','消化器','腎・泌尿器','内分泌・代謝','脳神経','精神','皮膚・熱傷','運動器']
expected_order=sorted(catalog['rows'],key=lambda row:(system_order.index(row['領域'][0]),row['疾患名'].casefold()))
assert catalog['rows']==expected_order, 'catalog must be primary-system ascending, then disease-name ascending'
seen_categories={}
for row in catalog['rows']:
    for field in ('主な症状','検査値UP','検査値DOWN','関連薬剤'):
        assert len(row[field])==len(row['_categories'][field]),(row['疾患名'],field)
        if field in ('検査値UP','検査値DOWN'):
            assert all('（' not in item and '）' not in item for item in row[field]),(row['疾患名'],field)
        color_family='symptom' if field=='主な症状' else ('lab' if field.startswith('検査値') else 'drug')
        for item,category in zip(row[field],row['_categories'][field]):
            key=(color_family,item)
            assert key not in seen_categories or seen_categories[key]==category,f'inconsistent color: {item}'
            seen_categories[key]=category
pages=[ROOT/'nursing/diseases/index.html']+[ROOT/f'nursing/diseases/{x["slug"]}/index.html' for x in manifest]
link_count=0
for p in pages:
    source=p.read_text(encoding='utf-8'); parsed=Page(source)
    assert len(parsed.ids)==len(set(parsed.ids)), f'duplicate id: {p}'
    assert len([t for t,a in parsed.tags if t=='h1'])==1,p
    assert not has_source_marker(source),p
    assert not any(t in ('iframe','foreignobject') for t,a in parsed.tags),p
    if p.parent.name!='diseases':
        assert {'observations','mechanism','treatment','related','references'} <= set(parsed.ids),p
        practice=ROOT/f'content/disease-practice/{p.parent.name}.json'
        if practice.exists():
            data=json.loads(practice.read_text(encoding='utf-8'))
            assert len([t for t,a in parsed.tags if t=='svg'])==len(data['variants']),p
            assert {'judgment','actions','tests','report','education'} <= set(parsed.ids),p
        else:
            assert len([t for t,a in parsed.tags if t=='svg'])==1,p
            assert {'diagram-title','diagram-desc'} <= set(parsed.ids),p
        assert not has_embedded_media(parsed), f'{p}: imported or embedded media'
        row=next(x for x in catalog['rows'] if x['href']==p.parent.name+'/')
        assert row['疾患名'] in source,p
        assert f'data-system="{row["system"]}"' in source,p
    for link in parsed.links:
        u=urlsplit(link)
        if u.scheme or u.netloc: continue
        target=(ROOT/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else (p.parent/unquote(u.path) if u.path else p)
        if target.is_dir(): target=target/'index.html'
        assert target.exists(),f'{p}: missing {link}'
        if u.fragment and target.suffix=='.html':
            assert unquote(u.fragment) in Page(target.read_text(encoding='utf-8-sig')).ids,f'{p}: missing anchor {link}'
        link_count+=1
    if '--http' in sys.argv:
        url='http://127.0.0.1:49217/'+p.parent.relative_to(ROOT).as_posix()+'/'
        with urlopen(url) as response:
            assert response.status==200,url
            assert response.read().decode('utf-8').replace('\r\n','\n')==source,url
page_total=expected+1
print(f'PASS: {expected}/{expected} source entries; {page_total} HTML pages; 10 systems; {link_count} local links/anchors; original SVGs; no raw-source markers'+(f'; HTTP {page_total}/{page_total}' if '--http' in sys.argv else ''))
