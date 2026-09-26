"""Build static, original illustrated disease notes from reviewed general content.
Never reads or copies the private Notion export or its images.
"""
from pathlib import Path
import json, html, re
from disease_practice import enrich
from disease_readability import apply_readability
from disease_categories import item_category, symptom_parts

ROOT = Path(__file__).resolve().parents[1]
E = html.escape
SYSTEMS = {
 '呼吸器': 'respiratory', '循環器': 'cardiovascular', '消化器': 'digestive',
 '腎・泌尿・生殖器（男性）': 'renal', '内分泌代謝': 'endocrine', '脳神経': 'neurological',
 '整形': 'orthopedic', '皮膚・熱傷': 'skin', '精神': 'mental', '救急': 'emergency'
}
DISPLAY_SYSTEM = {'腎・泌尿・生殖器（男性）': '腎・泌尿器', '整形': '運動器', '内分泌代謝': '内分泌・代謝'}
# User-facing order. Regeneration inserts new pages into the matching group.
SYSTEM_ORDER = ['救急','呼吸器','循環器','消化器','腎・泌尿器','内分泌・代謝','脳神経','精神','皮膚・熱傷','運動器']
SYSTEM_RANK = {name:index for index,name in enumerate(SYSTEM_ORDER)}
NHS = 'https://www.nhs.uk/conditions/'
REFS = {k: ('NHS：' + title, NHS + path + '/') for k,title,path in [
 ('ckd','Chronic kidney disease','kidney-disease'),('aki','Acute kidney injury','acute-kidney-injury'),
 ('pyelo','Kidney infection','kidney-infection'),('uti','Urinary tract infections','urinary-tract-infections-utis'),
 ('hf','Heart failure','heart-failure'),('mi','Heart attack','heart-attack'),('af','Atrial fibrillation','atrial-fibrillation'),
 ('hypertension','High blood pressure','high-blood-pressure-hypertension'),('sah','Subarachnoid haemorrhage','subarachnoid-haemorrhage'),
 ('subdural','Subdural haematoma','subdural-haematoma'),('nph','Hydrocephalus','hydrocephalus'),
 ('stroke','Stroke — treatment','stroke/treatment'),('pneumonia','Pneumonia','pneumonia'),('asthma','Asthma','asthma'),
 ('pe','Pulmonary embolism','pulmonary-embolism'),('ph','Pulmonary hypertension','pulmonary-hypertension'),
 ('osteomalacia','Rickets and osteomalacia','rickets-and-osteomalacia'),('dvt','Deep vein thrombosis','deep-vein-thrombosis-dvt'),
 ('phlebitis','Phlebitis','phlebitis'),('pad','Peripheral arterial disease','peripheral-arterial-disease-pad'),
 ('valve','Heart valve disease','heart-valve-disease'),('cirrhosis','Cirrhosis','cirrhosis'),('pancreatitis','Acute pancreatitis','acute-pancreatitis'),
 ('malnutrition','Malnutrition','malnutrition'),('sepsis','Sepsis','sepsis'),('cellulitis','Cellulitis','cellulitis'),
 ('pressure','Pressure ulcers','pressure-sores'),('hip','Broken hip','broken-hip'),
 ('dementia','Dementia — symptoms','dementia/symptoms'),('bph','Enlarged prostate','enlarged-prostate'),
 ('diabetes','Diabetes','diabetes')
]}
REFS.update({
 'adhf':('日本循環器学会／日本心不全学会：2025年改訂版 心不全診療ガイドライン','https://www.j-circ.or.jp/cms/wp-content/uploads/2025/03/JCS2025_Kato.pdf'),
 'ileus':('日本腹部救急医学会雑誌：イレウスという用語の問題点','https://www.jstage.jst.go.jp/article/jaem/43/1/43_29/_pdf/-char/ja'),
 'shock':('MedlinePlus：Shock','https://medlineplus.gov/shock.html'),
 'copd':('日本呼吸器学会：慢性閉塞性肺疾患','https://www.jrs.or.jp/citizen/disease/b/b-01.html'),
 'nephrotic':('NIDDK：Nephrotic Syndrome in Adults','https://www.niddk.nih.gov/health-information/kidney-disease/nephrotic-syndrome-adults'),
 'dumping':('NIDDK：Dumping Syndrome','https://www.niddk.nih.gov/health-information/digestive-diseases/dumping-syndrome'),
 'pituitary':('Endocrine Society：Hormone Replacement in Hypopituitarism','https://www.endocrine.org/clinical-practice-guidelines/hormone-replacement-in-hypopituitarism'),
 'hhs':('Diabetes UK：Hyperosmolar Hyperglycaemic State','https://www.diabetes.org.uk/about-diabetes/looking-after-diabetes/complications/hyperosmolar-hyperglycaemic-state'),
 'rhabdo':('CDC：Treatment of Rhabdomyolysis','https://www.cdc.gov/niosh/rhabdo/treatment/index.html'),
 'respiratory':('NHLBI：Respiratory Failure','https://www.nhlbi.nih.gov/health/respiratory-failure'),
 'sss':('NHLBI：Conduction Disorders','https://www.nhlbi.nih.gov/health/conduction-disorders'),
 'vertebral':('日本整形外科学会：脊椎椎体骨折','https://www.joa.or.jp/public/sick/condition/vertebral_compression_fracture.html'),
 'pneumothorax':('NHS Gloucestershire：Spontaneous primary pneumothorax','https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/spontaneous-primary-pneumothorax/'),
 'disuse':('NHS Sussex：How and why to stay active in hospital','https://www.uhsussex.nhs.uk/resources/how-and-why-to-stay-active-in-hospital/'),
 'dissection':('国立循環器病研究センター：大動脈瘤と大動脈解離','https://www.ncvc.go.jp/hospital/pub/knowledge/disease/aortic-aneurysm_dissection/'),
 'refeeding':('NHS：Prevention and Management of Refeeding Syndrome','https://www.uhbw.nhs.uk/assets/1/23-639_refeedingsyndromeguideline-4_redacted.pdf'),
 'iad':('NHS Royal Devon：Incontinence Associated Dermatitis protocol','https://www.royaldevon.nhs.uk/media/wwbclbpo/incontinence-associated-dermatitis-iad-protocol.pdf'),
 'tamponade':('MedlinePlus：Cardiac tamponade','https://medlineplus.gov/ency/article/000194.htm'),
 'infection':('CDC：About Infections','https://www.cdc.gov/infection-control/about/index.html'),
 'electrolytes':('MedlinePlus：Fluid and Electrolyte Balance','https://medlineplus.gov/fluidandelectrolytebalance.html'),
 'edema':('Neurocritical Care Society：Acute Treatment of Cerebral Edema（2020）','https://www.neurocriticalcare.org/Portals/0/Docs/Resources/Cook2020_Article_GuidelinesForTheAcuteTreatment.pdf'),
 'pulmonary-edema':('MedlinePlus：Pulmonary edema','https://medlineplus.gov/ency/article/000140.htm')
})

def text(x,y,s,size=16):
    return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" fill="currentColor" stroke="none">{E(s)}</text>'
def path(d,**attrs):
    a=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in attrs.items())
    return f'<path d="{d}" {a}/>'
def circle(x,y,r,fill='white'):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def rect(x,y,w,h,fill='white',rx=8):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'
def arrow(x1,y1,x2,y2):
    return f'<path d="M{x1} {y1}L{x2} {y2}" marker-end="url(#tip)" fill="none"/>'

def illustration(kind, slug):
    """Mechanism motifs: labels explain what the geometry means, never diagnostic images."""
    s=''; caption=''
    if kind in ('airway','alveoli'):
        if kind=='airway':
            s=circle(85,115,53)+circle(85,115,35)+circle(275,115,53,'var(--system-soft)')+circle(275,115,15)
            s+=text(85,40,'通り道が広い')+text(275,40,'通り道が狭い')+arrow(152,115,204,115)
            caption='気道の断面：壁の変化や収縮で内腔が狭くなる。'
        else:
            s=''.join(circle(x,y,23) for x,y in [(65,90),(100,90),(65,130),(100,130)])
            s+=path('M248 66C215 80 220 152 258 165C299 177 321 118 300 82C285 60 268 59 248 66Z',fill='var(--system-soft)')
            s+=arrow(147,115,204,115)+text(85,40,'多くの肺胞壁')+text(275,40,'壁が失われる')
            caption='肺胞壁の破壊：小さな部屋の境界が失われ、交換面積や弾性が減る。'
    elif kind in ('occlusion','venous-clot','vessel-inflamed','dissection','pressure'):
        s=rect(20,78,320,88,'var(--system-soft)',22)+rect(20,96,320,52,'white',12)
        if kind=='dissection':
            s+=path('M80 96C140 130 210 55 315 96',fill='none')+arrow(70,128,150,128)+arrow(155,91,260,82)
            s+=text(110,205,'真腔')+text(271,45,'壁内の偽腔')
            caption='壁の中に別の血液の通り道（偽腔）ができ、真腔が圧迫されることがある。'
        elif kind=='pressure':
            s+=arrow(55,120,130,120)+arrow(200,120,295,120)+arrow(120,73,120,33)+arrow(250,170,250,210)
            caption='血管内の圧が高い状態：血管壁や、送り出す心臓への負荷が増える。'
        elif kind=='vessel-inflamed':
            s+=path('M95 82L110 95L125 82L140 95L155 82L170 95L185 82L200 95L215 82',fill='none',stroke_width=5)+arrow(50,120,100,120)
            caption='静脈壁の炎症：血管の走行に沿った痛み・発赤・硬結を観察する。'
        else:
            s+=circle(175,122,24,'currentColor')+arrow(45,120,120,120)+arrow(229,120,282,120)
            s+=text(175,48,'血栓・狭窄')+text(275,202,'血流が減る')
            if kind=='venous-clot':
                s+=arrow(180,76,265,30)+text(90,206,'戻りが滞る')
                caption='静脈内の血栓は戻る血流を妨げる。離れた血栓は肺動脈へ流れることがある。'
            else: caption='血管の内腔が狭まる・詰まることで、その先へ届く血液が減る。臓器の位置は省略した模式図。'
    elif kind in ('filter','leak'):
        s=rect(20,55,130,115,'var(--system-soft)')+rect(210,55,130,115)
        s+=path('M180 50V180',stroke_dasharray='6 9',stroke_width=8)+text(85,35,'血液側')+text(275,35,'尿側')
        s+=''.join(circle(x,y,7,'currentColor') for x,y in [(48,78),(88,80),(118,92),(66,117),(106,142)])
        if kind=='leak':
            s+=arrow(115,110,251,110)+circle(275,115,12,'currentColor')+text(180,211,'蛋白が尿へ漏れる')
            caption='糸球体の保持機能が障害されると、血液中に保つべき蛋白が尿へ失われる。'
        else:
            s+=arrow(111,112,162,112)+path('M172 95V135',stroke_width=6)+text(180,211,'排泄・調節が不十分')
            caption='腎機能の低下：老廃物や電解質、水分を適切に調節・排泄できなくなる。'
    elif kind in ('osmotic','shift','glucose','balance','depletion','signal'):
        s=rect(20,60,120,105,'var(--system-soft)')+rect(220,60,120,105)
        labels={
          'osmotic':('血液','尿','糖と水が失われる'), 'shift':('血液','細胞内','P・K・Mgが移動'),
          'glucose':('血液の糖','細胞','取り込みが不足'), 'balance':('体内','排泄・摂取','過剰 ↔ 不足'),
          'depletion':('蓄え・筋肉','必要な活動','蓄えが減っていく'), 'signal':('下垂体','標的臓器','ホルモン信号が不足')}
        a,b,c=labels[kind];s+=text(80,40,a)+text(280,40,b)+text(180,211,c)
        s+=''.join(circle(x,y,7,'currentColor') for x,y in [(48,84),(80,84),(111,84),(48,122),(80,122),(111,122)])
        s+=arrow(148,110,208,110)
        if kind in ('glucose','signal'):s+=path('M174 91L187 128',stroke_width=5)
        else:s+=circle(280,110,9,'currentColor')
        caption={'osmotic':'糖が尿へ出るとき、水も一緒に失われる。体液不足がさらに高浸透圧を悪化させる。',
          'shift':'栄養再開後のインスリン作用で、電解質が血液から細胞内へ移る。',
          'glucose':'インスリンの不足・作用不足により、糖の利用と血糖調節が障害される。',
          'balance':'電解質の濃度は、摂取・腎排泄・水分量・細胞内外の移動で変わる。',
          'depletion':'摂取不足や不活動が、筋肉と活動能力の低下につながる。',
          'signal':'下垂体からの指令が不足すると、その先の臓器のホルモン産生が低下する。'}[kind]
    elif kind in ('brain-bleed','brain-compress','ventricle','network'):
        s=circle(180,115,88)+path('M128 65C90 90 110 154 144 160C152 184 182 168 183 158C216 185 263 145 244 106C254 76 219 46 194 65C162 37 143 54 128 65Z',fill='var(--system-soft)')
        if kind=='ventricle':
            s+=path('M148 88Q162 75 170 104L176 144L162 153Q136 126 148 88ZM212 88Q198 75 190 104L184 144L198 153Q224 126 212 88Z',fill='currentColor')
            caption='脳室に髄液がたまり拡大する。歩行・認知・排尿の変化を対応させて観察する。'
        elif kind=='network':
            s+=path('M133 97L168 135M172 78L208 103M188 144L220 150',fill='none')
            s+=''.join(circle(x,y,6,'currentColor') for x,y in [(133,97),(168,135),(172,78),(208,103),(188,144),(220,150)])
            caption='神経ネットワークの障害：どの認知機能が損なわれるかで生活の困りごとが異なる。'
        elif kind=='brain-bleed':
            if slug=='sah': s+=path('M120 76Q100 112 121 145',stroke_width=12)+text(180,225,'脳表の周囲へ出血')
            else:s+=circle(143,110,24,'currentColor')+arrow(177,110,224,110)+text(180,225,'脳実質内の血腫')
            caption='出血の位置を示す模式図。くも膜下出血と脳内出血では、出血する空間が異なる。'
        else:
            s+=path('M115 61Q72 119 119 176Q101 118 141 80Z',fill='currentColor') if slug=='subdural-hematoma' else arrow(180,20,180,66)+arrow(273,112,228,112)
            s+=arrow(145,117,206,117)+text(180,225,'限られた空間で圧迫')
            caption='頭蓋内は広がりにくい。血腫や浮腫などによる容積の増加が脳を圧迫する。'
    elif kind in ('skin','skin-pressure','invasion'):
        s=rect(25,85,310,32,'var(--system-soft)',0)+rect(25,117,310,60,'white',0)+path('M25 85H143L160 107L184 77L202 85H335',fill='none',stroke_width=5)
        s+=text(80,58,'皮膚表面')+text(277,153,'皮下組織')
        if kind=='skin-pressure':
            s+=arrow(126,20,126,74)+arrow(238,37,193,66)+text(180,218,'圧・ずれ／裂ける外力')
            caption='圧迫で深部の組織が傷む褥瘡と、皮膚が裂けるスキンテア。深さと外力の向きを分けて考える。'
        elif slug=='iad':
            s+=path('M115 33Q103 52 115 59Q128 52 115 33ZM213 28Q201 47 213 54Q226 47 213 28Z',fill='var(--system-soft)')+arrow(115,63,139,82)+text(260,45,'湿潤・刺激')
            caption='尿・便による湿潤と刺激が皮膚のバリアを傷める。表面の赤み・びらんと、湿潤の範囲を対応させる。'
        else:
            s+=''.join(circle(x,y,5,'currentColor') for x,y in [(156,52),(176,61),(167,137),(185,151)])+arrow(175,65,175,126)
            caption='傷などから入った細菌が真皮・皮下組織に炎症を起こす。赤み・腫れの広がりと全身症状を追う。' if kind=='skin' else '病原体の侵入・増殖と、それに対する炎症反応。感染部位と全身への影響を分けて評価する。'
    elif kind in ('alveolar-fill','exchange','pleura'):
        s=path('M90 40V75C29 81 26 172 87 184C143 189 160 97 110 75V40',fill='white')
        if kind=='pleura':
            s+=path('M62 69C5 120 30 205 100 207C172 200 180 109 133 69',fill='none',stroke_dasharray='7 5')+arrow(167,122,127,122)+text(270,94,'胸膜腔の空気')+text(267,151,'肺が縮む')
            caption='胸壁と肺の間の空気が、肺の拡張を妨げる。肺の内側に空気が増える状態とは異なる。'
        else:
            s+=rect(220,75,110,110,'var(--system-soft)',25)
            s+=text(99,218,'肺胞')+text(275,218,'血液')
            if kind=='alveolar-fill':
                s+=path('M42 127Q62 116 84 130T143 130Q142 180 97 183Q49 180 42 127',fill='var(--system-soft)')
                s+=arrow(146,118,208,118)+path('M178 98V137',stroke_width=6)+text(242,39,'酸素が届きにくい')
                caption='肺胞内の液体がガス交換を妨げる。肺炎では炎症性滲出、肺水腫では体液の移動が中心。'
            else:
                s+=arrow(150,100,211,100)+arrow(211,158,150,158)+text(181,77,'O₂')+text(181,190,'CO₂')
                caption='O₂を取り込む酸素化と、CO₂を排出する換気。両方向を血液ガスと呼吸状態で評価する。'
    elif kind in ('pump','compress-heart','rhythm','valve','perfusion'):
        s=path('M175 74C105 17 52 97 175 184C298 97 245 17 175 74Z',fill='var(--system-soft)')
        if kind=='compress-heart':
            s=circle(175,116,91)+s+arrow(50,120,110,120)+arrow(301,120,240,120)
            caption='心臓の周囲からの圧迫で拡張しにくくなる。入ってくる血液が減り、拍出量が低下する。'
        elif kind=='rhythm':
            beats=[40,81,122,263,304] if slug=='sick-sinus' else [40,70,122,149,229,264,304]
            s=path('M30 140H330',fill='none')+''.join(path(f'M{x} 140V90',stroke_width=5) for x in beats)+arrow(50,179,310,179)+text(180,210,'時間 →')
            s+=text(180,44,'間隔が延びる・途切れる' if slug=='sick-sinus' else '拍動の間隔が不規則')
            caption='洞結節の働きが低下すると、拍動が遅くなったり途切れたりする。縦線は拍動の時刻を示す。' if slug=='sick-sinus' else '心房の電気活動が乱れ、心室へ伝わるタイミングが不規則になる。縦線は拍動の時刻を示す。'
        elif kind=='valve':
            s+=path('M140 104L170 119L201 101M140 105L153 130M201 101L191 130',fill='none')+arrow(173,143,173,92)
            caption='弁の開放が不十分なら狭窄、閉鎖が不十分なら逆流。圧と容量の負荷を分けて考える。'
        else:
            s+=arrow(228,100,313,100)+text(297,62,'全身へ')+arrow(76,163,40,192)
            caption='ポンプ機能・血管・体液量によって臓器に届く血流が変わる。うっ血と低灌流は別に評価する。'
        if kind!='rhythm': s+=text(180,230,'流れ・圧・リズムを評価')
    elif kind in ('compression','fracture','mineral'):
        if kind=='compression':
            s=rect(50,61,90,78)+path('M231 90L315 61V139H231Z',fill='var(--system-soft)')+arrow(174,104,209,104)+arrow(271,15,271,60)
            caption='椎体の前方がつぶれてくさび形になる例。変形が軽い骨折や、後方まで損傷する骨折もある。'
        else:
            s=path('M105 49C55 35 61 97 100 90L192 172C193 218 254 207 234 172L142 77C162 33 114 18 105 49Z',fill='var(--system-soft)')
            if kind=='fracture': s+=path('M121 76L112 100L137 96L128 119',fill='none',stroke_width=5)
            else:s+=''.join(circle(x,y,3,'currentColor') for x,y in [(117,83),(148,115),(180,146),(206,172)])
            caption='大腿骨頸部は骨頭と骨幹をつなぐ部分。骨折のずれは支持性や骨頭への血流に影響する。' if kind=='fracture' else '骨の基質に十分なミネラルが沈着せず、荷重に耐えにくくなる。'
        s+=text(180,233,'荷重と支持の関係')
    elif kind=='outlet':
        s=path('M90 30Q50 135 161 147H199Q310 135 270 30',fill='var(--system-soft)')+rect(159,142,42,94)+circle(140,171,28,'var(--system-soft)')+circle(220,171,28,'var(--system-soft)')+arrow(180,91,180,133)+arrow(180,184,180,226)
        s+=text(180,26,'膀胱')+text(81,221,'前立腺')+text(287,221,'尿道')
        caption='膀胱の下にある前立腺が、内側を通る尿道を圧迫して尿の流れを妨げる。'
    elif kind in ('rupture','inflammation','liver','ascending','transit'):
        if kind=='ascending':
            s=path('M103 39C45 30 43 110 103 110C134 108 135 82 105 75C90 73 91 58 105 55Z',fill='var(--system-soft)')+path('M109 108V160Q150 204 194 160V108',fill='none')+rect(111,161,85,35,'var(--system-soft)')+arrow(209,164,209,89)
            caption='尿路を上行する感染の模式図。膀胱中心の症状と腎臓まで及んだ全身症状を分ける。'
        elif kind=='transit':
            s=path('M70 20V76C20 142 102 184 147 118C170 86 136 60 104 75V20',fill='var(--system-soft)')+path('M145 120Q219 90 275 140Q310 180 244 187',fill='none',stroke_width=12)+arrow(165,92,247,111)
            caption='胃から小腸への流入が速すぎる。早期の体液移動と、後期の低血糖を区別する。'
        elif kind=='liver':
            s=path('M39 77Q181 12 317 89L281 133L191 142L67 194Z',fill='var(--system-soft)')+path('M96 58L114 161M151 43L177 150M215 49L235 139M76 99L289 107',fill='none')
            caption='肝組織の線維化は血液の通過を妨げる。合成機能低下と門脈圧上昇を別々に追う。'
        elif kind=='rupture':
            s=rect(24,60,118,110,'var(--system-soft)')+path('M35 80H130M35 101H110M35 122H130M35 143H112',fill='none')+arrow(148,111,229,111)+circle(276,90,10,'currentColor')+circle(278,145,6,'currentColor')+text(275,193,'蛋白・K')
            caption='壊れた筋細胞から蛋白やKが流出する。尿量と心電図を確認する理由につながる。'
        else:
            s=path('M40 130Q70 72 149 104Q245 45 323 104Q270 157 179 130Q91 175 40 130Z',fill='var(--system-soft)')+arrow(174,95,174,37)+arrow(180,140,180,200)+text(280,201,'炎症・体液移動')
            caption='膵臓の炎症が周囲へ広がり、組織への体液移動と循環への影響を起こす。'
    else: raise ValueError(kind)
    return f'<svg viewBox="0 0 360 250" role="img" aria-labelledby="diagram-title diagram-desc" xmlns="http://www.w3.org/2000/svg"><title id="diagram-title">{E(caption)}</title><desc id="diagram-desc">{E(caption)} 病態を理解するための模式図で、実際の形や大きさを再現したものではありません。</desc><defs><marker id="tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor"/></marker></defs><g stroke="currentColor" stroke-width="2.5" font-family="sans-serif">{s}</g></svg>',caption

inventory=json.loads((ROOT/'content/disease-inventory.json').read_text(encoding='utf-8-sig'))
notes=[]
for line in (ROOT/'content/disease-notes.txt').read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'): continue
    p=line.split('|'); assert len(p)==13,(len(p),p[0])
    i,slug,motif,flow,obs,up,down,drugs,treat,note,skills,related,ref = p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10],p[11],p[12]
    notes.append(dict(index=int(i),slug=slug,motif=motif,flow=flow.split('~'),obs=[x.split('>') for x in obs.split('~')],up=up.split(';'),down=down.split(';'),drugs=drugs.split(';'),treat=[x.split('>') for x in treat.split('~')],note=note,skills=skills.split(','),related=related.split(','),ref=ref))

by_slug={x['slug']:x for x in notes}
assert len(notes)==len(inventory),(len(notes),len(inventory))
DISPLAY_NAMES={
 'adhf':'ADHF/急性非代償性心不全',
 'aki':'AKI/急性腎障害',
 'aso':'ASO/閉塞性動脈硬化症',
 'atrial-fibrillation':'AF/心房細動',
 'ckd':'CKD/慢性腎臓病',
 'copd':'COPD/慢性閉塞性肺疾患',
 'dvt':'VTE/DVT/静脈血栓塞栓症・深部静脈血栓症',
 'hhs':'HHS/高浸透圧高血糖状態',
 'iad':'IAD/失禁関連皮膚炎',
 'nph':'NPH/正常圧水頭症',
 'pulmonary-embolism':'PTE/PE/肺血栓塞栓症',
 'sah':'SAH/くも膜下出血',
 'sick-sinus':'SSS/洞不全症候群',
 'subdural-hematoma':'SDH/硬膜下血腫',
 'uti':'UTI/尿路感染症',
}
for n in notes:
    item=inventory[n['index']]; n['name']=item['name']; n['systems']=item['systems']; n['system']=SYSTEMS[item['systems'][0]]
    if n['slug'] in DISPLAY_NAMES: n['name']=DISPLAY_NAMES[n['slug']]

entry=(ROOT/'nursing/diseases/index.html').read_text(encoding='utf-8')
header=re.search(r'<header class="site-header">.*?</header>',entry,re.S).group()
header=re.sub(r'href="([^"]+)"',lambda m:'href="'+('../'+m[1] if not m[1].startswith(('https:','#')) else m[1])+'"',header)
footer=re.search(r'<footer class="site-footer">.*?</footer>',entry,re.S).group()

def system_badges(values,system):
    return ' '.join(f'<span class="disease-tag" data-system="{system}">{E(v)}</span>' for v in values)


def clean_items(values,kind):
    cleaned=[]
    for value in values:
        value=re.sub(r'（[^）]*）','',value).strip()
        if kind=='drug':
            value=re.sub(r'^(原因に応じた?|病型に応じた?|欠乏に応じた?)','',value)
            value=re.sub(r'(など|等)$','',value)
        if kind in ('lab','drug'):
            parts=value.split('・')
        else: parts=[value]
        for part in parts:
            part=part.strip()
            if not part or part in ('特有の血液検査なし','標準治療は主に手術評価','病態そのものへの特効薬なし','治療薬','原因に応じた治療薬','原因別治療薬','原因別の薬剤','経口栄養補助','不足分の補充','補液','創傷被覆材'): continue
            if part not in cleaned: cleaned.append(part)
    return cleaned

def concept_badges(values,kind):
    return ' '.join(f'<span class="disease-tag" data-category="{item_category(v,kind)}">{E(v)}</span>' for v in values) or '—'
rows=[]
for n in notes:
    name=n['name']; slug=n['slug']; system=n['system']; source=REFS[n['ref']]
    extra_ref='<li><a href="https://www.skintears.org/post/bpr-for-the-prevention-and-management-of-skin-tears-in-aged-skin" rel="noopener noreferrer" target="_blank">ISTAP：Best Practice Recommendations for Skin Tears</a> — スキンテアの評価と予防・管理。</li>' if slug=='pressure-injury' else ''
    picture,caption=illustration(n['motif'],slug)
    symptoms=list(dict.fromkeys(part for x in n['obs'] for part in symptom_parts(x[0]))); lab_up=clean_items(n['up'],'lab'); lab_down=clean_items(n['down'],'lab'); drugs=clean_items(n['drugs'],'drug')
    region=' '.join(system_badges([DISPLAY_SYSTEM.get(s,s)],SYSTEMS[s]) for s in n['systems'])
    summaries=''.join(f'<div><dt>{label}</dt><dd>{concept_badges(values,kind)}</dd></div>' for label,values,kind in [('主な症状',symptoms,'symptom'),('代表的な薬',drugs,'drug'),('検査値UP',lab_up,'lab'),('検査値DOWN',lab_down,'lab')])
    flow=''.join(f'<li><span class="step-number">{i+1}</span><strong>{E(v)}</strong></li>' for i,v in enumerate(n['flow']))
    obs=''.join(f'<li><strong class="concept-label" data-category="{item_category(a,"symptom")}">{E(a)}</strong><span class="map-arrow" aria-hidden="true">→</span><span>{E(b)}</span></li>' for a,b in n['obs'])
    treatment=''.join(f'<li><span class="treatment-target">{E(a)}</span><span class="map-arrow" aria-hidden="true">→</span><strong>{E(b)}</strong></li>' for a,b in n['treat'])
    links=[]
    for skill in n['skills']:
        f=ROOT/f'nursing/skills/{skill}/index.html'; assert f.exists(),skill
        title=re.search(r'<title>(.*?)</title>',f.read_text(encoding='utf-8'),re.S).group(1).split('｜')[0]
        links.append(f'<li><a href="../../skills/{skill}/">{E(title)}</a><small>看護技術</small></li>')
    for other in n['related']:
        assert other in by_slug,other
        links.append(f'<li><a href="../{other}/">{E(by_slug[other]["name"])}</a><small>関連する疾患・病態</small></li>')
    page=f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(name)}｜疾患・病態｜永遠の新人看護師備忘録</title><meta name="description" content="{E(name)}の病態生理・症状と観察・治療を、短い説明とオリジナル図でつなぐ学習ノート。">
<link rel="canonical" href="https://mekomikudo.jp/nursing/diseases/{slug}/"><meta name="robots" content="index,follow"><meta name="theme-color" content="#eef6f8"><meta property="og:title" content="{E(name)}｜疾患・病態"><meta property="og:description" content="{E(name)}を図で理解する看護学習ノート。"><meta property="og:site_name" content="永遠の新人看護師備忘録"><meta property="og:type" content="article"><meta property="og:locale" content="ja_JP"><meta property="og:url" content="https://mekomikudo.jp/nursing/diseases/{slug}/"><meta name="twitter:card" content="summary"><link rel="icon" href="../../../favicon.ico"><link rel="stylesheet" href="../../../assets/css/styles.css?v=20260726-1"><link rel="stylesheet" href="../../../assets/css/diseases.css?v=20260926-1"></head>
<body data-page="nursing" data-section="diseases">{header}<main id="main-content" data-system="{system}"><div class="wrap disease-detail">
<nav aria-label="パンくず"><a href="../">疾患・病態</a> / {E(name)}</nav><header class="disease-detail-hero"><p>{region}</p><h1 class="disease-heading">{E(name)}</h1><p class="disease-lead">{E(n['flow'][0])}。{E(n['flow'][2])}につながる。</p><dl class="disease-summary">{summaries}</dl></header>
<p class="disease-lab-note">検査値は代表的な変化。全例に共通する診断基準ではなく、病期・治療・併存症で変わる。</p>
<nav class="disease-toc" aria-label="このページの内容"><a href="#observations">症状／観察項目</a><a href="#mechanism">病態生理</a><a href="#treatment">治療</a><a href="#related">関連リンク</a><a href="#references">参考文献</a></nav>
<section id="observations" class="disease-section"><h2>症状／観察項目</h2><p class="section-guide">起きている変化から、見る場所へ。</p><ul class="observation-links" aria-label="症状と観察の対応">{obs}</ul></section>
<section id="mechanism" class="disease-section"><h2>病態生理</h2><figure class="disease-mechanism"><div class="anatomy-panel">{picture}</div><ol class="mechanism-chain" aria-label="病態のつながり">{flow}</ol><figcaption>{E(caption)}</figcaption></figure><p class="disease-keypoint">{E(n['note'])}</p></section>
<section id="treatment" class="disease-section"><h2>治療</h2><p class="section-guide">治療の対象と、主な方法。</p><ul class="treatment-links" aria-label="病態に対する治療">{treatment}</ul><p class="disease-lab-note">代表的な治療の整理。病型・重症度・禁忌・国内の適応に応じて選択する。</p></section>
<section id="related" class="disease-section"><h2>関連リンク</h2><ul class="disease-related">{''.join(links)}<li><a href="../../medications/">薬剤一覧</a><small>{E('・'.join(drugs)) if drugs else '代表薬なし'}</small></li><li><a href="../../labs/">検査値一覧</a><small>検査の意味と関連所見</small></li></ul></section>
<section id="references" class="disease-section"><h2>参考文献</h2><ul><li><a href="{E(source[1])}" rel="noopener noreferrer" target="_blank">{E(source[0])}</a> — 疾患の概要・評価・治療の参照資料。</li>{extra_ref}</ul><p class="disease-lab-note">内容確認：<time datetime="2026-09-15">2026年9月15日</time>。海外資料の推奨は国内の薬剤適応・施設手順と区別して読む。</p></section>
<p class="disease-lab-note">看護学習用の概念図。実際の形・大きさ・診断所見を再現した図ではない。</p><a class="disease-back" href="../">疾患・病態の一覧に戻る</a></div></main>{footer}<script src="../../../assets/js/main.js"></script><script src="../../../assets/js/disease-diagrams.js?v=20260926-1"></script></body></html>'''
    page=enrich(page,ROOT,slug,item_category)
    page=apply_readability(page, slug, name, n['treat'])
    dest=ROOT/f'nursing/diseases/{slug}/index.html'; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_text(page,encoding='utf-8')
    rows.append({'疾患名':name,'領域':[DISPLAY_SYSTEM.get(s,s) for s in n['systems']],'主な症状':symptoms, '検査値UP':lab_up,'検査値DOWN':lab_down,'関連薬剤':drugs,
      '_categories':{'主な症状':[item_category(v,'symptom') for v in symptoms],'検査値UP':[item_category(v,'lab') for v in lab_up],'検査値DOWN':[item_category(v,'lab') for v in lab_down],'関連薬剤':[item_category(v,'drug') for v in drugs]},
      'href':slug+'/','system':system})
rows.sort(key=lambda row: (SYSTEM_RANK[row['領域'][0]], row['疾患名'].casefold()))
sorted_systems=sorted(((DISPLAY_SYSTEM.get(k,k),v) for k,v in SYSTEMS.items()),key=lambda x:SYSTEM_RANK[x[0]])
catalog={'countLabel':'疾患・病態','columns':['疾患名','領域','主な症状','検査値UP','検査値DOWN','代表的な薬'],'systems':dict(sorted_systems),'rows':rows}
(ROOT/'data/disease-catalog.js').write_text('window.NURSING_DATABASE = '+json.dumps(catalog,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(ROOT/'content/disease-page-manifest.json').write_text(json.dumps([{'sourceName':inventory[n['index']]['name'],'name':n['name'],'slug':n['slug'],'systems':n['systems'],'diagram':n['motif'],'reference':REFS[n['ref']][1]} for n in notes],ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Built {len(notes)} static disease pages, {len(SYSTEMS)} systems, {len(set(n["motif"] for n in notes))} explanatory diagram motifs.')
