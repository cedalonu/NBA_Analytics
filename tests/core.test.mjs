import test from 'node:test';
import assert from 'node:assert/strict';
import { computeStandings } from '../site/js/core/standings.js';
import { runElo, DEFAULT_PARAMS } from '../site/js/core/elo.js';
import { metrics, tuneAndEvaluate, splitSeasons } from '../site/js/core/backtest.js';
import { auditSeason } from '../site/js/core/audit.js';
import { makeSeason, makeSeasons } from './helpers/synthetic.mjs';

const toSeasons = (s) => s.map((x) => ({ key: String(x.endYear), games: x.games }));

test('posiciones: récords, local/visitante y racha salen de los resultados', () => {
  const g = [
    { iso: '2026-10-20', visitor: 'BOS', home: 'DET', vPts: 100, hPts: 110, played: true, phase: 'regular' },
    { iso: '2026-10-22', visitor: 'DET', home: 'BOS', vPts: 90, hPts: 100, played: true, phase: 'regular' },
    { iso: '2026-10-24', visitor: 'BOS', home: 'DET', vPts: 99, hPts: 101, played: true, phase: 'cup-knockout' }, // no cuenta
    { iso: '2026-10-26', visitor: 'BOS', home: 'DET', vPts: null, hPts: null, played: false, phase: 'regular' },
  ];
  const s = computeStandings(g);
  const bos = s.find((r) => r.team === 'BOS'), det = s.find((r) => r.team === 'DET');
  assert.deepEqual([bos.w, bos.l, bos.home, bos.away, bos.streak], [1, 1, '1-0', '0-1', 'W1']);
  assert.deepEqual([det.w, det.l], [1, 1]);
});

test('Elo: una predicción no depende del resultado del propio partido (sin mirar el futuro)', () => {
  const [s] = makeSeasons(1, '9999');
  const base = runElo(toSeasons([s])).games;
  const i = 400;
  const alt = JSON.parse(JSON.stringify(s.games));
  const g = alt.find((x) => x.iso === base[i].iso && x.home === base[i].home);
  [g.hPts, g.vPts] = [g.vPts + 30, g.hPts]; // resultado distinto
  const changed = runElo(toSeasons([{ ...s, games: alt }])).games;
  for (let k = 0; k <= i; k++) assert.equal(changed[k].pHome, base[k].pHome, `la predicción ${k} cambió`);
  assert.notEqual(changed[i + 40].pHome, base[i + 40].pHome); // pero los partidos posteriores sí aprenden
});

test('Elo: back-to-back resta ventaja y las probabilidades están en (0,1)', () => {
  const g = [
    { iso: '2026-11-01', time: '19:00', visitor: 'BOS', home: 'DET', vPts: 100, hPts: 100 + 1, played: true, phase: 'regular' },
    { iso: '2026-11-02', time: '19:00', visitor: 'BOS', home: 'MIA', vPts: null, hPts: null, played: false, phase: 'regular' },
    { iso: '2026-11-03', time: '19:00', visitor: 'NYK', home: 'LAL', vPts: null, hPts: null, played: false, phase: 'regular' },
  ];
  const out = runElo([{ key: '2027', games: g }], { ...DEFAULT_PARAMS, hca: 0, b2b: 40 }).games;
  const b2b = out[1]; // BOS jugó ayer
  assert.equal(b2b.b2bV, true); assert.equal(b2b.restV, 1);
  assert.ok(b2b.pHome > 0.5, 'el local descansado debe tener ventaja sobre el visitante en back-to-back');
  for (const r of out) assert.ok(r.pHome > 0 && r.pHome < 1);
});

test('Elo: aprende la fuerza real de los equipos (acierto claramente sobre el azar)', () => {
  const seasons = makeSeasons(3, '9999');
  const g = runElo(toSeasons(seasons)).games.filter((r) => r.season === '2026');
  const m = metrics(g);
  assert.ok(m.accuracy > 0.6, `acierto ${m.accuracy}`);
  assert.ok(m.logLoss < 0.65, `logLoss ${m.logLoss}`);
  assert.equal(m.calibration.reduce((s, b) => s + b.n, 0), m.n);
});

test('backtest: la división entrenamiento/prueba es fuera de muestra', () => {
  assert.deepEqual(splitSeasons(['2024', '2025', '2026', '2027']), { burn: ['2024'], train: ['2025'], test: ['2026', '2027'] });
  assert.deepEqual(splitSeasons(['a', 'b']), { burn: [], train: ['a'], test: ['b'] });
});

test('backtest: los parámetros ajustados NO dependen de las temporadas de prueba (sin fuga)', () => {
  const seasons = makeSeasons(4, '9999');
  const a = tuneAndEvaluate(toSeasons(seasons), { passes: 1 });
  const tampered = seasons.map((s, i) => (i < 2 ? s : { ...s, games: s.games.map((g) => ({ ...g, hPts: g.vPts, vPts: g.hPts })) })); // resultados de prueba invertidos
  const b = tuneAndEvaluate(toSeasons(tampered), { passes: 1 });
  assert.deepEqual(a.params, b.params);
  assert.deepEqual(a.train, b.train);
  assert.notEqual(a.test.accuracy, b.test.accuracy);
});

test('backtest: con señal real el modelo supera a los pronósticos sin información', () => {
  const r = tuneAndEvaluate(toSeasons(makeSeasons(4, '9999')), { passes: 1 });
  assert.ok(r.test.n > 2000);
  assert.ok(r.test.logLoss < r.baselines.constantHomeRate.logLoss, 'el modelo debe batir la tasa constante');
  assert.ok(r.test.accuracy > r.baselines.alwaysHome.accuracy);
  assert.ok(r.test.maeMargin < r.baselines.constantHomeRate.maeMargin);
});

test('backtest: con resultados al azar el modelo NO presume ventaja (honestidad)', () => {
  const seasons = makeSeasons(4, '9999').map((s, i) => makeSeason({ endYear: s.endYear, seed: 700 + i, strengths: Object.fromEntries(Object.keys(s.strengths).map((c) => [c, 0])) }));
  const r = tuneAndEvaluate(toSeasons(seasons), { passes: 1 });
  assert.ok(r.test.accuracy < 0.62, `acierto ${r.test.accuracy} con equipos idénticos`);
  assert.ok(r.test.logLoss > r.baselines.constantHomeRate.logLoss - 0.01, 'no debe aparentar ventaja sobre la tasa constante cuando no hay señal');
});

test('auditoría: temporada limpia sin errores; las anomalías plantadas se detectan', () => {
  const s = makeSeason({ endYear: 2027, seed: 5, playedUntil: '2026-12-31' });
  const today = '2027-01-05';
  const ok = auditSeason({ games: s.games, today });
  assert.equal(ok.summary.error, 0, JSON.stringify(ok.checks.filter((c) => c.status === 'error')));
  const g = JSON.parse(JSON.stringify(s.games));
  g.push({ ...g[0] });                                   // duplicado
  g[3].hPts = g[3].vPts;                                 // empate
  const pend = g.find((x) => !x.played); pend.hPts = 100; pend.vPts = 90; // pendiente con marcador
  const past = g.find((x) => x.played); past.played = false; past.hPts = null; past.vPts = null; // pasado sin resultado
  const bad = auditSeason({ games: g, today });
  const by = Object.fromEntries(bad.checks.map((c) => [c.id, c.status]));
  assert.equal(by.dups, 'error'); assert.equal(by.scores, 'error'); assert.equal(by['pending-scored'], 'error');
  assert.equal(by.overdue, 'warn'); assert.notEqual(by['per-team'], 'ok');
});

test('auditoría: reconcilia los récords con las posiciones de BBR', () => {
  const s = makeSeason({ endYear: 2027, seed: 5, playedUntil: '2026-12-31' });
  const st = computeStandings(s.games).map((r) => ({ team: r.team, w: r.w, l: r.l }));
  assert.equal(auditSeason({ games: s.games, today: '2027-01-05', bbrStandings: st }).checks.find((c) => c.id === 'standings').status, 'ok');
  st[0].w += 1;
  const r = auditSeason({ games: s.games, today: '2027-01-05', bbrStandings: st }).checks.find((c) => c.id === 'standings');
  assert.equal(r.status, 'error'); assert.match(r.items[0], new RegExp(st[0].team));
});

import { recentResults, MAX_RECENT_DAYS } from '../site/js/core/backtest.js';

test('resultados recientes: tope de 60 días, solo jugados, acierto/fallo correctos', () => {
  const [s] = makeSeasons(1, '9999');
  const elo = runElo(toSeasons([s]));
  const pred = new Map(elo.games.map((r) => [`${r.iso}|${r.visitor}|${r.home}`, r]));
  const today = '2024-02-01'; // la temporada sintética 2023-24 va de 2023-10-21 a 2024-04-01
  const a = recentResults({ games: s.games, pred, today, days: 999 }); // se recorta a 60
  assert.equal(a.days, MAX_RECENT_DAYS);
  assert.equal(a.from, '2023-12-04');
  assert.ok(a.rows.length > 0);
  for (const r of a.rows) { assert.ok(r.iso >= a.from && r.iso <= today); assert.equal(r.hit, (r.pHome >= 0.5) === (r.hPts > r.vPts)); assert.equal(r.winner, r.hPts > r.vPts ? r.home : r.visitor); }
  assert.equal(a.summary.hits + a.summary.misses, a.summary.n);
  assert.ok(a.rows.every((r, i, arr) => i === 0 || arr[i - 1].iso >= r.iso), 'orden: más reciente primero');
  const week = recentResults({ games: s.games, pred, today, days: 7 });
  assert.ok(week.rows.length < a.rows.length && week.rows.every((r) => r.iso >= '2024-01-26'));
  // un partido sin jugar no aparece
  const g2 = s.games.map((g) => (g.iso === a.rows[0].iso ? { ...g, played: false, vPts: null, hPts: null } : g));
  assert.equal(recentResults({ games: g2, pred, today, days: 60 }).rows.filter((r) => r.iso === a.rows[0].iso).length, 0);
  // fallos de alta confianza se marcan como "upset"
  assert.ok(a.rows.every((r) => r.upset === (!r.hit && r.pFav >= 0.7)));
});
