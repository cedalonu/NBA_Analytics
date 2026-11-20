import { findAnyTable, parseTable, cell } from './html.mjs';

const MON = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

export function statusFromDescription(d = '') {
  const m = /^(Out For Season|Out|Day To Day|Questionable|Doubtful|Probable)/i.exec(d.trim());
  return m ? m[1] : '';
}

/** Reporte de lesiones de BBR (fuente: Rotowire). Tabla: Player | Team | Update | Description. */
export function parseInjuriesHtml(html) {
  const tbl = findAnyTable(html, ['injuries'], ['Player', 'Team', 'Update', 'Description']);
  if (!tbl) return [];
  const t = parseTable(tbl);
  const out = [];
  for (const row of t.rows) {
    const p = cell(t, row, 'player', 'Player') ?? row.cells[0];
    const id = /\/players\/\w\/(\w+)\.html/.exec(p?.html ?? '')?.[1] ?? null;
    const tm = cell(t, row, 'team_name', 'Team');
    const team = /\/teams\/([A-Z]{3})\//.exec(tm?.html ?? '')?.[1] ?? null;
    const dm = /(\w{3}),?\s+(\w{3})\s+(\d{1,2}),\s+(\d{4})/.exec(cell(t, row, 'date_update', 'Update')?.text ?? '');
    const description = cell(t, row, 'note', 'Description')?.text ?? '';
    if (!p?.text || !team) continue;
    out.push({ playerId: id, player: p.text, team, updated: dm && MON[dm[2]] ? `${dm[4]}-${MON[dm[2]]}-${dm[3].padStart(2, '0')}` : null, status: statusFromDescription(description), description });
  }
  return out;
}
