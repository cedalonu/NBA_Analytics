#!/usr/bin/env node
// Servidor estático mínimo para ver el sitio en local: npm run dev → http://localhost:8080
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './lib/io.mjs';

const SITE = path.join(ROOT, 'site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
const port = Number(process.env.PORT) || 8080;
createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(SITE, url === '/' ? 'index.html' : url));
  if (!file.startsWith(SITE)) { res.writeHead(403).end(); return; }
  try { const buf = await readFile(file); res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(buf); }
  catch { res.writeHead(404).end('No encontrado'); }
}).listen(port, () => console.log(`NBA Analytics 2.0 en http://localhost:${port}`));
