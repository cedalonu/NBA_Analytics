// Carga de datos publicados en site/data (generados por scripts/fetch-data.mjs y scripts/build-model.mjs).
const bust = Math.floor(Date.now() / 300000); // el caché de GitHub Pages dura unos minutos
async function getJson(path) {
  try {
    const r = await fetch(`data/${path}?v=${bust}`, { cache: 'no-cache' });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

export async function loadAll() {
  const manifest = await getJson('manifest.json');
  if (!manifest || !manifest.seasons?.length) return { empty: true, manifest };
  const schedules = {};
  await Promise.all(manifest.seasons.map(async (y) => { const d = await getJson(`schedule-${y}.json`); if (d) schedules[y] = d; }));
  const cur = manifest.currentSeason;
  const [standings, players, injuries, model] = await Promise.all([
    getJson(`standings-${cur}.json`), getJson(`players-${cur}.json`), getJson('injuries.json'), getJson('model.json'),
  ]);
  return { empty: false, manifest, schedules, standings, players, injuries, model };
}
