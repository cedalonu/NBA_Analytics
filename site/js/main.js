import { loadAll } from './data.js';
import { runElo, DEFAULT_PARAMS } from './core/elo.js';
import { computeStandings } from './core/standings.js';
import { auditSeason } from './core/audit.js';
import { TEAMS, TEAM_CODES } from './core/teams.js';
import { todayET, isoAddDays, esc } from './core/util.js';
import * as schedule from './views/schedule.js';
import * as standings from './views/standings.js';
import * as predictions from './views/predictions.js';
import * as players from './views/players.js';
import * as injuries from './views/injuries.js';
import * as audit from './views/audit.js';
import * as model from './views/model.js';

const TABS = [
  ['calendario', 'Calendario y resultados', schedule], ['posiciones', 'Posiciones', standings], ['pronosticos', 'Próximos y pronósticos', predictions],
  ['jugadores', 'Jugadores', players], ['lesiones', 'Lesiones', injuries], ['auditoria', 'Auditoría', audit], ['modelo', 'Modelo y backtesting', model],
];
const isReg = (g) => g.phase === 'regular' || !g.phase;
const state = {
  data: null, season: null, tab: 'calendario', derived: null,
  ui: { date: null, team: '', status: 'all', horizon: 7, pSearch: '', pTeam: '', pSort: 'ppg', pMin: 5 },
};

const $ = (id) => document.getElementById(id);
const label = (y) => `${Number(y) - 1}-${String(y).slice(2)}`;

function defaultDate(games, today, isCurrent) {
  const dates = [...new Set(games.filter(isReg).map((g) => g.iso))].sort();
  if (!dates.length) return today;
  if (!isCurrent) return dates[dates.length - 1];
  return dates.includes(today) ? today : dates.find((d) => d >= today) ?? dates[dates.length - 1];
}

function derive() {
  const d = state.data;
  const years = d.manifest.seasons.filter((y) => d.schedules[y]);
  const seasons = years.map((y) => ({ key: String(y), games: d.schedules[y].games }));
  const params = { ...DEFAULT_PARAMS, ...(d.model?.params ?? {}) };
  const elo = runElo(seasons, params);
  const pred = {};
  for (const r of elo.games) (pred[r.season] ??= new Map()).set(`${r.iso}|${r.visitor}|${r.home}`, r);
  const injuriesByTeam = new Map();
  for (const i of d.injuries?.injuries ?? []) { if (!injuriesByTeam.has(i.team)) injuriesByTeam.set(i.team, []); injuriesByTeam.get(i.team).push(i); }
  state.derived = { years, ratings: elo.ratings, pred, injuriesByTeam, playerById: new Map((d.players?.players ?? []).map((p) => [p.id, p])) };
}

function ctx() {
  const d = state.data, dv = state.derived, today = todayET();
  const sched = d.schedules[state.season];
  const games = sched.games;
  const isCurrent = state.season === String(d.manifest.currentSeason);
  const bbrStandings = isCurrent ? d.standings : null;
  return {
    ui: state.ui, today, season: state.season, seasonLabel: label(state.season), currentSeason: d.manifest.currentSeason, games,
    pred: dv.pred[state.season] ?? new Map(), ratings: dv.ratings, standingsCalc: computeStandings(games), bbrStandings,
    players: d.players, injuries: d.injuries, injuriesByTeam: dv.injuriesByTeam, playerById: dv.playerById, model: d.model,
    audit: auditSeason({ games, today, bbrStandings: bbrStandings?.teams ?? null }),
    teamCodes: TEAM_CODES.slice().sort((a, b) => TEAMS[a].name.localeCompare(TEAMS[b].name)), teamNames: Object.fromEntries(TEAM_CODES.map((c) => [c, TEAMS[c].name])),
    sourceLine: `Fuente: ${sched.source} · datos al ${sched.fetchedAt ? new Date(sched.fetchedAt).toLocaleString('es-MX') : '—'}`,
  };
}

function renderChrome(c) {
  $('tabs').innerHTML = TABS.map(([id, text]) => `<button class="tab${id === state.tab ? ' on' : ''}" role="tab" data-tab="${id}">${esc(text)}</button>`).join('');
  const m = state.data.manifest;
  $('source-line').textContent = `Basketball-Reference · datos al ${m.updatedAt ? new Date(m.updatedAt).toLocaleString('es-MX') : '—'}`;
  const alerts = [];
  if (m.errors?.length) alerts.push(`<div class="banner warn">La última descarga tuvo ${m.errors.length} error(es): ${m.errors.map((e) => esc(`${e.task}: ${e.message}`)).join(' · ')}. Se muestran los últimos datos válidos.</div>`);
  if (c.season === String(m.currentSeason) && m.updatedAt && Date.now() - new Date(m.updatedAt).getTime() > 36 * 3600 * 1000) alerts.push('<div class="banner warn">Los datos tienen más de 36 horas sin cambios. Si hay partidos recientes, revisa que el workflow de actualización esté corriendo.</div>');
  if (c.audit.summary.error) alerts.push(`<div class="banner err">La auditoría encontró ${c.audit.summary.error} error(es) en los datos de la temporada ${esc(c.seasonLabel)}. Revisa la pestaña Auditoría.</div>`);
  else if (c.audit.summary.warn) alerts.push(`<div class="banner warn">La auditoría tiene ${c.audit.summary.warn} aviso(s). Revisa la pestaña Auditoría.</div>`);
  $('alerts').innerHTML = alerts.join('');
}

function render() {
  const view = $('view');
  if (state.data.empty) {
    $('tabs').innerHTML = ''; $('source-line').textContent = 'Sin datos todavía';
    view.innerHTML = `<div class="card empty"><h2>Aún no hay datos</h2><p class="muted">El sitio está listo, pero falta descargar el calendario y los resultados de Basketball-Reference.</p><ol><li>En GitHub abre <b>Actions → Sitio (datos + despliegue) → Run workflow</b>.</li><li>Espera a que termine y recarga esta página.</li></ol><p class="muted">Si Basketball-Reference bloquea la descarga desde GitHub, ejecuta <code>npm run fetch</code> en tu computadora y sube la carpeta <code>site/data</code>.</p></div>`;
    return;
  }
  const active = document.activeElement;
  const focusId = active?.id && view.contains(active) ? active.id : null;
  const caret = focusId && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  const c = ctx();
  renderChrome(c);
  const [, , mod] = TABS.find((t) => t[0] === state.tab);
  view.innerHTML = mod.render(c);
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (caret !== null && el.setSelectionRange) try { el.setSelectionRange(caret, caret); } catch { /* tipos sin selección */ } } }
}

function setSeason(y) {
  state.season = String(y);
  const games = state.data.schedules[state.season].games;
  state.ui.team = '';
  state.ui.date = defaultDate(games, todayET(), state.season === String(state.data.manifest.currentSeason));
}

function moveDate(dir) {
  const games = state.data.schedules[state.season].games.filter(isReg);
  const dates = [...new Set(games.map((g) => g.iso))].sort();
  const cur = state.ui.date ?? todayET();
  const next = dir > 0 ? dates.find((d) => d > cur) : [...dates].reverse().find((d) => d < cur);
  if (next) state.ui.date = next;
}

const ACTIONS = {
  'date-prev': () => moveDate(-1), 'date-next': () => moveDate(1),
  'date-today': () => { state.ui.date = defaultDate(state.data.schedules[state.season].games, todayET(), true); },
  'date-set': (el) => { if (el.value) state.ui.date = el.value; },
  'status-set': (el) => { state.ui.status = el.value; },
  'team-set': (el) => { state.ui.team = el.value; },
  'horizon-set': (el) => { state.ui.horizon = Number(el.value); },
  'p-search': (el) => { state.ui.pSearch = el.value; }, 'p-team': (el) => { state.ui.pTeam = el.value; },
  'p-sort': (el) => { state.ui.pSort = el.value; }, 'p-min': (el) => { state.ui.pMin = Math.max(0, Number(el.value) || 0); },
};

function onEvent(e) {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const type = e.type;
  const isInputLike = el.tagName === 'INPUT' || el.tagName === 'SELECT';
  if (isInputLike ? (type === 'click') : (type !== 'click')) return;
  if (el.type === 'text' && type === 'change') return; // el texto ya se aplicó con "input"
  ACTIONS[el.dataset.act]?.(el);
  render();
}

function route() {
  const t = location.hash.replace(/^#\//, '');
  if (TABS.some((x) => x[0] === t)) state.tab = t;
}

async function main() {
  const data = await loadAll();
  state.data = data;
  if (data.empty) { render(); return; }
  const cur = String(data.manifest.currentSeason);
  setSeason(data.schedules[cur] ? cur : Object.keys(data.schedules).sort().pop());
  derive();
  const sel = $('season-select');
  sel.innerHTML = Object.keys(data.schedules).sort().reverse().map((y) => `<option value="${y}"${y === state.season ? ' selected' : ''}>${label(y)}</option>`).join('');
  sel.addEventListener('change', () => { setSeason(sel.value); render(); });
  $('tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { state.tab = b.dataset.tab; location.hash = `#/${state.tab}`; render(); } });
  const view = $('view');
  view.addEventListener('click', onEvent); view.addEventListener('change', onEvent); view.addEventListener('input', onEvent);
  window.addEventListener('hashchange', () => { route(); render(); });
  route();
  render();
}

main().catch((e) => { console.error(e); $('view').innerHTML = `<div class="banner err">Error al iniciar la app: ${esc(e.message)}</div>`; });
