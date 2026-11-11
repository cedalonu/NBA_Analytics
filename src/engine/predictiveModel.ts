import { TeamSeasonStats, GamePrediction, PlayerCumulativeStats, PlayerInjury, ModelWeights } from '../types/nba';

export const DEFAULT_OPTIMIZED_WEIGHTS: ModelWeights = {
  homeCourtAdvantage: 3.1,       // NBA empirical home court advantage (~3.1 pts)
  netRatingWeight: 0.48,          // Impact of team net efficiency at match time
  injuryImpactWeight: 0.95,       // High sensitivity to missing star/rotation players
  rosterPowerWeight: 0.82,        // Active players cumulative PER/VORP quality
  restAdvantageWeight: 1.25,      // Fatigue & Back-to-Back (B2B) penalty
  formTrendWeight: 3.5,           // Momentum from last 10 games
  eloWeight: 0.36,                // Dynamic Elo difference contribution
  logisticScale: 11.2,            // Modern NBA logistic margin standard deviation
  overlapDecayGames: 20           // Bayesian gradual overlap window with prior season
};

export const BASELINE_UNOPTIMIZED_WEIGHTS: ModelWeights = {
  homeCourtAdvantage: 2.8,
  netRatingWeight: 0.32,
  injuryImpactWeight: 0.0,        // Baseline ignores injuries completely
  rosterPowerWeight: 0.0,         // Baseline ignores individual player metrics
  restAdvantageWeight: 0.6,
  formTrendWeight: 1.8,
  eloWeight: 0.22,
  logisticScale: 12.5,
  overlapDecayGames: 0            // Baseline does not use gradual overlap
};

export interface ModelTrainingFeatures {
  homeCourtAdvantage: number;
  netRatingDiff: number;
  injuryImpactDiff: number;
  activeRosterPowerDiff: number;
  restAdvantage: number;
  formTrendDiff: number;
  eloDiff: number;
}

// Calculate the net point impact of missing players (Injuries / Inactive)
export function calculateInjuryImpact(injuries: PlayerInjury[] = []): number {
  return injuries
    .filter((inj) => inj.status === 'OUT')
    .reduce((sum, inj) => sum + (inj.pointValueImpact || 0), 0);
}

// Calculate Star Power & Rotation Quality from active players' stats at match time
// Integrates minutes played per game and rate production (Per-36 / PER)
export function calculateActiveRosterPower(
  players: PlayerCumulativeStats[] = [], 
  injuries: PlayerInjury[] = []
): number {
  const outIds = new Set(injuries.filter((inj) => inj.status === 'OUT').map((inj) => inj.playerId));
  const active = players.filter((p) => !outIds.has(p.playerId));

  if (active.length === 0) return 15.0; // League average baseline PER

  // Sort active players by PER / VORP
  const sorted = [...active].sort((a, b) => (b.per || 15) - (a.per || 15));
  
  // Weight top 5 stars higher using usage tier scaled by minutes played
  // In the NBA, top players logging 32-36 min control the game outcome
  const tierWeights = [0.35, 0.25, 0.20, 0.12, 0.08];
  let weightedPer = 0;
  let totalW = 0;

  for (let i = 0; i < Math.min(5, sorted.length); i++) {
    const p = sorted[i];
    const val = p.per || 15;
    // Minute normalization factor: players playing heavy minutes (34+ min) carry more weight
    const minFactor = Math.min(1.25, Math.max(0.65, (p.min || 28) / 30));
    const effectiveWeight = tierWeights[i] * minFactor;
    weightedPer += val * effectiveWeight;
    totalW += effectiveWeight;
  }

  return totalW > 0 ? weightedPer / totalW : 15.0;
}

export function computeGamePrediction(
  visitorStats: TeamSeasonStats,
  homeStats: TeamSeasonStats,
  visitorRestDays: number,
  homeRestDays: number,
  visitorInjuries: PlayerInjury[] = [],
  homeInjuries: PlayerInjury[] = [],
  visitorPlayers: PlayerCumulativeStats[] = [],
  homePlayers: PlayerCumulativeStats[] = [],
  weights: ModelWeights = DEFAULT_OPTIMIZED_WEIGHTS
): GamePrediction {
  const LEAGUE_AVG_ORTG = 114.5;
  const LEAGUE_AVG_PACE = 99.2;

  // 1. Injury Impact Analysis (Player availability at game time)
  const visInjuryPenalty = calculateInjuryImpact(visitorInjuries);
  const homInjuryPenalty = calculateInjuryImpact(homeInjuries);
  // From Home perspective: Visitor missing players benefits Home (+), Home missing hurts Home (-)
  const rawInjuryDiff = visInjuryPenalty - homInjuryPenalty;
  const injuryImpactDiff = Math.round(rawInjuryDiff * 10) / 10;

  // 2. Active Player Quality Differential (from cumulative player stats up to this date)
  const visRosterPower = calculateActiveRosterPower(visitorPlayers, visitorInjuries);
  const homRosterPower = calculateActiveRosterPower(homePlayers, homeInjuries);
  // Differential in active player efficiency rating scaled to point spread
  const rawRosterDiff = (homRosterPower - visRosterPower) * 0.75;
  const activeRosterPowerDiff = Math.round(rawRosterDiff * 10) / 10;

  // 3. Rest Advantage calculation (B2B penalty calibrated)
  let rawRest = 0;
  if (homeRestDays === 0) rawRest -= 2.4; // Home Back-to-Back fatigue
  if (homeRestDays >= 2) rawRest += 1.0;
  if (visitorRestDays === 0) rawRest += 3.0; // Away Back-to-Back fatigue (extra travel penalty)
  if (visitorRestDays >= 2) rawRest -= 1.0;
  const restAdvantage = Math.round(rawRest * 10) / 10;

  // 4. Net Rating & Efficiency differential (team stats at match time)
  const homeNet = homeStats.netRating;
  const visNet = visitorStats.netRating;
  const netRatingDiff = Math.round((homeNet - visNet) * weights.netRatingWeight * 10) / 10;

  // 5. Elo differential
  const eloDiff = homeStats.elo - visitorStats.elo;
  const eloSpreadContribution = (eloDiff / 28) * weights.eloWeight;

  // 6. Form Trend differential (from team's last 10 games)
  const parseLast10 = (record: string) => {
    const parts = record.split('-');
    if (parts.length === 2) {
      const w = parseInt(parts[0], 10) || 5;
      return (w / 10) - 0.5;
    }
    return 0;
  };
  const homeTrend = parseLast10(homeStats.last10Record);
  const visTrend = parseLast10(visitorStats.last10Record);
  const formTrendDiff = Math.round((homeTrend - visTrend) * weights.formTrendWeight * 10) / 10;

  // 7. COMPOSITE OPTIMIZED SPREAD FORMULA
  // Incorporates team stats at match time, player stats, and injury availability
  const projectedSpread = 
    weights.homeCourtAdvantage + 
    netRatingDiff + 
    (injuryImpactDiff * weights.injuryImpactWeight) + 
    (activeRosterPowerDiff * weights.rosterPowerWeight) + 
    (restAdvantage * weights.restAdvantageWeight) + 
    formTrendDiff + 
    eloSpreadContribution;

  // 8. Expected Pace & Total Points adjusted for injuries and defensive matchup
  const expectedPace = (homeStats.pace + visitorStats.pace) / 2 || LEAGUE_AVG_PACE;
  const homeExpectedOff = (homeStats.offRating + visitorStats.defRating) / 2 - (homInjuryPenalty * 0.45) || LEAGUE_AVG_ORTG;
  const visExpectedOff = (visitorStats.offRating + homeStats.defRating) / 2 - (visInjuryPenalty * 0.45) || LEAGUE_AVG_ORTG;

  const baseHomePts = (homeExpectedOff * expectedPace) / 100 + (weights.homeCourtAdvantage / 2);
  const baseVisPts = (visExpectedOff * expectedPace) / 100 - (weights.homeCourtAdvantage / 2);

  const predictedHomePts = Math.round((baseHomePts + (projectedSpread / 2)) * 10) / 10;
  const predictedVisitorPts = Math.round((baseVisPts - (projectedSpread / 2)) * 10) / 10;
  const predictedTotal = Math.round((predictedHomePts + predictedVisitorPts) * 10) / 10;

  // 9. Calibrated Logistic Win Probability (Modern NBA margin SD)
  const homeProbRaw = 1 / (1 + Math.pow(10, -projectedSpread / weights.logisticScale));
  const homeProb = Math.min(0.95, Math.max(0.05, homeProbRaw));
  const visitorProb = 1 - homeProb;

  const predictedWinner = homeProb >= 0.5 ? homeStats.teamCode : visitorStats.teamCode;

  // 10. Confidence Tier based on ML probability distance and spread
  let confidence: 'ALTA' | 'MEDIA' | 'VALOR' = 'MEDIA';
  const marginAbs = Math.abs(projectedSpread);
  if (marginAbs >= 6.5 || homeProb >= 0.72 || homeProb <= 0.28) {
    confidence = 'ALTA';
  } else if (marginAbs <= 2.8 && Math.abs(homeProb - 0.5) < 0.08) {
    confidence = 'VALOR';
  }

  return {
    predictedWinner,
    visitorProb: Math.round(visitorProb * 1000) / 10,
    homeProb: Math.round(homeProb * 1000) / 10,
    predictedVisitorPts: Math.round(predictedVisitorPts),
    predictedHomePts: Math.round(predictedHomePts),
    predictedSpread: Math.round(projectedSpread * 10) / 10,
    predictedTotal: Math.round(predictedTotal * 10) / 10,
    confidence,
    factors: {
      homeCourtAdvantage: weights.homeCourtAdvantage,
      netRatingDiff,
      restAdvantage,
      formTrendDiff,
      eloDiff: Math.round(eloDiff),
      injuryImpactDiff,
      activeRosterPowerDiff
    },
    evaluated: false,
    correctWinner: false,
    spreadCovered: false,
    predictedOU: predictedTotal >= 226 ? 'OVER' : 'UNDER',
    ouResult: 'PUSH',
    optimizationTier: weights.injuryImpactWeight > 0 ? 'ML_V3_OPTIMIZED_PLAYERS_INJURIES' : 'BASELINE_UNOPTIMIZED'
  };
}
