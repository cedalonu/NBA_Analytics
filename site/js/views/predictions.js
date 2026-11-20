import { esc, fix, pct, table, tname, chip, gameKey } from './shared.js';
import { fmtDate, isoAddDays } from '../core/util.js';

function injuriesFor(ctx, team) {
  const list = (ctx.injuriesByTeam.get(team) ?? []).filter((i) => /out|day|quest|doubt/i.test(i.status || i.description));
  return list.slice(0, 3).map((i) => `${esc(i.player)} <span class="muted">(${esc(i.status || 'Lesión')})</span>`).join(', ');
}

export function render(ctx) {
  if (ctx.season !== String(ctx.currentSeason)) return '<div class="card"><p class="muted">Los pronósticos de próximos partidos solo aplican a la temporada en curso. Selecciona la temporada actual arriba.</p></div>';
  const days = ctx.ui.horizon;
  const end = isoAddDays(ctx.today, days - 1);
  const up = ctx.games.filter((g) => !g.played && (g.phase === 'regular' || !g.phase) && g.iso >= ctx.today && g.iso <= end).sort((a, b) => a.iso.localeCompare(b.iso) || (a.time ?? '').localeCompare(b.time ?? ''));
  const m = ctx.model?.test;
  const b = ctx.model?.baselines;
  const verdict = m?.n ? `Validación fuera de muestra (${m.n} partidos): acierto ${pct(m.accuracy)} vs ${pct(b.alwaysHome.accuracy)} de apostar siempre al local; log-loss ${fix(m.logLoss, 3)} vs ${fix(b.constantHomeRate.logLoss, 3)} sin información.` : 'El modelo aún no tiene backtesting calculado (ejecuta npm run model).';
  const rows = up.map((g) => {
    const r = ctx.pred.get(gameKey(g));
    if (!r) return '';
    const fav = r.pHome >= 0.5 ? g.home : g.visitor;
    const pf = Math.max(r.pHome, 1 - r.pHome);
    const rest = [r.b2bV ? `${g.visitor} B2B` : '', r.b2bH ? `${g.home} B2B` : ''].filter(Boolean).join(' · ');
    const inj = [injuriesFor(ctx, g.visitor) && `<b>${g.visitor}:</b> ${injuriesFor(ctx, g.visitor)}`, injuriesFor(ctx, g.home) && `<b>${g.home}:</b> ${injuriesFor(ctx, g.home)}`].filter(Boolean).join('<br>');
    return `<tr><td class="l">${esc(fmtDate(g.iso, { weekday: 'short', day: 'numeric', month: 'short' }))}<br><span class="muted">${esc(g.time ?? '—')} ET</span></td><td class="l">${tname(g.visitor)} @ ${tname(g.home)}</td><td>${pct(1 - r.pHome, 0)}</td><td>${pct(r.pHome, 0)}</td><td class="l"><b>${esc(fav)}</b> ${pct(pf, 0)}<div class="bar"><i style="width:${(pf * 100).toFixed(0)}%"></i></div></td><td>${r.margin >= 0 ? g.home : g.visitor} −${fix(Math.abs(r.margin))}</td><td class="l">${rest ? chip('warn', rest) : '<span class="muted">—</span>'}</td><td class="l" style="white-space:normal;min-width:220px">${inj || '<span class="muted">Sin lesiones reportadas</span>'}</td></tr>`;
  }).join('');
  const power = [...ctx.ratings].sort((a, b) => b[1] - a[1]).map(([t, r], i) => `<tr><td>${i + 1}</td><td class="l">${tname(t)}</td><td>${fix(r, 0)}</td></tr>`);
  return `<div class="card"><div class="toolbar"><b>Próximos ${days} días</b><select data-act="horizon-set" id="horizon-select">${[1, 3, 7, 14].map((d) => `<option value="${d}"${d === days ? ' selected' : ''}>${d} día(s)</option>`).join('')}</select></div>
    <p class="muted">${esc(verdict)} Las lesiones (Basketball-Reference) se muestran como contexto y <b>no modifican</b> el pronóstico hasta que un backtesting demuestre que ayudan.</p>
    ${up.length ? table(['Fecha', '~Partido', 'Visita', 'Local', '~Favorito', 'Margen', '~Descanso', '~Lesiones (contexto)'], [rows]) : '<p class="muted">No hay partidos en este periodo.</p>'}</div>
  <div class="card"><h3>Ranking Elo (fuerza actual)</h3>${table(['#', 'Equipo', 'Elo'], power)}</div>`;
}
