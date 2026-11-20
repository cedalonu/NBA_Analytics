import test from 'node:test';
import assert from 'node:assert/strict';
import { runPoints, pointsMetrics, teamPointsPerformance } from '../site/js/core/points.js';
import { tuneAndEvaluate, recentResults } from '../site/js/core/backtest.js';
import { runElo } from '../site/js/core/elo.js';
import { makeSeason, rng } from './helpers/synthetic.mjs';
import { TEAM_CODES } from '../site/js/core/teams.js';

const gauss = (r) => { let u = 0; for (let i = 0; i < 12; i++) u += r(); return u - 6; };

/** Temporadas donde cada equipo tiene ataque y defensa propios (los puntos dependen de los equipos). */
function seasonsWithEffects(n, { effects = true, seed = 5 } = {}) {
  const r = rng(seed);
  const off = Object.fromEntries(TEAM_CODES.map((c) => [c, effects ? gauss(r) * 3 : 0]));
  const def = Object.fromEntries(TEAM_CODES.map((c) => [c, effects ? gauss(r) * 3 : 0]));
  const out = [];
  for (let i = 0; i < n; i++) {
    const base = makeSeason({ endYear: 2024 + i, seed: seed + i * 17, strengths: Object.fromEntries(TEAM_CODES.map((c) => [c, 0])) });
    const games = base.games.map((g) => ({
      ...g,
      hPts: Math.round(112 + 1.25 + off[g.home] + def[g.visitor] + gauss(r) * 11),
      vPts: Math.round(112 - 1.25 + off[g.visitor] + def[g.home] + gauss(r) * 11),
    }));
    out.push({ key: String(2024 + i), games });
  }
  return out;
}

test('puntos: una predicción no depende del resultado del propio partido', () => {
  const s = seasonsWithEffects(1);
  const base = runPoints(s);
  const i = 300;
  const alt = s[0].games.map((g) => (g.iso === base[i].iso && g.home === base[i].home ? { ...g, hPts: g.hPts + 40, vPts: g.vPts - 20 } : g));
  const changed = runPoints([{ key: '2024', games: alt }]);
  for (let k = 0; k <= i; k++) { assert.equal(changed[k].hExp, base[k].hExp); assert.equal(changed[k].vExp, base[k].vExp); }
  assert.notEqual(changed[i + 60].hExp + changed[i + 60].vExp, base[i + 60].hExp + base[i + 60].vExp);
});

test('puntos: aprende el ataque y la defensa de cada equipo y supera a la media de la liga', () => {
  const r = tuneAndEvaluate(seasonsWithEffects(4), { passes: 1 });
  const p = r.points;
  assert.ok(p.test.n > 2000);
  assert.ok(p.test.maeTeam < p.baselines.leagueMeanHome.maeTeam - 0.15, `modelo ${p.test.maeTeam} vs liga ${p.baselines.leagueMeanHome.maeTeam}`);
  assert.ok(p.baselines.leagueMeanHome.maeTeam <= p.baselines.leagueMean.maeTeam + 1e-9, 'la ventaja de local debe ayudar');
  assert.ok(Math.abs(p.test.biasTotal) < 2, `sesgo ${p.test.biasTotal}`);
  assert.ok(Math.abs(p.params.hca - 2.5) <= 2);
});

test('puntos: sin diferencias entre equipos no aparenta ventaja (honestidad)', () => {
  const p = tuneAndEvaluate(seasonsWithEffects(4, { effects: false }), { passes: 1 }).points;
  assert.ok(p.test.maeTeam > p.baselines.leagueMeanHome.maeTeam - 0.15, `modelo ${p.test.maeTeam} vs liga ${p.baselines.leagueMeanHome.maeTeam}`);
});

test('puntos: el ajuste no depende de las temporadas de prueba (sin fuga)', () => {
  const s = seasonsWithEffects(4);
  const a = tuneAndEvaluate(s, { passes: 1 }).points;
  const tampered = s.map((x, i) => (i < 2 ? x : { ...x, games: x.games.map((g) => ({ ...g, hPts: g.hPts + 25, vPts: g.vPts - 25 })) }));
  const b = tuneAndEvaluate(tampered, { passes: 1 }).points;
  assert.deepEqual(a.params, b.params);
  assert.deepEqual(a.train, b.train);
  assert.notEqual(a.test.maeTeam, b.test.maeTeam);
});

test('puntos: métricas y desempeño por equipo cuadran', () => {
  const recs = [
    { played: true, home: 'BOS', visitor: 'DET', hExp: 110, vExp: 105, totalExp: 215, hPts: 115, vPts: 100 },
    { played: true, home: 'DET', visitor: 'BOS', hExp: 108, vExp: 112, totalExp: 220, hPts: 100, vPts: 118 },
    { played: false, home: 'BOS', visitor: 'MIA', hExp: 110, vExp: 100, totalExp: 210, hPts: null, vPts: null },
  ];
  const m = pointsMetrics(recs);
  assert.equal(m.n, 2);
  assert.equal(m.maeTeam, (5 + 5 + 8 + 6) / 4);
  assert.equal(m.maeTotal, (Math.abs(215 - 215) + Math.abs(220 - 218)) / 2);
  const t = teamPointsPerformance(recs);
  const bos = t.find((x) => x.team === 'BOS');
  assert.deepEqual([bos.n, bos.mae, bos.bias], [2, (5 + 6) / 2, (-5 + -6) / 2]);
});

test('resultados recientes incluyen puntos previstos, reales y errores', () => {
  const s = seasonsWithEffects(1);
  const games = s[0].games.map((g) => ({ ...g, played: true, phase: 'regular' }));
  const elo = runElo([{ key: '2024', games }]);
  const pred = new Map(elo.games.map((r) => [`${r.iso}|${r.visitor}|${r.home}`, r]));
  const pts = new Map(runPoints([{ key: '2024', games }]).map((r) => [`${r.iso}|${r.visitor}|${r.home}`, r]));
  const today = games[games.length - 1].iso;
  const a = recentResults({ games, pred, pts, today, days: 30 });
  assert.ok(a.rows.length > 0 && a.points && a.points.n === a.rows.length);
  for (const r of a.rows) { assert.equal(r.totalReal, r.hPts + r.vPts); assert.ok(Math.abs(r.errTotal - (r.hExp + r.vExp - r.totalReal)) < 1e-9); assert.ok(Math.abs(r.errH - (r.hExp - r.hPts)) < 1e-9); }
});
