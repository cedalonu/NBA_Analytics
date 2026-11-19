import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA_DIR = process.env.NBA_DATA_DIR ?? path.join(ROOT, 'site', 'data');

export async function readJson(file) {
  if (!existsSync(file)) return null;
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return null; }
}

const strip = (o, ignore) => JSON.stringify(o, (k, v) => (ignore.includes(k) ? undefined : v));

/** Escribe el JSON solo si cambió (ignorando campos de marca de tiempo) para no generar commits vacíos. */
export async function writeJsonIfChanged(file, obj, ignore = ['fetchedAt', 'generatedAt']) {
  const prev = await readJson(file);
  if (prev && strip(prev, ignore) === strip(obj, ignore)) return false;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(obj) + '\n');
  return true;
}
