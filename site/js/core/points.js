import { TEAM_CODES } from './teams.js';
import { daysBetween } from './util.js';

// Modelo de puntos por equipo: media de la liga + ataque del equipo + defensa del rival + ventaja de local − cansancio (back-to-back).
// El ataque y la defensa de cada equipo se actualizan después de cada partido (media móvil exponencial) y regresan entre temporadas.
export const DEFAULT_POINTS_PARAMS = { rate: 0.06, carry: 0.5, hca: 2.5, b2b: 1.0, prior: 150, mu0: 114 };

/**
 * seasons: [{ key, games }] ascendente. Cada predicción usa solo resultados anteriores al partido.
 * Devuelve [{ season, iso, time, visitor, home, played, hExp, vExp, totalExp, hPts, vPts }].
 */
export function runPoints(seasons, params = DEFAULT_POINTS_PARAMS) {
  const p = { ...DEFAULT_POINTS_PARAMS, ...params };
  const off = new Map(TEAM_CODES.map((c) => [c, 0]));
  const def = new Map(TEAM_CODES.map((c) => [c, 0])); // positivo = permite más puntos que el promedio
  let prevMu = p.mu0;
  const out = [];
  for (const season of seasons) {
    for (const c of TEAM_CODES) { off.set(c, off.get(c) * p.carry); def.set(c, def.get(c) * p.carry); }
    const games = season.games
      .filter((g) => g.phase === 'regular' || g.phase === undefined)
      .slice()
      .sort((a, b) => a.iso.localeCompare(b.iso) || (a.time ?? '').localeCompare(b.time ?? '') || a.home.localeCompare(b.home));
    const last = new Map();
    let sum = 0, n = 0; // puntos por equipo acumulados en la temporada
    for (const g of games) {
      if (!off.has(g.home) || !off.has(g.visitor)) continue;
      const mu = (sum + p.prior * prevMu) / (n + p.prior);
      const b2bH = last.has(g.home) && daysBetween(last.get(g.home), g.iso) === 1;
      const b2bV = last.has(g.visitor) && daysBetween(last.get(g.visitor), g.iso) === 1;
      const hExp = mu + p.hca / 2 + off.get(g.home) + def.get(g.visitor) - (b2bH ? p.b2b : 0);
      const vExp = mu - p.hca / 2 + off.get(g.visitor) + def.get(g.home) - (b2bV ? p.b2b : 0);
      out.push({ season: season.key, iso: g.iso, time: g.time ?? null, visitor: g.visitor, home: g.home, played: !!g.played, hExp, vExp, totalExp: hExp + vExp, hPts: g.hPts ?? null, vPts: g.vPts ?? null });
      if (g.played) {
        const dh = g.hPts - hExp, dv = g.vPts - vExp;
        off.set(g.home, off.get(g.home) + p.rate * dh); def.set(g.visitor, def.get(g.visitor) + p.rate * dh);
        off.set(g.visitor, off.get(g.visitor) + p.rate * dv); def.set(g.home, def.get(g.home) + p.rate * dv);
        sum += g.hPts + g.vPts; n += 2;
      }
      last.set(g.home, g.iso); last.set(g.visitor, g.iso);
    }
    if (n) prevMu = sum / n;
  }
  return out;
}

/** Error de los pronósticos de puntos sobre partidos jugados. */
export function pointsMetrics(recs) {
  const g = recs.filter((r) => r.played && r.hPts !== null);
  const n = g.length;
  if (!n) return { n: 0, maeTeam: null, maeTotal: null, rmseTotal: null, biasTotal: null, within10: null, meanTotal: null };
  let eTeam = 0, eTot = 0, sq = 0, bias = 0, w10 = 0, tot = 0;
  for (const r of g) {
    eTeam += Math.abs(r.hExp - r.hPts) + Math.abs(r.vExp - r.vPts);
    const d = r.totalExp - (r.hPts + r.vPts);
    eTot += Math.abs(d); sq += d * d; bias += d; if (Math.abs(d) <= 10) w10++; tot += r.hPts + r.vPts;
  }
  return { n, maeTeam: eTeam / (2 * n), maeTotal: eTot / n, rmseTotal: Math.sqrt(sq / n), biasTotal: bias / n, within10: w10 / n, meanTotal: tot / n };
}

/** Desempeño por equipo: error medio (MAE) y sesgo (previsto − real) de los puntos de ese equipo. */
export function teamPointsPerformance(recs) {
  const t = new Map();
  const add = (team, pred, real) => {
    const r = t.get(team) ?? { team, n: 0, abs: 0, bias: 0, pred: 0, real: 0 };
    r.n++; r.abs += Math.abs(pred - real); r.bias += pred - real; r.pred += pred; r.real += real; t.set(team, r);
  };
  for (const r of recs) { if (!r.played || r.hPts === null) continue; add(r.home, r.hExp, r.hPts); add(r.visitor, r.vExp, r.vPts); }
  return [...t.values()].map((r) => ({ team: r.team, n: r.n, mae: r.abs / r.n, bias: r.bias / r.n, avgPred: r.pred / r.n, avgReal: r.real / r.n }));
}

export const POINTS_GRID = {
  rate: [0.01, 0.02, 0.04, 0.06, 0.08, 0.12],
  carry: [0.2, 0.4, 0.6, 0.8, 0.9],
  hca: [0, 1.5, 2.5, 3.5, 4.5],
  b2b: [0, 0.8, 1.6, 2.4],
  prior: [50, 150, 300, 600],
};
