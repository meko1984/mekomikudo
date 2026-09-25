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
      return `<tr class="disease-row-link" data-href="${escape(row.href)}" tabindex="0" aria-label="${escape(row['疾患名'])}のページを開く">${columns.map((column, index) => {
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
  mount.querySelector('tbody').addEventListener('click', event => {
    const row = event.target.closest('tr[data-href]');
    if (!row || event.target.closest('a, button, input, select')) return;
    window.location.assign(row.dataset.href);
  });
  mount.querySelector('tbody').addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || event.target.closest('a, button, input, select')) return;
    const row = event.target.closest('tr[data-href]');
    if (!row) return;
    event.preventDefault();
    window.location.assign(row.dataset.href);
  });
  draw();
})();
