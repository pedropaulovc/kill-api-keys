let path = [];

function renderBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  if (path.length === 0) { bc.innerHTML = ''; return; }
  let html = '<span class="crumb">Start</span>';
  path.forEach((entry, i) => {
    const node = allNodes[entry.nodeId];
    const chosen = node.options.find(o => o.next === entry.chosenNext);
    const isLast = i === path.length - 1;
    const short = chosen ? (chosen.label.length > 28 ? chosen.label.substring(0, 26) + '\u2026' : chosen.label) : '';
    html += '<span class="crumb-sep">\u203A</span><span class="crumb' + (isLast ? ' active' : '') + '">' + short + '</span>';
  });
  bc.innerHTML = html;
}

function render() {
  const container = document.getElementById('tree');
  let html = '';

  path.forEach((entry, i) => {
    const node = allNodes[entry.nodeId];
    const chosen = node.options.find(o => o.next === entry.chosenNext);
    html += '<div class="question-card past" onclick="rewindTo(' + i + ')">';
    html += '<div class="step-badge">' + node.step + '</div>';
    html += '<div class="q-text">' + node.question + '</div>';
    if (node.hint) html += '<div class="q-hint">' + node.hint + '</div>';
    html += '<div class="options">';
    node.options.forEach(o => {
      html += '<div class="opt-btn' + (o === chosen ? ' selected' : '') + '">' + o.label + '</div>';
    });
    html += '</div></div>';
  });

  const lastChoice = path.length > 0 ? path[path.length - 1] : null;
  const currentNextId = lastChoice ? lastChoice.chosenNext : null;

  if (currentNextId && results[currentNextId]) {
    const r = results[currentNextId];
    html += '<div class="result-card">';
    html += '<div class="result-label">Recommendation</div>';
    html += '<div class="result-title">' + r.title + '</div>';
    html += '<div class="result-desc">' + r.desc + '</div>';
    html += '<div class="tag-row">';
    r.pros.forEach(p => { html += '<span class="tag pro">' + p + '</span>'; });
    r.cons.forEach(c => { html += '<span class="tag con">' + c + '</span>'; });
    html += '</div>';
    if (r.ask) {
      html += '<div style="margin-top:16px;padding:12px 14px;background:var(--bg-info);border-radius:var(--radius-sm);font-size:0.8125rem;line-height:1.55;color:var(--text-info);">';
      html += '<strong style="display:block;margin-bottom:4px;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;opacity:0.8;">What to ask the API provider</strong>';
      html += r.ask;
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="actions"><button class="reset-btn" onclick="resetTree()">Start over</button></div>';
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
  let html = '<div class="question-card">';
  html += '<div class="step-badge">' + node.step + '</div>';
  html += '<div class="q-text">' + node.question + '</div>';
  if (node.hint) html += '<div class="q-hint">' + node.hint + '</div>';
  html += '<div class="options">';
  node.options.forEach(o => {
    html += '<button class="opt-btn" onclick="choose(\'' + nodeId + '\',\'' + o.next + '\')">' + o.label + '</button>';
  });
  html += '</div></div>';
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
