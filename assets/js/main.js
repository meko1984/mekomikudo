const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const mainContent = document.querySelector("main");
const navDropdowns = [...document.querySelectorAll(".nav-dropdown")];

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

  const setDropdownState = (dropdown, isOpen) => {
    dropdown.classList.toggle("is-open", isOpen);
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", String(isOpen));
  };

  const closeDropdowns = (except = null) => {
    navDropdowns.forEach((dropdown) => {
      if (dropdown !== except) setDropdownState(dropdown, false);
    });
  };

  navDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    const firstLink = dropdown.querySelector(".nav-dropdown-menu a");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains("is-open");
      closeDropdowns(dropdown);
      setDropdownState(dropdown, willOpen);
    });

    toggle.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      closeDropdowns(dropdown);
      setDropdownState(dropdown, true);
      firstLink?.focus();
    });
  });

  navToggle.addEventListener("click", () => {
    setMenuState(!siteNav.classList.contains("is-open"));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeDropdowns();
      setMenuState(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
    if (
      siteNav.classList.contains("is-open")
      && !siteNav.contains(event.target)
      && !navToggle.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openDropdown = navDropdowns.find((dropdown) => dropdown.classList.contains("is-open"));
    if (openDropdown) {
      setDropdownState(openDropdown, false);
      openDropdown.querySelector(".nav-dropdown-toggle")?.focus();
      return;
    }

    if (!siteNav.classList.contains("is-open")) return;
    setMenuState(false);
    navToggle.focus();
  });

  window.addEventListener("resize", () => {
    closeDropdowns();
    if (window.innerWidth > 900) setMenuState(false);
  });
}

const currentPage = document.body.dataset.page;
const currentSection = document.body.dataset.section;
const currentNavigation = currentSection ? "learning" : currentPage;

if (currentNavigation) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentNavigation) {
      link.classList.add("is-active");
      if (link.matches("a")) link.setAttribute("aria-current", "page");
    }
  });
}

if (currentSection) {
  document.querySelectorAll("[data-subnav]").forEach((link) => {
    if (link.dataset.subnav === currentSection) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}
