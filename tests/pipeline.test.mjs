// Prueba de punta a punta: un servidor local imita las páginas de Basketball-Reference y se ejecutan
// fetch-data.mjs y build-model.mjs reales contra él.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawnSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSeasons } from './helpers/synthetic.mjs';
import { scheduleHtml, scheduleRow } from './helpers/synthetic.mjs';
import { computeStandings } from '../site/js/core/standings.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pagesFor(seasons) {
  const pages = {};
  for (const s of seasons) {
    const by = {};
    for (const g of s.games) { const mo = MONTHS[+g.iso.slice(5, 7) - 1]; (by[mo] ??= []).push(g); }
    const order = ['october', 'november', 'december', 'january', 'february', 'march', 'april'].filter((m) => by[m]);
    const html = (list) => scheduleHtml(list.map((g) => {
      const d = new Date(g.iso + 'T00:00:00Z');
      const [h, m] = g.time.split(':');
      return scheduleRow({ date: `${DOW[d.getUTCDay()]}, ${MON3[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`, time: `${+h % 12 || 12}:${m}${+h >= 12 ? 'p' : 'a'}`, v: g.visitor, vp: g.vPts, h: g.home, hp: g.hPts, year: s.endYear });
    }));
    const links = order.map((m) => `<a href="/leagues/NBA_${s.endYear}_games-${m}.html">${m}</a>`).join('');
    pages[`/leagues/NBA_${s.endYear}_games.html`] = html(by.october).replace('<body>', `<body>${links}`);
    for (const m of order.slice(1)) pages[`/leagues/NBA_${s.endYear}_games-${m}.html`] = html(by[m]);
  }
  const cur = seasons[seasons.length - 1];
  const st = computeStandings(cur.games);
  const stRow = (r) => `<tr><th data-stat="team_name"><a href="/teams/${r.team}/${cur.endYear}.html">${r.team}</a></th><td data-stat="wins">${r.w}</td><td data-stat="losses">${r.l}</td><td>.500</td></tr>`;
  const stTbl = (id, rows) => `<table id="${id}"><thead><tr><th data-stat="team_name">Conf</th><th data-stat="wins">W</th><th data-stat="losses">L</th><th>W/L%</th></tr></thead><tbody>${rows.map(stRow).join('')}</tbody></table>`;
  pages[`/leagues/NBA_${cur.endYear}_standings.html`] = stTbl('confs_standings_E', st.filter((r) => r.conf === 'E')) + `<!--${stTbl('confs_standings_W', st.filter((r) => r.conf === 'W'))}-->`;
  const prow = (i, cols, vals) => `<tr><th>${i}</th><td data-stat="name_display"><a href="/players/x/pl${i}x01.html">Jugador ${i}</a></td><td>25</td><td data-stat="team_name_abbr"><a href="/teams/BOS/${cur.endYear}.html">BOS</a></td><td>G</td>${vals.map((v) => `<td>${v}</td>`).join('')}</tr>`;
  const ptbl = (id, cols, mk) => `<table id="${id}"><thead><tr><th>Rk</th><th>Player</th><th>Age</th><th>Team</th><th>Pos</th>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: 200 }, (_, i) => prow(i + 1, cols, mk(i))).join('')}</tbody></table>`;
  pages[`/leagues/NBA_${cur.endYear}_per_game.html`] = ptbl('per_game_stats', ['G', 'GS', 'MP', 'FG%', '3P%', 'FT%', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PTS'], (i) => [10, 5, 30, '.450', '.350', '.800', 5, 4, 1, 0.5, 2, 30 - i / 10]);
  pages[`/leagues/NBA_${cur.endYear}_advanced.html`] = ptbl('advanced', ['G', 'MP', 'PER', 'TS%', 'USG%', 'WS', 'BPM', 'VORP'], (i) => [10, 300, 20 - i / 20, '.580', '22', 1.5, 2.5, 0.8]);
  pages['/friv/injuries.fcgi'] = `<table id="injuries"><thead><tr><th>Player</th><th>Team</th><th>Update</th><th>Description</th></tr></thead><tbody><tr><th data-stat="player"><a href="/players/x/pl1x01.html">Jugador 1</a></th><td data-stat="team_name"><a href="/teams/BOS/${cur.endYear}.html">Boston Celtics</a></td><td data-stat="date_update">Tue, Nov 17, 2026</td><td data-stat="note">Out (Knee) - prueba</td></tr></tbody></table>`;
  return pages;
}

const run = (script, env, args = []) => new Promise((resolve) => {
  const p = spawn(process.execPath, [path.join(ROOT, 'scripts', script), ...args], { env: { ...process.env, ...env } });
  let out = ''; p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (out += d));
  p.on('close', (code) => resolve({ code, out }));
});

test('pipeline completo: descarga → archivos JSON → modelo (servidor local que imita a BBR)', async () => {
  const seasons = makeSeasons(2, '2026-11-17', 21).map((s, i) => ({ ...s, endYear: 2026 + i }));
  const pages = pagesFor(seasons);
  const server = http.createServer((req, res) => {
    const p = req.url.split('?')[0];
    if (pages[p]) { res.writeHead(200, { 'Content-Type': 'text/html' }).end(pages[p]); } else { res.writeHead(404).end('no'); }
  });
  await new Promise((r) => server.listen(0, r));
  const dir = mkdtempSync(path.join(tmpdir(), 'nba-data-'));
  const env = { BBR_BASE: `http://127.0.0.1:${server.address().port}`, BBR_MIN_INTERVAL_MS: '0', NBA_DATA_DIR: dir };
  try {
    const a = await run('fetch-data.mjs', env, ['--seasons', '2026,2027']);
    assert.equal(a.code, 0, a.out);
    const manifest = JSON.parse(readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    assert.deepEqual(manifest.seasons, [2026, 2027]);
    assert.deepEqual(manifest.errors, []);
    const s27 = JSON.parse(readFileSync(path.join(dir, 'schedule-2027.json'), 'utf8'));
    assert.equal(s27.games.length, 1230);
    assert.equal(s27.games.filter((g) => g.played).length, seasons[1].games.filter((g) => g.played).length);
    assert.equal(s27.games[0].visitor.length, 3);
    assert.equal(JSON.parse(readFileSync(path.join(dir, 'standings-2027.json'), 'utf8')).teams.length, 30);
    assert.equal(JSON.parse(readFileSync(path.join(dir, 'players-2027.json'), 'utf8')).players.length, 200);
    assert.equal(JSON.parse(readFileSync(path.join(dir, 'injuries.json'), 'utf8')).injuries[0].status, 'Out');
    assert.ok(readdirSync(path.join(dir, 'injuries-history')).length === 1);

    // segunda corrida: temporada 2026 completa se omite o no cambia; no se reescribe nada
    const before = readFileSync(path.join(dir, 'schedule-2027.json'), 'utf8');
    const b = await run('fetch-data.mjs', env, ['--seasons', '2026,2027']);
    assert.equal(b.code, 0, b.out);
    assert.equal(readFileSync(path.join(dir, 'schedule-2027.json'), 'utf8'), before, 'sin cambios no debe reescribirse (evita commits vacíos)');

    const m = await run('build-model.mjs', env);
    assert.equal(m.code, 0, m.out);
    const model = JSON.parse(readFileSync(path.join(dir, 'model.json'), 'utf8'));
    assert.ok(model.test.n > 0 && model.params.k > 0);

    // si BBR falla (404) se conservan los datos anteriores y el error queda anotado
    server.removeAllListeners('request');
    server.on('request', (req, res) => res.writeHead(404).end('no'));
    const c = await run('fetch-data.mjs', env, ['--seasons', '2027', '--force']);
    const mf = JSON.parse(readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    assert.ok(mf.errors.length >= 1, c.out);
    assert.equal(readFileSync(path.join(dir, 'schedule-2027.json'), 'utf8'), before);
  } finally { server.close(); }
});
