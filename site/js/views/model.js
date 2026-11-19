import { esc, fix, pct, table } from './shared.js';

const row = (label, m) => (m && m.n ? `<tr><td class="l">${esc(label)}</td><td>${m.n}</td><td>${pct(m.accuracy)}${m.accuracySE ? ` <span class="muted">±${(m.accuracySE * 100).toFixed(1)}</span>` : ''}</td><td>${fix(m.logLoss, 4)}</td><td>${fix(m.brier, 4)}</td><td>${fix(m.maeMargin, 2)}</td></tr>` : `<tr><td class="l">${esc(label)}</td><td colspan="5" class="muted">sin datos</td></tr>`);

export function render(ctx) {
  const m = ctx.model;
  if (!m) return '<div class="card"><p class="muted">Aún no hay backtesting (ejecuta <code>npm run model</code> o el workflow).</p></div>';
  const split = m.split ?? {};
  const bs = m.baselines ?? {};
  const cal = (m.test?.calibration ?? []).filter((b) => b.n).map((b) => `<tr><td>${pct(b.from, 0)}–${pct(b.to, 0)}</td><td>${b.n}</td><td>${pct(b.predicted)}</td><td>${pct(b.actual)}</td></tr>`);
  const p = m.params ?? {};
  return `<div class="card"><h2>Cómo se valida el modelo</h2>
    <p>El modelo es un <b>Elo</b> con ventaja de local, margen de victoria, descanso (back-to-back) y regresión entre temporadas. Cada pronóstico usa solo información anterior al partido. Los parámetros se ajustan con las temporadas de <b>entrenamiento</b> (${esc((split.train ?? []).join(', ') || '—')}) y se miden en las de <b>prueba</b> (${esc((split.test ?? []).join(', ') || '—')}), que nunca participan en el ajuste${split.burn?.length ? `; ${esc(split.burn.join(', '))} solo sirve para inicializar los ratings` : ''}.</p>
    ${table(['~Conjunto', 'Partidos', 'Acierto', 'Log-loss', 'Brier', 'Error de margen'], [
      row('Prueba · modelo ajustado', m.test), row('Prueba · Elo sin ajustar', bs.eloDefault), row('Prueba · tasa de local constante', bs.constantHomeRate), row('Prueba · siempre local', bs.alwaysHome), row('Entrenamiento · modelo ajustado', m.train)])}
    <p class="muted">Menor log-loss, Brier y error de margen es mejor. Un modelo útil debe batir a la fila “tasa de local constante” (pronóstico sin información). Con ${m.test?.n ?? 0} partidos de prueba, el acierto tiene un margen de error de ±${m.test?.accuracySE ? (m.test.accuracySE * 100).toFixed(1) : '—'} puntos porcentuales.</p></div>
  <div class="grid g2"><div class="card"><h3>Parámetros ajustados</h3>${table(['~Parámetro', 'Valor'], Object.entries(p).map(([k, v]) => `<tr><td class="l">${esc(k)}</td><td>${esc(v)}</td></tr>`))}</div>
  <div class="card"><h3>Calibración (prueba)</h3>${table(['Prob. local', 'Partidos', 'Predicha', 'Real'], cal)}<p class="muted">Si el modelo está bien calibrado, “Predicha” y “Real” se parecen.</p></div></div>
  <p class="muted">Temporadas usadas: ${esc((m.seasons ?? []).join(', '))}. Calculado ${m.generatedAt ? esc(new Date(m.generatedAt).toLocaleString('es-MX')) : ''}.</p>`;
}
