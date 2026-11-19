// Datos SINTÉTICOS solo para pruebas (nunca se publican). Códigos de Basketball-Reference.
import { TEAM_CODES } from '../../site/js/core/teams.js';
import { isoAddDays } from '../../site/js/core/util.js';

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const gauss = (r) => { let u = 0; for (let i = 0; i < 12; i++) u += r(); return u - 6; };

/** Temporada de 1230 partidos (82 por equipo). Fuerza real por equipo → los resultados tienen señal que un buen modelo puede aprender. */
export function makeSeason({ endYear, seed, strengths, playedUntil = '9999-12-31', startIso }) {
  const r = rng(seed);
  const str = strengths ?? Object.fromEntries(TEAM_CODES.map((c) => [c, gauss(r) * 4]));
  const start = startIso ?? `${endYear - 1}-10-21`;
  const games = [];
  for (let round = 0; round < 82; round++) {
    const order = [...TEAM_CODES].sort(() => r() - 0.5);
    const iso = isoAddDays(start, round * 2);
    for (let i = 0; i < 30; i += 2) {
      const [visitor, home] = r() < 0.5 ? [order[i], order[i + 1]] : [order[i + 1], order[i]];
      const played = iso <= playedUntil;
      let vPts = null, hPts = null;
      if (played) {
        const margin = str[home] - str[visitor] + 2.5 + gauss(r) * 12;
        const total = 224 + gauss(r) * 6;
        hPts = Math.round((total + margin) / 2); vPts = Math.round((total - margin) / 2);
        if (hPts === vPts) hPts++;
      }
      games.push({ iso, time: '19:30', visitor, home, vPts, hPts, played, phase: 'regular' });
    }
  }
  return { endYear, strengths: str, games };
}

export function makeSeasons(n = 4, playedUntilLast, seed = 11) {
  const r = rng(seed);
  const base = Object.fromEntries(TEAM_CODES.map((c) => [c, gauss(r) * 4]));
  const out = [];
  let str = base;
  for (let i = 0; i < n; i++) {
    str = Object.fromEntries(TEAM_CODES.map((c) => [c, str[c] * 0.7 + gauss(r) * 2.6])); // la fuerza persiste entre temporadas
    const endYear = 2024 + i;
    out.push(makeSeason({ endYear, seed: seed + i * 101, strengths: str, playedUntil: i === n - 1 ? playedUntilLast : undefined }));
  }
  return out;
}

// ---------- HTML con la estructura de Basketball-Reference (para probar los parsers)
const FULL = (c) => ({ BOS: 'Boston Celtics', DET: 'Detroit Pistons', CHO: 'Charlotte Hornets', PHO: 'Phoenix Suns', SAC: 'Sacramento Kings', NOP: 'New Orleans Pelicans', DEN: 'Denver Nuggets', UTA: 'Utah Jazz', LAL: 'Los Angeles Lakers', WAS: 'Washington Wizards' }[c] ?? c);
export function scheduleRow({ date, time, v, vp, h, hp, box, ot = '', note = '', arena = '', year = 2027 }) {
  return `<tr><th scope="row" class="left " data-stat="date_game" csk="${box ?? ''}"><a href="/boxscores/index.fcgi?month=10&day=20&year=2026">${date}</a></th><td class="right " data-stat="game_start_time">${time}</td><td class="left " data-stat="visitor_team_name"><a href="/teams/${v}/${year}.html">${FULL(v)}</a></td><td class="right " data-stat="visitor_pts">${vp ?? ''}</td><td class="left " data-stat="home_team_name"><a href="/teams/${h}/${year}.html">${FULL(h)}</a></td><td class="right " data-stat="home_pts">${hp ?? ''}</td><td class="center " data-stat="box_score_text">${box ? `<a href="/boxscores/${box}.html">Box Score</a>` : ''}</td><td class="right " data-stat="overtimes">${ot}</td><td class="right " data-stat="attendance">20,178</td><td class="left " data-stat="arena_name">${arena}</td><td class="left " data-stat="game_remarks">${note}</td></tr>`;
}
export const scheduleHtml = (rows, { commented = false } = {}) => {
  const table = `<table class="suppress_glossary sortable stats_table" id="schedule"><thead><tr><th data-stat="date_game">Date</th><th data-stat="game_start_time">Start (ET)</th><th data-stat="visitor_team_name">Visitor/Neutral</th><th data-stat="visitor_pts">PTS</th><th data-stat="home_team_name">Home/Neutral</th><th data-stat="home_pts">PTS</th><th data-stat="box_score_text"></th><th data-stat="overtimes"></th><th data-stat="attendance">Attend.</th><th data-stat="arena_name">Arena</th><th data-stat="game_remarks">Notes</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
  return `<html><body><div id="all_schedule">${commented ? `<!--${table}-->` : table}</div></body></html>`;
};
