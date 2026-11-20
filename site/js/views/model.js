import { esc, fix, pct, table, tname, chip } from './shared.js';
import { recentResults, MAX_RECENT_DAYS } from '../core/backtest.js';
import { fmtDate } from '../core/util.js';

const row = (label, m) => (m && m.n ? `<tr><td class="l">${esc(label)}</td><td>${m.n}</td><td>${pct(m.accuracy)}${m.accuracySE ? ` <span class="muted">±${(m.accuracySE * 100).toFixed(1)}</span>` : ''}</td><td>${fix(m.logLoss, 4)}</td><td>${fix(m.brier, 4)}</td><td>${fix(m.maeMargin, 2)}</td></tr>` : `<tr><td class="l">${esc(label)}</td><td colspan="5" class="muted">sin datos</td></tr>`);

function recentCard(ctx) {
  const { ui } = ctx;
  const isCurrent = ctx.season === String(ctx.currentSeason);
  const playedDates = ctx.games.filter((g) => g.played).map((g) => g.iso).sort();
  const end = isCurrent ? ctx.today : (playedDates[playedDates.length - 1] ?? ctx.today);
  const days = Math.min(ui.btDays, MAX_RECENT_DAYS);
  const rec = recentResults({ games: ctx.games, pred: ctx.pred, today: end, days });
  const s = rec.summary;
  let rows = rec.rows;
  if (ui.btTeam) rows = rows.filter((r) => r.home === ui.btTeam || r.visitor === ui.btTeam);
  if (ui.btFilter === 'hit') rows = rows.filter((r) => r.hit);
  if (ui.btFilter === 'miss') rows = rows.filter((r) => !r.hit);
  const trainWarn = ctx.model?.split?.train?.includes(ctx.season) ? `<p class="banner warn">La temporada ${esc(ctx.seasonLabel)} se usó para ajustar los parámetros: estos aciertos NO son fuera de muestra. Para evaluar el modelo mira la temporada en curso.</p>` : '';
  const teamOpts = ['<option value="">Todos los equipos</option>', ...ctx.teamCodes.map((c) => `<option value="${c}"${ui.btTeam === c ? ' selected' : ''}>${esc(ctx.teamNames[c])}</option>`)].join('');
  const body = rows.map((r) => {
    const status = r.hit ? chip('ok', '✓ Acertó') : chip('error', r.upset ? '✗ Falló (alta confianza)' : '✗ Falló');
    const hw = r.hPts > r.vPts;
    const score = `<span class="${hw ? 'lose' : 'win'}">${r.vPts}</span> – <span class="${hw ? 'win' : 'lose'}">${r.hPts}</span>${r.ot ? ` <span class="muted">${esc(r.ot)}</span>` : ''}`;
    return `<tr class="${r.hit ? 'row-hit' : 'row-miss'}"><td class="l">${esc(fmtDate(r.iso, { day: 'numeric', month: 'short' }))}</td><td class="l">${tname(r.visitor)} @ ${tname(r.home)}</td><td class="l"><b>${esc(r.favorite)}</b> ${pct(r.pFav, 0)}</td><td>${esc(r.margin >= 0 ? r.home : r.visitor)} por ${fix(Math.abs(r.margin))}</td><td>${score}</td><td>${esc(r.winner)} por ${Math.abs(r.realMargin)}</td><td>${fix(r.marginErr)}</td><td class="l">${status}</td></tr>`;
  });
  const kpi = s.n ? `<div class="kpi"><div><b>${s.hits}/${s.n}</b><span>aciertos (${pct(s.accuracy)})</span></div><div><b>${pct(s.alwaysHome)}</b><span>apostando siempre al local</span></div><div><b>${fix(s.maeMargin, 1)}</b><span>error medio de margen (pts)</span></div><div><b>${s.confidentHits}/${s.confidentN}</b><span>aciertos con ≥70% de confianza</span></div><div><b>${s.misses}</b><span>fallos (${s.upsets} de alta confianza)</span></div></div>` : '';
  return `<div class="card"><h2>Pronósticos vs resultados reales</h2>
    <p class="muted">Partidos jugados del ${esc(fmtDate(rec.from))} al ${esc(fmtDate(rec.to))} (máximo ${MAX_RECENT_DAYS} días). Cada pronóstico se calculó <b>antes</b> del partido, solo con la información disponible en ese momento.</p>${trainWarn}
    <div class="toolbar"><label>Ventana <select id="bt-days" data-act="bt-days">${[7, 14, 30, 60].map((d) => `<option value="${d}"${d === days ? ' selected' : ''}>últimos ${d} días</option>`).join('')}</select></label>
      <label>Mostrar <select id="bt-filter" data-act="bt-filter"><option value="all"${ui.btFilter === 'all' ? ' selected' : ''}>Todos</option><option value="hit"${ui.btFilter === 'hit' ? ' selected' : ''}>Solo aciertos</option><option value="miss"${ui.btFilter === 'miss' ? ' selected' : ''}>Solo fallos</option></select></label>
      <select id="bt-team" data-act="bt-team">${teamOpts}</select></div>
    ${kpi}
    ${rows.length ? table(['Fecha', '~Partido', '~Favorito del modelo', 'Margen previsto', 'Resultado real', 'Margen real', 'Error (pts)', '~Estado'], [body.join('')]) : '<p class="muted">No hay partidos jugados en este periodo con ese filtro.</p>'}</div>`;
}

export function render(ctx) {
  const m = ctx.model;
  if (!m) return recentCard(ctx) + '<div class="card"><p class="muted">Aún no hay métricas de backtesting (ejecuta <code>npm run model</code> o el workflow).</p></div>';
  const split = m.split ?? {};
  const bs = m.baselines ?? {};
  const cal = (m.test?.calibration ?? []).filter((b) => b.n).map((b) => `<tr><td>${pct(b.from, 0)}–${pct(b.to, 0)}</td><td>${b.n}</td><td>${pct(b.predicted)}</td><td>${pct(b.actual)}</td></tr>`);
  const p = m.params ?? {};
  return recentCard(ctx) + `<div class="card"><h2>Cómo se valida el modelo</h2>
    <p>El modelo es un <b>Elo</b> con ventaja de local, margen de victoria, descanso (back-to-back) y regresión entre temporadas. Cada pronóstico usa solo información anterior al partido. Los parámetros se ajustan con las temporadas de <b>entrenamiento</b> (${esc((split.train ?? []).join(', ') || '—')}) y se miden en las de <b>prueba</b> (${esc((split.test ?? []).join(', ') || '—')}), que nunca participan en el ajuste${split.burn?.length ? `; ${esc(split.burn.join(', '))} solo sirve para inicializar los ratings` : ''}.</p>
    ${table(['~Conjunto', 'Partidos', 'Acierto', 'Log-loss', 'Brier', 'Error de margen'], [
      row('Prueba · modelo ajustado', m.test), row('Prueba · Elo sin ajustar', bs.eloDefault), row('Prueba · tasa de local constante', bs.constantHomeRate), row('Prueba · siempre local', bs.alwaysHome), row('Entrenamiento · modelo ajustado', m.train)])}
    <p class="muted">Menor log-loss, Brier y error de margen es mejor. Un modelo útil debe batir a la fila “tasa de local constante” (pronóstico sin información). Con ${m.test?.n ?? 0} partidos de prueba, el acierto tiene un margen de error de ±${m.test?.accuracySE ? (m.test.accuracySE * 100).toFixed(1) : '—'} puntos porcentuales.</p></div>
  <div class="grid g2"><div class="card"><h3>Parámetros ajustados</h3>${table(['~Parámetro', 'Valor'], Object.entries(p).map(([k, v]) => `<tr><td class="l">${esc(k)}</td><td>${esc(v)}</td></tr>`))}</div>
  <div class="card"><h3>Calibración (prueba)</h3>${table(['Prob. local', 'Partidos', 'Predicha', 'Real'], cal)}<p class="muted">Si el modelo está bien calibrado, “Predicha” y “Real” se parecen.</p></div></div>
  <p class="muted">Temporadas usadas: ${esc((m.seasons ?? []).join(', '))}. Calculado ${m.generatedAt ? esc(new Date(m.generatedAt).toLocaleString('es-MX')) : ''}.</p>`;
}
