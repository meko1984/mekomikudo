"""Shared semantic labels for the catalog and every disease page."""
import re
import unicodedata

def symptom_parts(value):
    """Separate co-listed findings without splitting explanatory parentheses."""
    parts=[]; start=0; depth=0
    for index,char in enumerate(value):
        if char in '（(': depth+=1
        elif char in '）)': depth=max(0,depth-1)
        elif char=='・' and not depth:
            if value[start:index].strip(): parts.append(value[start:index].strip())
            start=index+1
    if value[start:].strip(): parts.append(value[start:].strip())
    return parts

def item_category(value,kind):
    """A shared semantic color, independent from the disease's organ system."""
    value=unicodedata.normalize('NFKC',value).replace('−','-').replace('⁻','-')
    if kind=='lab':
        # Match complete abbreviations, not a letter anywhere in an examination name.
        aliases=[
            ('glucose-lab',r'(?<![A-Za-z])(?:HbA1c|GLU)(?![A-Za-z])|ヘモグロビンA1c|グリコヘモグロビン'),
            ('cardiac-lab',r'(?<![A-Za-z])CK-?MB(?![A-Za-z])|MB型クレアチンキナーゼ'),
            ('enzyme-lab',r'(?<![A-Za-z])(?:CK|CPK|ALP|LDH|LD)(?![A-Za-z])|クレアチンキナーゼ|アルカリ(?:ホス|フォス)ファターゼ|乳酸脱水素酵素'),
            ('pancreatic-lab',r'(?<![A-Za-z])(?:Lipase|AMY)(?![A-Za-z])|リパーゼ|アミラーゼ'),
            ('nutrient-lab',r'25\s*\(OH\)\s*D|ビタミンD'),
            ('osmolality-lab',r'(?<![A-Za-z])(?:Posm|Uosm)(?![A-Za-z])|浸透圧'),
            ('lipid-lab',r'(?<![A-Za-z])(?:LDL(?:-C)?|HDL(?:-C)?|TG|TC)(?![A-Za-z])|コレステロール|中性脂肪|脂質'),
            ('endocrine-lab',r'(?<![A-Za-z])(?:FT4|FT3|TSH|ACTH|PTH|LH|FSH|IGF-?1)(?![A-Za-z])|コルチゾール'),
            ('electrolyte',r'(?<![A-Za-z])IP(?![A-Za-z])|無機リン'),
            ('coagulation',r'(?<![A-Za-z])(?:APTT|PT(?:-INR)?|INR|D-?dimer|D-D|FDP)(?![A-Za-z])|Dダイマー|D-ダイマー|フィブリノゲン'),
            ('blood-gas',r'(?<![A-Za-z])(?:PaO2|PaCO2|HCO3-?|pH|BE|SaO2)(?![A-Za-z])'),
            ('renal-lab',r'クレアチニン|シスタチン|尿アルブミン|尿蛋白|尿中白血球|尿素窒素|(?<![A-Za-z])UN(?![A-Za-z])'),
            ('hematology',r'フェリチン|血清鉄|総鉄結合能|不飽和鉄結合能|トランスフェリン|(?<![A-Za-z])(?:FER|TSAT|Fe|TIBC|UIBC)(?![A-Za-z])|(?<![A-Za-z])(?:Hgb|Hb|PLAT|PLT|RBC|Ht|Eos)(?![A-Za-z])|ヘモグロビン|ヘマトクリット|血小板|好酸球'),
            ('cardiac-lab',r'(?<![A-Za-z])(?:TnT|TnI|cTnT|cTnI)(?![A-Za-z])|トロポニン'),
        ]
        for category,pattern in aliases:
            if re.search(pattern,value,re.I): return category
    rules={
      'symptom':[
        ('breathing','呼吸|息切れ|息苦|喘鳴|咳|痰|SpO|換気|酸素化|酸素需要|ラ音'),
        ('circulation','循環|血圧|低灌流|動悸|失神|浮腫|むくみ|冷感|静脈うっ血|頻脈|徐脈|脈拍|脈の|不整脈|冷汗|頸静脈'),
        ('neurologic','傾眠|不穏|意識|麻痺|言語|認知|物忘れ|行動|瞳孔|けいれん|頭痛|めまい|立ちくらみ|視覚|しびれ|感覚|振戦|筋痙攣|神経症状|眠気|混乱|ふらつき|言葉|言動|視野|複視|見え方|眼球運動|覚醒|幻視|注意力|注意の変化|反応.*(?:低下|変化|揺れ)|普段と違う反応|落ち着かなさ|震え'),
        ('hematology','出血|吐血|血便|黒色便|紫斑|喀血|貧血|血小板'),
        ('pain','痛|不快'),('digestive','食|腹|嘔吐|嘔気|悪心|下痢|黄疸|便|嚥下|むせ|体重|摂取'),
        ('urinary','尿|排尿|残尿|腎|失禁'),('skin','皮膚|発赤|びらん|壊死|創|硬結|熱感|浸出|かゆみ|掻痒|湿潤|腫脹|腫れ|皮弁|色調|色の変化|^傷$'),
        ('mobility','歩|筋力|動け|動作|脱力|活動|移動困難|動かしにく|運動障害|転倒'),
        ('infection','発熱|悪寒|感染|全身|倦怠'),('metabolic','口渇|多尿|寒がり')],
      'lab':[
        ('blood-gas',r'血液ガス|呼気終末CO|経皮CO'),
        ('microbiology-lab',r'培養|感受性|抗原|核酸|真菌検査'),
        ('imaging-lab',r'(?<![A-Za-z])(?:CT|MRI)(?![A-Za-z])|X線|画像|超音波|シンチ'),
        ('cardiac-lab',r'心電図|心エコー|右心カテーテル|ドプラ|TBI|皮膚灌流|血圧|脈拍'),
        ('renal-lab',r'尿検査|残尿測定|尿流測定|腎機能'),
        ('endocrine-lab',r'甲状腺|性ホルモン'),
        ('coagulation',r'凝固'),
        ('electrolyte',r'電解質'),
        ('inflammation',r'(?<![A-Za-z])(?:CRP|WBC)(?![A-Za-z])|白血球'),
        ('renal-lab',r'(?<![A-Za-z])(?:Cr|CRE|BUN|eGFR)(?![A-Za-z])|尿蛋白|尿中白血球'),
        ('glucose-lab',r'(?<![A-Za-z])HbA1c(?![A-Za-z])|血糖|グルコース'),
        ('liver-lab',r'(?<![A-Za-z])(?:AST|ALT|Alb|T-Bil|D-Bil|γ-GTP|GGT|NH3)(?![A-Za-z])|ビリルビン|アルブミン|アンモニア'),
        ('cardiac-lab',r'(?<![A-Za-z])(?:BNP|NT-proBNP|ABI)(?![A-Za-z])|トロポニン'),
        ('electrolyte',r'(?<![A-Za-z])(?:Na|K|Ca|Mg|P|Cl)(?![A-Za-z])|ナトリウム|カリウム|カルシウム|マグネシウム|無機リン|クロール'),
        ('general-lab',r'(?<![A-Za-z])Lac(?![A-Za-z])|乳酸')],
      'drug':[
        ('metabolic-drug',r'鉄補充|鉄剤|含糖酸化鉄|\bESA\b|HIF-PH|赤血球造血刺激|ダルベポエチン|ロキサデュスタット'),
        # Mechanism-specific families precede organ labels and generic antagonists.
        ('pde5-drug',r'PDE\s*5|ホスホジエステラーゼ5|タダラフィル|シルデナフィル'),
        ('sgc-drug',r'sGC|可溶性グアニル酸シクラーゼ|リオシグアト'),
        ('endothelin-drug','クラゾセンタン|ピヴラッツ|エンドセリン受容体|ボセンタン|アンブリセンタン|マシテンタン'),
        ('prostacyclin-drug','プロスタサイクリン|エポプロステノール|トレプロスチニル|セレキシパグ'),
        ('activin-drug','アクチビン|ソタテルセプト'),
        ('hemostatic-drug','抗凝固.*(?:拮抗|中和)|プロトロンビン複合体|凝固因子補充|止血管理|ケイセントラ'),
        ('anti-infective','抗菌|抗MRSA|グリコペプチド|バンコマイシン|抗ウイルス|抗真菌|リファキシミン|リフキシマ'),('antithrombotic','抗凝固|抗血小板|抗血栓|血栓溶解|DOAC|ヘパリン'),
        ('respiratory-drug',r'LAMA|LABA|SABA|SAMA|ICS|気管支拡張|吸入|β\s*2\s*(?:受容体)?刺激'),
        ('cardiovascular-drug',r'降圧|β\s*1?\s*(?:受容体)?遮断|Ca拮抗|ARB|ACE阻害|ARNI|MRA|血管拡張|血管収縮薬|心拍数|リズム|アトロピン|ノルアドレナリン|硝酸薬|ニトログリセリン|スタチン'),
        ('fluid-drug',r'利尿|補液|電解質|高K血症|リン吸着|高張食塩|(?:K|Ca|Mg|リン)補(?:充|正)|Ca静注|K除去|アルブミン製剤'),
        ('metabolic-drug','インスリン|血糖降下|SGLT2|ビグアナイド|SU薬|グリニド|DPP-?4|GLP-?1|ビタミン|Ca|リン製剤|骨粗鬆症|ホルモン|ヒドロコルチゾン|レボチロキシン|デスモプレシン|バソプレシン.*補充|抗FGF23|ブロスマブ|ブドウ糖'),
        ('analgesic','鎮痛'),('digestive-drug','ラクツロース|ラグノス|非吸収性合成二糖類|アカルボース|オクトレオチド'),
        ('skin-drug','皮膚保護|創傷被覆'),('immune-drug','ステロイド|免疫抑制'),
        ('urologic-drug',r'α\s*1\s*(?:受容体)?遮断|5α還元'),('neurologic-drug','抗発作薬|抗てんかん薬|ファスジル|エリル|蛋白リン酸化酵素阻害|ドネペジル|コリンエステラーゼ阻害|抗アミロイド|レカネマブ|ドナネマブ|メマンチン|脳血管攣縮|浸透圧療法')]
    }
    for category,pattern in rules[kind]:
        if re.search(pattern,value,re.I): return category
    return {'symptom':'general','lab':'general-lab','drug':'general-drug'}[kind]
