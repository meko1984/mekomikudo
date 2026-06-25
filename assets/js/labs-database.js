const EMPTY_TEXT = "登録されている内容はありません";
const LAB_COLUMNS = [
  { key: "item", label: "項目" },
  { key: "abbreviation", label: "略称" },
  { key: "collectionMethod", label: "採血方法" },
  { key: "increaseFactors", label: "上昇要因" },
  { key: "decreaseFactors", label: "低下要因" }
];

function parseCsv(text) {
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

function csvToObjects(text) {
  const [headers, ...rows] = parseCsv(text.replace(/^\uFEFF/, ""));
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function looksLikeAbbreviation(value) {
  return /[A-Za-z0-9+\-()γ]/.test(value);
}

function splitItemAndAbbreviation(value) {
  const parts = String(value || "").split("/").map((part) => part.trim()).filter(Boolean);
  if (parts.length <= 1) return { item: parts[0] || "", abbreviation: "" };

  const [first, ...rest] = parts;
  if (looksLikeAbbreviation(first)) {
    return { item: rest.join(" / "), abbreviation: first };
  }
  return { item: first, abbreviation: rest.join(" / ") };
}

function normalizeLabRow(row, index) {
  const split = splitItemAndAbbreviation(row["項目/略称"]);
  const item = row["項目"] || split.item;
  const abbreviation = row["略称"] || split.abbreviation;
  return {
    id: `lab-${index}`,
    sourceIndex: index,
    sourceName: row["項目/略称"] || item,
    item,
    abbreviation,
    collectionMethod: row["採血方法"] || "",
    increaseFactors: row["上昇要因"] || "",
    decreaseFactors: row["低下要因"] || "",
    fullName: row["Full name"] || "",
    description: row["説明"] || ""
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeForSearch(value) {
  return String(value || "").toLowerCase();
}

function getRowSearchText(row) {
  return normalizeForSearch([
    row.item,
    row.abbreviation,
    row.collectionMethod,
    row.increaseFactors,
    row.decreaseFactors,
    row.fullName,
    row.description
  ].join(" "));
}

function renderCell(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return escapeHtml(text).replaceAll(", ", "<br>");
}

function createLabsModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal-backdrop" data-modal-close></div>
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="lab-modal-title" tabindex="-1">
      <button class="modal-close" type="button" data-modal-close aria-label="詳細を閉じる">×</button>
      <h2 id="lab-modal-title">検査値詳細</h2>
      <dl class="modal-details">
        <dt>Full name</dt>
        <dd data-modal-full-name></dd>
        <dt>説明</dt>
        <dd data-modal-description></dd>
      </dl>
    </section>
  `;
  document.body.append(modal);
  return modal;
}

function setupLabsDatabase(mount) {
  const csvPath = mount.dataset.csv;
  let rows = [];
  let visibleRows = [];
  let methodRank = new Map();
  let sortState = { key: "collectionMethod", direction: "asc" };
  const modal = createLabsModal();
  const modalDialog = modal.querySelector(".modal-dialog");
  const modalFullName = modal.querySelector("[data-modal-full-name]");
  const modalDescription = modal.querySelector("[data-modal-description]");

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
  }

  function openModal(row) {
    modalFullName.textContent = row.fullName.trim() || EMPTY_TEXT;
    modalDescription.textContent = row.description.trim() || EMPTY_TEXT;
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    modalDialog.focus();
  }

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  mount.innerHTML = `
    <div class="database-panel labs-panel">
      <div class="database-toolbar labs-toolbar">
        <strong data-labs-count>0 検査項目</strong>
        <div class="database-controls">
          <input data-labs-search type="search" placeholder="キーワードで検索">
          <select data-labs-filter aria-label="採血方法で絞り込み">
            <option value="">採血方法すべて</option>
          </select>
        </div>
      </div>
      <div class="database-table-wrap">
        <table class="database-table labs-table">
          <thead>
            <tr>${LAB_COLUMNS.map((column) => `<th><button type="button" data-sort="${column.key}">${column.label}<span aria-hidden="true"></span></button></th>`).join("")}</tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = mount.querySelector("tbody");
  const searchInput = mount.querySelector("[data-labs-search]");
  const filterSelect = mount.querySelector("[data-labs-filter]");
  const count = mount.querySelector("[data-labs-count]");
  const sortButtons = [...mount.querySelectorAll("[data-sort]")];

  function updateSortButtons() {
    sortButtons.forEach((button) => {
      const active = button.dataset.sort === sortState.key;
      button.setAttribute("aria-sort", active ? sortState.direction : "none");
      button.querySelector("span").textContent = active ? (sortState.direction === "asc" ? "▲" : "▼") : "";
    });
  }

  function sortRows(items) {
    if (!sortState.key) return [...items];
    return [...items].sort((a, b) => {
      if (sortState.key === "collectionMethod") {
        const compared = (methodRank.get(a.collectionMethod) ?? 999) - (methodRank.get(b.collectionMethod) ?? 999)
          || a.sourceIndex - b.sourceIndex;
        return sortState.direction === "asc" ? compared : -compared;
      }
      const aValue = normalizeForSearch(a[sortState.key]);
      const bValue = normalizeForSearch(b[sortState.key]);
      const compared = aValue.localeCompare(bValue, "ja");
      return sortState.direction === "asc" ? compared : -compared;
    });
  }

  function draw() {
    const query = normalizeForSearch(searchInput.value.trim());
    const method = filterSelect.value;
    visibleRows = sortRows(rows.filter((row) => {
      const matchesQuery = !query || getRowSearchText(row).includes(query);
      const matchesMethod = !method || row.collectionMethod === method;
      return matchesQuery && matchesMethod;
    }));

    count.textContent = `${visibleRows.length} / ${rows.length} 検査項目`;
    updateSortButtons();

    if (visibleRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${LAB_COLUMNS.length}"><div class="database-empty">該当する項目がありません。</div></td></tr>`;
      return;
    }

    tbody.innerHTML = visibleRows.map((row) => `
      <tr data-row-id="${escapeHtml(row.id)}" tabindex="0" aria-label="${escapeHtml(row.item || row.sourceName)} の詳細を表示">
        ${LAB_COLUMNS.map((column) => `<td>${renderCell(row[column.key])}</td>`).join("")}
      </tr>
    `).join("");
  }

  function setMethods() {
    const methods = [...methodRank.keys()].filter(Boolean);
    filterSelect.innerHTML = `<option value="">採血方法すべて</option>${methods.map((method) => `<option value="${escapeHtml(method)}">${escapeHtml(method)}</option>`).join("")}`;
  }

  tbody.addEventListener("click", (event) => {
    const tr = event.target.closest("tr[data-row-id]");
    if (!tr) return;
    const row = visibleRows.find((item) => item.id === tr.dataset.rowId);
    if (row) openModal(row);
  });

  tbody.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tr = event.target.closest("tr[data-row-id]");
    if (!tr) return;
    event.preventDefault();
    const row = visibleRows.find((item) => item.id === tr.dataset.rowId);
    if (row) openModal(row);
  });

  searchInput.addEventListener("input", draw);
  filterSelect.addEventListener("change", draw);
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      sortState = {
        key,
        direction: sortState.key === key && sortState.direction === "asc" ? "desc" : "asc"
      };
      draw();
    });
  });

  if (window.location.protocol === "file:") {
    mount.innerHTML = `
      <div class="database-panel">
        <div class="database-empty">
          ChromeでHTMLファイルを直接開いているため、検査値CSVを読み込めません。VS CodeのLive Server、またはローカルサーバーから開いてください。
        </div>
      </div>
    `;
    return;
  }

  fetch(csvPath)
    .then((response) => {
      if (!response.ok) throw new Error("CSVを読み込めませんでした");
      return response.text();
    })
    .then((text) => {
      rows = csvToObjects(text).map(normalizeLabRow);
      methodRank = new Map([...new Set(rows.map((row) => row.collectionMethod))].map((method, index) => [method, index]));
      setMethods();
      draw();
    })
    .catch(() => {
      mount.innerHTML = `<div class="database-panel"><div class="database-empty">検査値データを読み込めませんでした。</div></div>`;
    });
}

document.querySelectorAll("[data-labs-database]").forEach(setupLabsDatabase);
