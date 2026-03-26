let path = [];

function renderBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  if (path.length === 0) { bc.innerHTML = ''; return; }
  let html = '<crumb-item>Start</crumb-item>';
  path.forEach((entry, i) => {
    const node = allNodes[entry.nodeId];
    const chosen = node.options.find(o => o.next === entry.chosenNext);
    const isLast = i === path.length - 1;
    const short = chosen ? (chosen.label.length > 28 ? chosen.label.substring(0, 26) + '\u2026' : chosen.label) : '';
    html += '<crumb-sep>\u203A</crumb-sep><crumb-item' + (isLast ? ' active' : '') + '>' + short + '</crumb-item>';
  });
  bc.innerHTML = html;
}

function render() {
  const container = document.getElementById('tree');
  let html = '';

  path.forEach((entry, i) => {
    const node = allNodes[entry.nodeId];
    const chosen = node.options.find(o => o.next === entry.chosenNext);
    html += '<question-card past onclick="rewindTo(' + i + ')">';
    html += '<step-badge>' + node.step + '</step-badge>';
    html += '<q-text>' + node.question + '</q-text>';
    if (node.hint) html += '<q-hint>' + node.hint + '</q-hint>';
    html += '<option-list>';
    node.options.forEach(o => {
      html += '<div class="opt-btn' + (o === chosen ? '" selected' : '"') + '>' + o.label + '</div>';
    });
    html += '</option-list></question-card>';
  });

  const lastChoice = path.length > 0 ? path[path.length - 1] : null;
  const currentNextId = lastChoice ? lastChoice.chosenNext : null;

  if (currentNextId && results[currentNextId]) {
    const r = results[currentNextId];
    html += '<result-card>';
    html += '<result-label>Recommendation</result-label>';
    html += '<result-title>' + r.title + '</result-title>';
    html += '<result-desc>' + r.desc + '</result-desc>';
    html += '<tag-row>';
    r.pros.forEach(p => { html += '<auth-tag pro>' + p + '</auth-tag>'; });
    r.cons.forEach(c => { html += '<auth-tag con>' + c + '</auth-tag>'; });
    html += '</tag-row>';
    if (r.ask) {
      html += '<div class="ask-box">';
      html += '<strong>What to ask the API provider</strong>';
      html += r.ask;
      html += '</div>';
    }
    html += '</result-card>';
    html += '<card-actions><button class="reset-btn" onclick="resetTree()">Start over</button></card-actions>';
  } else if (path.length === 0) {
    html += renderQuestion('root');
  } else if (currentNextId && allNodes[currentNextId]) {
    html += renderQuestion(currentNextId);
  }

  container.innerHTML = html;
  renderBreadcrumb();
}

function renderQuestion(nodeId) {
  const node = allNodes[nodeId];
  let html = '<question-card>';
  html += '<step-badge>' + node.step + '</step-badge>';
  html += '<q-text>' + node.question + '</q-text>';
  if (node.hint) html += '<q-hint>' + node.hint + '</q-hint>';
  html += '<option-list>';
  node.options.forEach(o => {
    html += '<button class="opt-btn" onclick="choose(\'' + nodeId + '\',\'' + o.next + '\')">' + o.label + '</button>';
  });
  html += '</option-list></question-card>';
  return html;
}

function choose(nodeId, next) {
  path.push({ nodeId: nodeId, chosenNext: next });
  render();
}

function rewindTo(index) {
  path = path.slice(0, index);
  render();
}

function resetTree() {
  path = [];
  render();
}

render();
