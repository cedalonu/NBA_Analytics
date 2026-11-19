import { TEAM_CODES } from './teams.js';
import { daysBetween } from './util.js';

const isReg = (g) => g.phase === 'regular' || g.phase === undefined;
export const EXPECTED_REGULAR_GAMES = 1230;
export const GAMES_PER_TEAM = 82;

const chk = (id, area, status, title, detail, items = []) => ({ id, area, status, title, detail, items });

/**
 * Auditoría de calendario/resultados (general, partidos finalizados y partidos próximos).
 * bbrStandings: [{team, w, l}] oficiales de BBR para reconciliar con los resultados (opcional).
 */
export function auditSeason({ games, today, bbrStandings = null }) {
  const reg = games.filter(isReg);
  const other = games.filter((g) => !isReg(g));
  const played = reg.filter((g) => g.played);
  const pending = reg.filter((g) => !g.played);
  const checks = [];

  // ---------- General
  checks.push(chk('total', 'general', reg.length === EXPECTED_REGULAR_GAMES ? 'ok' : reg.length > EXPECTED_REGULAR_GAMES ? 'error' : 'warn',
    'Partidos de temporada regular', `${reg.length} partidos (se esperan ${EXPECTED_REGULAR_GAMES}).`));

  const per = new Map(TEAM_CODES.map((c) => [c, { total: 0, home: 0, away: 0 }]));
  const unknown = new Set();
  for (const g of reg) {
    for (const [t, k] of [[g.home, 'home'], [g.visitor, 'away']]) {
      const r = per.get(t);
      if (!r) { unknown.add(t); continue; }
      r.total++; r[k]++;
    }
  }
  checks.push(chk('teams', 'general', unknown.size ? 'error' : 'ok', 'Equipos reconocidos', unknown.size ? `Códigos desconocidos: ${[...unknown].join(', ')}` : 'Los 30 equipos están en el calendario.'));

  const badTotals = [...per].filter(([, r]) => r.total !== GAMES_PER_TEAM);
  checks.push(chk('per-team', 'general', badTotals.some(([, r]) => r.total > GAMES_PER_TEAM) ? 'error' : badTotals.length ? 'warn' : 'ok',
    `Partidos por equipo (${GAMES_PER_TEAM})`, badTotals.length ? `${badTotals.length} equipo(s) no tienen ${GAMES_PER_TEAM}.` : 'Todos los equipos tienen 82 partidos.',
    badTotals.map(([t, r]) => `${t}: ${r.total}`)));

  const badSplit = [...per].filter(([, r]) => r.total === GAMES_PER_TEAM && (r.home !== 41 || r.away !== 41));
  checks.push(chk('home-away', 'general', badSplit.length ? 'warn' : 'ok', 'Balance local/visitante (41/41)',
    badSplit.length ? `${badSplit.length} equipo(s) sin 41 locales y 41 visitantes.` : 'Todos los equipos tienen 41 locales y 41 visitantes.', badSplit.map(([t, r]) => `${t}: ${r.home} local / ${r.away} visitante`)));

  const seen = new Set(), dups = [];
  for (const g of games) { const k = `${g.iso}|${g.visitor}|${g.home}`; if (seen.has(k)) dups.push(k); seen.add(k); }
  checks.push(chk('dups', 'general', dups.length ? 'error' : 'ok', 'Partidos duplicados', dups.length ? `${dups.length} duplicado(s).` : 'Sin duplicados.', dups));

  const day = new Map(), twice = [];
  for (const g of games) for (const t of [g.home, g.visitor]) { const k = `${g.iso}|${t}`; if (day.has(k)) twice.push(`${t} el ${g.iso}`); day.set(k, 1); }
  checks.push(chk('twice', 'general', twice.length ? 'error' : 'ok', 'Equipo con dos partidos el mismo día', twice.length ? `${twice.length} caso(s).` : 'Ningún equipo juega dos veces el mismo día.', twice));

  const notes = {};
  for (const g of other) notes[g.note ?? g.phase] = (notes[g.note ?? g.phase] ?? 0) + 1;
  checks.push(chk('phases', 'general', 'info', 'Partidos fuera de temporada regular', other.length ? `${other.length} excluidos de posiciones y modelo (Copa NBA eliminatoria / Play-In).` : 'Ninguno.', Object.entries(notes).map(([k, v]) => `${k}: ${v}`)));

  // ---------- Finalizados
  const bad = played.filter((g) => !(g.vPts > 0 && g.hPts > 0) || g.vPts === g.hPts);
  checks.push(chk('scores', 'finalizados', bad.length ? 'error' : 'ok', 'Marcadores válidos', bad.length ? `${bad.length} partido(s) con marcador inválido o empatado.` : `${played.length} partidos con marcador válido y sin empates.`, bad.map((g) => `${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`)));

  const odd = played.filter((g) => g.vPts < 70 || g.hPts < 70 || g.vPts > 190 || g.hPts > 190);
  checks.push(chk('odd-scores', 'finalizados', odd.length ? 'warn' : 'ok', 'Marcadores atípicos', odd.length ? `${odd.length} partido(s) fuera de 70–190 puntos por equipo.` : 'Sin marcadores atípicos.', odd.map((g) => `${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`)));

  const future = played.filter((g) => g.iso > today);
  checks.push(chk('future-played', 'finalizados', future.length ? 'error' : 'ok', 'Resultados con fecha futura', future.length ? `${future.length} partido(s) futuros ya tienen marcador.` : 'Ningún partido futuro tiene marcador.', future.map((g) => `${g.iso} ${g.visitor} @ ${g.home}`)));

  const overdue = pending.filter((g) => g.iso < today);
  checks.push(chk('overdue', 'finalizados', overdue.length ? 'warn' : 'ok', 'Partidos pasados sin resultado', overdue.length ? `${overdue.length} partido(s) con fecha anterior a hoy y sin marcador (aplazados o datos sin actualizar).` : 'Todos los partidos anteriores a hoy tienen resultado.', overdue.map((g) => `${g.iso} ${g.visitor} @ ${g.home}`)));

  if (bbrStandings && bbrStandings.length) {
    const w = new Map(TEAM_CODES.map((c) => [c, { w: 0, l: 0 }]));
    for (const g of played) { if (!w.has(g.home) || !w.has(g.visitor)) continue; const hw = g.hPts > g.vPts; w.get(g.home)[hw ? 'w' : 'l']++; w.get(g.visitor)[hw ? 'l' : 'w']++; }
    const diffs = bbrStandings.filter((s) => w.has(s.team) && (w.get(s.team).w !== s.w || w.get(s.team).l !== s.l))
      .map((s) => `${s.team}: calculado ${w.get(s.team).w}-${w.get(s.team).l} vs BBR ${s.w}-${s.l}`);
    checks.push(chk('standings', 'finalizados', diffs.length ? 'error' : 'ok', 'Récords vs posiciones oficiales de BBR',
      diffs.length ? `${diffs.length} equipo(s) no coinciden con las posiciones de BBR.` : `Los ${bbrStandings.length} récords calculados coinciden con BBR.`, diffs));
  } else {
    checks.push(chk('standings', 'finalizados', 'warn', 'Récords vs posiciones oficiales de BBR', 'No hay posiciones de BBR para comparar.'));
  }

  const tot = played.reduce((s, g) => s + g.vPts + g.hPts, 0);
  const hw = played.filter((g) => g.hPts > g.vPts).length;
  checks.push(chk('summary', 'finalizados', 'info', 'Resumen de resultados', played.length ? `${played.length} jugados · promedio ${(tot / played.length).toFixed(1)} puntos totales · local gana ${(100 * hw / played.length).toFixed(1)}%.` : 'Aún no hay partidos jugados.'));

  // ---------- Próximos
  const withScore = pending.filter((g) => g.vPts !== null && g.vPts !== undefined && g.vPts !== 0);
  checks.push(chk('pending-scored', 'proximos', withScore.length ? 'error' : 'ok', 'Partidos sin jugar con marcador', withScore.length ? `${withScore.length} partido(s) pendientes traen marcador.` : 'Ningún partido pendiente trae marcador.', withScore.map((g) => `${g.iso} ${g.visitor} @ ${g.home}`)));

  const upcoming = pending.filter((g) => g.iso >= today).sort((a, b) => a.iso.localeCompare(b.iso));
  checks.push(chk('upcoming', 'proximos', 'info', 'Partidos por jugar', `${upcoming.length} partidos por jugar${upcoming[0] ? `; el siguiente es ${upcoming[0].visitor} @ ${upcoming[0].home} el ${upcoming[0].iso}` : ''}.`));

  const b2b = new Map(TEAM_CODES.map((c) => [c, 0]));
  const lastDay = new Map();
  for (const g of [...reg].sort((a, c) => a.iso.localeCompare(c.iso))) {
    for (const t of [g.home, g.visitor]) { if (!b2b.has(t)) continue; if (lastDay.has(t) && daysBetween(lastDay.get(t), g.iso) === 1) b2b.set(t, b2b.get(t) + 1); lastDay.set(t, g.iso); }
  }
  const heavy = [...b2b].filter(([, n]) => n > 20);
  checks.push(chk('b2b', 'proximos', heavy.length ? 'warn' : 'info', 'Back-to-back en el calendario', `Entre ${Math.min(...b2b.values())} y ${Math.max(...b2b.values())} por equipo.`, [...b2b].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t, n]) => `${t}: ${n}`)));

  const noTime = pending.filter((g) => !g.time);
  checks.push(chk('no-time', 'proximos', noTime.length ? 'info' : 'ok', 'Partidos sin hora', noTime.length ? `${noTime.length} partido(s) por jugar sin hora publicada.` : 'Todos los partidos por jugar tienen hora.'));

  const dates = [...new Set(reg.map((g) => g.iso))].sort();
  let gap = 0, gapAt = '';
  for (let i = 1; i < dates.length; i++) { const d = daysBetween(dates[i - 1], dates[i]); if (d > gap) { gap = d; gapAt = `${dates[i - 1]} → ${dates[i]}`; } }
  checks.push(chk('gaps', 'proximos', gap > 8 ? 'warn' : 'info', 'Mayor pausa del calendario', dates.length ? `${gap} día(s) entre ${gapAt} (el Juego de Estrellas suele causar la mayor).` : 'Sin fechas.'));

  const summary = { ok: 0, warn: 0, error: 0, info: 0 };
  for (const c of checks) summary[c.status]++;
  return { checks, summary };
}
