const MED_EMPTY_TEXT = "登録されている内容はありません";
const MED_DATA_VERSION = "20260726-1";
const MED_TABLE_COLUMNS = [
  { key: "name", label: "薬剤名" },
  { key: "effects", label: "主な効能・効果" },
  { key: "classification", label: "薬効分類" },
  { key: "precautions", label: "禁忌・重要な注意" }
];

const MEDICATION_EFFECT_GROUPS = [
  { key: "circulatory", label: "循環・血液", keywords: ["循環", "血圧", "低血圧", "高血圧", "ショック", "狭心症", "不整脈", "頻脈", "頻拍", "徐脈", "房室", "洞房", "心性", "心疾患", "心房", "心室", "心不全", "心停止", "心筋", "冠動脈", "虚血", "動脈", "静脈", "脳血管", "血栓", "血行", "出血", "貧血", "凝固", "HIT"] },
  { key: "respiratory", label: "呼吸", keywords: ["呼吸", "喘息", "気管支", "肺水腫", "去痰", "咳嗽", "気道", "COPD", "肺気腫"] },
  { key: "mental", label: "精神・神経", keywords: ["不安", "抑うつ", "うつ病", "躁病", "統合失調", "認知症", "せん妄", "幻覚", "不眠", "睡眠障害", "鎮静", "麻酔", "痙攣", "けいれん", "てんかん", "意識", "神経症", "末梢性神経障害", "筋無力症"] },
  { key: "infection", label: "感染・炎症・免疫", keywords: ["感染", "敗血症", "肺炎", "髄膜炎", "腎盂腎炎", "膀胱炎", "腹膜炎", "白癬", "カンジダ", "炎症", "消炎", "湿疹", "皮膚炎", "アレルギー", "解熱", "川崎病", "ピロリ"] },
  { key: "tumor", label: "腫瘍", keywords: ["悪性腫瘍", "癌", "がん", "腫瘍"] },
  { key: "metabolism", label: "代謝・内分泌・栄養", keywords: ["糖尿病", "高血糖", "低血糖", "脂血症", "コレステロール", "アルドステロン症", "低カリウム", "電解質", "代謝", "栄養", "低蛋白", "ビタミン", "鉄欠乏", "カロリー", "アミノ酸", "テタニー", "カルシウム", "マグネシウム", "アシドーシス"] },
  { key: "renal", label: "腎・泌尿・体液", keywords: ["腎", "尿", "浮腫", "脱水", "水分", "排尿", "細胞外液", "補液"] },
  { key: "dermatology", label: "皮膚", keywords: ["皮膚", "皮脂", "爪", "凍瘡", "瘢痕", "ケロイド", "びらん", "痒疹", "そう痒", "角皮症", "乾癬", "蕁麻疹", "面皰", "癜風", "掌蹠膿疱症", "虫さされ", "薬疹", "中毒疹"] },
  { key: "digestive", label: "肝・胆・膵・消化器", keywords: ["肝", "胆", "膵", "消化管", "胃", "腸", "便秘", "排便", "下痢", "悪心", "嘔吐", "潰瘍", "制酸", "Zollinger-Ellison"] },
  { key: "ophthalmic", label: "眼", keywords: ["眼", "角膜", "結膜", "緑内障"] },
  { key: "musculoskeletal", label: "疼痛・筋・骨格", keywords: ["疼痛", "鎮痛", "関節", "筋肉", "筋性斜頸", "骨", "熱傷", "凍傷", "外傷"] },
];

const DEFAULT_MEDICATION_EFFECT_GROUP = { key: "other", label: "その他" };

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
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function medicationCsvToObjects(text) {
  const [headers = [], ...rows] = parseMedicationCsv(text.replace(/^\uFEFF/, ""));
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function normalizeMedicationRow(row, categoryId, index) {
  return {
    id: `${categoryId}-${index}`,
    name: row["薬剤一般名"] || row["薬剤商品名"] || "",
    ingredient: row["一般名・成分名"] || row["薬剤商品名"] || "",
    effects: row["効果効能"] || "",
    classification: row["薬効分類"] || "",
    precautions: row["禁忌・重要な注意"] || "",
    mechanism: row["作用機序・薬理作用"] || "",
    seriousAdverseEffects: row["重大な副作用"] || "",
    nursingPoints: row["看護のポイント"] || "",
    source: row["出典"] || "",
    sourceUrl: row["出典URL"] || "",
    reviewedAt: row["最終確認日"] || "",
    referenceProduct: row["参照製品"] || "",
    onset: row["効果発現時間"] || "",
    tmax: row["Tmax/hr"] || ""
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
  return normalizeMedicationSearch(Object.values(row).join(" "));
}

function splitFilterValues(value) {
  return String(value || "")
    .split(/[,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitMedicationEffects(value) {
  const effects = [];
  let effect = "";
  let parenthesisDepth = 0;

  for (const char of String(value || "")) {
    if (char === "（" || char === "(") parenthesisDepth += 1;
    if (char === "）" || char === ")") parenthesisDepth = Math.max(0, parenthesisDepth - 1);
    if ((char === "," || char === "、" || char === "\n") && parenthesisDepth === 0) {
      if (effect.trim()) effects.push(effect.trim());
      effect = "";
    } else {
      effect += char;
    }
  }

  if (effect.trim()) effects.push(effect.trim());
  return effects;
}

function getMedicationEffectGroup(value) {
  const normalized = normalizeMedicationSearch(value);
  if (normalized.includes("消化管") || normalized.includes("胆管")) {
    return MEDICATION_EFFECT_GROUPS.find((group) => group.key === "digestive");
  }
  if (normalized.includes("尿管")) {
    return MEDICATION_EFFECT_GROUPS.find((group) => group.key === "renal");
  }
  return MEDICATION_EFFECT_GROUPS.find((group) => (
    group.keywords.some((keyword) => normalized.includes(normalizeMedicationSearch(keyword)))
  )) || DEFAULT_MEDICATION_EFFECT_GROUP;
}

function renderMedicationEffectTags(value) {
  const effects = splitMedicationEffects(value);
  if (effects.length === 0) return `<span class="medication-empty">${MED_EMPTY_TEXT}</span>`;
  return `<span class="medication-effect-list">${effects.map((effect) => {
    const group = getMedicationEffectGroup(effect);
    const accessibleLabel = `${effect}（${group.label}）`;
    return `<span class="lab-factor-tag medication-effect-tag factor-${group.key}" title="領域：${escapeMedicationHtml(group.label)}" aria-label="${escapeMedicationHtml(accessibleLabel)}">${escapeMedicationHtml(effect)}</span>`;
  }).join("")}</span>`;
}

function renderMedicationText(value) {
  const text = String(value || "").trim();
  return text ? escapeMedicationHtml(text) : `<span class="medication-empty">${MED_EMPTY_TEXT}</span>`;
}

function renderMedicationName(row) {
  const ingredient = row.ingredient && row.ingredient !== row.name
    ? `<span class="medication-ingredient">${escapeMedicationHtml(row.ingredient)}</span>`
    : "";
  return `<span class="medication-name">${escapeMedicationHtml(row.name)}</span>${ingredient}`;
}

function createMedicationModal() {
  const modal = document.createElement("div");
  modal.className = "modal medication-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal-backdrop" data-med-modal-close></div>
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="medication-modal-title" tabindex="-1">
      <button class="modal-close" type="button" data-med-modal-close aria-label="詳細を閉じる">×</button>
      <p class="medication-modal-label">薬剤詳細</p>
      <h2 id="medication-modal-title"></h2>
      <p class="medication-modal-ingredient" data-med-modal-ingredient></p>
      <dl class="modal-details">
        <dt>主な効能・効果</dt><dd data-med-modal-effects></dd>
        <dt>薬効分類</dt><dd data-med-modal-classification></dd>
        <dt>禁忌・重要な注意</dt><dd data-med-modal-precautions></dd>
        <dt>作用機序・薬理作用</dt><dd data-med-modal-mechanism></dd>
        <dt>重大な副作用</dt><dd data-med-modal-adverse></dd>
        <dt>看護のポイント</dt><dd data-med-modal-nursing></dd>
        <dt>参照した電子添文</dt><dd data-med-modal-reference></dd>
        <dt>出典</dt><dd data-med-modal-source></dd>
        <dt>最終確認日</dt><dd data-med-modal-reviewed></dd>
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
  const fields = {
    title: modal.querySelector("#medication-modal-title"),
    ingredient: modal.querySelector("[data-med-modal-ingredient]"),
    effects: modal.querySelector("[data-med-modal-effects]"),
    classification: modal.querySelector("[data-med-modal-classification]"),
    precautions: modal.querySelector("[data-med-modal-precautions]"),
    mechanism: modal.querySelector("[data-med-modal-mechanism]"),
    adverse: modal.querySelector("[data-med-modal-adverse]"),
    nursing: modal.querySelector("[data-med-modal-nursing]"),
    reference: modal.querySelector("[data-med-modal-reference]"),
    source: modal.querySelector("[data-med-modal-source]"),
    reviewed: modal.querySelector("[data-med-modal-reviewed]")
  };
  let sections = [];
  let lastFocusedElement = null;

  function syncMedicationUrl(drugName = "") {
    const url = new URL(window.location.href);
    url.searchParams.delete("drug");
    if (drugName) url.hash = `drug=${encodeURIComponent(drugName)}`;
    else if (url.hash.startsWith("#drug=")) url.hash = "";
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    syncMedicationUrl();
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function setModalText(element, value) {
    element.textContent = String(value || "").trim() || MED_EMPTY_TEXT;
  }

  function openModal(row, { syncUrl = true } = {}) {
    lastFocusedElement = document.activeElement;
    fields.title.textContent = row.name || "薬剤詳細";
    fields.ingredient.textContent = row.ingredient ? `一般名・成分名：${row.ingredient}` : "";
    fields.effects.innerHTML = renderMedicationEffectTags(row.effects);
    setModalText(fields.classification, row.classification);
    setModalText(fields.precautions, row.precautions);
    setModalText(fields.mechanism, row.mechanism);
    setModalText(fields.adverse, row.seriousAdverseEffects);
    setModalText(fields.nursing, row.nursingPoints);
    setModalText(fields.reference, row.referenceProduct);
    setModalText(fields.reviewed, row.reviewedAt);
    fields.source.replaceChildren();
    if (row.sourceUrl) {
      const link = document.createElement("a");
      link.href = row.sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = row.source || "PMDA電子添文";
      fields.source.append(link);
    } else {
      fields.source.textContent = row.source || MED_EMPTY_TEXT;
    }
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    if (syncUrl) syncMedicationUrl(row.name);
    modalDialog.focus();
  }

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-med-modal-close]")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;

    const focusableElements = [...modalDialog.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )].filter((element) => !element.hidden);
    if (focusableElements.length === 0) {
      event.preventDefault();
      modalDialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === modalDialog)) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  if (window.location.protocol === "file:") {
    mount.innerHTML = `<div class="database-panel"><div class="database-empty">薬剤データを表示するには、ローカルサーバーから開いてください。</div></div>`;
    return;
  }

  mount.innerHTML = `
    <div class="database-panel medications-toolbar-panel">
      <div class="database-toolbar medications-toolbar">
        <strong data-medications-count aria-live="polite">0 薬剤</strong>
        <div class="database-controls">
          <input data-medications-search type="search" aria-label="薬剤を検索" placeholder="薬剤名・効能などで検索">
          <select data-medications-category aria-label="投与経路で絞り込み"><option value="">投与経路すべて</option></select>
          <select data-medications-filter aria-label="薬効分類で絞り込み"><option value="">薬効分類すべて</option></select>
        </div>
      </div>
    </div>
    <p class="database-hint">行を選ぶと、作用機序・副作用・看護のポイント・出典を確認できます。</p>
    <div class="medications-sections" data-medications-sections></div>
  `;

  const searchInput = mount.querySelector("[data-medications-search]");
  const categorySelect = mount.querySelector("[data-medications-category]");
  const filterSelect = mount.querySelector("[data-medications-filter]");
  const count = mount.querySelector("[data-medications-count]");
  const sectionsMount = mount.querySelector("[data-medications-sections]");
  let sortState = { key: null, direction: "asc" };

  function updateFilters() {
    categorySelect.innerHTML = `<option value="">投与経路すべて</option>${sections.map((section) => `<option value="${escapeMedicationHtml(section.id)}">${escapeMedicationHtml(section.title)}</option>`).join("")}`;
    const classifications = [...new Set(sections.flatMap((section) => section.rows.flatMap((row) => splitFilterValues(row.classification))))]
      .sort((a, b) => a.localeCompare(b, "ja"));
    filterSelect.innerHTML = `<option value="">薬効分類すべて</option>${classifications.map((value) => `<option value="${escapeMedicationHtml(value)}">${escapeMedicationHtml(value)}</option>`).join("")}`;
  }

  function filteredRows(rows) {
    const query = normalizeMedicationSearch(searchInput.value.trim());
    const classification = filterSelect.value;
    const items = rows.filter((row) => (
      (!query || getMedicationSearchText(row).includes(query))
      && (!classification || splitFilterValues(row.classification).includes(classification))
    ));
    if (!sortState.key) return items;
    return [...items].sort((a, b) => {
      const compared = normalizeMedicationSearch(a[sortState.key]).localeCompare(normalizeMedicationSearch(b[sortState.key]), "ja");
      return sortState.direction === "asc" ? compared : -compared;
    });
  }

  function draw() {
    let visibleCount = 0;
    const selectedCategory = categorySelect.value;
    const visibleSections = sections.filter((section) => !selectedCategory || section.id === selectedCategory);
    sectionsMount.innerHTML = visibleSections.map((section) => {
      const rows = filteredRows(section.rows);
      visibleCount += rows.length;
      const headers = MED_TABLE_COLUMNS.map((column) => {
        const active = sortState.key === column.key;
        const mark = active ? (sortState.direction === "asc" ? "▲" : "▼") : "";
        return `<th scope="col" aria-sort="${active ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}"><button type="button" data-med-sort="${column.key}">${column.label}<span aria-hidden="true">${mark}</span></button></th>`;
      }).join("");
      const body = rows.length ? rows.map((row) => `
        <tr data-med-row-id="${escapeMedicationHtml(row.id)}" tabindex="0" aria-label="${escapeMedicationHtml(row.name)}の詳細を表示">
          <td>${renderMedicationName(row)}</td>
          <td>${renderMedicationEffectTags(row.effects)}</td>
          <td>${renderMedicationText(row.classification)}</td>
          <td>${renderMedicationText(row.precautions)}</td>
        </tr>
      `).join("") : `<tr><td colspan="${MED_TABLE_COLUMNS.length}"><div class="database-empty">該当する薬剤がありません。</div></td></tr>`;
      return `<section class="database-panel medication-category" data-medication-category="${escapeMedicationHtml(section.id)}"><h2>${escapeMedicationHtml(section.title)}</h2><div class="database-table-wrap"><table class="database-table medications-table"><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table></div></section>`;
    }).join("");
    count.textContent = `${visibleCount} / ${visibleSections.reduce((sum, section) => sum + section.rows.length, 0)} 薬剤`;
  }

  mount.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-med-sort]");
    if (sortButton) {
      const key = sortButton.dataset.medSort;
      sortState = { key, direction: sortState.key === key && sortState.direction === "asc" ? "desc" : "asc" };
      draw();
      return;
    }
    const tableRow = event.target.closest("tr[data-med-row-id]");
    if (!tableRow) return;
    const row = sections.flatMap((section) => section.rows).find((item) => item.id === tableRow.dataset.medRowId);
    if (row) openModal(row);
  });

  mount.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const tableRow = event.target.closest("tr[data-med-row-id]");
    if (!tableRow) return;
    event.preventDefault();
    const row = sections.flatMap((section) => section.rows).find((item) => item.id === tableRow.dataset.medRowId);
    if (row) openModal(row);
  });

  [searchInput, categorySelect, filterSelect].forEach((control) => {
    control.addEventListener(control === searchInput ? "input" : "change", draw);
  });

  Promise.all(sources.map((source, sourceIndex) => fetch(`${source.file}?v=${MED_DATA_VERSION}`)
    .then((response) => {
      if (!response.ok) throw new Error("CSVを読み込めませんでした");
      return response.text();
    })
    .then((text) => ({
      id: `medication-${sourceIndex}`,
      title: source.title,
      rows: medicationCsvToObjects(text).map((row, index) => normalizeMedicationRow(row, `medication-${sourceIndex}`, index))
    }))))
    .then((loadedSections) => {
      sections = loadedSections;
      updateFilters();
      draw();
      const hashDrug = window.location.hash.startsWith("#drug=")
        ? decodeURIComponent(window.location.hash.slice("#drug=".length))
        : "";
      const requestedDrug = hashDrug || new URLSearchParams(window.location.search).get("drug");
      if (!requestedDrug) return;

      const normalizedRequest = normalizeMedicationSearch(requestedDrug);
      const allRows = sections.flatMap((section) => section.rows.map((row) => ({ row, section })));
      const match = allRows.find(({ row }) => row.name === requestedDrug)
        || allRows.find(({ row }) => row.ingredient === requestedDrug)
        || allRows.find(({ row }) => (
          normalizeMedicationSearch(row.name).includes(normalizedRequest)
          || normalizeMedicationSearch(row.ingredient).includes(normalizedRequest)
        ));
      if (!match) return;

      categorySelect.value = match.section.id;
      searchInput.value = "";
      filterSelect.value = "";
      draw();
      const targetRow = sectionsMount.querySelector(`[data-med-row-id="${CSS.escape(match.row.id)}"]`);
      if (targetRow) targetRow.scrollIntoView({ block: "center" });
      openModal(match.row, { syncUrl: false });
      syncMedicationUrl(match.row.name);
    })
    .catch(() => {
      mount.innerHTML = `<div class="database-panel"><div class="database-empty">薬剤データを読み込めませんでした。</div></div>`;
    });
}

document.querySelectorAll("[data-medications-database]").forEach(setupMedicationsDatabase);
