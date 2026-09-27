document.querySelectorAll("details.ecg-terminal-detail").forEach((detail, index) => {
  const summary = detail.querySelector("summary");
  const originalPanel = summary?.nextElementSibling;
  if (!summary || !originalPanel) return;

  const card = document.createElement("div");
  card.className = detail.className;
  const panelId = `ecg-terminal-panel-${index + 1}`;
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = summary.innerHTML;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panelId);
  originalPanel.id = panelId;
  originalPanel.hidden = true;

  card.append(button, originalPanel);
  detail.replaceWith(card);

  const togglePanel = () => {
    const shouldOpen = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(shouldOpen));
    originalPanel.hidden = !shouldOpen;
    card.classList.toggle("is-open", shouldOpen);
  };

  button.addEventListener("click", togglePanel);
});
