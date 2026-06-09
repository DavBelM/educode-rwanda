/* EduCode Rwanda — shared chrome: persistent theme, settings tweaks, screen index.
   Loaded synchronously in <head> so theme applies before first paint. */
(function () {
  var LS = {
    theme:  "ec.theme",
    cream:  "ec.cream",
    radius: "ec.radius",
    shadow: "ec.shadow",
  };
  var root = document.documentElement;

  // --- apply persisted settings immediately (pre-paint) ----------------------
  var theme  = localStorage.getItem(LS.theme)  || "dark";
  var cream  = localStorage.getItem(LS.cream)  || "#efe9dc";
  var radius = localStorage.getItem(LS.radius) || "7";
  var shadow = localStorage.getItem(LS.shadow) || "off";
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-shadow", shadow);
  root.style.setProperty("--radius", radius + "px");
  if (cream !== "#efe9dc") root.style.setProperty("--cream", cream);

  var CREAMS = ["#efe9dc", "#e7dcc4", "#f1ece2"]; // soft / warm tan / cool near-white

  var SCREENS = [
    ["01", "Landing",          "index.html"],
    ["02", "Log in",           "Login.html"],
    ["03", "Sign up",          "Signup.html"],
    ["04", "Student dashboard","Dashboard.html"],
    ["05", "Courses",          "Courses.html"],
    ["06", "Course detail",    "Course.html"],
    ["07", "Lesson",           "Lesson.html"],
    ["08", "Coding workspace", "Workspace.html"],
    ["09", "Teacher dashboard","Teacher.html"],
  ];

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>';
  var GRID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';

  function save(k, v) { localStorage.setItem(k, v); }

  function syncThemeIcon() {
    document.querySelectorAll('[data-action="theme"]').forEach(function (b) {
      b.innerHTML = root.getAttribute("data-theme") === "dark" ? MOON : SUN;
    });
  }

  function buildSettings() {
    var pop = document.createElement("div");
    pop.className = "pop";
    pop.id = "ec-pop";
    pop.innerHTML =
      '<h5>Appearance</h5>' +
      '<div class="pop-row"><span>Theme</span><span class="seg" data-seg="theme">' +
        '<button data-v="dark">Dark</button><button data-v="light">Light</button></span></div>' +
      '<div class="pop-row"><span>Accent cream</span><span class="swatches" data-seg="cream">' +
        CREAMS.map(function (c) { return '<button data-v="' + c + '" style="background:' + c + '"></button>'; }).join("") +
      '</span></div>' +
      '<div class="pop-row"><span>Corner radius</span><span class="seg" data-seg="radius">' +
        '<button data-v="6">6</button><button data-v="7">7</button><button data-v="8">8</button></span></div>' +
      '<div class="pop-row"><span>Card shadow</span><span class="seg" data-seg="shadow">' +
        '<button data-v="off">Off</button><button data-v="on">On</button></span></div>';
    document.body.appendChild(pop);

    function mark() {
      pop.querySelector('[data-seg="theme"]').querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === root.getAttribute("data-theme")); });
      pop.querySelector('[data-seg="radius"]').querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === (localStorage.getItem(LS.radius) || "7")); });
      pop.querySelector('[data-seg="shadow"]').querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === root.getAttribute("data-shadow")); });
      pop.querySelector('[data-seg="cream"]').querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === (localStorage.getItem(LS.cream) || "#efe9dc")); });
    }
    mark();

    pop.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]"); if (!b) return;
      var seg = b.parentElement.dataset.seg, v = b.dataset.v;
      if (seg === "theme")  { root.setAttribute("data-theme", v); save(LS.theme, v); syncThemeIcon(); }
      if (seg === "radius") { root.style.setProperty("--radius", v + "px"); save(LS.radius, v); }
      if (seg === "shadow") { root.setAttribute("data-shadow", v); save(LS.shadow, v); }
      if (seg === "cream")  { root.style.setProperty("--cream", v); save(LS.cream, v); }
      mark();
    });
    return pop;
  }

  function buildIndex() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var fab = document.createElement("button");
    fab.className = "fab";
    fab.innerHTML = GRID + "<span>Screens</span>";
    var sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.innerHTML = "<h5>Prototype screens</h5>" + SCREENS.map(function (s) {
      var active = s[2].toLowerCase() === here;
      return '<a class="' + (active ? "here" : "") + '" href="' + s[2] + '"><span class="n">' + s[0] + '</span>' + s[1] + "</a>";
    }).join("");
    document.body.appendChild(fab);
    document.body.appendChild(sheet);
    fab.addEventListener("click", function (e) { e.stopPropagation(); sheet.classList.toggle("open"); });
    sheet.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  function init() {
    syncThemeIcon();
    var pop = buildSettings();
    buildIndex();

    document.addEventListener("click", function (e) {
      var t = e.target.closest('[data-action="theme"]');
      if (t) { var nx = root.getAttribute("data-theme") === "dark" ? "light" : "dark"; root.setAttribute("data-theme", nx); save(LS.theme, nx); syncThemeIcon();
        pop.querySelectorAll('[data-seg="theme"] button').forEach(function (b) { b.classList.toggle("on", b.dataset.v === nx); }); return; }
      var s = e.target.closest('[data-action="settings"]');
      if (s) { e.stopPropagation(); pop.classList.toggle("open"); return; }
      if (!e.target.closest("#ec-pop")) pop.classList.remove("open");
      if (!e.target.closest(".sheet") && !e.target.closest(".fab")) { var sh = document.querySelector(".sheet"); if (sh) sh.classList.remove("open"); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
