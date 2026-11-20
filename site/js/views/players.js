import { esc, fix, table, sourceNote } from './shared.js';

export const SORTS = { ppg: 'Puntos', rpg: 'Rebotes', apg: 'Asistencias', spg: 'Robos', bpg: 'Bloqueos', per: 'PER', bpm: 'BPM', vorp: 'VORP', ws: 'Win Shares', mpg: 'Minutos' };

export function render(ctx) {
  const p = ctx.players;
  if (!p?.players?.length) return '<div class="card"><p class="muted">Aún no hay datos de jugadores (ejecuta el workflow o <code>npm run fetch</code>).</p></div>';
  const { ui } = ctx;
  const q = ui.pSearch.trim().toLowerCase();
  let list = p.players.filter((x) => (x.g ?? 0) >= ui.pMin && (!ui.pTeam || x.team === ui.pTeam) && (!q || x.name.toLowerCase().includes(q)));
  list = list.sort((a, b) => (b[ui.pSort] ?? -1e9) - (a[ui.pSort] ?? -1e9)).slice(0, 100);
  const teams = ['<option value="">Todos los equipos</option>', ...ctx.teamCodes.map((c) => `<option value="${c}"${ui.pTeam === c ? ' selected' : ''}>${esc(c)}</option>`)].join('');
  const rows = list.map((x, i) => `<tr><td>${i + 1}</td><td class="l">${esc(x.name)}</td><td class="l">${esc(x.team ?? '')}</td><td>${esc(x.pos ?? '')}</td><td>${x.g ?? '—'}</td><td>${fix(x.mpg)}</td><td>${fix(x.ppg)}</td><td>${fix(x.rpg)}</td><td>${fix(x.apg)}</td><td>${fix(x.spg)}</td><td>${fix(x.bpg)}</td><td>${fix(x.fgp, 3)}</td><td>${fix(x.tpp, 3)}</td><td>${fix(x.per)}</td><td>${fix(x.ts, 3)}</td><td>${fix(x.bpm)}</td><td>${fix(x.vorp)}</td></tr>`);
  return `<div class="card"><div class="toolbar"><input id="p-search" data-act="p-search" placeholder="Buscar jugador" value="${esc(ui.pSearch)}"><select id="p-team" data-act="p-team">${teams}</select>
    <label>Ordenar por <select id="p-sort" data-act="p-sort">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}"${ui.pSort === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
    <label>Mín. juegos <input id="p-min" data-act="p-min" type="number" min="0" max="82" value="${ui.pMin}" style="width:64px"></label></div>
    ${table(['#', '~Jugador', '~Eq', 'Pos', 'G', 'MIN', 'PTS', 'REB', 'AST', 'ROB', 'BLQ', 'FG%', '3P%', 'PER', 'TS%', 'BPM', 'VORP'], rows)}</div>
  <p class="muted">${sourceNote(p)} · Promedios por partido de la temporada ${esc(p.season)}.</p>`;
}
