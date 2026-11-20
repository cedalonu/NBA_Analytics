#!/usr/bin/env node
/**
 * Descarga de Basketball-Reference → site/data/*.json
 *   node scripts/fetch-data.mjs                      # últimas 4 temporadas + standings/jugadores/lesiones de la actual
 *   node scripts/fetch-data.mjs --seasons 2027       # solo esa temporada (año en que termina)
 *   node scripts/fetch-data.mjs --force              # vuelve a bajar también temporadas completas
 *   node scripts/fetch-data.mjs --only injuries      # schedule | standings | players | injuries
 * Respeta 20 solicitudes/min. Si algo falla conserva el archivo anterior y lo anota en manifest.json (errors).
 */
import path from 'node:path';
import { createClient, BASE } from './lib/http.mjs';
import { fetchSeasonSchedule, seasonLabel } from './lib/schedule.mjs';
import { parseStandingsHtml } from './lib/standings.mjs';
import { parsePlayers } from './lib/players.mjs';
import { parseInjuriesHtml } from './lib/injuries.mjs';
import { DATA_DIR, readJson, writeJsonIfChanged } from './lib/io.mjs';

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const force = args.includes('--force');
const only = arg('--only');
const want = (t) => !only || only === t;

const now = new Date();
const currentEnd = now.getUTCMonth() >= 8 ? now.getUTCFullYear() + 1 : now.getUTCFullYear(); // desde septiembre ya es la siguiente temporada
const seasons = arg('--seasons') ? arg('--seasons').split(',').map(Number) : [currentEnd - 3, currentEnd - 2, currentEnd - 1, currentEnd];
const nowIso = now.toISOString();
const etDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now);

const log = (m) => console.log(m);
const client = createClient({ log });
const errors = [];
let changed = false;

const isComplete = (d) => {
  const reg = (d?.games ?? []).filter((g) => g.phase === 'regular');
  return reg.length >= 1200 && reg.every((g) => g.played);
};

for (const endYear of seasons) {
  if (!want('schedule')) break;
  const file = path.join(DATA_DIR, `schedule-${endYear}.json`);
  const existing = await readJson(file);
  if (existing && !force && endYear < currentEnd && isComplete(existing)) { log(`\n== ${seasonLabel(endYear)}: ya está completa, se omite.`); continue; }
  log(`\n== Calendario ${seasonLabel(endYear)} ==`);
  try {
    const data = await fetchSeasonSchedule(client, endYear, log);
    data.fetchedAt = nowIso;
    log(`  total ${data.counts.total} | jugados ${data.counts.played} | temporada regular ${data.counts.regular}`);
    if (Object.keys(data.counts.notes).length) log(`  notas vistas: ${JSON.stringify(data.counts.notes)}`);
    if (await writeJsonIfChanged(file, data)) { changed = true; log('  → guardado'); } else log('  sin cambios');
  } catch (e) { errors.push({ task: `schedule-${endYear}`, message: e.message }); console.error('  ERROR:', e.message); }
}

if (want('standings')) {
  log(`\n== Posiciones ${seasonLabel(currentEnd)} ==`);
  try {
    const teams = parseStandingsHtml(await client.get(`/leagues/NBA_${currentEnd}_standings.html`));
    if (teams.length < 30) throw new Error(`Se leyeron ${teams.length} equipos de las posiciones (se esperaban 30).`);
    const out = { season: seasonLabel(currentEnd), source: `${BASE}/leagues/NBA_${currentEnd}_standings.html`, fetchedAt: nowIso, teams };
    if (await writeJsonIfChanged(path.join(DATA_DIR, `standings-${currentEnd}.json`), out)) { changed = true; log('  → guardado'); } else log('  sin cambios');
  } catch (e) { errors.push({ task: 'standings', message: e.message }); console.error('  ERROR:', e.message); }
}

if (want('players')) {
  log(`\n== Jugadores ${seasonLabel(currentEnd)} ==`);
  try {
    const perGame = await client.get(`/leagues/NBA_${currentEnd}_per_game.html`);
    const advanced = await client.get(`/leagues/NBA_${currentEnd}_advanced.html`);
    const players = parsePlayers(perGame, advanced);
    if (players.length < 150) throw new Error(`Se leyeron ${players.length} jugadores (se esperaban más de 150).`);
    const out = { season: seasonLabel(currentEnd), source: `${BASE}/leagues/NBA_${currentEnd}_per_game.html`, fetchedAt: nowIso, players };
    if (await writeJsonIfChanged(path.join(DATA_DIR, `players-${currentEnd}.json`), out)) { changed = true; log(`  → guardado (${players.length} jugadores)`); } else log('  sin cambios');
  } catch (e) { errors.push({ task: 'players', message: e.message }); console.error('  ERROR:', e.message); }
}

if (want('injuries')) {
  log('\n== Lesiones ==');
  try {
    const injuries = parseInjuriesHtml(await client.get('/friv/injuries.fcgi'));
    const out = { source: `${BASE}/friv/injuries.fcgi`, fetchedAt: nowIso, injuries };
    if (await writeJsonIfChanged(path.join(DATA_DIR, 'injuries.json'), out)) { changed = true; log(`  → guardado (${injuries.length} registros)`); } else log('  sin cambios');
    // Historial diario: permitirá validar con backtesting si las lesiones aportan al modelo.
    await writeJsonIfChanged(path.join(DATA_DIR, 'injuries-history', `${etDate}.json`), { date: etDate, injuries });
  } catch (e) { errors.push({ task: 'injuries', message: e.message }); console.error('  ERROR:', e.message); }
}

// manifest
const prev = await readJson(path.join(DATA_DIR, 'manifest.json'));
const available = [];
for (const y of [...new Set([...(prev?.seasons ?? []), ...seasons])]) if (await readJson(path.join(DATA_DIR, `schedule-${y}.json`))) available.push(y);
available.sort();
const manifest = {
  version: '2.0',
  currentSeason: currentEnd,
  seasons: available,
  updatedAt: changed ? nowIso : prev?.updatedAt ?? nowIso,
  errors: errors.length ? errors : (only ? prev?.errors ?? [] : []),
};
await writeJsonIfChanged(path.join(DATA_DIR, 'manifest.json'), manifest, []);
console.log(`\nListo. Temporadas disponibles: ${available.join(', ') || 'ninguna'}${errors.length ? ` | ${errors.length} error(es)` : ''}`);
if (!available.includes(currentEnd)) { console.error(`No hay calendario de la temporada actual (${currentEnd}).`); process.exitCode = 1; }
