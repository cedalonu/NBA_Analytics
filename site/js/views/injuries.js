import { esc, fix, tname, chip, sourceNote } from './shared.js';

const level = (i) => (/out for season/i.test(i.status) ? 'error' : /^out/i.test(i.status) ? 'error' : /day|quest|doubt/i.test(i.status) ? 'warn' : 'info');

export function render(ctx) {
  const inj = ctx.injuries;
  if (!inj?.injuries) return '<div class="card"><p class="muted">Aún no hay reporte de lesiones (ejecuta el workflow o <code>npm run fetch</code>).</p></div>';
  const teams = [...ctx.injuriesByTeam.keys()].sort((a, b) => ctx.teamNames[a].localeCompare(ctx.teamNames[b]));
  const cards = teams.map((t) => {
    const rows = ctx.injuriesByTeam.get(t).map((i) => {
      const st = ctx.playerById.get(i.playerId);
      const stat = st ? `<span class="muted"> · ${fix(st.ppg)} pts, ${fix(st.mpg)} min</span>` : '';
      return `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b>${esc(i.player)}</b> ${chip(level(i), i.status || 'Reporte')}${stat}<div class="muted" style="font-size:12.5px">${esc(i.description)}${i.updated ? ` · ${esc(i.updated)}` : ''}</div></div>`;
    }).join('');
    return `<div class="card"><h3>${tname(t)}</h3>${rows}</div>`;
  }).join('');
  return `<p class="muted">${esc(inj.injuries.length)} registro(s). ${sourceNote(inj)}. Se guarda una copia diaria en <code>data/injuries-history</code> para poder validar el efecto de las lesiones en el modelo.</p><div class="grid g2">${cards || '<div class="card"><p class="muted">No hay lesiones reportadas.</p></div>'}</div>`;
}
