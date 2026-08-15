/* Progressive enhancement only — every page works with JavaScript disabled. */

/* Mobile navigation drawer. */
(function () {
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the drawer when a link is followed or Escape is pressed.
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();

/* Click-to-load YouTube. Keeps YouTube from tracking visitors who never
   press play, and keeps the pages fast. */
(function () {
  document.querySelectorAll("[data-youtube]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.youtube;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      frame.title = el.dataset.title || "YouTube video";
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      const wrap = document.createElement("div");
      wrap.className = "embed";
      wrap.appendChild(frame);
      el.replaceWith(wrap);
    });
  });
})();
