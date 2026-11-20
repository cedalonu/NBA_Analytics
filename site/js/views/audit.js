import { esc, chip, STATUS_LABEL } from './shared.js';

const AREAS = [['general', 'General'], ['finalizados', 'Partidos finalizados'], ['proximos', 'Partidos próximos']];

export function render(ctx) {
  const a = ctx.audit;
  const s = a.summary;
  const head = `<div class="card"><div class="kpi"><div><b style="color:var(--err)">${s.error}</b><span>errores</span></div><div><b style="color:var(--warn)">${s.warn}</b><span>avisos</span></div><div><b style="color:var(--ok)">${s.ok}</b><span>correctos</span></div><div><b style="color:var(--info)">${s.info}</b><span>informativos</span></div></div>
    <p class="muted">Se audita el calendario y los resultados de Basketball-Reference de la temporada ${esc(ctx.seasonLabel)}${ctx.bbrStandings ? ' y se reconcilian con sus posiciones oficiales' : ' (sin posiciones oficiales para reconciliar en esta temporada)'}. Hoy (hora del Este): ${esc(ctx.today)}.</p></div>`;
  const blocks = AREAS.map(([key, label]) => {
    const rows = a.checks.filter((c) => c.area === key).map((c) => {
      const items = c.items?.length ? `<details><summary class="muted">Ver ${c.items.length} detalle(s)</summary><ul>${c.items.slice(0, 60).map((i) => `<li>${esc(i)}</li>`).join('')}${c.items.length > 60 ? `<li>… y ${c.items.length - 60} más</li>` : ''}</ul></details>` : '';
      return `<div style="padding:8px 0;border-bottom:1px solid var(--line)">${chip(c.status, STATUS_LABEL[c.status])} <b>${esc(c.title)}</b><div class="muted">${esc(c.detail)}</div>${items}</div>`;
    }).join('');
    return `<div class="card"><h3>${label}</h3>${rows}</div>`;
  }).join('');
  return head + `<div class="grid g2">${blocks}</div>`;
}
