import React, { useState, useMemo } from 'react';
import { Game, PlayerBoxScore, PlayerCumulativeStats, PlayerInjury } from '../types/nba';
import { TEAM_MAP } from '../data/teamsData';
import { getActiveTeamMap } from '../engine/seasonEngine';
import { 
  X, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck, 
  Flame, 
  BarChart2, 
  Activity, 
  AlertCircle, 
  Stethoscope, 
  UserMinus, 
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface GameModalProps {
  game: Game;
  onClose: () => void;
  onToggleGameStatus?: (gameId: string, markFinished: boolean) => void;
  onRefreshData?: () => void;
}

type TabType = 'players' | 'injuries' | 'recent' | 'teamStats' | 'prediction';
type PlayerViewType = 'cumulative' | 'boxscore';

export const GameModal: React.FC<GameModalProps> = ({ 
  game, 
  onClose,
  onToggleGameStatus,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [selectedTeam, setSelectedTeam] = useState<'visitor' | 'home'>('visitor');
  const [playerView, setPlayerView] = useState<PlayerViewType>('cumulative');
  const [minuteMode, setMinuteMode] = useState<'perGame' | 'per36'>('perGame');
  
  // Sort state for players table
  const [sortField, setSortField] = useState<string>('pts');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const teamMap = useMemo(() => getActiveTeamMap(game.season || '2026-2027'), [game.season]);
  const visitorTeam = teamMap.get(game.visitor) || TEAM_MAP.get(game.visitor);
  const homeTeam = teamMap.get(game.home) || TEAM_MAP.get(game.home);

  const currentTeamCode = selectedTeam === 'visitor' ? game.visitor : game.home;
  const currentTeamInfo = selectedTeam === 'visitor' ? visitorTeam : homeTeam;

  const totalInjuries = (game.visitorInjuries?.length || 0) + (game.homeInjuries?.length || 0);

  // Handle header click to sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Sorted players list
  const sortedPlayers = useMemo(() => {
    if (playerView === 'cumulative') {
      const list = selectedTeam === 'visitor' ? [...game.visitorStatsBeforeGame] : [...game.homeStatsBeforeGame];
      return list.sort((a: any, b: any) => {
        if (sortField === 'name') {
          return sortDir === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        }
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (minuteMode === 'per36') {
          if (sortField === 'pts') { valA = a.ptsPer36 ?? a.pts; valB = b.ptsPer36 ?? b.pts; }
          if (sortField === 'reb') { valA = a.rebPer36 ?? a.reb; valB = b.rebPer36 ?? b.reb; }
          if (sortField === 'ast') { valA = a.astPer36 ?? a.ast; valB = b.astPer36 ?? b.ast; }
        }
        return sortDir === 'desc' ? valB - valA : valA - valB;
      });
    } else {
      const list = selectedTeam === 'visitor' ? [...game.visitorBoxScore] : [...game.homeBoxScore];
      return list.sort((a: any, b: any) => {
        if (sortField === 'name') {
          return sortDir === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        }
        const valA = a[sortField] ?? 0;
        const valB = b[sortField] ?? 0;
        return sortDir === 'desc' ? valB - valA : valA - valB;
      });
    }
  }, [playerView, minuteMode, selectedTeam, game, sortField, sortDir]);

  const playerColumns = playerView === 'cumulative'
    ? minuteMode === 'per36'
      ? [
          { key: 'name', label: 'JUGADOR', width: 'col-span-3' },
          { key: 'gp', label: 'GP', width: 'col-span-1' },
          { key: 'min', label: 'MIN/G', width: 'col-span-1' },
          { key: 'pts', label: 'PTS/36', width: 'col-span-1' },
          { key: 'reb', label: 'REB/36', width: 'col-span-1' },
          { key: 'ast', label: 'AST/36', width: 'col-span-1' },
          { key: 'fg', label: 'FG%', width: 'col-span-1' },
          { key: 'tp', label: '3P%', width: 'col-span-1' },
          { key: 'per', label: 'PER', width: 'col-span-1' },
          { key: 'vorpValue', label: 'VORP', width: 'col-span-1' },
        ]
      : [
          { key: 'name', label: 'JUGADOR', width: 'col-span-3' },
          { key: 'gp', label: 'GP', width: 'col-span-1' },
          { key: 'min', label: 'MIN', width: 'col-span-1' },
          { key: 'pts', label: 'PPG', width: 'col-span-1' },
          { key: 'reb', label: 'RPG', width: 'col-span-1' },
          { key: 'ast', label: 'APG', width: 'col-span-1' },
          { key: 'fg', label: 'FG%', width: 'col-span-1' },
          { key: 'tp', label: '3P%', width: 'col-span-1' },
          { key: 'per', label: 'PER', width: 'col-span-1' },
          { key: 'pm', label: '+/-', width: 'col-span-1' },
        ]
    : [
        { key: 'name', label: 'JUGADOR', width: 'col-span-3' },
        { key: 'min', label: 'MIN', width: 'col-span-1' },
        { key: 'pts', label: 'PTS', width: 'col-span-1' },
        { key: 'reb', label: 'REB', width: 'col-span-1' },
        { key: 'ast', label: 'AST', width: 'col-span-1' },
        { key: 'fgm', label: 'FG', width: 'col-span-1' },
        { key: 'fg', label: 'FG%', width: 'col-span-1' },
        { key: 'tp', label: '3P%', width: 'col-span-1' },
        { key: 'tov', label: 'TOV', width: 'col-span-1' },
        { key: 'pm', label: '+/-', width: 'col-span-1' },
      ];

  const isFinished = game.isFinished ?? (game.status === 'FINAL');
  const actualWinner = isFinished ? (game.hPts > game.vPts ? game.home : game.visitor) : undefined;
  const isPredictHit = isFinished ? game.prediction.correctWinner : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[1140px] max-h-[92vh] flex flex-col rounded-2xl border border-[var(--border)] bg-[#0d0d14] shadow-[0_25px_90px_rgba(0,0,0,0.85)] my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[#141420]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center -space-x-2">
              <div 
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center font-black text-[13px] border border-white/20 shadow-md text-white"
                style={{ backgroundColor: visitorTeam?.primaryColor || '#333' }}
              >
                {game.visitor}
              </div>
              <div 
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center font-black text-[13px] border border-white/20 shadow-md text-white"
                style={{ backgroundColor: homeTeam?.primaryColor || '#444' }}
              >
                {game.home}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[17px] sm:text-[20px] font-bold text-white tracking-tight">
                  {isFinished ? (
                    <>
                      <span className={game.vPts > game.hPts ? 'text-[var(--green)]' : 'text-white'}>
                        {visitorTeam?.city} {game.visitor} {game.vPts}
                      </span>
                      <span className="text-[var(--text-faint)] mx-2">@</span>
                      <span className={game.hPts > game.vPts ? 'text-[var(--green)]' : 'text-white'}>
                        {game.hPts} {homeTeam?.city} {game.home}
                      </span>
                      {game.ot && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-[var(--surface-3)] text-[11px] text-[var(--accent)] border border-[var(--border)] font-semibold">
                          {game.ot}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-white">
                        {visitorTeam?.city} {game.visitor}
                      </span>
                      <span className="text-cyan-400 font-normal mx-2">vs</span>
                      <span className="text-white">
                        {homeTeam?.city} {game.home}
                      </span>
                      <span className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold tracking-wider uppercase">
                        PROGRAMADO • POR JUGAR
                      </span>
                    </>
                  )}
                </h2>
              </div>

              {!isFinished && (
                <div className="mt-1 flex items-center gap-2 text-[12px] font-mono text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Proyección del Modelo: <strong>{game.visitor} {game.prediction.predictedVisitorPts} - {game.prediction.predictedHomePts} {game.home}</strong> ({game.prediction.predictedWinner} favorito por {Math.abs(game.prediction.predictedSpread)} pts • {game.prediction.predictedWinner === game.home ? game.prediction.homeProb : game.prediction.visitorProb}%)</span>
                </div>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-dim)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {game.display} {game.season || '2026-2027'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {game.time}
                </span>
                <span>•</span>
                {isFinished ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-[var(--green)] font-semibold bg-[var(--green-bg)] px-2 py-0.5 rounded-full border border-[var(--green-border)] text-[10px]">
                      <ShieldCheck className="w-3 h-3" /> {game.season === '2026-2027' ? 'Partido Finalizado Oficial' : 'Basketball-Reference Oficial'}
                    </span>
                    <span>•</span>
                    <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${isPredictHit ? 'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                      {isPredictHit ? '✓ Predicción Acertada' : '✗ Predicción Fallida'}
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/35">
                    <Clock className="w-3 h-3" /> Pronóstico Activo (Confianza {game.prediction.confidence})
                  </span>
                )}
                {totalInjuries > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <Stethoscope className="w-3 h-3" /> {totalInjuries} {totalInjuries === 1 ? 'Baja Registrada' : 'Bajas Registradas'}
                    </span>
                  </>
                )}
              </div>

              {isFinished && game.bbrVerifiedNote && (
                <div className="mt-1.5 text-[11px] text-[var(--accent)] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {game.bbrVerifiedNote}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[#1a1a28] text-white hover:text-[var(--green)] hover:border-[var(--green)] text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refrescar datos y sincronizar partidos disputados"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[var(--green)]" />
                <span className="hidden sm:inline">Refrescar Datos</span>
              </button>
            )}

            {onToggleGameStatus && (
              !isFinished ? (
                <button
                  onClick={() => onToggleGameStatus(game.id, true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Marcar este partido como disputado con su resultado oficial de Basketball-Reference"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marcar como Jugado</span>
                </button>
              ) : game.season === '2026-2027' ? (
                <button
                  onClick={() => onToggleGameStatus(game.id, false)}
                  className="px-2.5 py-1.5 rounded-xl border border-white/10 text-[var(--text-dim)] hover:text-white hover:bg-white/5 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  title="Revertir este partido a estado Programado (Por Jugar)"
                >
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span className="hidden sm:inline">Marcar como Programado</span>
                </button>
              ) : null
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[#11111a] px-5 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-3 text-[12px] font-semibold border-b-2 tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'players'
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-transparent text-[var(--text-dim)] hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Top 10 Jugadores
          </button>

          <button
            onClick={() => setActiveTab('injuries')}
            className={`px-4 py-3 text-[12px] font-semibold border-b-2 tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'injuries'
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-transparent text-[var(--text-dim)] hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Bajas &amp; Lesiones {totalInjuries > 0 && `(${totalInjuries})`}
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-3 text-[12px] font-semibold border-b-2 tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'recent'
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-transparent text-[var(--text-dim)] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> Últimos 10 Partidos
          </button>

          <button
            onClick={() => setActiveTab('teamStats')}
            className={`px-4 py-3 text-[12px] font-semibold border-b-2 tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'teamStats'
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-transparent text-[var(--text-dim)] hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Estadísticas Equipos
          </button>

          <button
            onClick={() => setActiveTab('prediction')}
            className={`px-4 py-3 text-[12px] font-semibold border-b-2 tracking-wider uppercase transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'prediction'
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-transparent text-[var(--text-dim)] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Modelo Predictivo (Optimizado)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: TOP 10 PLAYERS STATS */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {/* Team Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider mr-1">Equipo:</span>
                  <button
                    onClick={() => setSelectedTeam('visitor')}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                      selectedTeam === 'visitor'
                        ? 'bg-[var(--green)] text-black'
                        : 'bg-[#181824] text-[var(--text-dim)] hover:text-white'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: visitorTeam?.primaryColor }} 
                    />
                    {game.visitor} ({visitorTeam?.city})
                  </button>
                  <button
                    onClick={() => setSelectedTeam('home')}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                      selectedTeam === 'home'
                        ? 'bg-[var(--green)] text-black'
                        : 'bg-[#181824] text-[var(--text-dim)] hover:text-white'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: homeTeam?.primaryColor }} 
                    />
                    {game.home} ({homeTeam?.city})
                  </button>
                </div>

                {/* View switcher: Cumulative vs Box Score and Per Game vs Per 36 */}
                <div className="flex flex-wrap items-center gap-2">
                  {playerView === 'cumulative' && (
                    <div className="flex items-center gap-1 bg-[#181824] p-1 rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => setMinuteMode('perGame')}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded font-semibold transition-colors ${
                          minuteMode === 'perGame'
                            ? 'bg-[var(--green)] text-black font-bold shadow-sm'
                            : 'text-[var(--text-dim)] hover:text-white'
                        }`}
                        title="Estadísticas tradicionales promedio por partido"
                      >
                        Por Partido
                      </button>
                      <button
                        onClick={() => setMinuteMode('per36')}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded font-semibold transition-colors ${
                          minuteMode === 'per36'
                            ? 'bg-[var(--accent)] text-black font-bold shadow-sm'
                            : 'text-[var(--text-dim)] hover:text-white'
                        }`}
                        title="Normalizado a ritmo de 36 minutos jugados"
                      >
                        Por 36 Min (Ritmo)
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1 bg-[#181824] p-1 rounded-lg border border-[var(--border)]">
                    <button
                      onClick={() => setPlayerView('cumulative')}
                      className={`px-3 py-1 text-[11px] font-mono rounded font-semibold transition-colors ${
                        playerView === 'cumulative'
                          ? 'bg-[var(--surface-3)] text-white shadow-sm'
                          : 'text-[var(--text-dim)] hover:text-white'
                      }`}
                    >
                      Estadísticas Previas al Juego
                    </button>
                    <button
                      onClick={() => {
                        if (isFinished) setPlayerView('boxscore');
                      }}
                      disabled={!isFinished}
                      className={`px-3 py-1 text-[11px] font-mono rounded font-semibold transition-colors ${
                        !isFinished
                          ? 'opacity-40 cursor-not-allowed text-[var(--text-faint)]'
                          : playerView === 'boxscore'
                          ? 'bg-[var(--surface-3)] text-white shadow-sm'
                          : 'text-[var(--text-dim)] hover:text-white'
                      }`}
                      title={!isFinished ? 'El partido aún no se ha jugado; el boxscore se registrará cuando termine el partido' : 'Boxscore oficial de este partido'}
                    >
                      {isFinished ? 'Boxscore Este Partido' : 'Boxscore (Disponible tras Fin)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] px-1 font-mono">
                <span>
                  {!isFinished
                    ? `* Partido programado: Mostrando plantilla y estadísticas acumuladas vigentes para ${game.display}`
                    : playerView === 'cumulative'
                    ? minuteMode === 'per36'
                      ? `* Métricas normalizadas a 36 minutos con overlap gradual de temporada anterior (BBR)`
                      : `* Mostrando estadísticas acumuladas hasta antes del ${game.display} con overlap Bayesiano`
                    : `* Mostrando actuación individual oficial en los 48 minutos del encuentro`}
                </span>
                <span className="text-[var(--green)]">
                  Haz clic en cualquier encabezado para ordenar
                </span>
              </div>

              {/* Players Table */}
              <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--surface)] shadow-lg">
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-0 border-b border-[var(--border)] bg-[#161624] text-[11px] font-mono text-[var(--text-dim)] uppercase tracking-wider">
                    {playerColumns.map((col) => {
                      const isSorted = sortField === col.key;
                      return (
                        <div
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className={`${col.width} px-3 py-3 cursor-pointer select-none transition-colors flex items-center justify-between hover:bg-white/[0.05] hover:text-white ${
                            isSorted ? 'bg-[var(--green-bg)] text-[var(--green)] font-bold' : ''
                          }`}
                        >
                          <span>{col.label}</span>
                          {isSorted && (
                            <span className="text-[10px]">{sortDir === 'desc' ? '▼' : '▲'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Table Rows */}
                  {sortedPlayers.map((player: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    const isOut = player.isInjuredOut;
                    return (
                      <div
                        key={player.playerId || idx}
                        className={`grid grid-cols-12 gap-0 border-b border-white/[0.04] text-[12px] font-mono transition-colors hover:bg-white/[0.03] ${
                          isOut ? 'bg-red-500/[0.04]' : isEven ? 'bg-transparent' : 'bg-white/[0.01]'
                        }`}
                      >
                        {/* Name & Pos */}
                        <div className="col-span-3 px-3 py-2.5 flex items-center gap-1.5 truncate">
                          <span className="w-4 text-[10px] text-[var(--text-faint)]">{idx + 1}</span>
                          <span className={`font-semibold truncate ${isOut ? 'text-red-300 line-through' : 'text-white'}`}>
                            {player.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-3)] text-[var(--text-dim)]">
                            {player.pos}
                          </span>
                          {player.isTransferred && (
                            <span 
                              className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" 
                              title={player.transferNote || `Traspasado desde ${player.priorTeamCode}`}
                            >
                              Ex-{player.priorTeamCode}
                            </span>
                          )}
                          {playerView === 'cumulative' && player.overlapPriorWeight > 0 && (
                            <span 
                              className="hidden xl:inline text-[8px] px-1 py-0.2 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25"
                              title={`Overlap Bayesiano: ${player.overlapPriorWeight}% temporada anterior | ${player.overlapCurrentWeight}% temporada 2025-26`}
                            >
                              {player.overlapPriorWeight}% Prior
                            </span>
                          )}
                          {isOut && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
                              BAJA
                            </span>
                          )}
                        </div>

                        {playerView === 'cumulative' ? (
                          minuteMode === 'per36' ? (
                            <>
                              <div className={`col-span-1 px-3 py-2.5 text-[var(--text-dim)] ${sortField === 'gp' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.gp}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'min' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.min?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-bold text-[var(--accent)] ${sortField === 'pts' ? 'underline' : ''}`}>
                                {player.ptsPer36?.toFixed(1) || player.pts?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'reb' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.rebPer36?.toFixed(1) || player.reb?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'ast' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.astPer36?.toFixed(1) || player.ast?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'fg' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.fg?.toFixed(1)}%
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'tp' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.tp?.toFixed(1)}%
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-semibold ${sortField === 'per' ? 'text-[var(--green)]' : ''}`}>
                                {player.per?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-bold ${player.vorpValue >= 2.0 ? 'text-[var(--green)]' : 'text-white'}`}>
                                {player.vorpValue > 0 ? `+${player.vorpValue}` : player.vorpValue}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={`col-span-1 px-3 py-2.5 text-[var(--text-dim)] ${sortField === 'gp' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.gp}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'min' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.min?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-bold text-white ${sortField === 'pts' ? 'text-[var(--green)]' : ''}`}>
                                {player.pts?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'reb' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.reb?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'ast' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.ast?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'fg' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.fg?.toFixed(1)}%
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 ${sortField === 'tp' ? 'text-[var(--green)] font-bold' : ''}`}>
                                {player.tp?.toFixed(1)}%
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-semibold ${sortField === 'per' ? 'text-[var(--green)]' : ''}`}>
                                {player.per?.toFixed(1)}
                              </div>
                              <div className={`col-span-1 px-3 py-2.5 font-bold ${player.pm >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                                {player.pm > 0 ? `+${player.pm}` : player.pm}
                              </div>
                            </>
                          )
                        ) : (
                          <>
                            <div className={`col-span-1 px-3 py-2.5 ${sortField === 'min' ? 'text-[var(--green)] font-bold' : ''}`}>
                              {player.min}m
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 font-bold text-white ${sortField === 'pts' ? 'text-[var(--green)]' : ''}`}>
                              {player.pts}
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 ${sortField === 'reb' ? 'text-[var(--green)] font-bold' : ''}`}>
                              {player.reb}
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 ${sortField === 'ast' ? 'text-[var(--green)] font-bold' : ''}`}>
                              {player.ast}
                            </div>
                            <div className="col-span-1 px-3 py-2.5 text-[var(--text-dim)]">
                              {player.fgm}/{player.fga}
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 ${sortField === 'fg' ? 'text-[var(--green)] font-bold' : ''}`}>
                              {player.fg?.toFixed(0)}%
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 ${sortField === 'tp' ? 'text-[var(--green)] font-bold' : ''}`}>
                              {player.tp?.toFixed(0)}%
                            </div>
                            <div className="col-span-1 px-3 py-2.5 text-[var(--text-dim)]">
                              {player.tov}
                            </div>
                            <div className={`col-span-1 px-3 py-2.5 font-bold ${player.pm >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                              {player.pm > 0 ? `+${player.pm}` : player.pm}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: INJURIES & MEDICAL REPORT */}
          {activeTab === 'injuries' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                  <Stethoscope className="w-5 h-5 text-[var(--accent)]" />
                  <div>
                    <h3 className="font-bold text-white text-[15px]">
                      Informe Médico y Bajas Confirmadas al Momento del Partido
                    </h3>
                    <p className="text-[11px] text-[var(--text-dim)]">
                      Registrado en la previa del encuentro ({game.display} 2025-26) e incorporado directamente al modelo predictivo.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Visitor Injuries */}
                  <div className="rounded-xl border border-white/5 bg-[#141420] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: visitorTeam?.primaryColor }} 
                        />
                        <span className="font-bold text-white text-[13px]">
                          {game.visitor} ({visitorTeam?.name})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--text-dim)]">
                        {game.visitorInjuries?.length || 0} {game.visitorInjuries?.length === 1 ? 'Baja' : 'Bajas'}
                      </span>
                    </div>

                    {(!game.visitorInjuries || game.visitorInjuries.length === 0) ? (
                      <div className="py-4 text-center text-[12px] text-[var(--green)] flex items-center justify-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Plantilla completa disponible sin bajas
                      </div>
                    ) : (
                      <div className="space-y-2 font-mono text-[12px]">
                        {game.visitorInjuries.map((inj, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{inj.playerName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                                {inj.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-dim)] mt-1 font-sans">
                              Motivo: {inj.reason}
                            </p>
                            <div className="mt-1 text-[10px] text-red-300 font-semibold">
                              Impacto estimado en el spread: -{inj.pointValueImpact} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Home Injuries */}
                  <div className="rounded-xl border border-white/5 bg-[#141420] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: homeTeam?.primaryColor }} 
                        />
                        <span className="font-bold text-white text-[13px]">
                          {game.home} ({homeTeam?.name})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--text-dim)]">
                        {game.homeInjuries?.length || 0} {game.homeInjuries?.length === 1 ? 'Baja' : 'Bajas'}
                      </span>
                    </div>

                    {(!game.homeInjuries || game.homeInjuries.length === 0) ? (
                      <div className="py-4 text-center text-[12px] text-[var(--green)] flex items-center justify-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> Plantilla completa disponible sin bajas
                      </div>
                    ) : (
                      <div className="space-y-2 font-mono text-[12px]">
                        {game.homeInjuries.map((inj, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{inj.playerName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                                {inj.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-dim)] mt-1 font-sans">
                              Motivo: {inj.reason}
                            </p>
                            <div className="mt-1 text-[10px] text-red-300 font-semibold">
                              Impacto estimado en el spread: -{inj.pointValueImpact} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Net Differential Card */}
                <div className="mt-4 p-3 rounded-lg bg-[#111118] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-[12px] font-mono">
                  <span className="text-[var(--text-dim)]">
                    Efecto Neto de Bajas en la Proyección ({game.home} vs {game.visitor}):
                  </span>
                  <span className={`font-bold text-[13px] ${
                    game.prediction.factors.injuryImpactDiff > 0 ? 'text-[var(--green)]' : game.prediction.factors.injuryImpactDiff < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    {game.prediction.factors.injuryImpactDiff > 0 ? `+${game.prediction.factors.injuryImpactDiff}` : game.prediction.factors.injuryImpactDiff} pts hacia {game.home}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LAST 10 GAMES */}
          {activeTab === 'recent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visitor Last Games */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: visitorTeam?.primaryColor || '#666' }} 
                    />
                    <h3 className="font-bold text-white text-[14px]">
                      {game.visitor} • Últimos Partidos ({game.visitorLast10BeforeGame.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-[var(--text-dim)] font-mono">
                    Récord previo: {game.visitorTeamStatsBeforeGame.wins}-{game.visitorTeamStatsBeforeGame.losses}
                  </span>
                </div>

                {game.visitorLast10BeforeGame.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-[var(--text-faint)]">
                    Primer partido de la temporada (sin partidos previos).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {game.visitorLast10BeforeGame.map((past, i) => (
                      <div
                        key={past.gameId || i}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.04] bg-[#141420] text-[12px] font-mono hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] ${
                              past.won ? 'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {past.won ? 'W' : 'L'}
                          </span>
                          <div>
                            <span className="text-[var(--text-faint)] text-[10px] mr-2">{past.displayDate}</span>
                            <span className="text-white font-semibold">
                              {past.isHome ? 'vs' : '@'} {past.opponentCode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">
                            {past.teamScore} - {past.oppScore}
                          </span>
                          <span className={`text-[10px] w-10 text-right ${past.won ? 'text-[var(--green)]' : 'text-red-400'}`}>
                            {past.won ? `+${past.margin}` : `-${past.margin}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Home Last Games */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: homeTeam?.primaryColor || '#666' }} 
                    />
                    <h3 className="font-bold text-white text-[14px]">
                      {game.home} • Últimos Partidos ({game.homeLast10BeforeGame.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-[var(--text-dim)] font-mono">
                    Récord previo: {game.homeTeamStatsBeforeGame.wins}-{game.homeTeamStatsBeforeGame.losses}
                  </span>
                </div>

                {game.homeLast10BeforeGame.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-[var(--text-faint)]">
                    Primer partido de la temporada (sin partidos previos).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {game.homeLast10BeforeGame.map((past, i) => (
                      <div
                        key={past.gameId || i}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.04] bg-[#141420] text-[12px] font-mono hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] ${
                              past.won ? 'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {past.won ? 'W' : 'L'}
                          </span>
                          <div>
                            <span className="text-[var(--text-faint)] text-[10px] mr-2">{past.displayDate}</span>
                            <span className="text-white font-semibold">
                              {past.isHome ? 'vs' : '@'} {past.opponentCode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">
                            {past.teamScore} - {past.oppScore}
                          </span>
                          <span className={`text-[10px] w-10 text-right ${past.won ? 'text-[var(--green)]' : 'text-red-400'}`}>
                            {past.won ? `+${past.margin}` : `-${past.margin}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEAM STATS COMPARISON */}
          {activeTab === 'teamStats' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="grid grid-cols-3 text-center border-b border-[var(--border)] pb-3 mb-4">
                  <div className="text-left font-bold text-[16px] text-white flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full" 
                      style={{ backgroundColor: visitorTeam?.primaryColor }} 
                    />
                    {visitorTeam?.name} ({game.visitor})
                  </div>
                  <div className="text-[11px] font-mono tracking-widest text-[var(--text-dim)] uppercase my-auto">
                    MÉTRICA COMPARATIVA
                  </div>
                  <div className="text-right font-bold text-[16px] text-white flex items-center justify-end gap-2">
                    {homeTeam?.name} ({game.home})
                    <span 
                      className="w-3.5 h-3.5 rounded-full" 
                      style={{ backgroundColor: homeTeam?.primaryColor }} 
                    />
                  </div>
                </div>

                {/* Metric Rows */}
                <div className="space-y-3 font-mono text-[13px]">
                  {[
                    { label: 'Récord Temporada', vis: `${game.visitorTeamStatsBeforeGame.wins}-${game.visitorTeamStatsBeforeGame.losses}`, hom: `${game.homeTeamStatsBeforeGame.wins}-${game.homeTeamStatsBeforeGame.losses}`, better: game.visitorTeamStatsBeforeGame.winPct > game.homeTeamStatsBeforeGame.winPct ? 'vis' : 'hom' },
                    { label: 'Offensive Rating (ORtg)', vis: game.visitorTeamStatsBeforeGame.offRating.toFixed(1), hom: game.homeTeamStatsBeforeGame.offRating.toFixed(1), better: game.visitorTeamStatsBeforeGame.offRating > game.homeTeamStatsBeforeGame.offRating ? 'vis' : 'hom' },
                    { label: 'Defensive Rating (DRtg)', vis: game.visitorTeamStatsBeforeGame.defRating.toFixed(1), hom: game.homeTeamStatsBeforeGame.defRating.toFixed(1), better: game.visitorTeamStatsBeforeGame.defRating < game.homeTeamStatsBeforeGame.defRating ? 'vis' : 'hom' },
                    { label: 'Net Rating', vis: (game.visitorTeamStatsBeforeGame.netRating > 0 ? `+${game.visitorTeamStatsBeforeGame.netRating}` : `${game.visitorTeamStatsBeforeGame.netRating}`), hom: (game.homeTeamStatsBeforeGame.netRating > 0 ? `+${game.homeTeamStatsBeforeGame.netRating}` : `${game.homeTeamStatsBeforeGame.netRating}`), better: game.visitorTeamStatsBeforeGame.netRating > game.homeTeamStatsBeforeGame.netRating ? 'vis' : 'hom' },
                    { label: 'Pace (Posesiones/48 min)', vis: game.visitorTeamStatsBeforeGame.pace.toFixed(1), hom: game.homeTeamStatsBeforeGame.pace.toFixed(1), better: 'none' },
                    { label: 'Promedio Pts Anotados (PPG)', vis: game.visitorTeamStatsBeforeGame.ptsForAvg.toFixed(1), hom: game.homeTeamStatsBeforeGame.ptsForAvg.toFixed(1), better: game.visitorTeamStatsBeforeGame.ptsForAvg > game.homeTeamStatsBeforeGame.ptsForAvg ? 'vis' : 'hom' },
                    { label: 'Promedio Pts Recibidos', vis: game.visitorTeamStatsBeforeGame.ptsAgainstAvg.toFixed(1), hom: game.homeTeamStatsBeforeGame.ptsAgainstAvg.toFixed(1), better: game.visitorTeamStatsBeforeGame.ptsAgainstAvg < game.homeTeamStatsBeforeGame.ptsAgainstAvg ? 'vis' : 'hom' },
                    { label: 'Últimos 10 Partidos', vis: game.visitorTeamStatsBeforeGame.last10Record, hom: game.homeTeamStatsBeforeGame.last10Record, better: 'none' },
                    { label: 'Racha Actual', vis: game.visitorTeamStatsBeforeGame.streak, hom: game.homeTeamStatsBeforeGame.streak, better: game.visitorTeamStatsBeforeGame.streak.startsWith('W') && !game.homeTeamStatsBeforeGame.streak.startsWith('W') ? 'vis' : 'hom' },
                    { label: 'Días de Descanso', vis: `${game.visitorTeamStatsBeforeGame.restDays} días`, hom: `${game.homeTeamStatsBeforeGame.restDays} días`, better: game.visitorTeamStatsBeforeGame.restDays > game.homeTeamStatsBeforeGame.restDays ? 'vis' : 'hom' },
                    { label: 'Elo Rating Actual', vis: game.visitorTeamStatsBeforeGame.elo, hom: game.homeTeamStatsBeforeGame.elo, better: game.visitorTeamStatsBeforeGame.elo > game.homeTeamStatsBeforeGame.elo ? 'vis' : 'hom' }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 py-2 border-b border-white/[0.03] items-center hover:bg-white/[0.02] px-2 rounded">
                      <div className={`text-left font-bold ${row.better === 'vis' ? 'text-[var(--green)]' : 'text-white'}`}>
                        {row.vis}
                      </div>
                      <div className="text-center text-[11px] text-[var(--text-dim)] uppercase">
                        {row.label}
                      </div>
                      <div className={`text-right font-bold ${row.better === 'hom' ? 'text-[var(--green)]' : 'text-white'}`}>
                        {row.hom}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTIVE MODEL BREAKDOWN */}
          {activeTab === 'prediction' && (
            <div className="space-y-5">
              
              {/* Optimization Tier Banner */}
              <div className="p-3.5 rounded-xl border border-[var(--green-border)] bg-[var(--green-bg)] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--green)]" />
                  <span className="text-[12px] font-bold text-white font-mono">
                    Modelo Predictivo Optimizado ML v3.0
                  </span>
                  <span className="text-[10px] text-[var(--green)] font-mono font-semibold px-2 py-0.5 rounded bg-black/40">
                    Estadísticas Jugadores + Bajas Médicas + Métricas al Momento
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-dim)]">
                  Algoritmo entrenado con la temporada 2025-2026
                </span>
              </div>

              {/* Status Action Banner if match is Scheduled */}
              {!isFinished && (
                <div className="p-3.5 rounded-xl border border-cyan-500/35 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-white font-sans">
                        Este partido figura como Programado ({game.display})
                      </span>
                      <p className="text-[11px] text-cyan-300/80 font-sans">
                        ¿Este partido ya fue realizado en la NBA? Pulsa para sincronizar su marcador oficial y box score.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onToggleGameStatus && (
                      <button
                        onClick={() => onToggleGameStatus(game.id, true)}
                        className="px-3.5 py-1.5 rounded-lg bg-[var(--green)] text-black font-bold text-[11px] font-mono flex items-center gap-1.5 hover:bg-[#34ff74] transition-all cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sincronizar a Resultado Final</span>
                      </button>
                    )}
                    {onRefreshData && (
                      <button
                        onClick={onRefreshData}
                        className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-[#121b2b] text-cyan-200 hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Refrescar Datos</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Prediction Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Win Probabilities */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
                      PROBABILIDAD PREDICTIVA
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[13px] font-bold text-white">{game.visitor}</span>
                        <div className="text-[20px] font-black text-white">{game.prediction.visitorProb}%</div>
                      </div>
                      <span className="text-[11px] text-[var(--text-faint)] font-mono">VS</span>
                      <div className="text-right">
                        <span className="text-[13px] font-bold text-white">{game.home}</span>
                        <div className="text-[20px] font-black text-[var(--green)]">{game.prediction.homeProb}%</div>
                      </div>
                    </div>

                    {/* Visual Bar */}
                    <div className="mt-3 h-2.5 w-full rounded-full bg-[var(--surface-3)] overflow-hidden flex">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${game.prediction.visitorProb}%` }} 
                      />
                      <div 
                        className="h-full bg-[var(--green)] transition-all duration-300"
                        style={{ width: `${game.prediction.homeProb}%` }} 
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between items-center text-[11px]">
                    <span className="text-[var(--text-dim)]">Ganador Proyectado:</span>
                    <span className="font-bold text-[var(--green)]">{game.prediction.predictedWinner}</span>
                  </div>
                </div>

                {/* Score Projection vs Real */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
                      MARCADOR: MODELO VS REAL
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-[#141420] border border-white/5">
                        <span className="text-[10px] text-[var(--text-faint)] block">PROYECTADO</span>
                        <span className="text-[17px] font-black text-white font-mono">
                          {game.prediction.predictedVisitorPts} - {game.prediction.predictedHomePts}
                        </span>
                        <span className="text-[10px] text-[var(--text-dim)] block">
                          Total: {game.prediction.predictedTotal}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#141420] border border-white/5">
                        <span className="text-[10px] text-[var(--text-faint)] block">REAL FINAL</span>
                        {isFinished ? (
                          <>
                            <span className="text-[17px] font-black text-[var(--green)] font-mono">
                              {game.vPts} - {game.hPts}
                            </span>
                            <span className="text-[10px] text-[var(--text-dim)] block">
                              Total: {game.vPts + game.hPts}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[17px] font-bold text-amber-300 font-mono">
                              — - —
                            </span>
                            <span className="text-[10px] text-amber-300/80 block font-sans">
                              Por disputar
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between items-center text-[11px]">
                    <span className="text-[var(--text-dim)]">Hándicap Estimado:</span>
                    <span className="font-mono font-bold text-white">
                      {game.home} {game.prediction.predictedSpread > 0 ? `-${game.prediction.predictedSpread}` : `+${Math.abs(game.prediction.predictedSpread)}`}
                    </span>
                  </div>
                </div>

                {/* Verdict & Confidence */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
                      EVALUACIÓN DEL MODELO
                    </span>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#141420]">
                        <span className="text-[11px] text-[var(--text-dim)]">Acierto Ganador (SU):</span>
                        {!isFinished ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <span>⏳</span> PENDIENTE
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                            game.prediction.correctWinner
                              ? 'bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {game.prediction.correctWinner ? '✓ ACERTADO' : '✗ FALLADO'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#141420]">
                        <span className="text-[11px] text-[var(--text-dim)]">Línea Altas/Bajas:</span>
                        {!isFinished ? (
                          <span className="text-[11px] font-mono text-amber-300/90">
                            Proj: {game.prediction.predictedOU} (Pendiente)
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-white">
                            Proj: {game.prediction.predictedOU} ({game.prediction.ouResult})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border)] flex justify-between items-center text-[11px]">
                    <span className="text-[var(--text-dim)]">Confianza del Algoritmo:</span>
                    <span className="font-bold text-[var(--accent)] font-mono">{game.prediction.confidence}</span>
                  </div>
                </div>
              </div>

              {/* Factors Breakdown Table (7 quantitative factors) */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                  <Award className="w-4 h-4 text-[var(--green)]" />
                  <h3 className="font-bold text-white text-[14px]">
                    Desglose de Factores del Modelo Optimizado (Basketball-Reference Standards)
                  </h3>
                </div>

                <div className="space-y-2.5 font-mono text-[12px]">
                  {/* Factor 1: HCA */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <span className="text-white font-semibold">1. Ventaja de Cancha Local (Home Court Advantage)</span>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Ponderación estándar de la NBA calculada sobre temporadas oficiales en Basketball-Reference.
                      </p>
                    </div>
                    <span className="text-[var(--green)] font-bold text-[13px]">
                      +{game.prediction.factors.homeCourtAdvantage} pts
                    </span>
                  </div>

                  {/* Factor 2: Net Rating */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <span className="text-white font-semibold">2. Diferencial de Eficiencia Neta al Momento (ORtg - DRtg)</span>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Puntos anotados y recibidos por 100 posesiones acumulados hasta el día de este juego.
                      </p>
                    </div>
                    <span className={`font-bold text-[13px] ${game.prediction.factors.netRatingDiff >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                      {game.prediction.factors.netRatingDiff > 0 ? `+${game.prediction.factors.netRatingDiff}` : game.prediction.factors.netRatingDiff} pts
                    </span>
                  </div>

                  {/* Factor 3: Rest & B2B */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <span className="text-white font-semibold">3. Factor Descanso &amp; Fatiga (Back-to-Back Penalty)</span>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        {game.visitor}: {game.visitorTeamStatsBeforeGame.restDays} días rest | {game.home}: {game.homeTeamStatsBeforeGame.restDays} días rest.
                      </p>
                    </div>
                    <span className={`font-bold text-[13px] ${game.prediction.factors.restAdvantage >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                      {game.prediction.factors.restAdvantage > 0 ? `+${game.prediction.factors.restAdvantage}` : game.prediction.factors.restAdvantage} pts
                    </span>
                  </div>

                  {/* Factor 4: Form Trend */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <span className="text-white font-semibold">4. Tendencia de Racha &amp; Forma (Last 10 Games)</span>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Récord reciente de victorias en los últimos 10 encuentros disputados antes de esta fecha.
                      </p>
                    </div>
                    <span className={`font-bold text-[13px] ${game.prediction.factors.formTrendDiff >= 0 ? 'text-[var(--green)]' : 'text-red-400'}`}>
                      {game.prediction.factors.formTrendDiff > 0 ? `+${game.prediction.factors.formTrendDiff}` : game.prediction.factors.formTrendDiff} pts
                    </span>
                  </div>

                  {/* Factor 5: Dynamic Elo */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <span className="text-white font-semibold">5. Diferencial Dinámico de Rating Elo</span>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Rating Elo que se actualiza partido a partido según margen de victoria acumulado.
                      </p>
                    </div>
                    <span className="text-white font-bold text-[13px]">
                      {game.prediction.factors.eloDiff > 0 ? `+${game.prediction.factors.eloDiff}` : game.prediction.factors.eloDiff} Elo
                    </span>
                  </div>

                  {/* Factor 6: Injury Impact */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold">6. Impacto de Bajas &amp; Lesionados al Momento del Partido</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                          Optimizado
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Penalización cuantitativa según el VORP y puntos esperados de jugadores no disponibles en este encuentro.
                      </p>
                    </div>
                    <span className={`font-bold text-[13px] ${
                      (game.prediction.factors.injuryImpactDiff || 0) >= 0 ? 'text-[var(--green)]' : 'text-red-400'
                    }`}>
                      {(game.prediction.factors.injuryImpactDiff || 0) > 0 ? `+${game.prediction.factors.injuryImpactDiff}` : (game.prediction.factors.injuryImpactDiff || 0)} pts
                    </span>
                  </div>

                  {/* Factor 7: Active Roster Power */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141420] border border-white/[0.03]">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold">7. Calidad &amp; Eficiencia del Quinteto Activo (PER / VORP)</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                          Optimizado
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-dim)] font-sans">
                        Diferencial en Player Efficiency Rating (PER) de los jugadores disponibles que realmente disputan el partido.
                      </p>
                    </div>
                    <span className={`font-bold text-[13px] ${
                      (game.prediction.factors.activeRosterPowerDiff || 0) >= 0 ? 'text-[var(--green)]' : 'text-red-400'
                    }`}>
                      {(game.prediction.factors.activeRosterPowerDiff || 0) > 0 ? `+${game.prediction.factors.activeRosterPowerDiff}` : (game.prediction.factors.activeRosterPowerDiff || 0)} pts
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#141420] border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[var(--text-dim)]">
            Auditoría Basketball-Reference • 2025-2026 • Estadísticas cronológicas y reporte médico verificados
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--green)] text-black text-[12px] font-bold tracking-wider hover:opacity-90 transition-opacity"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
