import { findAnyTable, parseTable, cell, num } from './html.mjs';
import { BASE } from './http.mjs';

const MON = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
export const MONTHS = ['october', 'november', 'december', 'january', 'february', 'march', 'april'];
const BASE_URL = (p) => `${BASE}${p}`;

export function parseTime(t) {
  const m = /^(\d{1,2}):(\d{2})\s*([ap])m?$/i.exec(String(t).trim());
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toLowerCase() === 'p') h += 12;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

/** regular | cup-knockout | play-in según la nota de BBR. */
export function phaseFromNote(note = '') {
  if (/play-?in/i.test(note)) return 'play-in';
  if (/cup/i.test(note) && /(quarter|semi|final|knockout)/i.test(note)) return 'cup-knockout';
  return 'regular';
}

const teamCode = (c) => /\/teams\/([A-Z]{3})\//.exec(c?.html ?? '')?.[1] ?? null;

export function parseScheduleHtml(html) {
  const tableHtml = findAnyTable(html, ['schedule'], ['Date', 'Visitor/Neutral', 'Home/Neutral']);
  if (!tableHtml) return [];
  const t = parseTable(tableHtml);
  const games = [];
  for (const row of t.rows) {
    const date = cell(t, row, 'date_game', 'Date');
    const v = cell(t, row, 'visitor_team_name', 'Visitor/Neutral');
    const h = cell(t, row, 'home_team_name', 'Home/Neutral');
    if (!date || !v || !h) continue;
    const dm = /(\w{3}),?\s+(\w{3})\s+(\d{1,2}),\s+(\d{4})/.exec(date.text);
    const visitor = teamCode(v), home = teamCode(h);
    if (!dm || !MON[dm[2]] || !visitor || !home) continue;
    const vp = cell(t, row, 'visitor_pts', 'PTS', 0)?.text ?? '';
    const hp = cell(t, row, 'home_pts', 'PTS', 1)?.text ?? '';
    const played = /^\d+$/.test(vp) && /^\d+$/.test(hp);
    const note = cell(t, row, 'game_remarks', 'Notes')?.text ?? '';
    const ot = cell(t, row, 'overtimes')?.text ?? '';
    const box = /\/boxscores\/(\d{8}0[A-Z]{3})\.html/.exec(cell(t, row, 'box_score_text')?.html ?? '')?.[1];
    games.push({
      iso: `${dm[4]}-${MON[dm[2]]}-${dm[3].padStart(2, '0')}`,
      time: parseTime(cell(t, row, 'game_start_time', 'Start (ET)')?.text ?? ''),
      visitor, home,
      vPts: played ? +vp : null,
      hPts: played ? +hp : null,
      played,
      ...(ot ? { ot } : {}),
      ...(note ? { note } : {}),
      phase: phaseFromNote(note),
      arena: cell(t, row, 'arena_name', 'Arena')?.text || undefined,
      attendance: num(cell(t, row, 'attendance', 'Attend.')?.text) ?? undefined,
      box,
    });
  }
  return games;
}

export function parseMonthLinks(html, endYear) {
  const found = new Set();
  for (const m of html.matchAll(new RegExp(`/leagues/NBA_${endYear}_games-([a-z]+)\\.html`, 'gi'))) {
    if (MONTHS.includes(m[1].toLowerCase())) found.add(m[1].toLowerCase());
  }
  return found.size ? [...found] : MONTHS.slice(1);
}

export const seasonLabel = (endYear) => `${endYear - 1}-${String(endYear).slice(2)}`;

export function summarize(games) {
  const reg = games.filter((g) => g.phase === 'regular');
  const notes = {};
  for (const g of games) if (g.note) notes[g.note] = (notes[g.note] ?? 0) + 1;
  return { total: games.length, regular: reg.length, played: games.filter((g) => g.played).length, notes };
}

export async function fetchSeasonSchedule(client, endYear, log = () => {}) {
  const mainPath = `/leagues/NBA_${endYear}_games.html`;
  const main = await client.get(mainPath);
  let games = parseScheduleHtml(main); // la página principal es octubre
  log(`  october: ${games.length}`);
  for (const mo of parseMonthLinks(main, endYear).filter((m) => m !== 'october')) {
    const g = parseScheduleHtml(await client.get(`/leagues/NBA_${endYear}_games-${mo}.html`));
    log(`  ${mo}: ${g.length}`);
    games = games.concat(g);
  }
  if (!games.length) throw new Error(`Temporada ${endYear}: no se pudo leer ningún partido (HTML distinto al esperado o página bloqueada).`);
  const seen = new Set();
  games = games.filter((g) => { const k = `${g.iso}|${g.visitor}|${g.home}`; if (seen.has(k)) return false; seen.add(k); return true; });
  games.sort((a, b) => a.iso.localeCompare(b.iso) || (a.time ?? '').localeCompare(b.time ?? '') || a.home.localeCompare(b.home));
  return { season: seasonLabel(endYear), endYear, source: BASE_URL(mainPath), counts: summarize(games), games };
}
