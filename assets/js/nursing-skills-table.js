const NURSING_SKILL_CATEGORY_ORDER = [
  "清潔・衣生活援助技術",
  "食事援助技術",
  "排泄援助技術",
  "与薬の技術",
  "症状・生体機能管理技術",
  "呼吸・循環を整える技術",
  "創傷管理技術",
  "救命救急処置技術",
  "エンゼルケア"
];

const NURSING_SKILL_CATEGORY_CLASSES = {
  "清潔・衣生活援助技術": "skill-category-hygiene",
  "食事援助技術": "skill-category-nutrition",
  "排泄援助技術": "skill-category-elimination",
  "与薬の技術": "skill-category-medication",
  "症状・生体機能管理技術": "skill-category-assessment",
  "呼吸・循環を整える技術": "skill-category-respiratory",
  "創傷管理技術": "skill-category-wound",
  "救命救急処置技術": "skill-category-emergency",
  "エンゼルケア": "skill-category-end-of-life"
};

function escapeNursingSkillHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeNursingSkillSearch(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replaceAll(/\s+/g, "");
}

function renderNursingSkillName(skill) {
  const name = escapeNursingSkillHtml(skill.name);
  if (!skill.href) return `<span class="nursing-skill-name">${name}</span>`;
  return `<a class="nursing-skill-link" href="${escapeNursingSkillHtml(skill.href)}">${name}<span aria-hidden="true">›</span></a>`;
}

function renderNursingSkillCategory(category) {
  const className = NURSING_SKILL_CATEGORY_CLASSES[category] || "skill-category-default";
  return `<span class="skill-category ${className}">${escapeNursingSkillHtml(category)}</span>`;
}

function renderNursingSkillsTable() {
  const mount = document.querySelector("[data-nursing-skills]");
  const skills = Array.isArray(window.NURSING_SKILLS) ? window.NURSING_SKILLS : [];
  const sortState = { key: null, direction: "asc" };
  if (!mount) return;

  mount.innerHTML = `
    <div class="database-panel nursing-skills-panel">
      <div class="database-toolbar nursing-skills-toolbar">
        <strong data-nursing-skills-count aria-live="polite">${skills.length} 技術</strong>
        <div class="database-controls">
          <input data-nursing-skills-search type="search" aria-label="看護技術を検索" placeholder="技術名・分類で検索">
          <select data-nursing-skills-category aria-label="分類で絞り込み">
            <option value="">すべての分類</option>
          </select>
        </div>
      </div>
      <div class="database-table-wrap">
        <table class="database-table nursing-skills-table">
          <thead>
            <tr>
              <th scope="col" aria-sort="none">
                <button type="button" data-nursing-skills-sort="name">看護技術 <span aria-hidden="true">↕</span></button>
              </th>
              <th scope="col" aria-sort="none">
                <button type="button" data-nursing-skills-sort="category">分類 <span aria-hidden="true">↕</span></button>
              </th>
              <th scope="col">概要</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  const searchInput = mount.querySelector("[data-nursing-skills-search]");
  const categorySelect = mount.querySelector("[data-nursing-skills-category]");
  const count = mount.querySelector("[data-nursing-skills-count]");
  const tbody = mount.querySelector("tbody");
  const sortButtons = [...mount.querySelectorAll("[data-nursing-skills-sort]")];

  const categories = NURSING_SKILL_CATEGORY_ORDER.filter((category) => (
    skills.some((skill) => skill.category === category)
  ));
  categorySelect.innerHTML += categories.map((category) => (
    `<option value="${escapeNursingSkillHtml(category)}">${escapeNursingSkillHtml(category)}</option>`
  )).join("");

  function sortSkills(items) {
    if (!sortState.key) return items;
    const direction = sortState.direction === "asc" ? 1 : -1;
    return [...items].sort((left, right) => {
      if (sortState.key === "category") {
        const leftIndex = NURSING_SKILL_CATEGORY_ORDER.indexOf(left.category);
        const rightIndex = NURSING_SKILL_CATEGORY_ORDER.indexOf(right.category);
        if (leftIndex !== rightIndex) return (leftIndex - rightIndex) * direction;
      }
      const leftValue = sortState.key === "name" ? left.name : left.category;
      const rightValue = sortState.key === "name" ? right.name : right.category;
      const comparison = leftValue.localeCompare(rightValue, "ja");
      if (comparison !== 0) return comparison * direction;
      return left.name.localeCompare(right.name, "ja") * direction;
    });
  }

  function updateSortIndicators() {
    sortButtons.forEach((button) => {
      const isActive = button.dataset.nursingSkillsSort === sortState.key;
      const arrow = button.querySelector("span");
      const th = button.closest("th");
      arrow.textContent = isActive ? (sortState.direction === "asc" ? "↑" : "↓") : "↕";
      th.setAttribute("aria-sort", isActive
        ? (sortState.direction === "asc" ? "ascending" : "descending")
        : "none");
    });
  }

  function draw() {
    const query = normalizeNursingSkillSearch(searchInput.value);
    const category = categorySelect.value;
    const visibleSkills = sortSkills(skills.filter((skill) => {
      const searchText = normalizeNursingSkillSearch(`${skill.name} ${skill.category} ${skill.summary}`);
      return (!query || searchText.includes(query)) && (!category || skill.category === category);
    }));

    count.textContent = `${visibleSkills.length} 技術`;
    tbody.innerHTML = visibleSkills.length
      ? visibleSkills.map((skill) => {
        const rowLinkAttributes = skill.href
          ? ` class="nursing-skill-row is-linked" tabindex="0" role="link" aria-label="${escapeNursingSkillHtml(skill.name)}を開く" data-nursing-skill-href="${escapeNursingSkillHtml(skill.href)}"`
          : ` class="nursing-skill-row"`;
        return `
          <tr${rowLinkAttributes}>
            <td>${renderNursingSkillName(skill)}</td>
            <td>${renderNursingSkillCategory(skill.category)}</td>
            <td><span class="nursing-skill-summary">${escapeNursingSkillHtml(skill.summary)}</span></td>
          </tr>
        `;
      }).join("")
      : `<tr><td colspan="3"><div class="database-empty">該当する看護技術がありません。</div></td></tr>`;
  }

  searchInput.addEventListener("input", draw);
  categorySelect.addEventListener("change", draw);
  tbody.addEventListener("click", (event) => {
    const row = event.target.closest("[data-nursing-skill-href]");
    if (!row || event.target.closest("a")) return;
    window.location.href = row.dataset.nursingSkillHref;
  });
  tbody.addEventListener("keydown", (event) => {
    const row = event.target.closest("[data-nursing-skill-href]");
    if (!row || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    window.location.href = row.dataset.nursingSkillHref;
  });
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.nursingSkillsSort;
      if (sortState.key === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.key = key;
        sortState.direction = "asc";
      }
      updateSortIndicators();
      draw();
    });
  });
  updateSortIndicators();
  draw();
}

renderNursingSkillsTable();
