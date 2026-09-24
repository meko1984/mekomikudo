(() => {
  const root = document.querySelector('.disease-detail');
  if (!root) return;
  const glossary = Object.fromEntries(`ADHF|Acute decompensated heart failure|急性非代償性心不全
ACS|Acute coronary syndrome|急性冠症候群
NSAIDs|Nonsteroidal anti-inflammatory drugs|非ステロイド性抗炎症薬
RAAS|Renin-angiotensin-aldosterone system|レニン・アンジオテンシン・アルドステロン系
SCAD|Spontaneous coronary artery dissection|特発性冠動脈解離
HFrEF|Heart failure with reduced ejection fraction|左室駆出率が低下した心不全
HFpEF|Heart failure with preserved ejection fraction|左室駆出率が保たれた心不全
HFmrEF|Heart failure with mildly reduced ejection fraction|左室駆出率が軽度低下した心不全
STEMI|ST-elevation myocardial infarction|ST上昇型心筋梗塞
NSTEMI|Non-ST-elevation myocardial infarction|非ST上昇型心筋梗塞
PCI|Percutaneous coronary intervention|経皮的冠動脈インターベンション
CABG|Coronary artery bypass grafting|冠動脈バイパス術
DAPT|Dual antiplatelet therapy|抗血小板薬2剤併用療法
ARNI|Angiotensin receptor-neprilysin inhibitor|アンジオテンシン受容体ネプリライシン阻害薬
ACE|Angiotensin-converting enzyme|アンジオテンシン変換酵素（ACE阻害薬はその働きを抑える薬）
ARB|Angiotensin II receptor blocker|アンジオテンシンII受容体拮抗薬
MRA|Mineralocorticoid receptor antagonist|ミネラルコルチコイド受容体拮抗薬
SGLT2|Sodium-glucose cotransporter 2|ナトリウム・グルコース共輸送体2
LAMA|Long-acting muscarinic antagonist|長時間作用性抗コリン薬
LABA|Long-acting beta2 agonist|長時間作用性β2刺激薬
ICS|Inhaled corticosteroid|吸入ステロイド薬
SABA|Short-acting beta2 agonist|短時間作用性β2刺激薬
NPPV|Noninvasive positive pressure ventilation|非侵襲的陽圧換気
HFNC|High-flow nasal cannula|高流量鼻カニュラ酸素療法
PEEP|Positive end-expiratory pressure|呼気終末陽圧
CKD|Chronic kidney disease|慢性腎臓病
AKI|Acute kidney injury|急性腎障害
COPD|Chronic obstructive pulmonary disease|慢性閉塞性肺疾患
HHS|Hyperosmolar hyperglycemic state|高浸透圧高血糖状態
IAD|Incontinence-associated dermatitis|失禁関連皮膚炎
SAH|Subarachnoid hemorrhage|くも膜下出血
SSS|Sick sinus syndrome|洞不全症候群
NPH|Normal pressure hydrocephalus|正常圧水頭症
VTE|Venous thromboembolism|静脈血栓塞栓症
DVT|Deep vein thrombosis|深部静脈血栓症
PTE|Pulmonary thromboembolism|肺血栓塞栓症
PE|Pulmonary embolism|肺塞栓症
ASO|Arteriosclerosis obliterans|閉塞性動脈硬化症
PAH|Pulmonary arterial hypertension|肺動脈性肺高血圧症
CTEPH|Chronic thromboembolic pulmonary hypertension|慢性血栓塞栓性肺高血圧症
PDE5|Phosphodiesterase type 5|ホスホジエステラーゼ5
sGC|Soluble guanylate cyclase|可溶性グアニル酸シクラーゼ
DOAC|Direct oral anticoagulant|直接作用型経口抗凝固薬
UFH|Unfractionated heparin|未分画ヘパリン
LMWH|Low-molecular-weight heparin|低分子ヘパリン
APTT|Activated partial thromboplastin time|活性化部分トロンボプラスチン時間
PT-INR|Prothrombin time-international normalized ratio|プロトロンビン時間の国際標準比
BNP|B-type natriuretic peptide|B型ナトリウム利尿ペプチド
NT-proBNP|N-terminal pro-B-type natriuretic peptide|N末端プロB型ナトリウム利尿ペプチド
eGFR|Estimated glomerular filtration rate|推算糸球体濾過量
Cr|Creatinine|クレアチニン
BUN|Blood urea nitrogen|血中尿素窒素
Hb|Hemoglobin|ヘモグロビン
Alb|Albumin|アルブミン
CRP|C-reactive protein|C反応性蛋白
WBC|White blood cell count|白血球数
CK|Creatine kinase|クレアチンキナーゼ
AST|Aspartate aminotransferase|アスパラギン酸アミノトランスフェラーゼ
ALT|Alanine aminotransferase|アラニンアミノトランスフェラーゼ
LDL|Low-density lipoprotein|低密度リポ蛋白
FT4|Free thyroxine|遊離サイロキシン
AVP|Arginine vasopressin|アルギニンバソプレシン
SpO₂|Peripheral oxygen saturation|経皮的動脈血酸素飽和度
PaO₂|Arterial partial pressure of oxygen|動脈血酸素分圧
PaCO₂|Arterial partial pressure of carbon dioxide|動脈血二酸化炭素分圧
PEF|Peak expiratory flow|最大呼気流量
LVEF|Left ventricular ejection fraction|左室駆出率
EF|Ejection fraction|駆出率
MRSA|Methicillin-resistant Staphylococcus aureus|メチシリン耐性黄色ブドウ球菌
SBAR|Situation, Background, Assessment, Recommendation|状況・背景・評価・提案の報告形式
CT|Computed tomography|コンピュータ断層撮影
MRI|Magnetic resonance imaging|磁気共鳴画像
ECG|Electrocardiogram|心電図
TAVI|Transcatheter aortic valve implantation|経カテーテル的大動脈弁植込み術
TAVR|Transcatheter aortic valve replacement|経カテーテル的大動脈弁置換術
TEER|Transcatheter edge-to-edge repair|経カテーテル的弁接合不全修復術
ERCP|Endoscopic retrograde cholangiopancreatography|内視鏡的逆行性胆管膵管造影
DKA|Diabetic ketoacidosis|糖尿病性ケトアシドーシス
rt-PA|Recombinant tissue plasminogen activator|遺伝子組換え組織型プラスミノゲン活性化因子`.split('\n').map(line => { const [key, ...value] = line.split('|'); return [key, value]; }));
  const pattern = new RegExp(`(?<![A-Za-z0-9])(${Object.keys(glossary).sort((a,b) => b.length-a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![A-Za-z0-9])`, 'g');
  const popup = document.createElement('div');
  popup.className = 'disease-glossary-popup'; popup.id = 'disease-glossary-popup'; popup.role = 'tooltip'; popup.hidden = true;
  document.body.append(popup);
  let active = null;
  function close() { if (active) active.setAttribute('aria-expanded', 'false'); active = null; popup.hidden = true; }
  function open(button) {
    close(); active = button;
    const [english, japanese] = glossary[button.textContent];
    popup.replaceChildren();
    for (const text of [english, japanese]) { const line = document.createElement('div'); line.textContent = text; popup.append(line); }
    popup.hidden = false; button.setAttribute('aria-expanded', 'true');
    const rect = button.getBoundingClientRect();
    popup.style.left = `${Math.max(8, Math.min(rect.left, innerWidth-popup.offsetWidth-8))}px`;
    popup.style.top = `${rect.bottom+8+popup.offsetHeight > innerHeight ? Math.max(8,rect.top-popup.offsetHeight-8) : rect.bottom+8}px`;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: node => node.parentElement.closest('svg,a,button,script,style,h1,.disease-toc') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const matches = [...node.textContent.matchAll(pattern)]; if (!matches.length) continue;
    const fragment = document.createDocumentFragment(); let cursor = 0;
    for (const match of matches) {
      fragment.append(node.textContent.slice(cursor,match.index));
      const button = document.createElement('button'); button.type = 'button'; button.className = 'disease-abbreviation'; button.textContent = match[0];
      button.setAttribute('aria-label', `${match[0]}の正式名称と日本語`); button.setAttribute('aria-describedby', popup.id); button.setAttribute('aria-expanded','false');
      button.addEventListener('mouseenter', () => open(button)); button.addEventListener('mouseleave', () => { if (document.activeElement !== button) close(); });
      button.addEventListener('focus', () => open(button)); button.addEventListener('blur', close);
      button.addEventListener('click', () => open(button));
      fragment.append(button); cursor = match.index+match[0].length;
    }
    fragment.append(node.textContent.slice(cursor)); node.replaceWith(fragment);
  }
  document.addEventListener('click', event => { if (!event.target.closest('.disease-abbreviation')) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  window.addEventListener('scroll', close, true); window.addEventListener('resize', close);
})();
