// Utilidades para leer tablas HTML de Basketball-Reference sin dependencias.
export function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}
export const stripTags = (h) => decode(String(h).replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
export const attr = (attrs, name) => new RegExp(`\\b${name}="([^"]*)"`, 'i').exec(attrs)?.[1];

/** BBR a veces deja tablas dentro de comentarios HTML; las "destapa". */
export const uncomment = (html) => html.replace(/<!--([\s\S]*?)-->/g, '$1');

function sliceTable(html, start) {
  const end = html.indexOf('</table>', start);
  return html.slice(start, end < 0 ? undefined : end + 8);
}

/** Busca una tabla por id; si no existe prueba dentro de los comentarios. */
export function findTable(html, id) {
  const re = new RegExp(`<table\\b[^>]*\\bid="${id}"[^>]*>`, 'i');
  const m = re.exec(html);
  if (m) return sliceTable(html, m.index);
  const un = uncomment(html);
  if (un === html) return null;
  const m2 = re.exec(un);
  return m2 ? sliceTable(un, m2.index) : null;
}

/** Busca la primera tabla cuyos encabezados incluyen todos los textos pedidos (respaldo si cambia el id). */
export function findTableByHeaders(html, required) {
  for (const source of [html, uncomment(html)]) {
    for (const m of source.matchAll(/<table\b[^>]*>/gi)) {
      const t = sliceTable(source, m.index);
      const heads = parseTable(t).headers.map((h) => h.text);
      if (required.every((r) => heads.includes(r))) return t;
    }
  }
  return null;
}

export function findAnyTable(html, ids, requiredHeaders) {
  for (const id of ids) { const t = findTable(html, id); if (t) return t; }
  return requiredHeaders ? findTableByHeaders(html, requiredHeaders) : null;
}

const CELL = /<(th|td)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
export function parseTable(tableHtml) {
  const thead = /<thead\b[^>]*>([\s\S]*?)<\/thead>/i.exec(tableHtml)?.[1] ?? '';
  const hrs = [...thead.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const hr = hrs.length ? hrs[hrs.length - 1][1] : '';
  const headers = [...hr.matchAll(CELL)].map((m) => ({ stat: attr(m[2], 'data-stat'), text: stripTags(m[3]) }));
  const body = /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i.exec(tableHtml)?.[1] ?? tableHtml.replace(thead, '');
  const rows = [];
  for (const rm of body.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi)) {
    if (/\b(thead|spacer|over_header)\b/i.test(rm[1])) continue;
    const cells = [...rm[2].matchAll(CELL)].map((m) => ({ stat: attr(m[2], 'data-stat'), html: m[3], text: stripTags(m[3]) }));
    if (cells.length) rows.push({ cells });
  }
  return { headers, rows };
}

/** Celda de una fila: primero por data-stat y, si no existe, por el texto del encabezado (n-ésima aparición). */
export function cell(table, row, stats, header, nth = 0) {
  for (const s of [].concat(stats ?? [])) {
    const c = row.cells.find((x) => x.stat === s);
    if (c) return c;
  }
  if (header !== undefined) {
    const idx = table.headers.map((h, i) => (h.text === header ? i : -1)).filter((i) => i >= 0);
    if (idx[nth] !== undefined) return row.cells[idx[nth]];
  }
  return undefined;
}
export const num = (t) => { const x = parseFloat(String(t ?? '').replace(/,/g, '')); return Number.isFinite(x) ? x : null; };
