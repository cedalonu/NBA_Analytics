// Cliente HTTP con límite de frecuencia (Sports Reference permite ~20 solicitudes por minuto).
export const BASE = process.env.BBR_BASE ?? 'https://www.basketball-reference.com'; // BBR_BASE solo se usa en las pruebas
const UA = 'NBA-Analytics-2.0 (proyecto personal de analitica; max 20 solicitudes/min)';

export function createClient({ minIntervalMs = Number(process.env.BBR_MIN_INTERVAL_MS ?? 3500), fetchImpl = globalThis.fetch, sleepImpl, log = () => {} } = {}) {
  const sleep = sleepImpl ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  let last = 0;
  return {
    async get(path) {
      const url = path.startsWith('http') ? path : BASE + path;
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        const wait = last + minIntervalMs - Date.now();
        if (wait > 0) await sleep(wait);
        last = Date.now();
        try {
          const res = await fetchImpl(url, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
          if (res.ok) return await res.text();
          if (res.status === 403) throw Object.assign(new Error(`HTTP 403 en ${url}: Basketball-Reference bloqueó la solicitud (¿IP de servidor?). Ejecuta "npm run fetch" desde tu computadora y sube site/data.`), { fatal: true });
          if (res.status === 404) throw Object.assign(new Error(`HTTP 404 en ${url}`), { fatal: true });
          lastError = new Error(`HTTP ${res.status} en ${url}`);
          if (res.status === 429) await sleep(attempt * 20000);
        } catch (e) {
          if (e.fatal) throw e;
          lastError = e;
        }
        log(`  reintento ${attempt}/3: ${lastError.message}`);
        await sleep(attempt * 3000);
      }
      throw lastError;
    },
  };
}
