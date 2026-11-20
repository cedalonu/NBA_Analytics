import { esc, fix, pct } from '../core/util.js';
import { TEAMS } from '../core/teams.js';

export const gameKey = (g) => `${g.iso}|${g.visitor}|${g.home}`;
export const tname = (c) => esc(TEAMS[c]?.name ?? c);
export const chip = (status, text) => `<span class="chip ${esc(status)}">${esc(text)}</span>`;
export const STATUS_LABEL = { ok: 'OK', warn: 'Aviso', error: 'Error', info: 'Info' };
export const sourceNote = (obj) => (obj?.fetchedAt ? `Fuente: <a href="${esc(obj.source)}" target="_blank" rel="noopener">Basketball-Reference</a> · ${new Date(obj.fetchedAt).toLocaleString('es-MX')}` : 'Fuente: Basketball-Reference');
export { esc, fix, pct };

export function table(headers, rows, { cls = '' } = {}) {
  return `<div class="tblwrap"><table class="${cls}"><thead><tr>${headers.map((h, i) => (String(h).startsWith('~') ? `<th class="l">${String(h).slice(1)}</th>` : `<th${i === 0 ? ' class="l"' : ''}>${h}</th>`)).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}
