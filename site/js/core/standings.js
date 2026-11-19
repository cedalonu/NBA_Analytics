import { TEAM_CODES, TEAMS } from './teams.js';

const isReg = (g) => g.phase === 'regular' || g.phase === undefined;

/** Posiciones calculadas a partir de los resultados publicados (solo temporada regular). */
export function computeStandings(games) {
  const t = new Map(TEAM_CODES.map((c) => [c, { team: c, w: 0, l: 0, hw: 0, hl: 0, aw: 0, al: 0, pf: 0, pa: 0, results: [] }]));
  const played = games.filter((g) => isReg(g) && g.played).sort((a, b) => a.iso.localeCompare(b.iso) || (a.time ?? '').localeCompare(b.time ?? ''));
  for (const g of played) {
    const hv = t.get(g.home), vv = t.get(g.visitor);
    if (!hv || !vv) continue;
    const homeWon = g.hPts > g.vPts;
    hv.pf += g.hPts; hv.pa += g.vPts; vv.pf += g.vPts; vv.pa += g.hPts;
    if (homeWon) { hv.w++; hv.hw++; vv.l++; vv.al++; } else { vv.w++; vv.aw++; hv.l++; hv.hl++; }
    hv.results.push(homeWon ? 'W' : 'L'); vv.results.push(homeWon ? 'L' : 'W');
  }
  const rows = [...t.values()].map((r) => {
    const gp = r.w + r.l;
    const last10 = r.results.slice(-10);
    let streak = '';
    if (r.results.length) {
      const last = r.results[r.results.length - 1];
      let n = 0;
      for (let i = r.results.length - 1; i >= 0 && r.results[i] === last; i--) n++;
      streak = `${last}${n}`;
    }
    return {
      team: r.team, conf: TEAMS[r.team].conf, w: r.w, l: r.l, gp, pct: gp ? r.w / gp : 0,
      home: `${r.hw}-${r.hl}`, away: `${r.aw}-${r.al}`,
      last10: `${last10.filter((x) => x === 'W').length}-${last10.filter((x) => x === 'L').length}`, streak,
      ppg: gp ? r.pf / gp : 0, oppg: gp ? r.pa / gp : 0, mov: gp ? (r.pf - r.pa) / gp : 0,
    };
  });
  rows.sort((a, b) => b.pct - a.pct || b.w - a.w || b.mov - a.mov || a.team.localeCompare(b.team));
  return rows;
}
