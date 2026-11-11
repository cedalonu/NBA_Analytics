export type Conference = 'East' | 'West';
export type Division = 'Atlantic' | 'Central' | 'Southeast' | 'Northwest' | 'Pacific' | 'Southwest';

export interface Team {
  code: string;        // e.g. "BOS"
  name: string;        // e.g. "Boston Celtics"
  city: string;        // e.g. "Boston"
  nickname: string;    // e.g. "Celtics"
  conference: Conference;
  division: Division;
  primaryColor: string;
  secondaryColor: string;
  baseOffRating: number;
  baseDefRating: number;
  basePace: number;
}

export interface Player {
  id: string;
  name: string;
  teamCode: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  number: number;
  basePpg: number;
  baseRpg: number;
  baseApg: number;
  baseFgPct: number;
  baseTpPct: number;
  basePer: number;
  baseMinutes: number;
  // Prior season baseline for gradual Bayesian overlap
  priorTeamCode?: string;
  isTransferred?: boolean;
  transferNote?: string;
  priorPpg?: number;
  priorRpg?: number;
  priorApg?: number;
  priorPer?: number;
  priorMinutes?: number;
  priorFgPct?: number;
  priorTpPct?: number;
}

export interface PlayerInjury {
  playerId: string;
  playerName: string;
  teamCode: string;
  status: 'OUT' | 'QUESTIONABLE' | 'ACTIVE';
  reason: string;
  pointValueImpact: number; // point drop if player is OUT
}

export interface StartingLineupPlayer {
  pos: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  name: string;
  isQuestionable?: boolean;
  statusBadge?: string;
  projectedMin?: number;
}

export interface MayNotPlayPlayer {
  pos: string;
  name: string;
  status: 'Out' | 'Ques' | 'Doubtful';
  reason?: string;
  pointImpact?: number;
}

export interface OfficialGameLineup {
  visitorLineup: StartingLineupPlayer[];
  homeLineup: StartingLineupPlayer[];
  visitorMayNotPlay: MayNotPlayPlayer[];
  homeMayNotPlay: MayNotPlayPlayer[];
  moneyline?: string;
  spread?: string;
  overUnder?: string;
  referees?: string;
  sourceUrl?: string;
}

export interface PlayerBoxScore {
  playerId: string;
  name: string;
  teamCode: string;
  pos: string;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fgm: number;
  fga: number;
  fg: number; // percentage
  tpm: number;
  tpa: number;
  tp: number; // percentage
  ftm: number;
  fta: number;
  pm: number; // plusMinus
  per: number;
  isInjuredOut?: boolean;
  injuryReason?: string;
}

export interface PlayerCumulativeStats {
  playerId: string;
  name: string;
  teamCode: string;
  pos: string;
  gp: number;
  min: number;  // average minutes
  pts: number;  // blended average points
  reb: number;  // blended average rebounds
  ast: number;  // blended average assists
  fg: number;   // cumulative/blended FG%
  tp: number;   // cumulative/blended 3P%
  per: number;  // blended PER
  pm: number;   // cumulative average +/-
  vorpValue: number; // Estimated Value Over Replacement (Points/100 poss impact)
  
  // Gradual Overlap with prior season (Bayesian shrinkage)
  priorTeamCode?: string;
  isTransferred?: boolean;
  transferNote?: string;
  overlapPriorWeight: number;   // e.g. 0.65 (65% prior season)
  overlapCurrentWeight: number; // e.g. 0.35 (35% current season)
  
  // Per-36 minute statistics (requested by user for minute-normalized impact)
  ptsPer36: number;
  rebPer36: number;
  astPer36: number;
  
  rawSeasonPts?: number;
  rawSeasonMin?: number;
}

export interface TeamSeasonStats {
  teamCode: string;
  gp: number;
  wins: number;
  losses: number;
  winPct: number;
  homeWins: number;
  homeLosses: number;
  awayWins: number;
  awayLosses: number;
  ptsForAvg: number;
  ptsAgainstAvg: number;
  netRating: number;
  offRating: number;
  defRating: number;
  pace: number;
  streak: string;
  last10Record: string;
  restDays: number;
  elo: number;
  starPowerIndex?: number;
}

export interface PastGameSummary {
  gameId: string;
  dateIso: string;
  displayDate: string;
  opponentCode: string;
  isHome: boolean;
  teamScore: number;
  oppScore: number;
  won: boolean;
  margin: number;
  ot?: string;
}

export interface GamePrediction {
  predictedWinner: string;
  visitorProb: number;
  homeProb: number;
  predictedVisitorPts: number;
  predictedHomePts: number;
  predictedSpread: number; // home margin
  predictedTotal: number;
  confidence: 'ALTA' | 'MEDIA' | 'VALOR';
  factors: {
    homeCourtAdvantage: number;
    netRatingDiff: number;
    restAdvantage: number;
    formTrendDiff: number;
    eloDiff: number;
    injuryImpactDiff: number; // Net point adjustment due to injuries/inactives
    activeRosterPowerDiff: number; // Star availability differential
  };
  evaluated: boolean;
  correctWinner?: boolean;
  spreadCovered?: boolean;
  predictedOU: 'OVER' | 'UNDER';
  ouResult?: 'OVER' | 'UNDER' | 'PUSH' | 'PENDIENTE';
  optimizationTier: string;
}

export interface Game {
  id: string;
  iso: string;         // "2025-10-21"
  display: string;     // "Oct 21"
  monthKey: string;    // "2025-10"
  monthLabel: string;  // "Oct 2025"
  time: string;        // "19:30 ET"
  visitor: string;
  vPts: number;
  home: string;
  hPts: number;
  margin: number;
  ot?: string;
  verified: boolean;
  isFinished: boolean; // true for played games, false for upcoming games
  status: 'FINAL' | 'SCHEDULED' | 'LIVE';
  projVPts?: number;
  projHPts?: number;
  prediction: GamePrediction;
  visitorBoxScore: PlayerBoxScore[];
  homeBoxScore: PlayerBoxScore[];
  visitorStatsBeforeGame: PlayerCumulativeStats[];
  homeStatsBeforeGame: PlayerCumulativeStats[];
  visitorTeamStatsBeforeGame: TeamSeasonStats;
  homeTeamStatsBeforeGame: TeamSeasonStats;
  visitorLast10BeforeGame: PastGameSummary[];
  homeLast10BeforeGame: PastGameSummary[];
  visitorInjuries: PlayerInjury[];
  homeInjuries: PlayerInjury[];
  lineup?: OfficialGameLineup;
  bbrVerifiedNote?: string;
  season?: SeasonKey;
}

export type SeasonKey = '2026-2027' | '2025-2026';

export interface ModelWeights {
  homeCourtAdvantage: number;
  netRatingWeight: number;
  injuryImpactWeight: number;
  rosterPowerWeight: number;
  restAdvantageWeight: number;
  formTrendWeight: number;
  eloWeight: number;
  logisticScale: number;
  overlapDecayGames: number; // Games to blend prior season stats (default 20 games)
}

export interface TrainingComparison {
  season?: SeasonKey;
  baselineAccuracy: number;
  baselineAts: number;
  baselineMae: number;
  optimizedAccuracy: number;
  optimizedAts: number;
  optimizedMae: number;
  gamesEvaluated: number;
  scheduledGamesCount?: number;
  totalGamesInSeason?: number;
  injuryAccuracyImpact: number;
  playerStatsImpact: number;
  overlapPriorImpact: number; // Gain from Bayesian gradual overlap with prior season
  earlySeasonAccuracy: number; // Oct-Nov early games accuracy with prior overlap
  lateSeasonAccuracy: number;  // Dec-Apr games accuracy
  weights: ModelWeights;
  featuresUsed: {
    name: string;
    description: string;
    weight: number;
    importancePct: number;
  }[];
}

