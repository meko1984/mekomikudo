const EMPTY_TEXT = "登録されている内容はありません";
const LAB_COLUMNS = [
  { key: "item", label: "項目" },
  { key: "abbreviation", label: "略称" },
  { key: "category", label: "分類" },
  { key: "referenceRange", label: "参考基準値" },
  { key: "unit", label: "単位" }
];

const CATEGORY_ORDER = ["血算", "凝固", "生化学", "血液ガス", "腫瘍マーカー", "その他"];

const TRUSTED_SOURCE_HOSTS = new Set([
  "medlineplus.gov",
  "www.cdc.gov",
  "www.j-circ.or.jp",
  "www.jds.or.jp",
  "www.jrs.or.jp",
  "www.msdmanuals.com"
]);

const TRUSTED_SOURCE_SUFFIXES = [".ac.jp", ".go.jp", ".hosp.go.jp"];

const FACTOR_GROUPS = [
  { key: "mental", label: "精神", keywords: ["精神", "うつ", "不安", "パニック", "統合失調", "認知症", "せん妄"] },
  { key: "infection", label: "感染・炎症・免疫", keywords: ["感染", "慢性炎症", "敗血症", "自己免疫", "アレルギー", "関節リウマチ", "流行性耳下腺炎", "肺炎"] },
  { key: "tumor", label: "腫瘍", keywords: ["悪性腫瘍", "癌", "骨転移", "悪性リンパ腫", "多発性骨髄腫"] },
  { key: "metabolism", label: "代謝・内分泌・栄養", keywords: ["糖尿病", "高血糖", "低血糖", "インスリン", "甲状腺", "副腎", "アルドステロン", "低栄養", "栄養", "代謝性"] },
  { key: "renal", label: "腎・泌尿・体液", keywords: ["腎", "尿", "ネフローゼ", "脱水", "多飲"] },
  { key: "respiratory", label: "呼吸", keywords: ["呼吸", "喘息", "過換気", "一酸化炭素中毒"] },
  { key: "digestive", label: "肝・胆・膵・消化器", keywords: ["肝", "胆", "膵", "黄疸", "嘔吐", "下痢", "消化管", "十二指腸"] },
  { key: "musculoskeletal", label: "筋・骨格", keywords: ["横紋筋", "筋炎", "運動後"] },
  { key: "circulatory", label: "循環・血液", keywords: ["心筋", "心不全", "心臓", "動脈", "血栓", "肺塞栓", "ショック", "出血", "貧血", "多血", "赤血球", "白血病", "血小板", "骨髄異形成", "骨髄線維", "凝固因子", "DIC", "溶血", "鉄欠乏"] },
  { key: "lifestyle", label: "薬剤・生活・生理・その他", keywords: ["薬剤", "治療の副作用", "ワルファリン", "喫煙", "妊娠", "高齢", "成長期", "回復期", "高Na食", "低Na食"] }
];

const DEFAULT_FACTOR_GROUP = { key: "other", label: "その他" };

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
  const [headers = [], ...rows] = parseCsv(text.replace(/^\uFEFF/, ""));
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
    category: row["分類"] || "その他",
    referenceRange: row["参考基準値"] || "",
    unit: row["単位"] || "",
    referenceSource: row["基準値出典"] || "",
    increaseFactors: row["上昇要因"] || "",
    decreaseFactors: row["低下要因"] || "",
    fullName: row["Full name"] || "",
    description: row["説明"] || "",
    explanationSource: row["解説出典"] || "",
    explanationSourceUrl: row["解説出典URL"] || "",
    nursingPoint: row["看護ポイント"] || ""
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
    row.category,
    row.referenceRange,
    row.unit,
    row.referenceSource,
    row.increaseFactors,
    row.decreaseFactors,
    row.fullName,
    row.description,
    row.explanationSource,
    row.nursingPoint
  ].join(" "));
}

function renderCell(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return escapeHtml(text).replaceAll(", ", "<br>");
}

function getCategoryClass(value) {
  const classes = {
    "血算": "is-count",
    "凝固": "is-coagulation",
    "生化学": "is-chemistry",
    "血液ガス": "is-blood-gas",
    "腫瘍マーカー": "is-tumor-marker",
    "その他": "is-other"
  };
  return classes[value] || "is-other";
}

function renderLabCell(row, column) {
  if (column.key === "category") {
    return `<span class="lab-category ${getCategoryClass(row.category)}">${escapeHtml(row.category)}</span>`;
  }
  if (column.key === "referenceRange" && row.referenceRange) {
    return `<span class="lab-reference-range">${renderCell(row.referenceRange)}</span>`;
  }
  return renderCell(row[column.key]);
}

function getFactorGroup(value) {
  const normalized = normalizeForSearch(value);
  return FACTOR_GROUPS.find((group) => (
    group.keywords.some((keyword) => normalized.includes(normalizeForSearch(keyword)))
  )) || DEFAULT_FACTOR_GROUP;
}

function renderFactorTags(value, type) {
  const values = String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  if (values.length === 0) return escapeHtml(EMPTY_TEXT);
  return values.map((item) => {
    const group = getFactorGroup(item);
    const accessibleLabel = `${item}（${group.label}）`;
    return `<span class="lab-factor-tag ${type} factor-${group.key}" title="領域：${escapeHtml(group.label)}" aria-label="${escapeHtml(accessibleLabel)}">${escapeHtml(item)}</span>`;
  }).join(" ");
}

function getTrustedSourceUrl(value) {
  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase();
    const isTrustedHost = TRUSTED_SOURCE_HOSTS.has(hostname)
      || TRUSTED_SOURCE_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
    return parsed.protocol === "https:" && isTrustedHost ? parsed.href : "";
  } catch {
    return "";
  }
}

function renderExplanationSource(container, label, url) {
  container.replaceChildren();
  if (!label) {
    container.textContent = EMPTY_TEXT;
    return;
  }
  const trustedUrl = getTrustedSourceUrl(url);
  if (trustedUrl) {
    const link = document.createElement("a");
    link.href = trustedUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label + "（外部サイト）";
    container.append(link);
    return;
  }
  container.textContent = label;
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
        <dt>分類</dt>
        <dd data-modal-category></dd>
        <dt>参考基準値</dt>
        <dd data-modal-reference-range></dd>
        <dt>単位</dt>
        <dd data-modal-unit></dd>
        <dt>基準値の出典</dt>
        <dd data-modal-reference-source></dd>
        <dt>上昇要因</dt>
        <dd data-modal-increase-factors></dd>
        <dt>低下要因</dt>
        <dd data-modal-decrease-factors></dd>
        <dt>Full name</dt>
        <dd data-modal-full-name></dd>
        <dt>説明</dt>
        <dd data-modal-description></dd>
        <dt>看護で見るポイント</dt>
        <dd data-modal-nursing-point></dd>
        <dt>解説の出典</dt>
        <dd data-modal-explanation-source></dd>
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
  const categoryRank = new Map(CATEGORY_ORDER.map((category, index) => [category, index]));
  let sortState = { key: "category", direction: "asc" };
  const modal = createLabsModal();
  const modalDialog = modal.querySelector(".modal-dialog");
  const modalTitle = modal.querySelector("#lab-modal-title");
  const modalCategory = modal.querySelector("[data-modal-category]");
  const modalReferenceRange = modal.querySelector("[data-modal-reference-range]");
  const modalUnit = modal.querySelector("[data-modal-unit]");
  const modalReferenceSource = modal.querySelector("[data-modal-reference-source]");
  const modalIncreaseFactors = modal.querySelector("[data-modal-increase-factors]");
  const modalDecreaseFactors = modal.querySelector("[data-modal-decrease-factors]");
  const modalFullName = modal.querySelector("[data-modal-full-name]");
  const modalDescription = modal.querySelector("[data-modal-description]");
  const modalNursingPoint = modal.querySelector("[data-modal-nursing-point]");
  const modalExplanationSource = modal.querySelector("[data-modal-explanation-source]");
  let lastFocusedElement = null;

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function openModal(row) {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = row.item.trim() || "検査値詳細";
    modalCategory.innerHTML = `<span class="lab-category ${getCategoryClass(row.category)}">${escapeHtml(row.category)}</span>`;
    modalReferenceRange.textContent = row.referenceRange.trim() || EMPTY_TEXT;
    modalUnit.textContent = row.unit.trim() || EMPTY_TEXT;
    modalReferenceSource.textContent = row.referenceSource.trim() || EMPTY_TEXT;
    modalIncreaseFactors.innerHTML = renderFactorTags(row.increaseFactors, "is-increase");
    modalDecreaseFactors.innerHTML = renderFactorTags(row.decreaseFactors, "is-decrease");
    modalFullName.textContent = row.fullName.trim() || EMPTY_TEXT;
    modalDescription.textContent = row.description.trim() || EMPTY_TEXT;
    modalNursingPoint.textContent = row.nursingPoint.trim() || EMPTY_TEXT;
    renderExplanationSource(modalExplanationSource, row.explanationSource.trim(), row.explanationSourceUrl.trim());
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

  const toolbar = mount.querySelector("[data-labs-toolbar]");
  const staticSummary = mount.querySelector("[data-labs-static-summary]");
  const embeddedData = mount.querySelector("[data-labs-data]");
  const tbody = mount.querySelector("tbody");
  const searchInput = mount.querySelector("[data-labs-search]");
  const categoryFilter = mount.querySelector("[data-labs-category]");
  const itemFilter = mount.querySelector("[data-labs-item]");
  const abbreviationFilter = mount.querySelector("[data-labs-abbreviation]");
  const resetButton = mount.querySelector("[data-labs-reset]");
  const count = mount.querySelector("[data-labs-count]");
  const sortButtons = [...mount.querySelectorAll("[data-sort]")];
  const categoryShortcuts = [...mount.parentElement.querySelectorAll("[data-labs-category-shortcut]")];

  if (!toolbar || !embeddedData || !tbody || !searchInput || !categoryFilter
    || !itemFilter || !abbreviationFilter || !resetButton || !count) {
    mount.innerHTML = `<div class="database-panel"><div class="database-empty">検査値ページを更新できませんでした。</div></div>`;
    return;
  }

  toolbar.hidden = false;
  if (staticSummary) staticSummary.hidden = true;
  sortButtons.forEach((button) => { button.disabled = false; });
  categoryShortcuts.forEach((button) => { button.disabled = false; });

  function updateCategoryShortcuts() {
    categoryShortcuts.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.labsCategoryShortcut === categoryFilter.value));
    });
  }

  function updateSortButtons() {
    sortButtons.forEach((button) => {
      const active = button.dataset.sort === sortState.key;
      button.parentElement.setAttribute("aria-sort", active ? (sortState.direction === "asc" ? "ascending" : "descending") : "none");
      button.querySelector("span").textContent = active ? (sortState.direction === "asc" ? "▲" : "▼") : "";
    });
  }

  function sortRows(items) {
    if (!sortState.key) return [...items];
    return [...items].sort((a, b) => {
      if (sortState.key === "category") {
        const compared = (categoryRank.get(a.category) ?? 999) - (categoryRank.get(b.category) ?? 999)
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
    const category = categoryFilter.value;
    const itemQuery = normalizeForSearch(itemFilter.value.trim());
    const abbreviationQuery = normalizeForSearch(abbreviationFilter.value.trim());
    visibleRows = sortRows(rows.filter((row) => {
      const matchesQuery = !query || getRowSearchText(row).includes(query);
      const matchesCategory = !category || row.category === category;
      const matchesItem = !itemQuery || normalizeForSearch(row.item).includes(itemQuery);
      const matchesAbbreviation = !abbreviationQuery || normalizeForSearch(row.abbreviation).includes(abbreviationQuery);
      return matchesQuery && matchesCategory && matchesItem && matchesAbbreviation;
    }));

    count.textContent = `${visibleRows.length} / ${rows.length} 検査項目`;
    updateSortButtons();
    updateCategoryShortcuts();

    if (visibleRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${LAB_COLUMNS.length}"><div class="database-empty">該当する項目がありません。</div></td></tr>`;
      return;
    }

    tbody.innerHTML = visibleRows.map((row) => `
      <tr class="lab-row ${getCategoryClass(row.category)}" data-row-id="${escapeHtml(row.id)}" tabindex="0" aria-label="${escapeHtml(row.item || row.sourceName)} の詳細を表示">
        ${LAB_COLUMNS.map((column) => `<td>${renderLabCell(row, column)}</td>`).join("")}
      </tr>
    `).join("");
  }

  function setFilterOptions() {
    const categories = CATEGORY_ORDER.filter((category) => rows.some((row) => row.category === category));
    categoryFilter.innerHTML = `<option value="">すべて</option>${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
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
  categoryFilter.addEventListener("change", draw);
  itemFilter.addEventListener("input", draw);
  abbreviationFilter.addEventListener("input", draw);
  categoryShortcuts.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.labsCategoryShortcut;
      categoryFilter.value = categoryFilter.value === category ? "" : category;
      draw();
      mount.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    itemFilter.value = "";
    abbreviationFilter.value = "";
    draw();
    searchInput.focus();
  });
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

  function initialize(rawRows) {
    rows = rawRows.map(normalizeLabRow);
    setFilterOptions();
    draw();
  }

  try {
    initialize(JSON.parse(embeddedData.textContent));
  } catch {
    if (window.location.protocol === "file:") {
      toolbar.hidden = true;
      if (staticSummary) staticSummary.hidden = false;
      return;
    }

    fetch(csvPath)
      .then((response) => {
        if (!response.ok) throw new Error("CSVを読み込めませんでした");
        return response.text();
      })
      .then((text) => initialize(csvToObjects(text)))
      .catch(() => {
        toolbar.hidden = true;
        if (staticSummary) staticSummary.hidden = false;
      });
  }
}

document.querySelectorAll("[data-labs-database]").forEach(setupLabsDatabase);
