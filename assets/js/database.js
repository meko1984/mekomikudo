const badgeClassMap = {
  "呼吸器": "tag-blue",
  "循環器": "tag-pink",
  "炎症": "tag-beige",
  "血液": "tag-pink",
  "救急カート": "tag-pink",
  "サンプル": "tag-print",
  "準備中": "tag-pending",
  "実施": "tag-print",
  "見守り": "tag-training",
  "未経験": "tag-pending",
  "急変対応": "tag-pink",
  "観察": "tag-blue",
  "安全": "tag-beige"
};

function renderValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    return value.map((item) => `<span class="tag ${badgeClassMap[item] || "tag-blue"}">${item}</span>`).join(" ");
  }
  return String(value || "");
}

function getSearchText(row) {
  return JSON.stringify(row).toLowerCase();
}

function renderDatabase() {
  const mount = document.querySelector("[data-database]");
  const dataset = window.NURSING_DATABASE;
  if (!mount || !dataset) return;

  const rows = dataset.rows || [];
  const columns = dataset.columns || [];
  const searchId = `${mount.dataset.database || "database"}-search`;

  mount.innerHTML = `
    <div class="database-panel">
      <div class="database-toolbar">
        <strong>${rows.length} ${dataset.countLabel || "項目"}</strong>
        <input id="${searchId}" type="search" placeholder="キーワードで絞り込み">
      </div>
      <div class="database-table-wrap">
        <table class="database-table">
          <thead>
            <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = mount.querySelector("tbody");
  const input = mount.querySelector(`#${searchId}`);

  const draw = (items) => {
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${columns.length}"><div class="database-empty">該当する項目がありません。</div></td></tr>`;
      return;
    }
    tbody.innerHTML = items.map((row) => `
      <tr>${columns.map((column) => `<td>${renderValue(row[column])}</td>`).join("")}</tr>
    `).join("");
  };

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const filtered = rows.filter((row) => getSearchText(row).includes(query));
    draw(filtered);
  });

  draw(rows);
}

renderDatabase();
