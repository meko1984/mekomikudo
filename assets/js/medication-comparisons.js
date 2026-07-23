document.querySelectorAll("[data-spectrum-evidence-modal]").forEach((modal) => {
  const dialog = modal.querySelector(".spectrum-evidence-dialog");
  const title = modal.querySelector("[data-spectrum-evidence-title]");
  const note = modal.querySelector("[data-spectrum-evidence-note]");
  const source = modal.querySelector("[data-spectrum-evidence-source]");
  let lastFocusedElement = null;

  function closeEvidence() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("is-spectrum-evidence-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function openEvidence(button) {
    lastFocusedElement = button;
    title.textContent = button.dataset.spectrumTitle || "判定の根拠";
    note.textContent = button.dataset.spectrumNote || "";
    source.textContent = button.dataset.spectrumSource || "根拠資料";
    source.href = button.dataset.spectrumUrl || "#";
    modal.hidden = false;
    document.body.classList.add("is-spectrum-evidence-open");
    dialog.focus();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".spectrum-evidence-button");
    if (button) openEvidence(button);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-spectrum-evidence-close]")) closeEvidence();
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      closeEvidence();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...dialog.querySelectorAll("button:not([disabled]), a[href]")]
      .filter((element) => !element.hidden);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
