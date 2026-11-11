import React, { useState, useMemo } from 'react';
import { getActiveTeams, getActiveTeamMap, getActiveRosterForTeam } from '../engine/seasonEngine';
import { TeamSeasonStats, PlayerInjury, PlayerCumulativeStats, SeasonKey } from '../types/nba';
import { computeGamePrediction, DEFAULT_OPTIMIZED_WEIGHTS } from '../engine/predictiveModel';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Sliders, Play, Stethoscope, UserMinus, UserCheck, CheckCircle2 } from 'lucide-react';

interface Predictor2027Props {
  standings: TeamSeasonStats[];
  season?: SeasonKey;
  onSeasonChange?: (s: SeasonKey) => void;
}

export const Predictor2027: React.FC<Predictor2027Props> = ({ 
  standings, 
  season = '2026-2027',
  onSeasonChange 
}) => {
  const standingsMap = new Map(standings.map((s) => [s.teamCode, s]));

  const [visitorCode, setVisitorCode] = useState<string>('BRK');
  const [homeCode, setHomeCode] = useState<string>('SAS');
  const [visitorRest, setVisitorRest] = useState<number>(1);
  const [homeRest, setHomeRest] = useState<number>(2);

  // Simulated injuries state (Set of player IDs marked as OUT)
  const [visitorOutIds, setVisitorOutIds] = useState<Set<string>>(new Set());
  const [homeOutIds, setHomeOutIds] = useState<Set<string>>(new Set());

  const activeTeams = useMemo(() => getActiveTeams(season), [season]);
  const activeTeamMap = useMemo(() => getActiveTeamMap(season), [season]);

  const visTeam = activeTeamMap.get(visitorCode) || activeTeams[0];
  const homTeam = activeTeamMap.get(homeCode) || activeTeams[1];

  const visRoster = useMemo(() => getActiveRosterForTeam(visitorCode, season), [visitorCode, season]);
  const homRoster = useMemo(() => getActiveRosterForTeam(homeCode, season), [homeCode, season]);

  const visStats = standingsMap.get(visitorCode) || {
    teamCode: visitorCode,
    gp: 82,
    wins: 48,
    losses: 34,
    winPct: 0.585,
    homeWins: 27,
    homeLosses: 14,
    awayWins: 21,
    awayLosses: 20,
    ptsForAvg: visTeam.baseOffRating,
    ptsAgainstAvg: visTeam.baseDefRating,
    netRating: Math.round((visTeam.baseOffRating - visTeam.baseDefRating) * 10) / 10,
    offRating: visTeam.baseOffRating,
    defRating: visTeam.baseDefRating,
    pace: visTeam.basePace,
    streak: 'W2',
    last10Record: '6-4',
    restDays: visitorRest,
    elo: 1540
  };

  const homStats = standingsMap.get(homeCode) || {
    teamCode: homeCode,
    gp: 82,
    wins: 58,
    losses: 24,
    winPct: 0.707,
    homeWins: 33,
    homeLosses: 8,
    awayWins: 25,
    awayLosses: 16,
    ptsForAvg: homTeam.baseOffRating,
    ptsAgainstAvg: homTeam.baseDefRating,
    netRating: Math.round((homTeam.baseOffRating - homTeam.baseDefRating) * 10) / 10,
    offRating: homTeam.baseOffRating,
    defRating: homTeam.baseDefRating,
    pace: homTeam.basePace,
    streak: 'W4',
    last10Record: '8-2',
    restDays: homeRest,
    elo: 1630
  };

  // Convert roster to cumulative stats representation
  const visPlayers: PlayerCumulativeStats[] = useMemo(() => {
    return visRoster.map((p) => {
      const min = p.baseMinutes || 24;
      return {
        playerId: p.id,
        name: p.name,
        teamCode: visitorCode,
        pos: p.position,
        gp: 70,
        min,
        pts: p.basePpg,
        reb: p.baseRpg,
        ast: p.baseApg,
        fg: p.baseFgPct,
        tp: p.baseTpPct,
        per: p.basePer,
        pm: 3.5,
        vorpValue: Math.round(((p.basePer - 15) * (p.basePpg / 20) + (min / 10)) * 10) / 10,
        overlapPriorWeight: p.isTransferred ? 60 : 30,
        overlapCurrentWeight: p.isTransferred ? 40 : 70,
        ptsPer36: min > 0 ? Math.round((p.basePpg / min) * 36 * 10) / 10 : p.basePpg,
        rebPer36: min > 0 ? Math.round((p.baseRpg / min) * 36 * 10) / 10 : p.baseRpg,
        astPer36: min > 0 ? Math.round((p.baseApg / min) * 36 * 10) / 10 : p.baseApg,
        priorTeamCode: p.priorTeamCode || p.teamCode,
        isTransferred: !!p.isTransferred,
        transferNote: p.transferNote
      };
    });
  }, [visRoster, visitorCode]);

  const homPlayers: PlayerCumulativeStats[] = useMemo(() => {
    return homRoster.map((p) => {
      const min = p.baseMinutes || 24;
      return {
        playerId: p.id,
        name: p.name,
        teamCode: homeCode,
        pos: p.position,
        gp: 70,
        min,
        pts: p.basePpg,
        reb: p.baseRpg,
        ast: p.baseApg,
        fg: p.baseFgPct,
        tp: p.baseTpPct,
        per: p.basePer,
        pm: 4.8,
        vorpValue: Math.round(((p.basePer - 15) * (p.basePpg / 20) + (min / 10)) * 10) / 10,
        overlapPriorWeight: p.isTransferred ? 60 : 30,
        overlapCurrentWeight: p.isTransferred ? 40 : 70,
        ptsPer36: min > 0 ? Math.round((p.basePpg / min) * 36 * 10) / 10 : p.basePpg,
        rebPer36: min > 0 ? Math.round((p.baseRpg / min) * 36 * 10) / 10 : p.baseRpg,
        astPer36: min > 0 ? Math.round((p.baseApg / min) * 36 * 10) / 10 : p.baseApg,
        priorTeamCode: p.priorTeamCode || p.teamCode,
        isTransferred: !!p.isTransferred,
        transferNote: p.transferNote
      };
    });
  }, [homRoster, homeCode]);


  // Convert selected OUT players to PlayerInjury objects
  const visitorInjuries: PlayerInjury[] = useMemo(() => {
    return Array.from(visitorOutIds).map((id) => {
      const p = visRoster.find((r) => r.id === id)!;
      const impact = p.basePer >= 24 ? 7.5 : p.basePer >= 20 ? 5.5 : p.basePer >= 17 ? 4.0 : 2.5;
      return {
        playerId: p.id,
        playerName: p.name,
        teamCode: visitorCode,
        status: 'OUT',
        reason: 'Baja simulada para temporada 2026-2027',
        pointValueImpact: impact
      };
    });
  }, [visitorOutIds, visRoster, visitorCode]);

  const homeInjuries: PlayerInjury[] = useMemo(() => {
    return Array.from(homeOutIds).map((id) => {
      const p = homRoster.find((r) => r.id === id)!;
      const impact = p.basePer >= 24 ? 7.5 : p.basePer >= 20 ? 5.5 : p.basePer >= 17 ? 4.0 : 2.5;
      return {
        playerId: p.id,
        playerName: p.name,
        teamCode: homeCode,
        status: 'OUT',
        reason: 'Baja simulada para temporada 2026-2027',
        pointValueImpact: impact
      };
    });
  }, [homeOutIds, homRoster, homeCode]);

  const toggleVisitorInjury = (playerId: string) => {
    setVisitorOutIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  };

  const toggleHomeInjury = (playerId: string) => {
    setHomeOutIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  };

  // Run predictive engine with all 8 parameters
  const prediction = computeGamePrediction(
    visStats,
    homStats,
    visitorRest,
    homeRest,
    visitorInjuries,
    homeInjuries,
    visPlayers,
    homPlayers,
    DEFAULT_OPTIMIZED_WEIGHTS
  );

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--green-bg)] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--green-bg)] border border-[var(--green-border)] text-[var(--green)] text-[11px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Motor Calibrado Temporada {season}
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                season === '2026-2027' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
              }`}>
                {season === '2026-2027' ? 'ROSTERS 2026-2027 ACTUALIZADOS' : 'RESPALDO HISTÓRICO BBR'}
              </span>
            </div>
            <h2 className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight">
              Simulador Predictivo Optimizado ({season})
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--text-dim)] max-w-2xl mt-1">
              {season === '2026-2027'
                ? 'Simula cualquier enfrentamiento de la temporada 2026-2027 con rosters actualizados, novatos estelares (Cooper Flagg en Brooklyn, Stephon Castle en Spurs, Karl-Anthony Towns en Knicks, Paul George en 76ers) y Overlap Bayesiano con el respaldo 2025-2026.'
                : 'Simula cualquier cruce aplicando las métricas y reportes médicos del respaldo histórico 2025-2026 de Basketball-Reference.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Marquee Matchups Preset */}
      <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[#12121e] flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[11px] font-mono text-[var(--text-dim)] flex items-center gap-1.5 font-bold">
          <Zap className="w-4 h-4 text-amber-400" /> Duelos Estelares Recomendados ({season}):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setVisitorCode('BRK');
              setHomeCode('SAS');
              setVisitorOutIds(new Set());
              setHomeOutIds(new Set());
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            ⭐ BRK @ SAS (Flagg vs Wembanyama)
          </button>
          <button
            onClick={() => {
              setVisitorCode('BOS');
              setHomeCode('OKC');
              setVisitorOutIds(new Set());
              setHomeOutIds(new Set());
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            🏆 BOS @ OKC (Duelo de Gigantes)
          </button>
          <button
            onClick={() => {
              setVisitorCode('NYK');
              setHomeCode('PHI');
              setVisitorOutIds(new Set());
              setHomeOutIds(new Set());
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            🔥 NYK @ PHI (Towns vs Embiid)
          </button>
          <button
            onClick={() => {
              setVisitorCode('LAL');
              setHomeCode('GSW');
              setVisitorOutIds(new Set());
              setHomeOutIds(new Set());
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            👑 LAL @ GSW (LeBron vs Curry)
          </button>
          <button
            onClick={() => {
              setVisitorCode('DAL');
              setHomeCode('MIN');
              setVisitorOutIds(new Set());
              setHomeOutIds(new Set());
            }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            ⚡ DAL @ MIN (Doncic vs Edwards)
          </button>
        </div>
      </div>

      {/* Simulator Matchup Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

        
        {/* Visitor Team Picker */}
        <div className="md:col-span-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="text-[11px] font-mono tracking-widest text-[var(--text-dim)] uppercase">
                EQUIPO VISITANTE (AWAY)
              </span>
              <span className="text-[11px] font-bold text-white">{visTeam.conference} Conf</span>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-[16px] text-white shadow-lg border border-white/20"
                style={{ backgroundColor: visTeam.primaryColor }}
              >
                {visTeam.code}
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-[var(--text-faint)] block">Seleccionar Equipo:</label>
                <select
                  value={visitorCode}
                  onChange={(e) => {
                    setVisitorCode(e.target.value);
                    setVisitorOutIds(new Set());
                  }}
                  className="w-full mt-1 bg-[#161622] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] font-bold text-white focus:outline-none focus:border-[var(--green)]"
                >
                  {activeTeams.map((t) => (
                    <option key={t.code} value={t.code} disabled={t.code === homeCode}>
                      {t.city} {t.nickname} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rest days selector */}
            <div className="pt-2">
              <label className="text-[11px] text-[var(--text-dim)] flex items-center justify-between mb-1.5">
                <span>Días de Descanso Previos:</span>
                <span className="font-bold text-white font-mono">
                  {visitorRest === 0 ? '0 (Back-to-Back ⚠️)' : `${visitorRest} días`}
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((days) => (
                  <button
                    key={days}
                    onClick={() => setVisitorRest(days)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                      visitorRest === days
                        ? 'bg-[var(--green)] text-black border-[var(--green)]'
                        : 'bg-[#141420] border-[var(--border)] text-[var(--text-dim)] hover:text-white'
                    }`}
                  >
                    {days === 0 ? '0 (B2B)' : `${days}d`}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Player Roster / Injury Toggles */}
            <div className="pt-3 border-t border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-[var(--accent)]" /> Rotación &amp; Bajas Simuladas:
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  {visitorOutIds.size} {visitorOutIds.size === 1 ? 'baja activa' : 'bajas activas'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {visRoster.slice(0, 5).map((player) => {
                  const isOut = visitorOutIds.has(player.id);
                  return (
                    <div
                      key={player.id}
                      onClick={() => toggleVisitorInjury(player.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
                        isOut
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-[#141420] border-white/5 text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-faint)]">{player.position}</span>
                        <span className={`font-semibold ${isOut ? 'line-through text-red-300' : ''}`}>
                          {player.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-dim)] font-sans">
                          ({player.basePpg} ppg, PER {player.basePer})
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isOut ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {isOut ? 'OUT (Baja)' : 'DISPONIBLE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.04] text-center font-mono">
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">W-L 25-26</span>
              <span className="text-[12px] font-bold text-white">{visStats.wins}-{visStats.losses}</span>
            </div>
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">NET RTG</span>
              <span className="text-[12px] font-bold text-[var(--green)]">
                {visStats.netRating > 0 ? `+${visStats.netRating}` : visStats.netRating}
              </span>
            </div>
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">ELO RTG</span>
              <span className="text-[12px] font-bold text-white">{visStats.elo}</span>
            </div>
          </div>
        </div>

        {/* Center VS Indicator */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border)] bg-[#12121a] text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center font-mono font-black text-[14px] text-[var(--accent)] shadow-lg">
            VS
          </div>
          <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
            TEMPORADA 2026-27
          </span>
          <div className="mt-3 px-2.5 py-1 rounded-full bg-[var(--green-bg)] text-[var(--green)] text-[10px] font-bold tracking-widest uppercase border border-[var(--green-border)]">
            HCA: +3.1 pts
          </div>
          <div className="mt-3 text-[10px] text-[var(--text-dim)] font-mono">
            Haz clic en los jugadores para simular lesiones
          </div>
        </div>

        {/* Home Team Picker */}
        <div className="md:col-span-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="text-[11px] font-mono tracking-widest text-[var(--text-dim)] uppercase">
                EQUIPO LOCAL (HOME)
              </span>
              <span className="text-[11px] font-bold text-white">{homTeam.conference} Conf</span>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-[16px] text-white shadow-lg border border-white/20"
                style={{ backgroundColor: homTeam.primaryColor }}
              >
                {homTeam.code}
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-[var(--text-faint)] block">Seleccionar Equipo:</label>
                <select
                  value={homeCode}
                  onChange={(e) => {
                    setHomeCode(e.target.value);
                    setHomeOutIds(new Set());
                  }}
                  className="w-full mt-1 bg-[#161622] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] font-bold text-white focus:outline-none focus:border-[var(--green)]"
                >
                  {activeTeams.map((t) => (
                    <option key={t.code} value={t.code} disabled={t.code === visitorCode}>
                      {t.city} {t.nickname} ({t.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rest days selector */}
            <div className="pt-2">
              <label className="text-[11px] text-[var(--text-dim)] flex items-center justify-between mb-1.5">
                <span>Días de Descanso Previos:</span>
                <span className="font-bold text-white font-mono">
                  {homeRest === 0 ? '0 (Back-to-Back ⚠️)' : `${homeRest} días`}
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((days) => (
                  <button
                    key={days}
                    onClick={() => setHomeRest(days)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                      homeRest === days
                        ? 'bg-[var(--green)] text-black border-[var(--green)]'
                        : 'bg-[#141420] border-[var(--border)] text-[var(--text-dim)] hover:text-white'
                    }`}
                  >
                    {days === 0 ? '0 (B2B)' : `${days}d`}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Player Roster / Injury Toggles */}
            <div className="pt-3 border-t border-white/[0.04] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-[var(--accent)]" /> Rotación &amp; Bajas Simuladas:
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  {homeOutIds.size} {homeOutIds.size === 1 ? 'baja activa' : 'bajas activas'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {homRoster.slice(0, 5).map((player) => {
                  const isOut = homeOutIds.has(player.id);
                  return (
                    <div
                      key={player.id}
                      onClick={() => toggleHomeInjury(player.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
                        isOut
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-[#141420] border-white/5 text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-faint)]">{player.position}</span>
                        <span className={`font-semibold ${isOut ? 'line-through text-red-300' : ''}`}>
                          {player.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-dim)] font-sans">
                          ({player.basePpg} ppg, PER {player.basePer})
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isOut ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {isOut ? 'OUT (Baja)' : 'DISPONIBLE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.04] text-center font-mono">
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">W-L 25-26</span>
              <span className="text-[12px] font-bold text-white">{homStats.wins}-{homStats.losses}</span>
            </div>
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">NET RTG</span>
              <span className="text-[12px] font-bold text-[var(--green)]">
                {homStats.netRating > 0 ? `+${homStats.netRating}` : homStats.netRating}
              </span>
            </div>
            <div className="p-2 rounded bg-[#141420]">
              <span className="text-[10px] text-[var(--text-faint)] block">ELO RTG</span>
              <span className="text-[12px] font-bold text-white">{homStats.elo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Output Section */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--green)]" />
            <h3 className="text-[18px] font-bold text-white tracking-tight">
              Proyección Oficial del Modelo para 2026-2027
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]">
              Ganador Proyectado: {prediction.predictedWinner}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
              Confianza: {prediction.confidence}
            </span>
          </div>
        </div>

        {/* Big Probability Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Visitor Win Prob */}
          <div className="text-center p-4 rounded-xl bg-[#141420] border border-white/5 space-y-1">
            <span className="text-[12px] text-[var(--text-dim)] font-mono">{visTeam.name}</span>
            <div className="text-[36px] font-extrabold text-white font-mono">
              {prediction.visitorProb}%
            </div>
            <span className="text-[11px] text-[var(--text-faint)] font-mono block">
              Proyección: {prediction.predictedVisitorPts} pts
            </span>
            {visitorOutIds.size > 0 && (
              <span className="text-[10px] text-red-400 font-mono block mt-1">
                ⚠️ Con {visitorOutIds.size} baja(s) activa(s)
              </span>
            )}
          </div>

          {/* Center Spread & Bar */}
          <div className="space-y-3">
            <div className="text-center font-mono">
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-faint)] block">
                MARCADOR ESTIMADO
              </span>
              <div className="text-[26px] font-black text-[var(--green)]">
                {prediction.predictedVisitorPts} - {prediction.predictedHomePts}
              </div>
              <span className="text-[12px] text-white">
                Hándicap Proyectado: {homTeam.code} {prediction.predictedSpread > 0 ? `-${prediction.predictedSpread}` : `+${Math.abs(prediction.predictedSpread)}`} pts
              </span>
            </div>

            {/* Visual Probability Bar */}
            <div className="h-3 w-full rounded-full bg-[var(--surface-3)] overflow-hidden flex shadow-inner">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${prediction.visitorProb}%` }} 
              />
              <div 
                className="h-full bg-[var(--green)] transition-all duration-300"
                style={{ width: `${prediction.homeProb}%` }} 
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
              <span>{visTeam.code} ({prediction.visitorProb}%)</span>
              <span>Línea O/U: {prediction.predictedTotal} pts</span>
              <span>{homTeam.code} ({prediction.homeProb}%)</span>
            </div>
          </div>

          {/* Home Win Prob */}
          <div className="text-center p-4 rounded-xl bg-[#141420] border border-white/5 space-y-1">
            <span className="text-[12px] text-[var(--text-dim)] font-mono">{homTeam.name}</span>
            <div className="text-[36px] font-extrabold text-[var(--green)] font-mono">
              {prediction.homeProb}%
            </div>
            <span className="text-[11px] text-[var(--text-faint)] font-mono block">
              Proyección: {prediction.predictedHomePts} pts
            </span>
            {homeOutIds.size > 0 && (
              <span className="text-[10px] text-red-400 font-mono block mt-1">
                ⚠️ Con {homeOutIds.size} baja(s) activa(s)
              </span>
            )}
          </div>
        </div>

        {/* Quantitative Factors Contribution Table */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[#101018] space-y-3">
          <div className="text-[12px] font-bold text-white font-mono flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[var(--green)]" />
            Contribución de Factores Cuantitativos en el Margen Proyectado:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded bg-[#161624] border border-white/5">
              <span className="text-[var(--text-faint)] block text-[10px]">VENTAJA LOCAL</span>
              <span className="font-bold text-[var(--green)]">+{prediction.factors.homeCourtAdvantage} pts</span>
            </div>
            <div className="p-2.5 rounded bg-[#161624] border border-white/5">
              <span className="text-[var(--text-faint)] block text-[10px]">DIFERENCIAL NET RTG</span>
              <span className={`font-bold ${prediction.factors.netRatingDiff >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                {prediction.factors.netRatingDiff > 0 ? `+${prediction.factors.netRatingDiff}` : prediction.factors.netRatingDiff} pts
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#161624] border border-white/5">
              <span className="text-[var(--text-faint)] block text-[10px]">EFECTO BAJAS (INJURIES)</span>
              <span className={`font-bold ${prediction.factors.injuryImpactDiff >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                {prediction.factors.injuryImpactDiff > 0 ? `+${prediction.factors.injuryImpactDiff}` : prediction.factors.injuryImpactDiff} pts
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#161624] border border-white/5">
              <span className="text-[var(--text-faint)] block text-[10px]">CALIDAD QUINTETO ACTIVO</span>
              <span className={`font-bold ${prediction.factors.activeRosterPowerDiff >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                {prediction.factors.activeRosterPowerDiff > 0 ? `+${prediction.factors.activeRosterPowerDiff}` : prediction.factors.activeRosterPowerDiff} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
