/* Portfolio de Karim Khiter : interactions légères, sans dépendance. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js", "js-ready");

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* Ouverture locale (file://) : les liens de dossier pointent vers index.html */
  if (window.location.protocol === "file:") {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
      var parts = href.split("#");
      if (parts[0] === "" ) return;
      if (/\/$/.test(parts[0])) a.setAttribute("href", parts[0] + "index.html" + (parts[1] ? "#" + parts[1] : ""));
      else if (parts[0] === "." || parts[0] === "..") a.setAttribute("href", parts[0] + "/index.html");
    });
  }

  /* Thème clair / sombre */
  var toggle = document.querySelector(".theme-toggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#2B2320" : "#F3ECE3");
  }
  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      store("theme", next);
    });
  }

  /* Menu mobile */
  var navBtn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  function closeNav(focusBtn) {
    if (!nav || !navBtn) return;
    nav.classList.remove("is-open");
    navBtn.setAttribute("aria-expanded", "false");
    navBtn.setAttribute("aria-label", "Ouvrir le menu");
    if (focusBtn) navBtn.focus();
  }
  if (navBtn && nav) {
    navBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav(true);
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navBtn.contains(e.target)) closeNav(false);
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 920) closeNav(false); });
  }

  /* En-tête : bordure après défilement */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Apparition progressive discrète */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Filtres de la page Projets */
  var grid = document.getElementById("project-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".project-card"));
    var catBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter-cat]"));
    var typeSel = document.getElementById("filter-type");
    var search = document.getElementById("filter-search");
    var countEl = document.getElementById("result-count");
    var resetBtn = document.getElementById("filter-reset");
    var empty = document.getElementById("empty-state");
    var state = { cat: "all", type: "all", q: "" };

    var norm = function (s) {
      return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    };

    function readHash() {
      var h = window.location.hash.replace(/^#/, "");
      if (!h) return;
      h.split("&").forEach(function (pair) {
        var kv = pair.split("=");
        if (kv[0] === "cat" && kv[1]) state.cat = decodeURIComponent(kv[1]);
        if (kv[0] === "type" && kv[1]) state.type = decodeURIComponent(kv[1]);
      });
    }

    function writeHash() {
      var parts = [];
      if (state.cat !== "all") parts.push("cat=" + encodeURIComponent(state.cat));
      if (state.type !== "all") parts.push("type=" + encodeURIComponent(state.type));
      var url = window.location.pathname + window.location.search + (parts.length ? "#" + parts.join("&") : "");
      try { window.history.replaceState(null, "", url); } catch (e) { /* ignore */ }
    }

    function apply() {
      var q = norm(state.q.trim());
      var shown = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-cats") || "").split(" ");
        var okCat = state.cat === "all" || cats.indexOf(state.cat) !== -1;
        var okType = state.type === "all" || card.getAttribute("data-type") === state.type;
        var okQ = !q || norm(card.getAttribute("data-search")).indexOf(q) !== -1;
        var visible = okCat && okType && okQ;
        card.hidden = !visible;
        if (visible) shown++;
      });
      catBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-filter-cat") === state.cat ? "true" : "false"); });
      if (typeSel) typeSel.value = state.type;
      if (countEl) countEl.textContent = shown + (shown > 1 ? " projets affichés" : " projet affiché") + " sur " + cards.length;
      if (empty) empty.classList.toggle("is-visible", shown === 0);
      if (resetBtn) resetBtn.hidden = (state.cat === "all" && state.type === "all" && !state.q);
      writeHash();
    }

    catBtns.forEach(function (b) {
      b.addEventListener("click", function () { state.cat = b.getAttribute("data-filter-cat"); apply(); });
    });
    if (typeSel) typeSel.addEventListener("change", function () { state.type = typeSel.value; apply(); });
    if (search) search.addEventListener("input", function () { state.q = search.value; apply(); });
    if (resetBtn) resetBtn.addEventListener("click", function () {
      state = { cat: "all", type: "all", q: "" };
      if (search) search.value = "";
      apply();
      var first = catBtns[0]; if (first) first.focus();
    });
    var emptyReset = document.getElementById("empty-reset");
    if (emptyReset && resetBtn) emptyReset.addEventListener("click", function () { resetBtn.click(); });
    readHash();
    apply();
  }

  /* Constellation : survol, clavier et toucher */
  var sky = document.querySelector(".constellation");
  if (sky) {
    var stars = Array.prototype.slice.call(sky.querySelectorAll(".star"));
    var lines = Array.prototype.slice.call(sky.querySelectorAll("line[data-a]"));
    function light(id) {
      lines.forEach(function (l) {
        l.classList.toggle("is-lit", !!id && (l.getAttribute("data-a") === id || l.getAttribute("data-b") === id));
      });
    }
    function setActive(star) {
      stars.forEach(function (s) {
        var on = s === star;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-expanded", on ? "true" : "false");
      });
      light(star ? star.getAttribute("data-id") : null);
    }
    stars.forEach(function (s) {
      s.addEventListener("mouseenter", function () { light(s.getAttribute("data-id")); });
      s.addEventListener("mouseleave", function () { if (!s.classList.contains("is-active")) light(null); });
      s.addEventListener("focus", function () { light(s.getAttribute("data-id")); });
      s.addEventListener("blur", function () { if (!s.classList.contains("is-active")) light(null); });
      s.addEventListener("click", function () { setActive(s.classList.contains("is-active") ? null : s); });
    });
    document.addEventListener("click", function (e) { if (!sky.contains(e.target)) setActive(null); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setActive(null); });
  }
})();
