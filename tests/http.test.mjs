import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '../scripts/lib/http.mjs';

const res = (status, body = '') => ({ ok: status >= 200 && status < 300, status, text: async () => body });

test('http: reintenta errores 5xx y respeta el intervalo entre solicitudes', async () => {
  const sleeps = []; let calls = 0;
  const c = createClient({ minIntervalMs: 3500, sleepImpl: async (ms) => { sleeps.push(ms); }, fetchImpl: async () => (++calls === 1 ? res(503) : res(200, 'ok')) });
  assert.equal(await c.get('/x'), 'ok');
  assert.equal(calls, 2);
  assert.ok(sleeps.length >= 1);
});

test('http: un 403 no se reintenta y explica qué hacer', async () => {
  let calls = 0;
  const c = createClient({ sleepImpl: async () => {}, fetchImpl: async () => { calls++; return res(403); } });
  await assert.rejects(c.get('/x'), /403.*npm run fetch/s);
  assert.equal(calls, 1);
});

test('http: tres fallos seguidos terminan en error', async () => {
  const c = createClient({ sleepImpl: async () => {}, fetchImpl: async () => res(500) });
  await assert.rejects(c.get('/x'), /HTTP 500/);
});
