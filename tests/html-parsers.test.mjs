import test from 'node:test';
import assert from 'node:assert/strict';
import { findTable, parseTable, cell, uncomment } from '../scripts/lib/html.mjs';
import { parseScheduleHtml, parseMonthLinks, parseTime, phaseFromNote } from '../scripts/lib/schedule.mjs';
import { parseStandingsHtml } from '../scripts/lib/standings.mjs';
import { parsePlayers, collapsePlayers } from '../scripts/lib/players.mjs';
import { parseInjuriesHtml, statusFromDescription } from '../scripts/lib/injuries.mjs';
import { scheduleHtml, scheduleRow } from './helpers/synthetic.mjs';

const rows = [
  scheduleRow({ date: 'Tue, Oct 20, 2026', time: '3:00p', v: 'BOS', vp: 113, h: 'DET', hp: 121, box: '202610200DET', arena: 'Little Caesars Arena' }),
  `<tr class="thead"><th data-stat="date_game">Date</th></tr>`,
  scheduleRow({ date: 'Sat, Oct 24, 2026', time: '9:00p', v: 'NOP', vp: 135, h: 'DEN', hp: 141, box: '202610240DEN', ot: 'OT' }),
  scheduleRow({ date: 'Fri, Oct 30, 2026', time: '7:00p', v: 'CHO', vp: 79, h: 'WAS', hp: 95, box: '202610300WAS', note: 'NBA Cup' }),
  scheduleRow({ date: 'Wed, Nov 18, 2026', time: '10:00p', v: 'PHO', h: 'SAC' }),
  scheduleRow({ date: 'Wed, Dec 16, 2026', time: '12:30p', v: 'UTA', h: 'LAL', note: 'Emirates NBA Cup Quarterfinal' }),
];

test('html: destapa tablas dentro de comentarios y lee encabezados duplicados (PTS, PTS)', () => {
  const html = scheduleHtml(rows, { commented: true });
  assert.notEqual(uncomment(html), html);
  const t = parseTable(findTable(html, 'schedule'));
  assert.equal(t.headers.filter((h) => h.text === 'PTS').length, 2);
  assert.equal(cell(t, t.rows[0], undefined, 'PTS', 0).text, '113');
  assert.equal(cell(t, t.rows[0], undefined, 'PTS', 1).text, '121');
});

test('calendario: partidos jugados, pendientes, prórroga, notas y fases', () => {
  const g = parseScheduleHtml(scheduleHtml(rows));
  assert.equal(g.length, 5);
  assert.deepEqual([g[0].iso, g[0].time, g[0].visitor, g[0].home, g[0].vPts, g[0].hPts, g[0].played, g[0].box], ['2026-10-20', '15:00', 'BOS', 'DET', 113, 121, true, '202610200DET']);
  assert.equal(g[1].ot, 'OT');
  assert.deepEqual([g[2].visitor, g[2].note, g[2].phase], ['CHO', 'NBA Cup', 'regular']); // códigos nativos de BBR (sin traducir)
  assert.deepEqual([g[3].visitor, g[3].played, g[3].vPts, g[3].time], ['PHO', false, null, '22:00']);
  assert.deepEqual([g[4].time, g[4].phase], ['12:30', 'cup-knockout']);
});

test('calendario: también funciona cuando BBR envuelve la tabla en un comentario', () => {
  assert.equal(parseScheduleHtml(scheduleHtml(rows, { commented: true })).length, 5);
});

test('calendario: sin data-stat se apoya en los textos de encabezado', () => {
  const html = scheduleHtml(rows).replace(/ data-stat="[^"]*"/g, '');
  const g = parseScheduleHtml(html);
  assert.equal(g.length, 5);
  assert.deepEqual([g[0].visitor, g[0].vPts, g[0].hPts, g[0].home], ['BOS', 113, 121, 'DET']);
});

test('calendario: utilidades (hora, fases, enlaces de meses)', () => {
  assert.equal(parseTime('7:30p'), '19:30'); assert.equal(parseTime('12:00a'), '00:00'); assert.equal(parseTime('12:30p'), '12:30'); assert.equal(parseTime(''), null);
  assert.equal(phaseFromNote('Play-In Tournament'), 'play-in'); assert.equal(phaseFromNote('NBA Cup'), 'regular');
  assert.deepEqual(parseMonthLinks('<a href="/leagues/NBA_2027_games-november.html">x</a><a href="/leagues/NBA_2027_games-playoffs.html">p</a><a href="/leagues/NBA_2027_games-december.html">d</a>', 2027), ['november', 'december']);
});

test('posiciones: lee las dos conferencias', () => {
  const tbl = (id, teams) => `<table id="${id}"><thead><tr><th data-stat="team_name">Eastern Conference</th><th data-stat="wins">W</th><th data-stat="losses">L</th><th data-stat="win_loss_pct">W/L%</th></tr></thead><tbody>${teams.map(([c, w, l]) => `<tr><th data-stat="team_name"><a href="/teams/${c}/2027.html">${c}</a></th><td data-stat="wins">${w}</td><td data-stat="losses">${l}</td><td>.5</td></tr>`).join('')}</tbody></table>`;
  const s = parseStandingsHtml(tbl('confs_standings_E', [['PHI', 12, 3], ['BOS', 11, 3]]) + `<!--${tbl('confs_standings_W', [['SAS', 12, 2]])}-->`);
  assert.deepEqual(s, [{ team: 'PHI', conf: 'E', w: 12, l: 3 }, { team: 'BOS', conf: 'E', w: 11, l: 3 }, { team: 'SAS', conf: 'W', w: 12, l: 2 }]);
});

test('jugadores: promedia por jugador, usa el total de 2TM y el último equipo, y une avanzadas', () => {
  const head = (cols) => `<thead><tr><th>Rk</th><th>Player</th><th>Age</th><th>Team</th><th>Pos</th>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const row = (rk, name, id, team, vals) => `<tr><th>${rk}</th><td data-stat="name_display"><a href="/players/${id[0]}/${id}.html">${name}</a></td><td>27</td><td data-stat="team_name_abbr"><a href="/teams/${team}/2027.html">${team}</a></td><td>PG</td>${vals.map((v) => `<td>${v}</td>`).join('')}</tr>`;
  const pg = `<table id="per_game_stats">${head(['G', 'GS', 'MP', 'FG%', '3P%', 'FT%', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PTS'])}<tbody>`
    + row(1, 'Nikola Jokic', 'jokicni01', 'DEN', [14, 14, 34.1, '.570', '.400', '.850', 12.5, 10.1, 1.5, 0.8, 3.1, 28.4])
    + row(2, 'Jugador Viajero', 'viajju01', '2TM', [10, 5, 25.0, '.450', '.350', '.800', 4.0, 3.0, 1.0, 0.5, 2.0, 15.0])
    + row(2, 'Jugador Viajero', 'viajju01', 'LAL', [6, 1, 20.0, '.440', '.340', '.790', 3.0, 2.0, 1.0, 0.4, 2.0, 12.0])
    + row(2, 'Jugador Viajero', 'viajju01', 'SAC', [4, 4, 32.0, '.460', '.360', '.810', 5.5, 4.5, 1.0, 0.6, 2.0, 19.5]) + '</tbody></table>';
  const adv = `<table id="advanced">${head(['G', 'MP', 'PER', 'TS%', 'USG%', 'WS', 'BPM', 'VORP'])}<tbody>`
    + row(1, 'Nikola Jokic', 'jokicni01', 'DEN', [14, 478, 31.2, '.660', '31.0', 1.9, 11.5, 1.2]) + '</tbody></table>';
  const p = parsePlayers(pg, adv);
  assert.equal(p.length, 2);
  const j = p.find((x) => x.id === 'jokicni01');
  assert.deepEqual([j.ppg, j.rpg, j.apg, j.per, j.bpm, j.vorp, j.team], [28.4, 12.5, 10.1, 31.2, 11.5, 1.2, 'DEN']);
  const v = p.find((x) => x.id === 'viajju01');
  assert.deepEqual([v.team, v.ppg, v.g, v.per], ['SAC', 15, 10, null]);
  assert.equal(collapsePlayers([{ id: 'a', team: 'LAL' }]).length, 1);
});

test('lesiones: lee jugador, equipo, fecha y estado', () => {
  const html = `<table id="injuries"><thead><tr><th>Player</th><th>Team</th><th>Update</th><th>Description</th></tr></thead><tbody><tr><th data-stat="player"><a href="/players/b/balllam01.html">LaMelo Ball</a></th><td data-stat="team_name"><a href="/teams/CHO/2027.html">Charlotte Hornets</a></td><td data-stat="date_update">Tue, Nov 17, 2026</td><td data-stat="note">Out For Season (Ankle) - Ball will miss the remainder of the season.</td></tr></tbody></table>`;
  assert.deepEqual(parseInjuriesHtml(html), [{ playerId: 'balllam01', player: 'LaMelo Ball', team: 'CHO', updated: '2026-11-17', status: 'Out For Season', description: 'Out For Season (Ankle) - Ball will miss the remainder of the season.' }]);
  assert.equal(statusFromDescription('Day To Day (Knee) - x'), 'Day To Day');
});
