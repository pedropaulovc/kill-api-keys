/* ── Shame-level computation ─────────────────────────────── */
function shameLevel(svc) {
  if (!svc.authMethods.apiKeys) return "green";
  var hasGood = Object.keys(svc.authMethods).some(function (k) {
    return svc.authMethods[k] && authMethodMeta[k] && authMethodMeta[k].good;
  });
  return hasGood ? "yellow" : "red";
}

var levelOrder = { red: 0, yellow: 1, green: 2 };

/* ── Helpers ─────────────────────────────────────────────── */
function el(tag, cls) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function txt(tag, text, cls) {
  var e = el(tag, cls);
  e.textContent = text;
  return e;
}

/* ── Rendering ───────────────────────────────────────────── */
var activeCategory = "All";

function renderStats(list) {
  var total = list.length;
  var redCount = list.filter(function (s) { return shameLevel(s) === "red"; }).length;
  var container = document.getElementById("shame-stats");
  container.innerHTML = "";
  var b1 = document.createElement("strong");
  b1.textContent = total;
  var b2 = document.createElement("strong");
  b2.textContent = redCount;
  container.appendChild(b1);
  container.appendChild(document.createTextNode(" services reviewed. "));
  container.appendChild(b2);
  container.appendChild(document.createTextNode(" only support API keys."));
}

function renderFilters() {
  var categories = ["All"].concat(
    Array.from(new Set(services.map(function (s) { return s.category; }))).sort()
  );
  var bar = document.getElementById("filter-bar");
  bar.innerHTML = "";
  categories.forEach(function (cat) {
    var btn = el("button", "filter-btn");
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", cat === activeCategory ? "true" : "false");
    btn.addEventListener("click", function () { filterBy(cat); });
    bar.appendChild(btn);
  });
}

function renderCards(list) {
  var sorted = list.slice().sort(function (a, b) {
    return (levelOrder[shameLevel(a)] - levelOrder[shameLevel(b)]) ||
      a.name.localeCompare(b.name);
  });

  var container = document.getElementById("shame-list");
  container.innerHTML = "";

  sorted.forEach(function (s) {
    var level = shameLevel(s);
    var card = document.createElement("shame-card");
    card.setAttribute("data-level", level);

    var header = el("div", "service-header");
    header.appendChild(txt("span", s.name, "service-name"));
    header.appendChild(txt("span", s.category, "service-category"));
    card.appendChild(header);

    var methods = el("div", "auth-methods");
    Object.keys(authMethodMeta).forEach(function (key) {
      var meta = authMethodMeta[key];
      var supported = s.authMethods[key];
      var badge = document.createElement("shame-badge");
      badge.textContent = meta.label;
      if (supported && !meta.good) {
        badge.setAttribute("bad", "");
      } else if (supported && meta.good) {
        badge.setAttribute("supported", "");
      } else {
        badge.setAttribute("unsupported", "");
      }
      methods.appendChild(badge);
    });
    card.appendChild(methods);

    if (s.notes) {
      var notes = el("div", "service-notes");
      notes.textContent = s.notes;
      if (s.docsUrl && /^https?:\/\//.test(s.docsUrl)) {
        notes.appendChild(document.createTextNode(" "));
        var link = document.createElement("a");
        link.href = s.docsUrl;
        link.textContent = "Docs";
        link.target = "_blank";
        link.rel = "noopener";
        notes.appendChild(link);
      }
      card.appendChild(notes);
    }

    container.appendChild(card);
  });
}

function filterBy(cat) {
  activeCategory = cat;
  var filtered = cat === "All"
    ? services
    : services.filter(function (s) { return s.category === cat; });
  renderFilters();
  renderStats(filtered);
  renderCards(filtered);
}

/* ── Init ────────────────────────────────────────────────── */
renderFilters();
renderStats(services);
renderCards(services);
