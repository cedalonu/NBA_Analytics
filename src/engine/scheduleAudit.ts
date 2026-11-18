import type { RawScheduleItem } from './seasonEngine';

export interface ScheduleAudit {
  errors: string[];   // datos imposibles o corruptos
  warnings: string[]; // datos dudosos o pendientes de actualizar
  stats: {
    total: number;
    played: number;
    scheduled: number;
    teams: number;
    minGamesPerTeam: number;
    maxGamesPerTeam: number;
    overdue: number; // fecha pasada y sin resultado
  };
}

const MAX_GAMES = 82;

/**
 * Audita un calendario de temporada regular (finalizados y próximos) contra reglas básicas de la NBA.
 * `todayIso` permite probarlo con una fecha fija.
 */
export function auditSchedule(games: RawScheduleItem[], todayIso: string = new Date().toISOString().slice(0, 10)): ScheduleAudit {
  const errors: string[] = [];
  const warnings: string[] = [];
  const perTeam = new Map<string, { total: number; home: number; away: number }>();
  const seen = new Set<string>();
  const teamDay = new Map<string, string>();
  let played = 0;
  let overdue = 0;
  const overdueSample: string[] = [];

  for (const g of games) {
    const key = `${g.iso}|${g.visitor}|${g.home}`;
    if (seen.has(key)) errors.push(`Partido duplicado: ${g.iso} ${g.visitor} @ ${g.home}`);
    seen.add(key);

    for (const t of [g.visitor, g.home]) {
      const dayKey = `${g.iso}|${t}`;
      if (teamDay.has(dayKey)) errors.push(`${t} aparece dos veces el ${g.iso} (${teamDay.get(dayKey)} y ${g.visitor} @ ${g.home})`);
      else teamDay.set(dayKey, `${g.visitor} @ ${g.home}`);
    }
    const v = perTeam.get(g.visitor) ?? { total: 0, home: 0, away: 0 };
    const h = perTeam.get(g.home) ?? { total: 0, home: 0, away: 0 };
    v.total++; v.away++; h.total++; h.home++;
    perTeam.set(g.visitor, v); perTeam.set(g.home, h);

    const isPlayed = typeof g.played === 'boolean' ? g.played : (g.vPts > 0 && g.hPts > 0);
    if (isPlayed) {
      played++;
      if (g.iso > todayIso) errors.push(`Partido futuro con marcador: ${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`);
      if (g.vPts === g.hPts) errors.push(`Marcador empatado: ${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`);
      if (g.vPts < 60 || g.hPts < 60 || g.vPts > 200 || g.hPts > 200) warnings.push(`Marcador atípico: ${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`);
    } else {
      if (g.vPts !== 0 || g.hPts !== 0) errors.push(`Partido sin jugar con marcador: ${g.iso} ${g.visitor} ${g.vPts}-${g.hPts} ${g.home}`);
      if (g.iso < todayIso) { overdue++; if (overdueSample.length < 5) overdueSample.push(`${g.iso} ${g.visitor} @ ${g.home}`); }
    }
  }

  if (overdue) warnings.push(`${overdue} partido(s) con fecha pasada y sin resultado (aplazados o aún sin actualizar). Ej.: ${overdueSample.join('; ')}`);

  const counts = [...perTeam.values()].map((x) => x.total);
  const teams = perTeam.size;
  const minGames = counts.length ? Math.min(...counts) : 0;
  const maxGames = counts.length ? Math.max(...counts) : 0;
  if (teams && teams !== 30) errors.push(`Se esperaban 30 equipos y hay ${teams}`);
  for (const [t, c] of perTeam) {
    if (c.total > MAX_GAMES) errors.push(`${t} tiene ${c.total} partidos (máximo ${MAX_GAMES})`);
    if (Math.abs(c.home - c.away) > 8 && c.total >= MAX_GAMES - 4) warnings.push(`${t}: balance local/visitante ${c.home}/${c.away}`);
  }
  // Calendario completo esperado: 1230 partidos y 82 por equipo
  if (games.length !== 1230) warnings.push(`El calendario tiene ${games.length} partidos de temporada regular (se esperan 1230)`);
  else if (minGames !== MAX_GAMES || maxGames !== MAX_GAMES) warnings.push(`Partidos por equipo entre ${minGames} y ${maxGames} (se esperan ${MAX_GAMES})`);

  return {
    errors, warnings,
    stats: { total: games.length, played, scheduled: games.length - played, teams, minGamesPerTeam: minGames, maxGamesPerTeam: maxGames, overdue },
  };
}
