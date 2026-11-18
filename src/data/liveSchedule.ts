import type { RawScheduleItem } from '../engine/seasonEngine';
import { NBA_TEAMS } from './teamsData';
import { NBA_TEAMS_2027 } from './rosters2026_2027';

// Calendario real descargado de Basketball-Reference por scripts/fetch-bbr-schedule.mjs
// (lo ejecuta el workflow daily-update.yml y deja los JSON en public/data/).
export type LiveSeasonKey = '2025-2026' | '2026-2027';

export interface LiveScheduleMeta {
  season: LiveSeasonKey;
  source: string;
  fetchedAt: string;
  total: number;
  played: number;
  dropped: number;
}

const FILES: Record<LiveSeasonKey, string> = {
  '2025-2026': 'data/schedule-2025-26.json',
  '2026-2027': 'data/schedule-2026-27.json',
};

const store: Partial<Record<LiveSeasonKey, { games: RawScheduleItem[]; meta: LiveScheduleMeta }>> = {};

/** Valida y guarda un calendario ya descargado. Devuelve su resumen o null si no sirve. */
export function setLiveSchedule(season: LiveSeasonKey, json: any): LiveScheduleMeta | null {
  const raw: any[] = Array.isArray(json?.games) ? json.games : [];
  const teams = season === '2026-2027' ? NBA_TEAMS_2027 : NBA_TEAMS;
  const codes = new Set(teams.map((t: any) => t.code));
  const games: RawScheduleItem[] = [];
  let dropped = 0;
  for (const g of raw) {
    const valid = g && /^\d{4}-\d{2}-\d{2}$/.test(g.iso) && codes.has(g.visitor) && codes.has(g.home) && g.visitor !== g.home;
    // Solo temporada regular: la fase de eliminación de la Copa NBA y el Play-In no suman al récord.
    if (!valid || (g.phase && g.phase !== 'regular')) { dropped++; continue; }
    games.push({
      iso: g.iso,
      display: g.display,
      monthKey: g.monthKey,
      monthLabel: g.monthLabel,
      time: g.time || 'TBD',
      visitor: g.visitor,
      vPts: g.played ? Number(g.vPts) : 0,
      home: g.home,
      hPts: g.played ? Number(g.hPts) : 0,
      played: !!g.played,
      ...(g.ot ? { ot: g.ot } : {}),
      ...(g.note ? { bbrVerifiedNote: g.note } : {}),
    });
  }
  if (games.length < 100) return null; // archivo vacío o corrupto: se usa el respaldo
  games.sort((a, b) => a.iso.localeCompare(b.iso) || a.time.localeCompare(b.time));
  const meta: LiveScheduleMeta = {
    season,
    source: String(json?.source ?? 'basketball-reference.com'),
    fetchedAt: String(json?.fetchedAt ?? ''),
    total: games.length,
    played: games.filter((g) => g.played).length,
    dropped,
  };
  store[season] = { games, meta };
  return meta;
}

export function getLiveSchedule(season: string): RawScheduleItem[] | null {
  return store[season as LiveSeasonKey]?.games ?? null;
}

export function getLiveScheduleMeta(season: string): LiveScheduleMeta | null {
  return store[season as LiveSeasonKey]?.meta ?? null;
}

/** Descarga los JSON publicados junto a la app. Devuelve qué temporadas se cargaron. */
export async function loadLiveSchedules(): Promise<Record<LiveSeasonKey, LiveScheduleMeta | null>> {
  const base = (import.meta as any).env?.BASE_URL ?? './';
  const bust = Math.floor(Date.now() / 600000); // el caché de GitHub Pages dura ~10 min
  const out = { '2025-2026': null, '2026-2027': null } as Record<LiveSeasonKey, LiveScheduleMeta | null>;
  await Promise.all((Object.keys(FILES) as LiveSeasonKey[]).map(async (season) => {
    try {
      const res = await fetch(`${base}${FILES[season]}?v=${bust}`, { cache: 'no-cache' });
      if (!res.ok) return;
      out[season] = setLiveSchedule(season, await res.json());
    } catch (e) {
      console.warn(`[calendario] No se pudo cargar ${FILES[season]}:`, e);
    }
  }));
  return out;
}
