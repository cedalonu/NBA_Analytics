import { esc, fix, pct, table, tname, chip, sourceNote } from './shared.js';

function conf(rows, c, bbr) {
  const r = rows.filter((x) => x.conf === c);
  const hdr = ['#', '~Equipo', 'G', 'P', 'PCT', 'Local', 'Visita', 'U10', 'Racha', 'PF', 'PC', 'DIF'].concat(bbr ? ['BBR'] : []);
  const html = r.map((x, i) => {
    const b = bbr?.get(x.team);
    const cell = b ? (b.w === x.w && b.l === x.l ? chip('ok', `${b.w}-${b.l} ✓`) : chip('error', `${b.w}-${b.l} ≠`)) : '';
    return `<tr><td>${i + 1}</td><td class="l">${tname(x.team)}</td><td>${x.w}</td><td>${x.l}</td><td>${fix(x.pct, 3)}</td><td>${x.home}</td><td>${x.away}</td><td>${x.last10}</td><td>${x.streak}</td><td>${fix(x.ppg)}</td><td>${fix(x.oppg)}</td><td>${x.mov >= 0 ? '+' : ''}${fix(x.mov)}</td>${bbr ? `<td>${cell}</td>` : ''}</tr>`;
  });
  return `<div class="card"><h3>Conferencia ${c === 'E' ? 'Este' : 'Oeste'}</h3>${table(hdr, html)}</div>`;
}

export function render(ctx) {
  const bbr = ctx.bbrStandings ? new Map(ctx.bbrStandings.teams.map((t) => [t.team, t])) : null;
  const played = ctx.games.filter((g) => g.played && (g.phase === 'regular' || !g.phase)).length;
  return `<p class="muted">Calculadas a partir de los ${played} resultados de temporada regular${bbr ? ' y comparadas con las posiciones oficiales de Basketball-Reference (columna BBR)' : ''}. ${bbr ? sourceNote(ctx.bbrStandings) : ''}</p>
  <div class="grid g2">${conf(ctx.standingsCalc, 'E', bbr)}${conf(ctx.standingsCalc, 'W', bbr)}</div>`;
}
