const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const mainContent = document.querySelector("main");

if (mainContent) {
  if (!mainContent.id) mainContent.id = "main-content";
  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#main-content";
    skipLink.textContent = "本文へ移動";
    document.body.prepend(skipLink);
  }
}

if (navToggle && siteNav) {
  if (!siteNav.id) siteNav.id = "site-navigation";
  navToggle.setAttribute("aria-controls", siteNav.id);

  const setMenuState = (isOpen) => {
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  };

  navToggle.addEventListener("click", () => {
    setMenuState(!siteNav.classList.contains("is-open"));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("click", (event) => {
    if (
      siteNav.classList.contains("is-open")
      && !siteNav.contains(event.target)
      && !navToggle.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      setMenuState(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenuState(false);
  });
}

const currentPage = document.body.dataset.page;

if (currentPage) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}
