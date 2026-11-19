import { esc, fix, pct, gameKey, tname, chip } from './shared.js';
import { fmtDate } from '../core/util.js';

function gameRow(g, ctx) {
  const rec = ctx.pred.get(gameKey(g));
  const tm = g.time ? `${g.time} ET` : 'Hora por definir';
  let mid, status, extra = '';
  if (g.played) {
    const hw = g.hPts > g.vPts;
    mid = `<span class="score"><span class="${hw ? 'lose' : 'win'}">${g.vPts}</span> – <span class="${hw ? 'win' : 'lose'}">${g.hPts}</span></span>`;
    status = chip('ok', g.ot ? `Final/${g.ot}` : 'Final');
    if (rec) extra = `<span class="muted">Pronóstico previo: local ${pct(rec.pHome, 0)}</span>`;
  } else {
    mid = '<span class="muted">—</span>';
    status = chip('info', g.iso < ctx.today ? 'Sin resultado' : 'Por jugar');
    if (rec) extra = `<span class="muted">Local ${pct(rec.pHome, 0)} · margen ${rec.margin >= 0 ? '+' : ''}${fix(rec.margin)}</span>`;
  }
  const note = g.note ? ` <span class="chip">${esc(g.note)}</span>` : '';
  return `<div class="game"><span class="muted">${esc(tm)}</span><span class="teams"><b>${tname(g.visitor)}</b> @ <b>${tname(g.home)}</b>${note}</span>${mid}<span>${status}</span><span class="extra">${extra}</span></div>`;
}

export function render(ctx) {
  const { ui, games } = ctx;
  const reg = games.filter((g) => g.phase === 'regular' || !g.phase);
  const teamOpts = ['<option value="">Todos los equipos</option>', ...ctx.teamCodes.map((c) => `<option value="${c}"${ui.team === c ? ' selected' : ''}>${esc(ctx.teamNames[c])}</option>`)].join('');
  let body, heading;
  if (ui.team) {
    const list = reg.filter((g) => g.home === ui.team || g.visitor === ui.team).sort((a, b) => a.iso.localeCompare(b.iso));
    const w = list.filter((g) => g.played && ((g.home === ui.team) === (g.hPts > g.vPts))).length;
    const p = list.filter((g) => g.played).length;
    heading = `${esc(ctx.teamNames[ui.team])}: ${w}-${p - w} · ${list.length - p} por jugar`;
    let lastDay = '';
    body = list.map((g) => { const h = g.iso !== lastDay ? `<div class="muted" style="padding:8px 4px 0">${esc(fmtDate(g.iso))}</div>` : ''; lastDay = g.iso; return h + gameRow(g, ctx); }).join('');
  } else {
    const day = reg.filter((g) => g.iso === ui.date).sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
    const shown = day.filter((g) => ui.status === 'all' || (ui.status === 'final' ? g.played : !g.played));
    heading = `${esc(fmtDate(ui.date ?? ctx.today))} · ${day.length} partido(s)`;
    body = shown.length ? shown.map((g) => gameRow(g, ctx)).join('') : '<p class="muted">No hay partidos este día con ese filtro.</p>';
  }
  const dateCtl = ui.team ? '' : `<button class="btn" data-act="date-prev">◀</button><input type="date" id="date-input" value="${esc(ui.date ?? '')}" data-act="date-set"><button class="btn" data-act="date-next">▶</button><button class="btn" data-act="date-today">Hoy</button>
    <select data-act="status-set" id="status-select"><option value="all"${ui.status === 'all' ? ' selected' : ''}>Todos</option><option value="final"${ui.status === 'final' ? ' selected' : ''}>Finalizados</option><option value="pending"${ui.status === 'pending' ? ' selected' : ''}>Por jugar</option></select>`;
  return `<div class="card"><div class="toolbar">${dateCtl}<select data-act="team-set" id="team-select">${teamOpts}</select></div><h2>${heading}</h2>${body}</div>
  <p class="muted">${esc(ctx.sourceLine)}</p>`;
}
