// Genera un sitio de PRUEBA (datos sintéticos) en un directorio temporal para verificar la interfaz en un navegador.
import { cpSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { makeSeasons, rng } from './synthetic.mjs';
import { computeStandings } from '../../site/js/core/standings.js';
import { tuneAndEvaluate } from '../../site/js/core/backtest.js';
import { TEAM_CODES } from '../../site/js/core/teams.js';

export function makeFixtureSite(out, today = '2026-11-17') {
  rmSync(out, { recursive: true, force: true });
  cpSync(new URL('../../site/', import.meta.url), out, { recursive: true });
  const data = path.join(out, 'data'); mkdirSync(data, { recursive: true });
  const seasons = makeSeasons(4, today);
  const w = (f, o) => writeFileSync(path.join(data, f), JSON.stringify(o));
  const fetchedAt = new Date().toISOString();
  for (const s of seasons) w(`schedule-${s.endYear}.json`, { season: `${s.endYear - 1}-${String(s.endYear).slice(2)}`, endYear: s.endYear, source: 'https://example.test/sintetico', fetchedAt, counts: {}, games: s.games });
  const cur = seasons[3];
  w('standings-2027.json', { season: '2026-27', source: 'https://example.test/standings', fetchedAt, teams: computeStandings(cur.games).map((r) => ({ team: r.team, conf: r.conf, w: r.w, l: r.l })) });
  const r = rng(3);
  const players = Array.from({ length: 300 }, (_, i) => ({ id: `p${i}`, name: `Jugador Prueba ${i}`, team: TEAM_CODES[i % 30], age: 20 + (i % 15), pos: 'G', g: 10 + (i % 5), gs: 5, mpg: 15 + r() * 20, fgp: 0.45, tpp: 0.35, ftp: 0.8, rpg: r() * 10, apg: r() * 8, spg: r() * 2, bpg: r() * 2, tov: 2, ppg: r() * 30, per: 10 + r() * 20, ts: 0.55, usg: 20, ws: r() * 3, bpm: r() * 8 - 2, vorp: r() * 2 }));
  w('players-2027.json', { season: '2026-27', source: 'https://example.test/players', fetchedAt, players });
  w('injuries.json', { source: 'https://example.test/injuries', fetchedAt, injuries: [{ playerId: 'p3', player: 'Jugador Prueba 3', team: TEAM_CODES[3], updated: today, status: 'Out', description: 'Out (Knee) - prueba' }, { playerId: 'p10', player: 'Jugador Prueba 10', team: TEAM_CODES[10], updated: today, status: 'Day To Day', description: 'Day To Day (Ankle) - prueba' }] });
  const model = tuneAndEvaluate(seasons.map((s) => ({ key: String(s.endYear), games: s.games })), { passes: 1 });
  w('model.json', { version: '2.0', generatedAt: fetchedAt, seasons: seasons.map((s) => String(s.endYear)), ...model });
  w('manifest.json', { version: '2.0', currentSeason: 2027, seasons: [2024, 2025, 2026, 2027], updatedAt: fetchedAt, errors: [] });
  return out;
}
if (process.argv[1] === new URL(import.meta.url).pathname) { makeFixtureSite(process.argv[2] ?? '/tmp/nba2-fixture'); console.log('fixture listo'); }
