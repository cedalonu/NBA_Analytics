import type { Game, ModelWeights, SeasonKey } from '../types/nba';
import { buildChronologicalSeason } from './seasonEngine';
import { DEFAULT_OPTIMIZED_WEIGHTS } from './predictiveModel';

export interface CalibrationBin { from: number; to: number; n: number; predicted: number; actual: number }
export interface BacktestMetrics {
  n: number;
  accuracy: number;          // % de ganadores acertados
  brier: number;             // menor es mejor (0.25 = moneda al aire)
  logLoss: number;           // menor es mejor (0.693 = moneda al aire)
  maeMargin: number;         // error medio del margen (puntos)
  maeTotal: number;          // error medio del total (puntos)
  homeWinRate: number;       // % de victorias locales observado
  alwaysHomeAccuracy: number;// precisión de apostar siempre al local
  calibration: CalibrationBin[];
}

/** Métricas sobre partidos finalizados; se omiten los primeros `warmup` para dejar que el modelo acumule datos de la temporada. */
export function evaluateGames(games: Game[], warmup = 100): BacktestMetrics {
  const fin = games.filter((g) => g.isFinished).slice(warmup);
  const eps = 1e-6;
  let correct = 0, brier = 0, ll = 0, mm = 0, mt = 0, homeWins = 0;
  const bins: { n: number; p: number; y: number }[] = Array.from({ length: 10 }, () => ({ n: 0, p: 0, y: 0 }));
  for (const g of fin) {
    const pHome = Math.min(1 - eps, Math.max(eps, g.prediction.homeProb / (g.prediction.homeProb + g.prediction.visitorProb || 1)));
    const y = g.hPts > g.vPts ? 1 : 0;
    homeWins += y;
    if ((pHome >= 0.5 ? 1 : 0) === y) correct++;
    brier += (pHome - y) ** 2;
    ll += -(y * Math.log(pHome) + (1 - y) * Math.log(1 - pHome));
    mm += Math.abs(g.prediction.predictedSpread - (g.hPts - g.vPts));
    mt += Math.abs(g.prediction.predictedTotal - (g.hPts + g.vPts));
    const b = Math.min(9, Math.floor(pHome * 10));
    bins[b].n++; bins[b].p += pHome; bins[b].y += y;
  }
  const n = fin.length || 1;
  return {
    n: fin.length,
    accuracy: (correct / n) * 100,
    brier: brier / n,
    logLoss: ll / n,
    maeMargin: mm / n,
    maeTotal: mt / n,
    homeWinRate: (homeWins / n) * 100,
    alwaysHomeAccuracy: (homeWins / n) * 100,
    calibration: bins.map((b, i) => ({ from: i / 10, to: (i + 1) / 10, n: b.n, predicted: b.n ? b.p / b.n : 0, actual: b.n ? b.y / b.n : 0 })),
  };
}

export function runBacktest(season: SeasonKey, weights: ModelWeights, cutoffIso: string, warmup = 100): BacktestMetrics {
  const data = buildChronologicalSeason(weights, season, cutoffIso, {});
  return evaluateGames(data.games, warmup);
}

/** Variantes para medir cuánto aporta cada componente del modelo. */
export function ablationVariants(base: ModelWeights = DEFAULT_OPTIMIZED_WEIGHTS): { name: string; weights: ModelWeights }[] {
  const zero = (o: Partial<ModelWeights>): ModelWeights => ({ ...base, ...o });
  return [
    { name: 'Modelo actual', weights: base },
    { name: 'Sin lesiones ni plantilla (solo equipo)', weights: zero({ injuryImpactWeight: 0, rosterPowerWeight: 0 }) },
    { name: 'Sin lesiones', weights: zero({ injuryImpactWeight: 0 }) },
    { name: 'Sin plantilla (rosterPower)', weights: zero({ rosterPowerWeight: 0 }) },
    { name: 'Sin Elo', weights: zero({ eloWeight: 0 }) },
    { name: 'Sin forma reciente', weights: zero({ formTrendWeight: 0 }) },
    { name: 'Sin descanso/B2B', weights: zero({ restAdvantageWeight: 0 }) },
    { name: 'Solo ventaja de local', weights: zero({ netRatingWeight: 0, injuryImpactWeight: 0, rosterPowerWeight: 0, restAdvantageWeight: 0, formTrendWeight: 0, eloWeight: 0 }) },
  ];
}

const SEARCH_GRID: Record<keyof Omit<ModelWeights, 'overlapDecayGames'>, number[]> = {
  homeCourtAdvantage: [2.0, 2.5, 3.0, 3.5, 4.0],
  netRatingWeight: [0.2, 0.35, 0.5, 0.7, 0.9],
  injuryImpactWeight: [0, 0.4, 0.8, 1.2],
  rosterPowerWeight: [0, 0.4, 0.8, 1.2],
  restAdvantageWeight: [0, 0.6, 1.2, 1.8],
  formTrendWeight: [0, 1.5, 3.0, 4.5],
  eloWeight: [0, 0.2, 0.4, 0.6, 0.8],
  logisticScale: [9, 10, 11.2, 12.5, 14],
};

/**
 * Búsqueda por coordenadas: ajusta los pesos minimizando log-loss en `trainSeason` y reporta el resultado
 * fuera de muestra en `testSeason`. Evita elegir pesos mirando la misma temporada con la que se evalúa.
 */
export function tuneWeights(
  trainSeason: SeasonKey, trainCutoff: string, testSeason: SeasonKey, testCutoff: string,
  start: ModelWeights = DEFAULT_OPTIMIZED_WEIGHTS, passes = 2, log: (m: string) => void = () => {}
): { weights: ModelWeights; train: BacktestMetrics; trainBefore: BacktestMetrics; testBefore: BacktestMetrics; test: BacktestMetrics } {
  let best = { ...start };
  let bestM = runBacktest(trainSeason, best, trainCutoff);
  const trainBefore = bestM;
  const testBefore = runBacktest(testSeason, start, testCutoff);
  for (let p = 0; p < passes; p++) {
    for (const key of Object.keys(SEARCH_GRID) as (keyof typeof SEARCH_GRID)[]) {
      for (const v of SEARCH_GRID[key]) {
        if (v === best[key]) continue;
        const cand = { ...best, [key]: v } as ModelWeights;
        const m = runBacktest(trainSeason, cand, trainCutoff);
        if (m.logLoss < bestM.logLoss - 1e-5) { best = cand; bestM = m; log(`  ${key}=${v} -> logLoss ${m.logLoss.toFixed(4)} acc ${m.accuracy.toFixed(1)}%`); }
      }
    }
  }
  return { weights: best, train: bestM, trainBefore, testBefore, test: runBacktest(testSeason, best, testCutoff) };
}
