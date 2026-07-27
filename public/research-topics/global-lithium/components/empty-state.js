// Honest placeholders for data we do not have.
//
// Two distinct kinds, because they mean different things to a reader deciding whether to
// trust the page:
//   'undisclosed' 未披露 — nobody publishes this for free; we would have to buy it.
//   'gap'         数据缺口 — it exists and we should have it, but we have not collected it.
//
// A dash in a cell says neither. Every placeholder therefore states WHICH sources were
// checked and what it would take to fill it, so the gaps become a reviewable register
// rather than something the reader has to discover by noticing an absence.

/**
 * @param {object} spec
 * @param {'undisclosed'|'gap'} spec.kind
 * @param {string} spec.title    what the block would have shown
 * @param {string} spec.why      why it is not here
 * @param {string} [spec.needs]  what would fill it
 * @param {string[]} [spec.have] related things we DO have, so the view is not empty-handed
 */
export function renderEmptyState({ kind, title, why, needs, have = [] }) {
  const label = kind === 'undisclosed' ? '未披露' : '数据缺口';
  const tone = kind === 'undisclosed' ? 'is-undisclosed' : 'is-gap';

  return `
    <div class="empty-state-block ${tone}">
      <div class="empty-state-hatch" aria-hidden="true"></div>
      <div class="empty-state-body">
        <span class="empty-state-tag">${label}</span>
        <h3>${escape(title)}</h3>
        <p class="empty-state-why">${escape(why)}</p>
        ${needs ? `<p class="empty-state-needs"><b>补齐需要：</b>${escape(needs)}</p>` : ''}
        ${have.length ? `
          <div class="empty-state-have">
            <b>目前可用的替代信息：</b>
            <ul>${have.map((h) => `<li>${escape(h)}</li>`).join('')}</ul>
          </div>` : ''}
      </div>
    </div>
  `;
}

/** Renders the whole set as the method view's gap register. */
export function renderGapRegister(specs) {
  return `
    <table class="gap-table">
      <thead>
        <tr><th>指标</th><th>状态</th><th>原因</th><th>补齐需要</th></tr>
      </thead>
      <tbody>
        ${specs.map((s) => `
          <tr>
            <td>${escape(s.title)}</td>
            <td><span class="gap-pill ${s.kind === 'undisclosed' ? 'is-undisclosed' : 'is-gap'}">${
              s.kind === 'undisclosed' ? '未披露' : '数据缺口'
            }</span></td>
            <td>${escape(s.why)}</td>
            <td>${escape(s.needs || '—')}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
}

function escape(value) {
  if (value === null || value === undefined || value === '') return '—';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
