import { runElo, DEFAULT_PARAMS } from './elo.js';
import { isoAddDays } from './util.js';

const EPS = 1e-9;

/** Métricas de pronóstico sobre partidos jugados. */
export function metrics(recs) {
  const g = recs.filter((r) => r.played);
  const n = g.length;
  if (!n) return { n: 0, accuracy: null, accuracySE: null, brier: null, logLoss: null, maeMargin: null, homeRate: null, calibration: [] };
  let ok = 0, brier = 0, ll = 0, mae = 0, hw = 0;
  const bins = Array.from({ length: 10 }, () => ({ n: 0, p: 0, y: 0 }));
  for (const r of g) {
    const y = r.hPts > r.vPts ? 1 : 0;
    const p = Math.min(1 - EPS, Math.max(EPS, r.pHome));
    hw += y;
    if ((p >= 0.5 ? 1 : 0) === y) ok++;
    brier += (p - y) ** 2;
    ll += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
    mae += Math.abs(r.margin - (r.hPts - r.vPts));
    const b = bins[Math.min(9, Math.floor(p * 10))];
    b.n++; b.p += p; b.y += y;
  }
  const acc = ok / n;
  return {
    n, accuracy: acc, accuracySE: Math.sqrt((acc * (1 - acc)) / n), brier: brier / n, logLoss: ll / n, maeMargin: mae / n, homeRate: hw / n,
    calibration: bins.map((b, i) => ({ from: i / 10, to: (i + 1) / 10, n: b.n, predicted: b.n ? b.p / b.n : null, actual: b.n ? b.y / b.n : null })),
  };
}

/** Pronóstico constante (sin información): sirve de piso para saber si el modelo aporta algo. */
export function constantBaseline(recs, pHome, meanMargin) {
  return metrics(recs.map((r) => ({ ...r, pHome, margin: meanMargin })));
}

export const GRID = {
  k: [10, 14, 18, 22, 26, 32],
  hca: [50, 70, 90, 110, 130],
  carry: [0.5, 0.6, 0.7, 0.8, 0.9],
  b2b: [0, 15, 30, 45],
  mov: [0, 1],
};

/** burn-in = primera temporada (ratings iniciales), entrenamiento = intermedias, prueba = últimas dos (fuera de muestra). */
export function splitSeasons(keys) {
  const n = keys.length;
  if (n >= 4) return { burn: [keys[0]], train: keys.slice(1, n - 2), test: keys.slice(n - 2) };
  if (n === 3) return { burn: [keys[0]], train: [keys[1]], test: [keys[2]] };
  if (n === 2) return { burn: [], train: [keys[0]], test: [keys[1]] };
  return { burn: [], train: [], test: keys.slice() };
}

const inSet = (set) => (r) => set.includes(r.season);

/**
 * Ajusta parámetros por búsqueda de coordenadas minimizando log-loss SOLO en las temporadas de entrenamiento
 * (el cálculo no ve ninguna temporada de prueba) y evalúa fuera de muestra en las de prueba.
 */
export function tuneAndEvaluate(seasons, { passes = 2, start = DEFAULT_PARAMS, log = () => {} } = {}) {
  const keys = seasons.map((s) => s.key);
  const split = splitSeasons(keys);
  const trainEnd = split.train.length ? keys.indexOf(split.train[split.train.length - 1]) : keys.indexOf(split.test[0]) - 1;
  const trainSeasons = seasons.slice(0, trainEnd + 1);
  const evalTrain = (params) => metrics(runElo(trainSeasons, params).games.filter(inSet(split.train)));

  let best = { ...start };
  let bestM = split.train.length ? evalTrain(best) : null;
  if (bestM) {
    for (let pass = 0; pass < passes; pass++) {
      for (const key of Object.keys(GRID)) {
        for (const v of GRID[key]) {
          if (v === best[key]) continue;
          const cand = { ...best, [key]: v };
          const m = evalTrain(cand);
          if (m.logLoss < bestM.logLoss - 1e-5) { best = cand; bestM = m; log(`  ${key}=${v} → logLoss ${m.logLoss.toFixed(4)}`); }
        }
      }
    }
  }

  const tunedAll = runElo(seasons, best).games;
  const defaultAll = runElo(seasons, DEFAULT_PARAMS).games;
  const trainRecs = tunedAll.filter(inSet(split.train)).filter((r) => r.played);
  const trainHome = trainRecs.length ? trainRecs.filter((r) => r.hPts > r.vPts).length / trainRecs.length : 0.5;
  const trainMargin = trainRecs.length ? trainRecs.reduce((s, r) => s + (r.hPts - r.vPts), 0) / trainRecs.length : 0;
  const testRecs = tunedAll.filter(inSet(split.test));
  const testDefault = defaultAll.filter(inSet(split.test));

  return {
    split,
    params: best,
    train: bestM,
    test: metrics(testRecs),
    baselines: {
      alwaysHome: constantBaseline(testRecs, 0.999, trainMargin),
      constantHomeRate: { pHome: trainHome, meanMargin: trainMargin, ...constantBaseline(testRecs, trainHome, trainMargin) },
      eloDefault: metrics(testDefault),
    },
  };
}

export const MAX_RECENT_DAYS = 60;

/**
 * Pronósticos vs resultados reales de los últimos `days` días (tope: 60) hasta la fecha `today` inclusive.
 * pred: Map "iso|visitante|local" → predicción hecha ANTES del partido (salida de runElo).
 */
export function recentResults({ games, pred, today, days = MAX_RECENT_DAYS }) {
  const span = Math.min(Math.max(1, Math.floor(days)), MAX_RECENT_DAYS);
  const from = isoAddDays(today, -(span - 1));
  const rows = [];
  for (const g of games) {
    if (!g.played || (g.phase !== 'regular' && g.phase !== undefined) || g.iso < from || g.iso > today) continue;
    const r = pred.get(`${g.iso}|${g.visitor}|${g.home}`);
    if (!r) continue;
    const homeWon = g.hPts > g.vPts;
    const homeFav = r.pHome >= 0.5;
    const pFav = homeFav ? r.pHome : 1 - r.pHome;
    const hit = homeFav === homeWon;
    rows.push({
      iso: g.iso, time: g.time ?? null, visitor: g.visitor, home: g.home, vPts: g.vPts, hPts: g.hPts, ot: g.ot,
      pHome: r.pHome, favorite: homeFav ? g.home : g.visitor, pFav, margin: r.margin, realMargin: g.hPts - g.vPts,
      winner: homeWon ? g.home : g.visitor, hit, marginErr: Math.abs(r.margin - (g.hPts - g.vPts)), upset: !hit && pFav >= 0.7,
    });
  }
  rows.sort((a, b) => b.iso.localeCompare(a.iso) || (b.time ?? '').localeCompare(a.time ?? '') || a.home.localeCompare(b.home));
  const n = rows.length;
  const hits = rows.filter((x) => x.hit).length;
  const m = metrics(rows.map((x) => ({ played: true, pHome: x.pHome, margin: x.margin, hPts: x.hPts, vPts: x.vPts })));
  const confident = rows.filter((x) => x.pFav >= 0.7);
  return {
    from, to: today, days: span, rows,
    summary: { n, hits, misses: n - hits, accuracy: n ? hits / n : null, alwaysHome: n ? rows.filter((x) => x.hPts > x.vPts).length / n : null, logLoss: m.logLoss, brier: m.brier, maeMargin: m.maeMargin, confidentN: confident.length, confidentHits: confident.filter((x) => x.hit).length, upsets: rows.filter((x) => x.upset).length },
  };
}
