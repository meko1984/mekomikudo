const MED_EMPTY_TEXT = "登録されている内容はありません";
const MED_TABLE_COLUMNS = [
  { key: "genericName", label: "薬剤一般名" },
  { key: "productName", label: "薬剤商品名" },
  { key: "effects", label: "効果効能" },
  { key: "tmax", label: "Tmax/hr" }
];

function parseMedicationCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function medicationCsvToObjects(text) {
  const [headers, ...rows] = parseMedicationCsv(text.replace(/^\uFEFF/, ""));
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function normalizeMedicationRow(row, categoryId, index) {
  return {
    id: `${categoryId}-${index}`,
    genericName: row["薬剤一般名"] || "",
    productName: row["薬剤商品名"] || "",
    effects: row["効果効能"] || "",
    tmax: row["Tmax/hr"] || "",
    classification: row["薬効分類"] || "",
    onset: row["効果発現時間"] || "",
    notes: row["注意点"] || ""
  };
}

function escapeMedicationHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeMedicationSearch(value) {
  return String(value || "").toLowerCase();
}

function getMedicationSearchText(row) {
  return normalizeMedicationSearch([
    row.genericName,
    row.productName,
    row.effects,
    row.tmax,
    row.classification,
    row.onset,
    row.notes
  ].join(" "));
}

function renderMedicationCell(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return escapeMedicationHtml(text).replaceAll(", ", "<br>");
}

function createMedicationModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal-backdrop" data-med-modal-close></div>
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="medication-modal-title" tabindex="-1">
      <button class="modal-close" type="button" data-med-modal-close aria-label="詳細を閉じる">×</button>
      <h2 id="medication-modal-title">薬剤詳細</h2>
      <dl class="modal-details">
        <dt>薬効分類</dt>
        <dd data-med-modal-classification></dd>
        <dt>効果発現時間</dt>
        <dd data-med-modal-onset></dd>
        <dt>注意点</dt>
        <dd data-med-modal-notes></dd>
      </dl>
    </section>
  `;
  document.body.append(modal);
  return modal;
}

function setupMedicationsDatabase(mount) {
  const sources = window.MEDICATION_DATABASES || [];
  const modal = createMedicationModal();
  const modalDialog = modal.querySelector(".modal-dialog");
  const modalClassification = modal.querySelector("[data-med-modal-classification]");
  const modalOnset = modal.querySelector("[data-med-modal-onset]");
  const modalNotes = modal.querySelector("[data-med-modal-notes]");
  let sections = [];

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
  }

  function openModal(row) {
    modalClassification.textContent = row.classification.trim() || MED_EMPTY_TEXT;
    modalOnset.textContent = row.onset.trim() || MED_EMPTY_TEXT;
    modalNotes.textContent = row.notes.trim() || MED_EMPTY_TEXT;
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    modalDialog.focus();
  }

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-med-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  if (window.location.protocol === "file:") {
    mount.innerHTML = `
      <div class="database-panel">
        <div class="database-empty">
          ChromeでHTMLファイルを直接開いているため、薬剤CSVを読み込めません。VS CodeのLive Server、またはローカルサーバーから開いてください。
        </div>
      </div>
    `;
    return;
  }

  mount.innerHTML = `
    <div class="database-panel medications-toolbar-panel">
      <div class="database-toolbar medications-toolbar">
        <strong data-medications-count>0 薬剤</strong>
        <div class="database-controls">
          <input data-medications-search type="search" placeholder="キーワードで検索">
          <select data-medications-filter aria-label="効果効能で絞り込み">
            <option value="">効果効能すべて</option>
          </select>
        </div>
      </div>
    </div>
    <div class="medications-sections" data-medications-sections></div>
  `;

  const searchInput = mount.querySelector("[data-medications-search]");
  const filterSelect = mount.querySelector("[data-medications-filter]");
  const count = mount.querySelector("[data-medications-count]");
  const sectionsMount = mount.querySelector("[data-medications-sections]");
  let sortState = { key: null, direction: "asc" };

  function splitFilterValues(value) {
    return String(value || "")
      .split(/[,、\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function updateEffectsFilter() {
    const effects = [...new Set(sections.flatMap((section) => section.rows.flatMap((row) => splitFilterValues(row.effects))))]
      .sort((a, b) => a.localeCompare(b, "ja"));
    filterSelect.innerHTML = `<option value="">効果効能すべて</option>${effects.map((value) => `<option value="${escapeMedicationHtml(value)}">${escapeMedicationHtml(value)}</option>`).join("")}`;
  }

  function sortRows(items) {
    if (!sortState.key) return [...items];
    return [...items].sort((a, b) => {
      const aValue = normalizeMedicationSearch(a[sortState.key]);
      const bValue = normalizeMedicationSearch(b[sortState.key]);
      const compared = aValue.localeCompare(bValue, "ja");
      return sortState.direction === "asc" ? compared : -compared;
    });
  }

  function filteredRows(rows) {
    const query = normalizeMedicationSearch(searchInput.value.trim());
    const effect = filterSelect.value;
    return sortRows(rows.filter((row) => {
      const matchesQuery = !query || getMedicationSearchText(row).includes(query);
      const matchesEffect = !effect || splitFilterValues(row.effects).includes(effect);
      return matchesQuery && matchesEffect;
    }));
  }

  function draw() {
    let visibleCount = 0;
    const html = sections.map((section) => {
      const rows = filteredRows(section.rows);
      visibleCount += rows.length;
      const sortHeader = (column) => {
        const active = sortState.key === column.key;
        const mark = active ? (sortState.direction === "asc" ? "▲" : "▼") : "";
        return `<th><button type="button" data-med-sort="${column.key}">${column.label}<span aria-hidden="true">${mark}</span></button></th>`;
      };
      return `
        <section class="database-panel medication-category" data-medication-category="${escapeMedicationHtml(section.id)}">
          <h2>${escapeMedicationHtml(section.title)}</h2>
          <div class="database-table-wrap">
            <table class="database-table medications-table">
              <thead><tr>${MED_TABLE_COLUMNS.map(sortHeader).join("")}</tr></thead>
              <tbody>
                ${rows.length ? rows.map((row) => `
                  <tr data-med-row-id="${escapeMedicationHtml(row.id)}" tabindex="0" aria-label="${escapeMedicationHtml(row.genericName || row.productName)} の詳細を表示">
                    ${MED_TABLE_COLUMNS.map((column) => `<td>${renderMedicationCell(row[column.key])}</td>`).join("")}
                  </tr>
                `).join("") : `<tr><td colspan="${MED_TABLE_COLUMNS.length}"><div class="database-empty">該当する薬剤がありません。</div></td></tr>`}
              </tbody>
            </table>
          </div>
        </section>
      `;
    }).join("");

    count.textContent = `${visibleCount} / ${sections.reduce((sum, section) => sum + section.rows.length, 0)} 薬剤`;
    sectionsMount.innerHTML = html;
  }

  mount.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-med-sort]");
    if (sortButton) {
      const key = sortButton.dataset.medSort;
      sortState = {
        key,
        direction: sortState.key === key && sortState.direction === "asc" ? "desc" : "asc"
      };
      draw();
      return;
    }

    const tr = event.target.closest("tr[data-med-row-id]");
    if (!tr) return;
    const row = sections.flatMap((section) => section.rows).find((item) => item.id === tr.dataset.medRowId);
    if (row) openModal(row);
  });

  mount.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tr = event.target.closest("tr[data-med-row-id]");
    if (!tr) return;
    event.preventDefault();
    const row = sections.flatMap((section) => section.rows).find((item) => item.id === tr.dataset.medRowId);
    if (row) openModal(row);
  });

  searchInput.addEventListener("input", draw);
  filterSelect.addEventListener("change", draw);

  Promise.all(sources.map((source, sourceIndex) => (
    fetch(source.file)
      .then((response) => {
        if (!response.ok) throw new Error("CSVを読み込めませんでした");
        return response.text();
      })
      .then((text) => ({
        id: `medication-${sourceIndex}`,
        title: source.title,
        rows: medicationCsvToObjects(text).map((row, index) => normalizeMedicationRow(row, `medication-${sourceIndex}`, index))
      }))
  )))
    .then((loadedSections) => {
      sections = loadedSections;
      updateEffectsFilter();
      draw();
    })
    .catch(() => {
      mount.innerHTML = `<div class="database-panel"><div class="database-empty">薬剤データを読み込めませんでした。</div></div>`;
    });
}

document.querySelectorAll("[data-medications-database]").forEach(setupMedicationsDatabase);
