import { findTable, findTableByHeaders, parseTable, cell, num } from './html.mjs';

function readRows(tbl, conf) {
  const t = parseTable(tbl);
  const out = [];
  for (const row of t.rows) {
    const team = /\/teams\/([A-Z]{3})\//.exec(row.cells[0]?.html ?? '')?.[1];
    const w = num(cell(t, row, 'wins', 'W')?.text), l = num(cell(t, row, 'losses', 'L')?.text);
    if (team && w !== null && l !== null) out.push({ team, conf, w, l });
  }
  return out;
}

/** Posiciones oficiales de BBR (conferencias Este y Oeste). */
export function parseStandingsHtml(html) {
  let out = [];
  for (const [id, conf] of [['confs_standings_E', 'E'], ['confs_standings_W', 'W']]) {
    const tbl = findTable(html, id);
    if (tbl) out = out.concat(readRows(tbl, conf));
  }
  if (!out.length) {
    const tbl = findTableByHeaders(html, ['W', 'L', 'W/L%']);
    if (tbl) out = readRows(tbl, null);
  }
  return out;
}
