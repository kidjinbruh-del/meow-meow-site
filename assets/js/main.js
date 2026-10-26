(() => {
  "use strict";

  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  const panel = document.getElementById("nav-panel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Тень и уплотнение шапки при скролле */
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Мобильное меню */
  const closeMenu = () => {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
  };

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    });

    panel.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* Появление блоков */
  const revealItems = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* Копирование SHA-256 */
  document.querySelectorAll(".copy[data-copy]").forEach((button) => {
    const label = button.querySelector("span");

    const markDone = () => {
      button.classList.add("is-done");
      if (label) label.textContent = "Скопировано";
      window.setTimeout(() => {
        button.classList.remove("is-done");
        if (label) label.textContent = "Скопировать";
      }, 2000);
    };

    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
        markDone();
      } catch (error) {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
          markDone();
        } finally {
          document.body.removeChild(area);
        }
      }
    });
  });

  /* Лайтбокс */
  const shots = Array.from(document.querySelectorAll(".shot"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  if (shots.length && lightbox && lightboxImg && lightboxCaption) {
    const closeButton = lightbox.querySelector(".lightbox__close");
    const prevButton = lightbox.querySelector(".lightbox__nav--prev");
    const nextButton = lightbox.querySelector(".lightbox__nav--next");
    let current = 0;
    let lastTrigger = null;

    const render = () => {
      const shot = shots[current];
      const img = shot.querySelector("img");
      lightboxImg.src = shot.dataset.full || (img ? img.src : "");
      lightboxImg.alt = shot.dataset.caption || (img ? img.alt : "Скриншот приложения");
      lightboxCaption.textContent = shot.dataset.caption || "";
    };

    const open = (index, trigger) => {
      current = (index + shots.length) % shots.length;
      lastTrigger = trigger || null;
      render();
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      if (closeButton) closeButton.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      lightboxImg.removeAttribute("src");
      if (lastTrigger) lastTrigger.focus();
    };

    const step = (delta) => {
      current = (current + delta + shots.length) % shots.length;
      render();
    };

    shots.forEach((shot, index) => {
      shot.addEventListener("click", () => open(index, shot));
    });

    if (closeButton) closeButton.addEventListener("click", close);
    if (prevButton) prevButton.addEventListener("click", () => step(-1));
    if (nextButton) nextButton.addEventListener("click", () => step(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    });
  }

  /* Год в подвале */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
