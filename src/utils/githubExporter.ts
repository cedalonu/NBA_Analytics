import { Game, TeamSeasonStats, TrainingComparison, SeasonKey } from '../types/nba';

export function exportStandaloneHtml(
  games: Game[], 
  standings: TeamSeasonStats[], 
  trainingData?: TrainingComparison,
  season: SeasonKey = '2026-2027'
): void {
  const verifiedCount = games.filter((g) => g.verified).length;
  const hits = games.filter((g) => g.prediction.correctWinner).length;
  const accuracy = Math.round((hits / games.length) * 1000) / 10;
  const atsHits = games.filter((g) => g.prediction.spreadCovered).length;
  const atsAccuracy = Math.round((atsHits / games.length) * 1000) / 10;

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NBA ${season} Analytics & Predictive Model - Basketball-Reference</title>
  <meta name="description" content="Dashboard analítico y modelo predictivo optimizado de la NBA temporada ${season} con estadísticas de jugadores, bajas médicas y métricas al momento de cada partido.">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;700;800&display=swap');
    :root {
      --bg: #08080c;
      --surface: #12121a;
      --surface-2: #1a1a26;
      --surface-3: #232333;
      --border: #28283a;
      --text: #f5f5f7;
      --text-dim: #8e8ea6;
      --text-faint: #595973;
      --green: #22ff66;
      --green-bg: rgba(34,255,102,0.12);
      --green-border: rgba(34,255,102,0.35);
      --accent: #d6ff00;
      --red: #ff3b3b;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
    }
    h1, h2, h3, h4 {
      font-family: 'Space Grotesk', sans-serif;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 10px; }
  </style>
</head>
<body class="min-h-screen">
  <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
    
    <!-- Top Header -->
    <header class="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#12121a] border border-[#28283a] shadow-xl">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(34,255,102,0.12)] border border-[rgba(34,255,102,0.35)] text-[#22ff66] text-xs font-bold tracking-widest uppercase mb-2">
          ● Basketball-Reference • Modelo Optimizado ML v3.0 (${season})
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-white">NBA Analytics &amp; Predictive Engine ${season}</h1>
        <p class="text-sm text-[#8e8ea6] mt-1 max-w-2xl">
          ${season === '2026-2027' 
            ? 'Versión en producción con plantillas actualizadas, traspasos confirmados, novatos estelares y Overlap Bayesiano con el respaldo 2025-2026.' 
            : 'Respaldo histórico oficial verificado con Basketball-Reference (1,230 partidos y estadísticas cronológicas).'}
        </p>
      </div>

      <div class="flex gap-3 flex-wrap">
        <div class="p-3.5 rounded-xl bg-[#1a1a26] border border-[#28283a] text-center min-w-[110px]">
          <span class="text-[10px] text-[#8e8ea6] block uppercase tracking-wider">Partidos Reales</span>
          <span class="text-2xl font-bold text-white">${games.length}</span>
        </div>
        <div class="p-3.5 rounded-xl bg-[#1a1a26] border border-[#28283a] text-center min-w-[110px]">
          <span class="text-[10px] text-[#8e8ea6] block uppercase tracking-wider">Acierto Ganador</span>
          <span class="text-2xl font-bold text-[#22ff66]">${accuracy}%</span>
        </div>
        <div class="p-3.5 rounded-xl bg-[#1a1a26] border border-[#28283a] text-center min-w-[110px]">
          <span class="text-[10px] text-[#8e8ea6] block uppercase tracking-wider">Cubierto Spread</span>
          <span class="text-2xl font-bold text-[#d6ff00]">${atsAccuracy}%</span>
        </div>
      </div>
    </header>

    ${trainingData ? `
    <!-- Training & Optimization Summary -->
    <div class="p-6 rounded-2xl bg-[#12121a] border border-[#28283a] space-y-4">
      <div class="flex items-center justify-between border-b border-[#28283a] pb-3">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          ⚡ Optimización del Modelo: Comparativa de Rendimiento
        </h2>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-[rgba(34,255,102,0.12)] text-[#22ff66] font-bold">
          +${Math.round((trainingData.optimizedAccuracy - trainingData.baselineAccuracy) * 10) / 10}% Incremento de Acierto
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-[#1a1a26] border border-white/5 space-y-1">
          <span class="text-xs text-[#8e8ea6] block">Modelo Base (Sin Bajas ni Jugadores)</span>
          <div class="text-xl font-bold text-red-400 font-mono">${trainingData.baselineAccuracy}% Acierto</div>
          <span class="text-[11px] text-[#595973] block">ATS: ${trainingData.baselineAts}% • MAE: ${trainingData.baselineMae} pts</span>
        </div>
        <div class="p-4 rounded-xl bg-[#1a1a26] border border-[rgba(34,255,102,0.35)] bg-[rgba(34,255,102,0.05)] space-y-1">
          <span class="text-xs text-[#22ff66] block font-bold">Modelo Optimizado (ML v3.0)</span>
          <div class="text-xl font-bold text-[#22ff66] font-mono">${trainingData.optimizedAccuracy}% Acierto</div>
          <span class="text-[11px] text-[#8e8ea6] block">ATS: ${trainingData.optimizedAts}% • MAE: ${trainingData.optimizedMae} pts</span>
        </div>
        <div class="p-4 rounded-xl bg-[#1a1a26] border border-white/5 space-y-1">
          <span class="text-xs text-[#8e8ea6] block">Aporte de Características Entrenadas</span>
          <div class="text-xs font-mono text-white mt-1">
            • Bajas Médicas: +${trainingData.injuryAccuracyImpact}%<br />
            • Calidad de Jugadores: +${trainingData.playerStatsImpact}%
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Verified Games Table -->
    <div class="rounded-2xl bg-[#12121a] border border-[#28283a] p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Partidos Oficiales y Proyecciones (${games.length})</h2>
        <span class="text-xs text-[#8e8ea6]">Basketball-Reference Oficial 2025-2026</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="border-b border-[#28283a] bg-[#1a1a26] text-[#8e8ea6]">
            <tr>
              <th class="p-3">Fecha</th>
              <th class="p-3">Visitante</th>
              <th class="p-3 text-right">PTS</th>
              <th class="p-3 text-center">@</th>
              <th class="p-3 text-left">PTS</th>
              <th class="p-3">Local</th>
              <th class="p-3 text-center">Bajas Médicas</th>
              <th class="p-3 text-center">Predicción Ganador</th>
              <th class="p-3 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${games.map((g) => {
              const totalInjs = (g.visitorInjuries?.length || 0) + (g.homeInjuries?.length || 0);
              const isFinished = g.isFinished ?? (g.status === 'FINAL');
              const isHit = isFinished ? g.prediction.correctWinner : false;
              return `
              <tr class="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td class="p-3 text-white">
                  ${g.display}
                  ${!isFinished ? `<span style="font-size:9px;margin-left:4px;padding:2px 6px;border-radius:4px;background:rgba(6,182,212,0.15);color:#38bdf8;font-weight:bold;">POR JUGAR</span>` : ''}
                </td>
                <td class="p-3 font-bold">${g.visitor}</td>
                <td class="p-3 text-right font-bold ${isFinished ? (g.vPts > g.hPts ? 'text-[#22ff66]' : 'text-white') : 'text-[#8e8ea6]'}">
                  ${isFinished ? g.vPts : `— <span style="font-size:10px;color:#38bdf8;">(${g.prediction.predictedVisitorPts})</span>`}
                </td>
                <td class="p-3 text-center text-[#595973]">@</td>
                <td class="p-3 text-left font-bold ${isFinished ? (g.hPts > g.vPts ? 'text-[#22ff66]' : 'text-white') : 'text-[#8e8ea6]'}">
                  ${isFinished ? g.hPts : `— <span style="font-size:10px;color:#38bdf8;">(${g.prediction.predictedHomePts})</span>`}
                </td>
                <td class="p-3 font-bold">${g.home}</td>
                <td class="p-3 text-center">
                  ${totalInjs > 0 ? `<span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold">${totalInjs} Baja(s)</span>` : `<span class="text-[#595973] text-[10px]">Completos</span>`}
                </td>
                <td class="p-3 text-center font-bold">${g.prediction.predictedWinner} (${g.prediction.predictedVisitorPts}-${g.prediction.predictedHomePts})</td>
                <td class="p-3 text-right">
                  ${isFinished ? `
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isHit ? 'bg-[rgba(34,255,102,0.12)] text-[#22ff66]' : 'bg-red-500/10 text-red-400'}">
                    ${isHit ? '✓ ACERTADO' : '✗ FALLADO'}
                  </span>
                  ` : `
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    ⏳ PENDIENTE
                  </span>
                  `}
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Trigger download in browser
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nba_2025_2026_model_github.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
