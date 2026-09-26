"""Authored concise definitions and shared, semantic readability transforms."""
import html, re

DEFINITIONS = dict(line.split('|', 1) for line in '''ckd|腎臓の障害、または腎機能の低下が3か月以上続く状態
adhf|心臓の働きが急に悪化し、うっ血や全身への血流不足による症状が新たに現れる、または増悪する状態
ileus-bowel-obstruction|腸閉塞は物理的な障害で腸内容が進めない状態、イレウスは機械的な閉塞がなく腸管運動が低下した状態
copd|気道や肺胞の障害により、息を吐くときの空気の流れが持続的に制限される病気
hhs|著しい高血糖に重い脱水と血液の高浸透圧を伴う状態
iad|尿や便の接触による湿潤・刺激で皮膚が炎症を起こす状態
sah|脳を覆うくも膜の下の空間に出血する病気
sick-sinus|心拍の起点となる洞結節の働きが障害され、徐脈や心拍の停止などが起こる状態
shock|組織への血流や酸素供給が不足し、臓器の働きを保てなくなる危険な状態
dumping|胃の手術後などに食べ物が小腸へ急速に流れ、食後の腹部症状や低血糖などが起こる状態
nephrotic|尿に大量の蛋白が失われ、血液中のアルブミン低下やむくみを生じる状態
refeeding|長期間の低栄養後に栄養を再開することで、電解質や体液が急変し臓器障害を起こす状態
vertebral-fracture|背骨を構成する椎体がつぶれるように折れた状態
rhabdomyolysis|骨格筋が壊れ、筋肉内の成分が血液中へ流れ出る状態
hypopituitarism|下垂体から分泌されるホルモンの一部または複数が不足する状態
infection|病原体が体内に侵入・増殖し、組織の障害や炎症などを起こすこと
liver-disease|肝臓が傷つく肝障害、線維化が進む肝硬変、肝臓の働きが大きく失われる肝不全を扱うページ
asthma|気道の慢性炎症により、変動する気道の狭まりと咳・喘鳴・息苦しさを生じる病気
pneumothorax|胸膜の間に空気が入り、肺が縮んでしまう状態
aki|短期間に腎機能が低下し、老廃物や水分・電解質の調節が難しくなる状態
respiratory-failure|血液へ十分な酸素を取り込めない、または二酸化炭素を十分に排出できない状態
subdural-hematoma|脳を覆う硬膜の内側に血液がたまる状態
hypertension|動脈の血圧が持続的に高くなる病気
hypercapnia|動脈血の二酸化炭素分圧が高くなった状態
osteomalacia|骨の石灰化が不十分になり、骨が軟らかく弱くなる病気
tamponade|心膜液貯留は心臓の周囲に液体がたまる状態で、心タンポナーデはその圧で心臓に血液が入りにくくなる状態
myocardial-infarction|心筋への血流や酸素の供給が不足し、心筋の一部が壊死する病気
heart-failure|心臓の機能障害により、息切れやむくみなどが現れる症候群
pyelonephritis|細菌などが腎盂や腎臓の組織に感染し、炎症を起こす病気
nph|脳室が拡大し、歩行・認知・排尿の障害を生じる水頭症の一型
phlebitis|静脈の壁に炎症が起こる状態
dvt|深部静脈血栓症は深い静脈に血栓ができる病気で、肺塞栓症と合わせて静脈血栓塞栓症と呼ぶ
bph|前立腺が良性に大きくなり、尿の通り道を圧迫して排尿障害などを起こす病気
femoral-neck-fracture|太ももの骨の股関節に近い頸部が折れた状態
aortic-dissection|大動脈の壁が裂け、壁の中に血液が流れ込んで別の通り道ができる病気
malnutrition|必要な栄養が不足し、体の機能や筋肉量などの維持が難しくなる状態
electrolytes|ナトリウムやカリウムなど、体液中の電解質の濃度やバランスが崩れた状態
diabetes|インスリンの不足や作用低下により、血糖値が慢性的に高くなる病気
uti|腎臓から尿道までの尿路に病原体が感染して炎症を起こす病気
dementia|認知機能の低下により、日常生活の自立に支障が出る状態
ischemic-stroke|脳の血管が詰まるなどして血流が途絶え、脳組織が壊死する病気
intracerebral-hemorrhage|脳の血管が破れて、脳の組織内に出血する病気
cerebral-edema|脳浮腫は脳に水分が増えて腫れる状態で、脳ヘルニアは圧迫により脳の一部が本来の位置からずれる状態
disuse|安静や不活動が続き、筋力や心肺機能などが低下する状態
sepsis|感染に対する体の反応が制御できなくなり、生命を脅かす臓器障害を生じる状態
pneumonia|主に感染によって肺胞や肺の組織に炎症が起こる病気
emphysema|肺胞の壁が壊れ、空気を吐き出す力やガス交換の面積が減る病気
pulmonary-embolism|主に静脈でできた血栓が肺動脈に流れ込み、血流を妨げる病気
pulmonary-hypertension|肺の血管を流れる血液の圧力が高くなる状態
pulmonary-edema|肺の間質や肺胞に水分がたまり、酸素を取り込みにくくなる状態
atrial-fibrillation|心房細動は心房の電気活動が乱れ、有効な収縮が失われて脈が不規則になる不整脈
aso|主に脚の動脈が動脈硬化で狭くなったり詰まったりして、血流が不足する病気
valvular-disease|心臓の弁が開きにくくなる、または閉じきらず血液が逆流する病気
cellulitis|細菌が真皮や皮下組織に感染し、赤み・腫れ・熱感・痛みを起こす病気
chronic-renal-failure|慢性の腎機能低下が進み、排泄や体液調節などの働きが不足した状態
pancreatitis|膵臓に炎症が起こる病気
pressure-injury|褥瘡は圧迫やずれによる組織の損傷で、スキンテアは摩擦などの外力によって皮膚が裂ける傷'''.splitlines())

def points(text):
    items = [x.strip() for x in re.findall(r'[^。]+。?', text) if x.strip()]
    return '<ul class="practice-points">' + ''.join('<li>'+x+'</li> ' for x in items) + '</ul>'

def apply_readability(page, slug, name, treatments):
    definition = DEFINITIONS[slug]
    lead = definition if slug in ('tamponade','dvt','cerebral-edema','atrial-fibrillation') else name+'とは、'+definition
    page = re.sub(r'(<p class="disease-lead">).*?</p>', lambda m:m[1]+html.escape(lead)+'。</p>', page, flags=re.S)
    page = re.sub(r'(<nav class="disease-toc".*?</nav>)', r'<details class="disease-toc-disclosure"><summary>ページ内の目次</summary>\1</details>', page, flags=re.S)
    # Split complete sentences, not commas: keep qualifications attached to their claims.
    page = re.sub(r'<p(?=[ >])([^>]*)>(.*?)</p>', lambda m:'<div'+m[1]+'>'+points(m[2])+'</div>' if m[2].count('。')>1 and '<a ' not in m[2] else m[0], page, flags=re.S)
    page = re.sub(r'<dd>(.*?)</dd>', lambda m:'<dd>'+points(m[1])+'</dd>' if m[1].count('。')>1 and '<ul' not in m[1] else m[0], page, flags=re.S)
    summary = '治療の基本：'+ '、'.join(b for _,b in treatments)+'。'
    if slug=='heart-failure':
        summary='治療の基本：ADHFでは呼吸・循環の安定化、うっ血解除、誘因治療を優先する。安定後のHFrEFではARNI（またはACE阻害薬・ARB）、β遮断薬、MRA、SGLT2阻害薬の4系統を基本に、病型・血圧・腎機能などで個別化する。'
    page = re.sub(r'(<section id="treatment"[^>]*><h2>.*?</h2>)', lambda m:m[1]+'<div class="treatment-overview">'+points(html.escape(summary))+'</div>',page)
    page = re.sub(r'diseases\.css\?v=[^"\']+', 'diseases.css?v=20260926-1', page)
    glossary_version = '20260926-2' if slug == 'heart-failure' else '20260916-1'
    return page.replace('</body>', f'<script src="../../../assets/js/disease-glossary.js?v={glossary_version}"></script></body>')
