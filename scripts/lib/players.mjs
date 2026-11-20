import { findAnyTable, parseTable, cell, num } from './html.mjs';

const pid = (c) => /\/players\/\w\/(\w+)\.html/.exec(c?.html ?? '')?.[1] ?? null;
const teamOf = (c) => /\/teams\/([A-Z]{3})\//.exec(c?.html ?? '')?.[1] ?? (c?.text || null);

/** Lee una tabla de jugadores de la liga y devuelve filas por jugador/equipo con las columnas pedidas (por encabezado). */
export function parsePlayerTable(html, ids, columns) {
  const tbl = findAnyTable(html, ids, ['Player', 'Team']);
  if (!tbl) return [];
  const t = parseTable(tbl);
  const rows = [];
  for (const row of t.rows) {
    const p = cell(t, row, ['name_display', 'player'], 'Player');
    const id = pid(p);
    if (!p || !id) continue;
    const team = teamOf(cell(t, row, ['team_name_abbr', 'team_id'], 'Team'));
    const rec = { id, name: p.text, team, age: num(cell(t, row, 'age', 'Age')?.text), pos: cell(t, row, 'pos', 'Pos')?.text || null };
    for (const [key, header] of Object.entries(columns)) rec[key] = num(cell(t, row, undefined, header)?.text);
    rows.push(rec);
  }
  return rows;
}

const isTotalRow = (team) => /^\dTM$|^TOT$/.test(team ?? '');

/** Un jugador con varios equipos aparece varias veces: la fila de total (2TM/TOT) manda y el equipo actual es la última fila. */
export function collapsePlayers(rows) {
  const by = new Map();
  for (const r of rows) { if (!by.has(r.id)) by.set(r.id, []); by.get(r.id).push(r); }
  const out = [];
  for (const list of by.values()) {
    const total = list.find((r) => isTotalRow(r.team)) ?? list[0];
    const current = [...list].reverse().find((r) => !isTotalRow(r.team)) ?? list[list.length - 1];
    out.push({ ...total, team: current.team });
  }
  return out;
}

export const PER_GAME_COLS = { g: 'G', gs: 'GS', mpg: 'MP', fgp: 'FG%', tpp: '3P%', ftp: 'FT%', rpg: 'TRB', apg: 'AST', spg: 'STL', bpg: 'BLK', tov: 'TOV', ppg: 'PTS' };
export const ADVANCED_COLS = { per: 'PER', ts: 'TS%', usg: 'USG%', ws: 'WS', bpm: 'BPM', vorp: 'VORP' };

export function parsePlayers(perGameHtml, advancedHtml) {
  const pg = collapsePlayers(parsePlayerTable(perGameHtml, ['per_game_stats', 'per_game'], PER_GAME_COLS));
  const adv = new Map(collapsePlayers(parsePlayerTable(advancedHtml ?? '', ['advanced'], ADVANCED_COLS)).map((r) => [r.id, r]));
  return pg.map((p) => ({ ...p, ...Object.fromEntries(Object.keys(ADVANCED_COLS).map((k) => [k, adv.get(p.id)?.[k] ?? null])) }));
}
