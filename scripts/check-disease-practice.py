"""Audit the richer content separately; legacy page checks do not prove clinical completeness."""
import csv, html, json, re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit,parse_qs,quote
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'content/disease-page-manifest.json').read_text(encoding='utf-8'))
lab_names=set()
for row in csv.DictReader((ROOT/'data/lab-values.csv').open(encoding='utf-8-sig',newline='')):
    lab_names.update((row['項目'],row['略称']))
drug_names=set()
for path in (ROOT/'data/medications').glob('*.csv'):
    for row in csv.DictReader(path.open(encoding='utf-8-sig',newline='')):
        drug_names.update((row.get('薬剤一般名',''),row.get('一般名・成分名','')))
required=('variants','observations','judgment','actions','treatments','labs','sbar','education','links','references')
ready=[]; missing=[]; direct_links=0; verified_diagrams=0
for item in manifest:
    path=ROOT/'content/disease-practice'/f'{item["slug"]}.json'
    if not path.exists(): missing.append(item['slug']);continue
    d=json.loads(path.read_text(encoding='utf-8'))
    assert all(d.get(key) for key in required),path
    assert len(d['judgment'])==3 and len(d['sbar'])==4,path
    for observation in d['observations']:
        assert all(observation.get(k) for k in ('symptom','how','meaning','compare','worse','recheck')),path
    for treatment in d['treatments']:
        assert all(treatment.get(k) for k in ('name','aim','before','during','response','condition')),path
        if treatment.get('drug'): assert treatment['drug'] in drug_names,treatment['drug']
    for lab in d['labs']:
        targets = lab[3] if isinstance(lab[3], list) else ([lab[3]] if lab[3] else [])
        assert len(targets) == len(set(targets)), (path, lab[0], 'duplicate lab target')
        for target in targets: assert target in lab_names, target
    rendered=(ROOT/'nursing/diseases'/item['slug']/'index.html').read_text(encoding='utf-8')
    # Every requested detail must survive rendering, including multi-test cards.
    for lab in d['labs']:
        targets = lab[3] if isinstance(lab[3], list) else ([lab[3]] if lab[3] else [])
        for target in targets:
            assert f'../../labs/?lab={quote(target)}' in rendered, (path, target, 'missing lab detail link')
    # Global navigation intentionally opens indexes; clinical references must open details.
    clinical=rendered[rendered.index('<main'):rendered.index('</main>')]
    clinical_text=html.unescape(re.sub(r'<[^>]+>','',clinical))
    # A complete source record is insufficient if the renderer drops its bedside fields.
    for section in ('mechanism','observations','judgment','actions','treatment','tests','report','education','related','references'):
        assert len(re.findall(r'id="'+section+r'"',clinical))==1, f'{path}: missing/duplicate section {section}'
    for collection in ('observations','judgment','treatments'):
        for card in d[collection]:
            for key,value in card.items():
                if key=='drug' or not value: continue
                assert value in clinical_text, f'{path}: unrendered {collection}.{key}'
    report_html=clinical.split('<section id="report"',1)[1].split('</section>',1)[0]
    assert report_html.count('<ul class="practice-report-list">')==4, f'{path}: report is not four bullet lists'
    for heading,report in d['sbar']:
        assert heading in clinical_text and report in clinical_text, f'{path}: report content lost'
    for variant in d['variants']:
        assert variant.get('mode') and len(variant.get('chain',[]))>=3, f'{path}: incomplete mechanism'
        assert html.escape(variant['watch']) in clinical, f'{path}: missing mechanism observation'
    # Check the reader-facing section, not an accidental match elsewhere on the page.
    for source_key, section_id in (('actions','actions'), ('education','education'),
                                   ('labs','tests'), ('references','references')):
        section_html=clinical.split(f'<section id="{section_id}"',1)[1].split('</section>',1)[0]
        section_text=html.unescape(re.sub(r'<[^>]+>','',section_html))
        for card in d[source_key]:
            values=card[:3] if source_key=='labs' else (card[0],card[2]) if source_key=='references' else card
            for value in values:
                assert value and value in section_text, f'{path}: missing {section_id} content: {value}'
    mechanism_html=clinical.split('<section id="mechanism"',1)[1].split('</section>',1)[0]
    mechanism_text=html.unescape(re.sub(r'<[^>]+>','',mechanism_html))
    mechanism_cards=re.findall(r'<article\b[^>]*>(.*?)</article>',mechanism_html,re.S)
    assert len(mechanism_cards)==len(d['variants']), f'{path}: mechanism card count differs'
    diagram_ids=set()
    for variant,card_html in zip(d['variants'],mechanism_cards):
        card_text=html.unescape(re.sub(r'<[^>]+>','',card_html))
        for value in [variant['name'], *variant['chain'], variant['watch']]:
            assert value in card_text, f'{path}: wrong mechanism card: {value}'
        chains=re.findall(r'<ol class="practice-chain">(.*?)</ol>',card_html,re.S)
        assert len(chains)==1, f'{path}: missing causal chain'
        steps=[html.unescape(re.sub(r'<[^>]+>','',value)) for value in re.findall(r'<li>(.*?)</li>',chains[0],re.S)]
        assert steps==variant['chain'], f'{path}: causal chain order differs'
        svgs=re.findall(r'<svg\b.*?</svg>',card_html,re.S)
        assert len(svgs)==1, f'{path}: each mechanism needs one diagram'
        svg=ET.fromstring(svgs[0])
        assert svg.get('role')=='img' and svg.get('viewBox'), f'{path}: inaccessible diagram'
        title_id=svg.get('aria-labelledby')
        assert title_id and title_id not in diagram_ids, f'{path}: missing/duplicate diagram label'
        titles=[node for node in svg.iter() if node.tag.rsplit('}',1)[-1]=='title' and node.get('id')==title_id]
        assert len(titles)==1 and ''.join(titles[0].itertext()).strip(), f'{path}: missing diagram description'
        diagram_ids.add(title_id)
        verified_diagrams+=1
    for href in re.findall(r'href="([^"]+)"',clinical):
        url=urlsplit(href); q=parse_qs(url.query)
        if 'medications/' in url.path:
            assert q.get('drug'),f'generic medication link: {path}'
            assert q['drug'][0] in drug_names,q
            direct_links+=1
        if 'labs/' in url.path:
            assert q.get('lab'),f'generic lab link: {path}'
            assert q['lab'][0] in lab_names,q
            direct_links+=1
    ready.append(item['slug'])
print(f'Practice content structured and linked: {len(ready)}/55; verified direct detail targets: {direct_links}')
print(f'Mechanism cards with ordered chains, observations and labelled SVGs: {verified_diagrams}; clinical meaning requires separate review')
print('Ready for visual/clinical review: '+', '.join(ready))
print('Still missing practice content: '+', '.join(missing))
