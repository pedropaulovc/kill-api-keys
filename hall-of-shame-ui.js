/* ── Shame-level computation ─────────────────────────────── */
function shameLevel(svc) {
  if (!svc.authMethods.apiKeys) return "green";
  const hasGood = Object.entries(svc.authMethods).some(
    ([k, v]) => v && authMethodMeta[k] && authMethodMeta[k].good
  );
  return hasGood ? "yellow" : "red";
}

const levelOrder = { red: 0, yellow: 1, green: 2 };

/* ── Rendering ───────────────────────────────────────────── */
let activeCategory = "All";

function renderStats(list) {
  const total = list.length;
  const redCount = list.filter(s => shameLevel(s) === "red").length;
  const el = document.getElementById("shame-stats");
  el.innerHTML =
    "<strong>" + total + "</strong> services reviewed. " +
    "<strong>" + redCount + "</strong> only support API keys.";
}

function renderFilters() {
  const categories = ["All"].concat(
    [...new Set(services.map(s => s.category))].sort()
  );
  const bar = document.getElementById("filter-bar");
  bar.innerHTML = categories.map(function (cat) {
    return '<button class="filter-btn"' +
      (cat === activeCategory ? ' aria-pressed="true"' : ' aria-pressed="false"') +
      ' onclick="filterBy(\'' + cat.replace(/'/g, "\\'") + '\')">' +
      cat + "</button>";
  }).join("");
}

function renderCards(list) {
  const sorted = list.slice().sort(function (a, b) {
    return (levelOrder[shameLevel(a)] - levelOrder[shameLevel(b)]) ||
      a.name.localeCompare(b.name);
  });

  var html = "";
  for (var i = 0; i < sorted.length; i++) {
    var s = sorted[i];
    var level = shameLevel(s);

    html += '<shame-card data-level="' + level + '">';
    html += '<div class="service-header">';
    html += '<span class="service-name">' + s.name + "</span>";
    html += '<span class="service-category">' + s.category + "</span>";
    html += "</div>";

    html += '<div class="auth-methods">';
    var methods = Object.keys(authMethodMeta);
    for (var j = 0; j < methods.length; j++) {
      var key = methods[j];
      var meta = authMethodMeta[key];
      var supported = s.authMethods[key];
      if (supported && !meta.good) {
        html += "<shame-badge bad>" + meta.label + "</shame-badge>";
      } else if (supported && meta.good) {
        html += "<shame-badge supported>" + meta.label + "</shame-badge>";
      } else {
        html += "<shame-badge unsupported>" + meta.label + "</shame-badge>";
      }
    }
    html += "</div>";

    if (s.notes) {
      html += '<div class="service-notes">' + s.notes;
      if (s.docsUrl) {
        html += ' <a href="' + s.docsUrl + '" target="_blank" rel="noopener">Docs</a>';
      }
      html += "</div>";
    }

    html += "</shame-card>";
  }

  document.getElementById("shame-list").innerHTML = html;
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
