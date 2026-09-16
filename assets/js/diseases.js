(() => {
  const mount = document.querySelector('[data-database="diseases"]');
  const database = window.NURSING_DATABASE;
  if (!mount || !database) return;
  const systems = database.systems;
  const columns = ['疾患名', '領域', '主な症状', '検査値UP', '検査値DOWN', '代表的な薬'];
  const collator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const regions = Object.keys(systems);
  const regionRank = new Map(regions.map((region, index) => [region, index]));
  const orderedRows = [...database.rows].sort((a, b) =>
    (regionRank.get(a['領域'][0]) - regionRank.get(b['領域'][0])) || collator.compare(a['疾患名'], b['疾患名'])
  );
  mount.classList.add('disease-catalog');
  mount.innerHTML = `
    <p class="disease-catalog-intro">疾患名から、病態の図・症状と観察・治療へ。領域の色は各ページでも共通です。</p>
    <p class="disease-lab-note">検査値は代表的な変化で、全例に共通する診断基準ではありません。薬は病型・重症度により選択します。</p>
    <details class="disease-color-legend"><summary>色分けの見方</summary>
      <div><strong>症状</strong><span data-category="breathing">呼吸</span><span data-category="circulation">循環</span><span data-category="neurologic">神経</span><span data-category="pain">痛み</span><span data-category="digestive">消化・栄養</span><span data-category="urinary">排尿</span><span data-category="skin">皮膚</span><span data-category="mobility">運動</span><span data-category="infection">感染・全身</span><span data-category="hematology">出血</span><span data-category="metabolic">代謝</span></div>
      <div><strong>検査</strong><span data-category="blood-gas">血液ガス</span><span data-category="renal-lab">腎・尿</span><span data-category="electrolyte">電解質</span><span data-category="inflammation">炎症</span><span data-category="hematology">血球・凝固</span><span data-category="cardiac-lab">心臓・血管</span><span data-category="glucose-lab">糖代謝</span><span data-category="liver-lab">肝胆道・蛋白</span><span data-category="enzyme-lab">組織由来酵素</span><span data-category="pancreatic-lab">膵・消化酵素</span><span data-category="nutrient-lab">ビタミン</span><span data-category="osmolality-lab">浸透圧</span><span data-category="lipid-lab">脂質</span><span data-category="endocrine-lab">ホルモン</span><span data-category="imaging-lab">画像検査</span><span data-category="microbiology-lab">微生物検査</span></div>
      <div><strong>薬</strong><span data-category="respiratory-drug">呼吸器薬</span><span data-category="cardiovascular-drug">循環器薬</span><span data-category="antithrombotic">抗血栓薬</span><span data-category="hemostatic-drug">止血・中和薬</span><span data-category="anti-infective">抗感染薬</span><span data-category="metabolic-drug">代謝・内分泌薬</span><span data-category="fluid-drug">体液・電解質</span><span data-category="analgesic">鎮痛薬</span><span data-category="digestive-drug">消化器薬</span><span data-category="skin-drug">皮膚用薬</span><span data-category="immune-drug">免疫調整薬</span><span data-category="pde5-drug">PDE5阻害薬</span><span data-category="sgc-drug">sGC刺激薬</span><span data-category="endothelin-drug">エンドセリン受容体拮抗薬</span><span data-category="prostacyclin-drug">プロスタサイクリン経路</span><span data-category="activin-drug">アクチビン経路</span></div>
    </details>
    <div class="disease-controls">
      <label>疾患・症状・検査・薬を探す<input type="search" id="disease-search" placeholder="キーワードを入力"></label>
      <label>領域<select id="disease-system"><option value="">すべての領域</option>${regions.map(r => `<option>${escape(r)}</option>`).join('')}</select></label>
      <p class="disease-count" role="status" aria-live="polite"></p>
    </div>
    <p id="disease-scroll-hint">スマートフォンでは表を横に動かして確認できます。</p>
    <div class="disease-table-scroll" tabindex="0" role="region" aria-label="疾患・病態一覧" aria-describedby="disease-scroll-hint">
      <table class="disease-table"><colgroup><col class="col-name"><col class="col-region"><col class="col-symptoms"><col class="col-up"><col class="col-down"><col class="col-drugs"></colgroup><thead><tr>${columns.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody></tbody></table>
    </div>`;
  const input = mount.querySelector('input');
  const select = mount.querySelector('select');
  function draw() {
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ja').replace(/\s/g, '');
    const query = normalize(input.value.trim());
    const rows = orderedRows.filter(row => (!select.value || row['領域'].includes(select.value)) && normalize(JSON.stringify(row)).includes(query));
    mount.querySelector('.disease-count').textContent = `${rows.length} / ${database.rows.length} 疾患`;
    mount.querySelector('tbody').innerHTML = rows.length ? rows.map(row => {
      return `<tr>${columns.map((column, index) => {
      const value = row[column === '代表的な薬' ? '関連薬剤' : column];
      const categoryKey = column === '代表的な薬' ? '関連薬剤' : column;
      const contents = Array.isArray(value) ? (value.length ? value.map((item, itemIndex) => {
        const attribute = column === '領域' ? ` data-system="${systems[item]}"` : ` data-category="${row._categories?.[categoryKey]?.[itemIndex] || 'general'}"`;
        return `<span class="disease-tag"${attribute}>${escape(item)}</span>`;
      }).join(' ') : '—') : escape(value);
      const title = index === 0 && /^[a-z0-9-]+\/$/.test(row.href || '') ? `<a href="${escape(row.href)}">${contents}</a>` : contents;
      return index === 0 ? `<th scope="row">${title}</th>` : `<td>${contents}</td>`;
      }).join('')}</tr>`;
    }).join('') : '<tr><td colspan="6" class="disease-empty">一致する疾患がありません。検索語や領域を変えてみてください。</td></tr>';
  }
  input.addEventListener('input', draw);
  select.addEventListener('change', draw);
  draw();
})();
