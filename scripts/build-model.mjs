#!/usr/bin/env node
/** Ajusta y valida el modelo con backtesting sobre los calendarios descargados → site/data/model.json */
import path from 'node:path';
import { DATA_DIR, readJson, writeJsonIfChanged } from './lib/io.mjs';
import { tuneAndEvaluate } from '../site/js/core/backtest.js';

const manifest = await readJson(path.join(DATA_DIR, 'manifest.json'));
if (!manifest?.seasons?.length) { console.error('Falta site/data/manifest.json. Ejecuta primero: npm run fetch'); process.exit(1); }
const seasons = [];
for (const y of manifest.seasons) {
  const d = await readJson(path.join(DATA_DIR, `schedule-${y}.json`));
  if (d) seasons.push({ key: String(y), games: d.games });
}
const result = tuneAndEvaluate(seasons, { log: console.log });
const fmt = (m) => (m && m.n ? `n=${m.n} acierto ${(m.accuracy * 100).toFixed(1)}% logLoss ${m.logLoss.toFixed(4)} Brier ${m.brier.toFixed(4)} MAE ${m.maeMargin.toFixed(2)}` : 'sin datos');
console.log('Parámetros:', result.params);
console.log('Entrenamiento      :', fmt(result.train));
console.log('Prueba (fuera de muestra):', fmt(result.test));
console.log('  siempre local    :', fmt(result.baselines.alwaysHome));
console.log('  tasa constante   :', fmt(result.baselines.constantHomeRate));
console.log('  Elo sin ajustar  :', fmt(result.baselines.eloDefault));
const pf = (m) => (m && m.n ? `n=${m.n} error por equipo ${m.maeTeam.toFixed(2)} error total ${m.maeTotal.toFixed(2)} sesgo ${m.biasTotal.toFixed(2)}` : 'sin datos');
console.log('Puntos · parámetros:', result.points.params);
console.log('Puntos · prueba     :', pf(result.points.test));
console.log('  media liga+local :', pf(result.points.baselines.leagueMeanHome));
console.log('  media liga       :', pf(result.points.baselines.leagueMean));
const out = { version: '2.0', generatedAt: new Date().toISOString(), seasons: seasons.map((s) => s.key), ...result };
await writeJsonIfChanged(path.join(DATA_DIR, 'model.json'), out);
