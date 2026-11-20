import { TEAM_CODES } from './teams.js';
import { daysBetween } from './util.js';

export const BASE_RATING = 1500;
// Valores iniciales razonables; build-model.mjs los ajusta con backtesting y deja el resultado en data/model.json.
export const DEFAULT_PARAMS = { k: 20, hca: 100, carry: 0.75, b2b: 25, mov: 1, eloPerPoint: 28 };

const expected = (diff) => 1 / (1 + Math.pow(10, -diff / 400));

/**
 * Elo cronológico con ventaja de local, margen de victoria, descanso (back-to-back) y regresión entre temporadas.
 * Cada predicción usa SOLO información anterior al partido (los resultados anteriores y el calendario).
 * seasons: [{ key, games }] en orden ascendente. Devuelve { ratings, games } donde games incluye pHome y margen predicho.
 */
export function runElo(seasons, params = DEFAULT_PARAMS) {
  const p = { ...DEFAULT_PARAMS, ...params };
  let ratings = new Map(TEAM_CODES.map((c) => [c, BASE_RATING]));
  const out = [];
  for (const season of seasons) {
    ratings = new Map(TEAM_CODES.map((c) => [c, BASE_RATING + (ratings.get(c) - BASE_RATING) * p.carry]));
    const games = season.games
      .filter((g) => g.phase === 'regular' || g.phase === undefined)
      .slice()
      .sort((a, b) => a.iso.localeCompare(b.iso) || (a.time ?? '').localeCompare(b.time ?? '') || a.home.localeCompare(b.home));
    const last = new Map();
    for (const g of games) {
      const rH = ratings.get(g.home), rV = ratings.get(g.visitor);
      if (rH === undefined || rV === undefined) continue;
      const restH = last.has(g.home) ? daysBetween(last.get(g.home), g.iso) : null;
      const restV = last.has(g.visitor) ? daysBetween(last.get(g.visitor), g.iso) : null;
      const b2bH = restH === 1, b2bV = restV === 1;
      const diff = rH - rV + p.hca + (b2bV ? p.b2b : 0) - (b2bH ? p.b2b : 0);
      const pHome = expected(diff);
      out.push({
        season: season.key, iso: g.iso, time: g.time ?? null, visitor: g.visitor, home: g.home, played: !!g.played,
        vPts: g.vPts ?? null, hPts: g.hPts ?? null, pHome, margin: diff / p.eloPerPoint, rH, rV, restH, restV, b2bH, b2bV,
      });
      if (g.played) {
        const homeWon = g.hPts > g.vPts ? 1 : 0;
        const movPts = Math.abs(g.hPts - g.vPts);
        const winnerDiff = homeWon ? diff : -diff;
        const mult = p.mov ? Math.pow(movPts + 3, 0.8) / (7.5 + 0.006 * winnerDiff) : 1;
        const delta = p.k * mult * (homeWon - pHome);
        ratings.set(g.home, rH + delta);
        ratings.set(g.visitor, rV - delta);
      }
      last.set(g.home, g.iso); last.set(g.visitor, g.iso);
    }
  }
  return { ratings, games: out };
}
