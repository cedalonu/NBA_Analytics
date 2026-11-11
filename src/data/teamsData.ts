import { Team, Player } from '../types/nba';

export const NBA_TEAMS: Team[] = [
  // Eastern - Atlantic
  { code: 'BOS', name: 'Boston Celtics', city: 'Boston', nickname: 'Celtics', conference: 'East', division: 'Atlantic', primaryColor: '#007A33', secondaryColor: '#BA9653', baseOffRating: 121.2, baseDefRating: 110.1, basePace: 98.5 },
  { code: 'BRK', name: 'Brooklyn Nets', city: 'Brooklyn', nickname: 'Nets', conference: 'East', division: 'Atlantic', primaryColor: '#000000', secondaryColor: '#FFFFFF', baseOffRating: 110.5, baseDefRating: 117.2, basePace: 97.8 },
  { code: 'NYK', name: 'New York Knicks', city: 'New York', nickname: 'Knicks', conference: 'East', division: 'Atlantic', primaryColor: '#006BB6', secondaryColor: '#F58426', baseOffRating: 118.8, baseDefRating: 112.4, basePace: 96.2 },
  { code: 'PHI', name: 'Philadelphia 76ers', city: 'Philadelphia', nickname: '76ers', conference: 'East', division: 'Atlantic', primaryColor: '#006BB6', secondaryColor: '#ED174C', baseOffRating: 114.6, baseDefRating: 114.2, basePace: 98.1 },
  { code: 'TOR', name: 'Toronto Raptors', city: 'Toronto', nickname: 'Raptors', conference: 'East', division: 'Atlantic', primaryColor: '#CE1141', secondaryColor: '#000000', baseOffRating: 112.4, baseDefRating: 116.8, basePace: 99.4 },

  // Eastern - Central
  { code: 'CHI', name: 'Chicago Bulls', city: 'Chicago', nickname: 'Bulls', conference: 'East', division: 'Central', primaryColor: '#CE1141', secondaryColor: '#000000', baseOffRating: 113.8, baseDefRating: 115.5, basePace: 101.2 },
  { code: 'CLE', name: 'Cleveland Cavaliers', city: 'Cleveland', nickname: 'Cavaliers', conference: 'East', division: 'Central', primaryColor: '#860038', secondaryColor: '#041E42', baseOffRating: 119.5, baseDefRating: 109.8, basePace: 99.1 },
  { code: 'DET', name: 'Detroit Pistons', city: 'Detroit', nickname: 'Pistons', conference: 'East', division: 'Central', primaryColor: '#1D42BA', secondaryColor: '#C8102E', baseOffRating: 112.2, baseDefRating: 116.0, basePace: 99.8 },
  { code: 'IND', name: 'Indiana Pacers', city: 'Indiana', nickname: 'Pacers', conference: 'East', division: 'Central', primaryColor: '#002D62', secondaryColor: '#FDBB30', baseOffRating: 118.2, baseDefRating: 117.6, basePace: 102.5 },
  { code: 'MIL', name: 'Milwaukee Bucks', city: 'Milwaukee', nickname: 'Bucks', conference: 'East', division: 'Central', primaryColor: '#00471B', secondaryColor: '#EEE1C6', baseOffRating: 117.8, baseDefRating: 113.5, basePace: 99.2 },

  // Eastern - Southeast
  { code: 'ATL', name: 'Atlanta Hawks', city: 'Atlanta', nickname: 'Hawks', conference: 'East', division: 'Southeast', primaryColor: '#E03A3E', secondaryColor: '#C1D32F', baseOffRating: 115.0, baseDefRating: 117.5, basePace: 102.1 },
  { code: 'CHA', name: 'Charlotte Hornets', city: 'Charlotte', nickname: 'Hornets', conference: 'East', division: 'Southeast', primaryColor: '#1D1160', secondaryColor: '#00788C', baseOffRating: 111.0, baseDefRating: 117.9, basePace: 98.7 },
  { code: 'MIA', name: 'Miami Heat', city: 'Miami', nickname: 'Heat', conference: 'East', division: 'Southeast', primaryColor: '#98002E', secondaryColor: '#F9A01B', baseOffRating: 114.2, baseDefRating: 111.8, basePace: 96.9 },
  { code: 'ORL', name: 'Orlando Magic', city: 'Orlando', nickname: 'Magic', conference: 'East', division: 'Southeast', primaryColor: '#0077C0', secondaryColor: '#C4CED4', baseOffRating: 112.8, baseDefRating: 109.2, basePace: 97.4 },
  { code: 'WAS', name: 'Washington Wizards', city: 'Washington', nickname: 'Wizards', conference: 'East', division: 'Southeast', primaryColor: '#002B5C', secondaryColor: '#E31837', baseOffRating: 109.2, baseDefRating: 119.8, basePace: 101.8 },

  // Western - Northwest
  { code: 'DEN', name: 'Denver Nuggets', city: 'Denver', nickname: 'Nuggets', conference: 'West', division: 'Northwest', primaryColor: '#0E2240', secondaryColor: '#FEC524', baseOffRating: 120.4, baseDefRating: 113.1, basePace: 97.9 },
  { code: 'MIN', name: 'Minnesota Timberwolves', city: 'Minnesota', nickname: 'Timberwolves', conference: 'West', division: 'Northwest', primaryColor: '#0C2340', secondaryColor: '#236192', baseOffRating: 116.5, baseDefRating: 108.9, basePace: 98.3 },
  { code: 'OKC', name: 'Oklahoma City Thunder', city: 'Oklahoma City', nickname: 'Thunder', conference: 'West', division: 'Northwest', primaryColor: '#007AC1', secondaryColor: '#EF3B24', baseOffRating: 119.8, baseDefRating: 107.5, basePace: 100.5 },
  { code: 'POR', name: 'Portland Trail Blazers', city: 'Portland', nickname: 'Trail Blazers', conference: 'West', division: 'Northwest', primaryColor: '#E03A3E', secondaryColor: '#000000', baseOffRating: 109.8, baseDefRating: 116.4, basePace: 99.6 },
  { code: 'UTA', name: 'Utah Jazz', city: 'Utah', nickname: 'Jazz', conference: 'West', division: 'Northwest', primaryColor: '#002B5C', secondaryColor: '#F9A01B', baseOffRating: 110.8, baseDefRating: 118.2, basePace: 100.8 },

  // Western - Pacific
  { code: 'GSW', name: 'Golden State Warriors', city: 'Golden State', nickname: 'Warriors', conference: 'West', division: 'Pacific', primaryColor: '#1D428A', secondaryColor: '#FFC72C', baseOffRating: 117.2, baseDefRating: 111.4, basePace: 100.2 },
  { code: 'LAC', name: 'LA Clippers', city: 'Los Angeles', nickname: 'Clippers', conference: 'West', division: 'Pacific', primaryColor: '#1D428A', secondaryColor: '#C8102E', baseOffRating: 114.5, baseDefRating: 112.0, basePace: 97.6 },
  { code: 'LAL', name: 'Los Angeles Lakers', city: 'Los Angeles', nickname: 'Lakers', conference: 'West', division: 'Pacific', primaryColor: '#552583', secondaryColor: '#FDB927', baseOffRating: 116.8, baseDefRating: 113.8, basePace: 100.9 },
  { code: 'PHX', name: 'Phoenix Suns', city: 'Phoenix', nickname: 'Suns', conference: 'West', division: 'Pacific', primaryColor: '#1D1160', secondaryColor: '#E56020', baseOffRating: 117.0, baseDefRating: 114.8, basePace: 98.4 },
  { code: 'SAC', name: 'Sacramento Kings', city: 'Sacramento', nickname: 'Kings', conference: 'West', division: 'Pacific', primaryColor: '#5A2D81', secondaryColor: '#63727A', baseOffRating: 116.2, baseDefRating: 115.0, basePace: 100.0 },

  // Western - Southwest
  { code: 'DAL', name: 'Dallas Mavericks', city: 'Dallas', nickname: 'Mavericks', conference: 'West', division: 'Southwest', primaryColor: '#00538C', secondaryColor: '#002B5E', baseOffRating: 119.2, baseDefRating: 113.0, basePace: 98.8 },
  { code: 'HOU', name: 'Houston Rockets', city: 'Houston', nickname: 'Rockets', conference: 'West', division: 'Southwest', primaryColor: '#CE1141', secondaryColor: '#000000', baseOffRating: 115.8, baseDefRating: 110.5, basePace: 99.5 },
  { code: 'MEM', name: 'Memphis Grizzlies', city: 'Memphis', nickname: 'Grizzlies', conference: 'West', division: 'Southwest', primaryColor: '#5D76A9', secondaryColor: '#12173F', baseOffRating: 117.5, baseDefRating: 112.2, basePace: 101.4 },
  { code: 'NOP', name: 'New Orleans Pelicans', city: 'New Orleans', nickname: 'Pelicans', conference: 'West', division: 'Southwest', primaryColor: '#0C2340', secondaryColor: '#C8102E', baseOffRating: 113.5, baseDefRating: 114.8, basePace: 98.9 },
  { code: 'SAS', name: 'San Antonio Spurs', city: 'San Antonio', nickname: 'Spurs', conference: 'West', division: 'Southwest', primaryColor: '#C4CED4', secondaryColor: '#000000', baseOffRating: 114.8, baseDefRating: 113.2, basePace: 100.4 }
];

export const TEAM_MAP = new Map<string, Team>(NBA_TEAMS.map((t) => [t.code, t]));

// Authentic Top 10 Rosters for all 30 teams with realistic skill baselines
export const NBA_ROSTERS: Record<string, Player[]> = {
  BOS: [
    { id: 'bos-1', name: 'Jayson Tatum', teamCode: 'BOS', position: 'SF', number: 0, basePpg: 27.5, baseRpg: 8.6, baseApg: 5.4, baseFgPct: 47.6, baseTpPct: 37.8, basePer: 24.2, baseMinutes: 35.8 },
    { id: 'bos-2', name: 'Jaylen Brown', teamCode: 'BOS', position: 'SG', number: 7, basePpg: 24.2, baseRpg: 6.1, baseApg: 4.5, baseFgPct: 48.9, baseTpPct: 35.2, basePer: 21.8, baseMinutes: 34.6 },
    { id: 'bos-3', name: 'Derrick White', teamCode: 'BOS', position: 'PG', number: 9, basePpg: 16.4, baseRpg: 4.4, baseApg: 4.8, baseFgPct: 46.1, baseTpPct: 39.4, basePer: 18.5, baseMinutes: 32.7 },
    { id: 'bos-4', name: 'Kristaps Porzingis', teamCode: 'BOS', position: 'C', number: 8, basePpg: 19.8, baseRpg: 7.2, baseApg: 2.1, baseFgPct: 51.5, baseTpPct: 38.0, basePer: 22.4, baseMinutes: 29.5 },
    { id: 'bos-5', name: 'Jrue Holiday', teamCode: 'BOS', position: 'PG', number: 4, basePpg: 13.5, baseRpg: 5.2, baseApg: 4.6, baseFgPct: 47.8, baseTpPct: 42.1, basePer: 16.2, baseMinutes: 31.0 },
    { id: 'bos-6', name: 'Payton Pritchard', teamCode: 'BOS', position: 'PG', number: 11, basePpg: 14.8, baseRpg: 3.3, baseApg: 3.8, baseFgPct: 46.8, baseTpPct: 41.2, basePer: 17.5, baseMinutes: 26.2 },
    { id: 'bos-7', name: 'Al Horford', teamCode: 'BOS', position: 'C', number: 42, basePpg: 8.9, baseRpg: 6.2, baseApg: 2.6, baseFgPct: 49.8, baseTpPct: 39.5, basePer: 14.8, baseMinutes: 25.4 },
    { id: 'bos-8', name: 'Sam Hauser', teamCode: 'BOS', position: 'SF', number: 30, basePpg: 9.2, baseRpg: 3.4, baseApg: 1.2, baseFgPct: 45.2, baseTpPct: 42.6, basePer: 13.4, baseMinutes: 21.5 },
    { id: 'bos-9', name: 'Luke Kornet', teamCode: 'BOS', position: 'C', number: 40, basePpg: 6.2, baseRpg: 4.8, baseApg: 1.4, baseFgPct: 67.2, baseTpPct: 0.0, basePer: 15.6, baseMinutes: 16.8 },
    { id: 'bos-10', name: 'Neemias Queta', teamCode: 'BOS', position: 'C', number: 88, basePpg: 5.5, baseRpg: 4.6, baseApg: 0.8, baseFgPct: 63.8, baseTpPct: 0.0, basePer: 14.2, baseMinutes: 13.5 }
  ],
  LAL: [
    { id: 'lal-1', name: 'Anthony Davis', teamCode: 'LAL', position: 'C', number: 3, basePpg: 28.2, baseRpg: 12.1, baseApg: 3.4, baseFgPct: 54.8, baseTpPct: 29.5, basePer: 27.6, baseMinutes: 35.4 },
    { id: 'lal-2', name: 'LeBron James', teamCode: 'LAL', position: 'SF', number: 23, basePpg: 23.4, baseRpg: 7.9, baseApg: 8.8, baseFgPct: 52.1, baseTpPct: 39.2, basePer: 24.0, baseMinutes: 34.8 },
    { id: 'lal-3', name: 'Austin Reaves', teamCode: 'LAL', position: 'SG', number: 15, basePpg: 17.6, baseRpg: 4.2, baseApg: 5.6, baseFgPct: 46.5, baseTpPct: 37.8, basePer: 17.4, baseMinutes: 33.5 },
    { id: 'lal-4', name: 'D\'Angelo Russell', teamCode: 'LAL', position: 'PG', number: 1, basePpg: 14.8, baseRpg: 2.8, baseApg: 5.2, baseFgPct: 43.8, baseTpPct: 38.5, basePer: 15.8, baseMinutes: 28.6 },
    { id: 'lal-5', name: 'Rui Hachimura', teamCode: 'LAL', position: 'PF', number: 28, basePpg: 13.2, baseRpg: 5.4, baseApg: 1.5, baseFgPct: 50.2, baseTpPct: 40.5, basePer: 15.2, baseMinutes: 29.0 },
    { id: 'lal-6', name: 'Dalton Knecht', teamCode: 'LAL', position: 'SG', number: 4, basePpg: 11.8, baseRpg: 3.1, baseApg: 1.4, baseFgPct: 45.4, baseTpPct: 39.0, basePer: 14.6, baseMinutes: 23.0 },
    { id: 'lal-7', name: 'Jarred Vanderbilt', teamCode: 'LAL', position: 'PF', number: 2, basePpg: 5.8, baseRpg: 5.6, baseApg: 1.3, baseFgPct: 51.2, baseTpPct: 28.0, basePer: 12.8, baseMinutes: 19.5 },
    { id: 'lal-8', name: 'Gabe Vincent', teamCode: 'LAL', position: 'PG', number: 7, basePpg: 6.4, baseRpg: 1.6, baseApg: 2.1, baseFgPct: 39.5, baseTpPct: 34.2, basePer: 9.8, baseMinutes: 18.2 },
    { id: 'lal-9', name: 'Jaxson Hayes', teamCode: 'LAL', position: 'C', number: 11, basePpg: 6.1, baseRpg: 4.4, baseApg: 0.9, baseFgPct: 69.4, baseTpPct: 0.0, basePer: 14.5, baseMinutes: 15.4 },
    { id: 'lal-10', name: 'Max Christie', teamCode: 'LAL', position: 'SG', number: 10, basePpg: 5.2, baseRpg: 2.2, baseApg: 1.1, baseFgPct: 42.1, baseTpPct: 36.8, basePer: 10.4, baseMinutes: 14.0 }
  ],
  GSW: [
    { id: 'gsw-1', name: 'Stephen Curry', teamCode: 'GSW', position: 'PG', number: 30, basePpg: 26.8, baseRpg: 4.8, baseApg: 5.9, baseFgPct: 46.8, baseTpPct: 41.5, basePer: 25.2, baseMinutes: 33.4 },
    { id: 'gsw-2', name: 'Jonathan Kuminga', teamCode: 'GSW', position: 'PF', number: 0, basePpg: 17.5, baseRpg: 5.4, baseApg: 2.6, baseFgPct: 50.8, baseTpPct: 34.2, basePer: 18.2, baseMinutes: 28.2 },
    { id: 'gsw-3', name: 'Buddy Hield', teamCode: 'GSW', position: 'SG', number: 7, basePpg: 16.2, baseRpg: 3.8, baseApg: 2.5, baseFgPct: 45.9, baseTpPct: 40.8, basePer: 17.0, baseMinutes: 27.5 },
    { id: 'gsw-4', name: 'Draymond Green', teamCode: 'GSW', position: 'PF', number: 23, basePpg: 9.4, baseRpg: 7.2, baseApg: 6.4, baseFgPct: 48.5, baseTpPct: 38.6, basePer: 16.5, baseMinutes: 29.8 },
    { id: 'gsw-5', name: 'Andrew Wiggins', teamCode: 'GSW', position: 'SF', number: 22, basePpg: 15.6, baseRpg: 4.7, baseApg: 2.1, baseFgPct: 46.2, baseTpPct: 37.4, basePer: 16.0, baseMinutes: 29.5 },
    { id: 'gsw-6', name: 'Brandin Podziemski', teamCode: 'GSW', position: 'SG', number: 2, basePpg: 10.8, baseRpg: 5.4, baseApg: 3.9, baseFgPct: 44.5, baseTpPct: 36.5, basePer: 14.2, baseMinutes: 25.6 },
    { id: 'gsw-7', name: 'De\'Anthony Melton', teamCode: 'GSW', position: 'PG', number: 8, basePpg: 10.3, baseRpg: 3.3, baseApg: 2.8, baseFgPct: 41.8, baseTpPct: 37.1, basePer: 13.8, baseMinutes: 21.0 },
    { id: 'gsw-8', name: 'Kevon Looney', teamCode: 'GSW', position: 'C', number: 5, basePpg: 5.6, baseRpg: 7.8, baseApg: 1.9, baseFgPct: 61.2, baseTpPct: 0.0, basePer: 15.2, baseMinutes: 18.2 },
    { id: 'gsw-9', name: 'Moses Moody', teamCode: 'GSW', position: 'SG', number: 4, basePpg: 9.8, baseRpg: 2.7, baseApg: 1.3, baseFgPct: 45.0, baseTpPct: 39.8, basePer: 13.5, baseMinutes: 19.4 },
    { id: 'gsw-10', name: 'Kyle Anderson', teamCode: 'GSW', position: 'PF', number: 1, basePpg: 6.2, baseRpg: 3.8, baseApg: 3.2, baseFgPct: 47.0, baseTpPct: 33.3, basePer: 12.8, baseMinutes: 18.0 }
  ],
  OKC: [
    { id: 'okc-1', name: 'Shai Gilgeous-Alexander', teamCode: 'OKC', position: 'PG', number: 2, basePpg: 31.4, baseRpg: 5.8, baseApg: 6.5, baseFgPct: 53.5, baseTpPct: 36.8, basePer: 29.8, baseMinutes: 34.5 },
    { id: 'okc-2', name: 'Jalen Williams', teamCode: 'OKC', position: 'SF', number: 8, basePpg: 21.5, baseRpg: 5.8, baseApg: 5.1, baseFgPct: 52.4, baseTpPct: 41.0, basePer: 21.2, baseMinutes: 33.2 },
    { id: 'okc-3', name: 'Chet Holmgren', teamCode: 'OKC', position: 'C', number: 7, basePpg: 18.2, baseRpg: 8.8, baseApg: 2.6, baseFgPct: 53.0, baseTpPct: 38.5, basePer: 22.8, baseMinutes: 30.8 },
    { id: 'okc-4', name: 'Isaiah Hartenstein', teamCode: 'OKC', position: 'C', number: 55, basePpg: 10.8, baseRpg: 10.2, baseApg: 3.4, baseFgPct: 63.5, baseTpPct: 0.0, basePer: 19.5, baseMinutes: 27.0 },
    { id: 'okc-5', name: 'Luguentz Dort', teamCode: 'OKC', position: 'SG', number: 5, basePpg: 11.4, baseRpg: 3.9, baseApg: 1.6, baseFgPct: 44.8, baseTpPct: 40.2, basePer: 13.6, baseMinutes: 29.0 },
    { id: 'okc-6', name: 'Alex Caruso', teamCode: 'OKC', position: 'PG', number: 9, basePpg: 8.9, baseRpg: 3.4, baseApg: 2.8, baseFgPct: 45.2, baseTpPct: 38.8, basePer: 15.0, baseMinutes: 24.5 },
    { id: 'okc-7', name: 'Cason Wallace', teamCode: 'OKC', position: 'PG', number: 22, basePpg: 8.4, baseRpg: 2.8, baseApg: 2.0, baseFgPct: 47.0, baseTpPct: 39.5, basePer: 12.8, baseMinutes: 23.2 },
    { id: 'okc-8', name: 'Aaron Wiggins', teamCode: 'OKC', position: 'SG', number: 21, basePpg: 9.6, baseRpg: 3.5, baseApg: 1.8, baseFgPct: 52.0, baseTpPct: 42.0, basePer: 14.8, baseMinutes: 19.8 },
    { id: 'okc-9', name: 'Isaiah Joe', teamCode: 'OKC', position: 'SG', number: 11, basePpg: 9.2, baseRpg: 2.4, baseApg: 1.5, baseFgPct: 44.5, baseTpPct: 41.8, basePer: 13.9, baseMinutes: 19.0 },
    { id: 'okc-10', name: 'Jaylin Williams', teamCode: 'OKC', position: 'C', number: 6, basePpg: 5.0, baseRpg: 4.2, baseApg: 1.8, baseFgPct: 46.5, baseTpPct: 37.0, basePer: 12.2, baseMinutes: 14.0 }
  ],
  DEN: [
    { id: 'den-1', name: 'Nikola Jokic', teamCode: 'DEN', position: 'C', number: 15, basePpg: 29.8, baseRpg: 13.2, baseApg: 10.4, baseFgPct: 57.8, baseTpPct: 48.0, basePer: 32.5, baseMinutes: 36.5 },
    { id: 'den-2', name: 'Jamal Murray', teamCode: 'DEN', position: 'PG', number: 27, basePpg: 20.8, baseRpg: 4.2, baseApg: 6.2, baseFgPct: 47.2, baseTpPct: 40.1, basePer: 19.8, baseMinutes: 34.0 },
    { id: 'den-3', name: 'Michael Porter Jr.', teamCode: 'DEN', position: 'SF', number: 1, basePpg: 18.5, baseRpg: 7.5, baseApg: 2.2, baseFgPct: 49.5, baseTpPct: 41.2, basePer: 18.8, baseMinutes: 33.5 },
    { id: 'den-4', name: 'Aaron Gordon', teamCode: 'DEN', position: 'PF', number: 50, basePpg: 15.4, baseRpg: 7.0, baseApg: 3.5, baseFgPct: 56.4, baseTpPct: 37.5, basePer: 18.4, baseMinutes: 32.0 },
    { id: 'den-5', name: 'Christian Braun', teamCode: 'DEN', position: 'SG', number: 0, basePpg: 14.2, baseRpg: 5.1, baseApg: 2.4, baseFgPct: 53.0, baseTpPct: 40.5, basePer: 16.2, baseMinutes: 31.5 },
    { id: 'den-6', name: 'Russell Westbrook', teamCode: 'DEN', position: 'PG', number: 4, basePpg: 11.8, baseRpg: 4.6, baseApg: 5.5, baseFgPct: 41.5, baseTpPct: 31.8, basePer: 14.8, baseMinutes: 24.5 },
    { id: 'den-7', name: 'Peyton Watson', teamCode: 'DEN', position: 'SF', number: 8, basePpg: 8.5, baseRpg: 3.6, baseApg: 1.4, baseFgPct: 46.5, baseTpPct: 34.5, basePer: 12.8, baseMinutes: 21.0 },
    { id: 'den-8', name: 'Julian Strawther', teamCode: 'DEN', position: 'SG', number: 3, basePpg: 9.2, baseRpg: 2.2, baseApg: 1.3, baseFgPct: 43.8, baseTpPct: 37.8, basePer: 12.5, baseMinutes: 18.5 },
    { id: 'den-9', name: 'Dario Saric', teamCode: 'DEN', position: 'C', number: 9, basePpg: 5.4, baseRpg: 3.5, baseApg: 1.6, baseFgPct: 47.0, baseTpPct: 36.2, basePer: 12.0, baseMinutes: 13.5 },
    { id: 'den-10', name: 'DeAndre Jordan', teamCode: 'DEN', position: 'C', number: 6, basePpg: 4.0, baseRpg: 4.8, baseApg: 0.8, baseFgPct: 65.0, baseTpPct: 0.0, basePer: 13.5, baseMinutes: 11.0 }
  ],
  DAL: [
    { id: 'dal-1', name: 'Luka Doncic', teamCode: 'DAL', position: 'PG', number: 77, basePpg: 32.5, baseRpg: 9.2, baseApg: 9.8, baseFgPct: 48.5, baseTpPct: 37.5, basePer: 30.5, baseMinutes: 36.8 },
    { id: 'dal-2', name: 'Kyrie Irving', teamCode: 'DAL', position: 'SG', number: 11, basePpg: 24.8, baseRpg: 4.8, baseApg: 5.2, baseFgPct: 49.5, baseTpPct: 41.2, basePer: 23.2, baseMinutes: 35.0 },
    { id: 'dal-3', name: 'Klay Thompson', teamCode: 'DAL', position: 'SG', number: 31, basePpg: 16.4, baseRpg: 3.6, baseApg: 2.1, baseFgPct: 43.8, baseTpPct: 39.5, basePer: 15.6, baseMinutes: 29.5 },
    { id: 'dal-4', name: 'P.J. Washington', teamCode: 'DAL', position: 'PF', number: 25, basePpg: 13.2, baseRpg: 6.8, baseApg: 1.8, baseFgPct: 45.6, baseTpPct: 35.4, basePer: 15.0, baseMinutes: 30.2 },
    { id: 'dal-5', name: 'Dereck Lively II', teamCode: 'DAL', position: 'C', number: 2, basePpg: 10.5, baseRpg: 8.6, baseApg: 2.2, baseFgPct: 71.0, baseTpPct: 0.0, basePer: 19.8, baseMinutes: 26.5 },
    { id: 'dal-6', name: 'Daniel Gafford', teamCode: 'DAL', position: 'C', number: 21, basePpg: 11.2, baseRpg: 6.9, baseApg: 1.4, baseFgPct: 70.5, baseTpPct: 0.0, basePer: 20.4, baseMinutes: 21.5 },
    { id: 'dal-7', name: 'Naji Marshall', teamCode: 'DAL', position: 'SF', number: 13, basePpg: 8.8, baseRpg: 3.8, baseApg: 2.4, baseFgPct: 47.8, baseTpPct: 36.8, basePer: 13.4, baseMinutes: 22.0 },
    { id: 'dal-8', name: 'Quentin Grimes', teamCode: 'DAL', position: 'SG', number: 5, basePpg: 7.9, baseRpg: 2.6, baseApg: 1.5, baseFgPct: 42.5, baseTpPct: 38.0, basePer: 12.2, baseMinutes: 19.0 },
    { id: 'dal-9', name: 'Jaden Hardy', teamCode: 'DAL', position: 'SG', number: 1, basePpg: 7.8, baseRpg: 1.8, baseApg: 1.6, baseFgPct: 43.0, baseTpPct: 37.2, basePer: 12.8, baseMinutes: 15.5 },
    { id: 'dal-10', name: 'Maxi Kleber', teamCode: 'DAL', position: 'PF', number: 42, basePpg: 4.8, baseRpg: 3.4, baseApg: 1.2, baseFgPct: 44.0, baseTpPct: 36.5, basePer: 10.8, baseMinutes: 16.0 }
  ],
  NYK: [
    { id: 'nyk-1', name: 'Jalen Brunson', teamCode: 'NYK', position: 'PG', number: 11, basePpg: 27.8, baseRpg: 3.5, baseApg: 7.4, baseFgPct: 48.0, baseTpPct: 39.8, basePer: 24.5, baseMinutes: 35.8 },
    { id: 'nyk-2', name: 'Karl-Anthony Towns', teamCode: 'NYK', position: 'C', number: 32, basePpg: 25.2, baseRpg: 12.4, baseApg: 3.1, baseFgPct: 53.2, baseTpPct: 43.5, basePer: 26.2, baseMinutes: 35.2 },
    { id: 'nyk-3', name: 'Mikal Bridges', teamCode: 'NYK', position: 'SG', number: 25, basePpg: 17.5, baseRpg: 4.2, baseApg: 3.6, baseFgPct: 47.5, baseTpPct: 37.2, basePer: 16.8, baseMinutes: 36.5 },
    { id: 'nyk-4', name: 'OG Anunoby', teamCode: 'NYK', position: 'SF', number: 8, basePpg: 16.8, baseRpg: 5.2, baseApg: 2.4, baseFgPct: 48.8, baseTpPct: 38.5, basePer: 17.5, baseMinutes: 35.0 },
    { id: 'nyk-5', name: 'Josh Hart', teamCode: 'NYK', position: 'SG', number: 3, basePpg: 12.4, baseRpg: 8.8, baseApg: 5.5, baseFgPct: 52.0, baseTpPct: 34.0, basePer: 16.2, baseMinutes: 36.0 },
    { id: 'nyk-6', name: 'Miles McBride', teamCode: 'NYK', position: 'PG', number: 2, basePpg: 10.5, baseRpg: 2.4, baseApg: 2.8, baseFgPct: 44.5, baseTpPct: 40.2, basePer: 14.0, baseMinutes: 23.5 },
    { id: 'nyk-7', name: 'Cameron Payne', teamCode: 'NYK', position: 'PG', number: 1, basePpg: 6.8, baseRpg: 1.8, baseApg: 2.6, baseFgPct: 43.2, baseTpPct: 36.5, basePer: 12.2, baseMinutes: 15.0 },
    { id: 'nyk-8', name: 'Jericho Sims', teamCode: 'NYK', position: 'C', number: 20, basePpg: 3.8, baseRpg: 4.9, baseApg: 0.8, baseFgPct: 68.0, baseTpPct: 0.0, basePer: 13.0, baseMinutes: 14.5 },
    { id: 'nyk-9', name: 'Landry Shamet', teamCode: 'NYK', position: 'SG', number: 44, basePpg: 5.5, baseRpg: 1.5, baseApg: 1.1, baseFgPct: 42.0, baseTpPct: 38.0, basePer: 10.5, baseMinutes: 12.0 },
    { id: 'nyk-10', name: 'Precious Achiuwa', teamCode: 'NYK', position: 'PF', number: 5, basePpg: 6.5, baseRpg: 5.8, baseApg: 1.0, baseFgPct: 50.5, baseTpPct: 26.5, basePer: 13.8, baseMinutes: 17.0 }
  ],
  MIN: [
    { id: 'min-1', name: 'Anthony Edwards', teamCode: 'MIN', position: 'SG', number: 5, basePpg: 28.5, baseRpg: 5.6, baseApg: 5.2, baseFgPct: 47.0, baseTpPct: 40.5, basePer: 25.8, baseMinutes: 36.2 },
    { id: 'min-2', name: 'Julius Randle', teamCode: 'MIN', position: 'PF', number: 30, basePpg: 21.2, baseRpg: 7.8, baseApg: 4.6, baseFgPct: 49.5, baseTpPct: 36.0, basePer: 21.5, baseMinutes: 33.8 },
    { id: 'min-3', name: 'Rudy Gobert', teamCode: 'MIN', position: 'C', number: 27, basePpg: 12.8, baseRpg: 11.5, baseApg: 1.8, baseFgPct: 64.5, baseTpPct: 0.0, basePer: 20.8, baseMinutes: 32.5 },
    { id: 'min-4', name: 'Naz Reid', teamCode: 'MIN', position: 'C', number: 11, basePpg: 15.2, baseRpg: 5.8, baseApg: 2.1, baseFgPct: 48.0, baseTpPct: 40.8, basePer: 18.5, baseMinutes: 26.5 },
    { id: 'min-5', name: 'Jaden McDaniels', teamCode: 'MIN', position: 'SF', number: 3, basePpg: 11.6, baseRpg: 3.8, baseApg: 1.8, baseFgPct: 47.5, baseTpPct: 35.8, basePer: 14.0, baseMinutes: 31.0 },
    { id: 'min-6', name: 'Mike Conley', teamCode: 'MIN', position: 'PG', number: 10, basePpg: 9.8, baseRpg: 2.8, baseApg: 5.6, baseFgPct: 44.0, baseTpPct: 42.0, basePer: 15.5, baseMinutes: 25.5 },
    { id: 'min-7', name: 'Donte DiVincenzo', teamCode: 'MIN', position: 'SG', number: 0, basePpg: 11.5, baseRpg: 3.5, baseApg: 3.4, baseFgPct: 43.5, baseTpPct: 38.5, basePer: 14.5, baseMinutes: 25.0 },
    { id: 'min-8', name: 'Nickeil Alexander-Walker', teamCode: 'MIN', position: 'SG', number: 9, basePpg: 8.8, baseRpg: 2.6, baseApg: 2.4, baseFgPct: 44.8, baseTpPct: 39.0, basePer: 13.0, baseMinutes: 21.0 },
    { id: 'min-9', name: 'Rob Dillingham', teamCode: 'MIN', position: 'PG', number: 4, basePpg: 6.5, baseRpg: 1.5, baseApg: 2.8, baseFgPct: 42.0, baseTpPct: 35.5, basePer: 11.5, baseMinutes: 14.0 },
    { id: 'min-10', name: 'Terrence Shannon Jr.', teamCode: 'MIN', position: 'SF', number: 8, basePpg: 5.0, baseRpg: 1.8, baseApg: 1.0, baseFgPct: 44.0, baseTpPct: 34.0, basePer: 10.5, baseMinutes: 12.0 }
  ],
  SAS: [
    { id: 'sas-1', name: 'Victor Wembanyama', teamCode: 'SAS', position: 'C', number: 1, basePpg: 26.5, baseRpg: 11.8, baseApg: 4.2, baseFgPct: 48.2, baseTpPct: 35.5, basePer: 28.5, baseMinutes: 33.5 },
    { id: 'sas-2', name: 'Devin Vassell', teamCode: 'SAS', position: 'SG', number: 24, basePpg: 18.5, baseRpg: 4.2, baseApg: 4.0, baseFgPct: 46.5, baseTpPct: 38.2, basePer: 17.5, baseMinutes: 32.0 },
    { id: 'sas-3', name: 'Chris Paul', teamCode: 'SAS', position: 'PG', number: 3, basePpg: 10.5, baseRpg: 3.8, baseApg: 8.4, baseFgPct: 44.5, baseTpPct: 37.8, basePer: 17.2, baseMinutes: 28.5 },
    { id: 'sas-4', name: 'Jeremy Sochan', teamCode: 'SAS', position: 'PF', number: 10, basePpg: 14.5, baseRpg: 7.8, baseApg: 3.2, baseFgPct: 49.5, baseTpPct: 33.0, basePer: 16.0, baseMinutes: 29.5 },
    { id: 'sas-5', name: 'Stephon Castle', teamCode: 'SAS', position: 'PG', number: 5, basePpg: 12.8, baseRpg: 3.9, baseApg: 4.5, baseFgPct: 43.8, baseTpPct: 32.5, basePer: 14.2, baseMinutes: 28.0 },
    { id: 'sas-6', name: 'Harrison Barnes', teamCode: 'SAS', position: 'SF', number: 40, basePpg: 11.4, baseRpg: 4.0, baseApg: 1.8, baseFgPct: 46.8, baseTpPct: 39.2, basePer: 13.8, baseMinutes: 26.0 },
    { id: 'sas-7', name: 'Keldon Johnson', teamCode: 'SAS', position: 'SF', number: 0, basePpg: 13.0, baseRpg: 5.2, baseApg: 1.8, baseFgPct: 47.0, baseTpPct: 34.5, basePer: 15.0, baseMinutes: 24.5 },
    { id: 'sas-8', name: 'Julian Champagnie', teamCode: 'SAS', position: 'SF', number: 30, basePpg: 9.4, baseRpg: 4.2, baseApg: 1.4, baseFgPct: 42.5, baseTpPct: 37.0, basePer: 12.5, baseMinutes: 22.0 },
    { id: 'sas-9', name: 'Zach Collins', teamCode: 'SAS', position: 'C', number: 23, basePpg: 7.8, baseRpg: 4.5, baseApg: 2.0, baseFgPct: 49.0, baseTpPct: 31.0, basePer: 13.5, baseMinutes: 16.0 },
    { id: 'sas-10', name: 'Tre Jones', teamCode: 'SAS', position: 'PG', number: 33, basePpg: 8.2, baseRpg: 2.8, baseApg: 4.8, baseFgPct: 48.5, baseTpPct: 32.0, basePer: 14.0, baseMinutes: 18.5 }
  ],
  MIA: [
    { id: 'mia-1', name: 'Jimmy Butler', teamCode: 'MIA', position: 'SF', number: 22, basePpg: 21.5, baseRpg: 5.8, baseApg: 5.2, baseFgPct: 50.5, baseTpPct: 38.0, basePer: 23.5, baseMinutes: 34.0 },
    { id: 'mia-2', name: 'Bam Adebayo', teamCode: 'MIA', position: 'C', number: 13, basePpg: 20.2, baseRpg: 10.4, baseApg: 4.5, baseFgPct: 52.0, baseTpPct: 34.5, basePer: 22.0, baseMinutes: 35.0 },
    { id: 'mia-3', name: 'Tyler Herro', teamCode: 'MIA', position: 'SG', number: 14, basePpg: 23.5, baseRpg: 5.2, baseApg: 5.0, baseFgPct: 46.8, baseTpPct: 41.5, basePer: 20.5, baseMinutes: 35.5 },
    { id: 'mia-4', name: 'Terry Rozier', teamCode: 'MIA', position: 'PG', number: 2, basePpg: 15.2, baseRpg: 3.8, baseApg: 4.2, baseFgPct: 43.5, baseTpPct: 36.5, basePer: 15.5, baseMinutes: 30.5 },
    { id: 'mia-5', name: 'Nikola Jovic', teamCode: 'MIA', position: 'PF', number: 5, basePpg: 10.8, baseRpg: 4.8, baseApg: 2.6, baseFgPct: 46.5, baseTpPct: 37.5, basePer: 14.5, baseMinutes: 24.5 },
    { id: 'mia-6', name: 'Duncan Robinson', teamCode: 'MIA', position: 'SG', number: 55, basePpg: 11.2, baseRpg: 2.5, baseApg: 2.2, baseFgPct: 44.5, baseTpPct: 40.5, basePer: 14.0, baseMinutes: 23.0 },
    { id: 'mia-7', name: 'Jaime Jaquez Jr.', teamCode: 'MIA', position: 'SF', number: 11, basePpg: 10.5, baseRpg: 4.5, baseApg: 2.8, baseFgPct: 48.0, baseTpPct: 33.5, basePer: 14.2, baseMinutes: 24.0 },
    { id: 'mia-8', name: 'Haywood Highsmith', teamCode: 'MIA', position: 'SF', number: 24, basePpg: 6.8, baseRpg: 3.6, baseApg: 1.4, baseFgPct: 46.0, baseTpPct: 38.5, basePer: 12.0, baseMinutes: 21.0 },
    { id: 'mia-9', name: 'Kel\'el Ware', teamCode: 'MIA', position: 'C', number: 7, basePpg: 6.2, baseRpg: 4.5, baseApg: 0.8, baseFgPct: 56.5, baseTpPct: 32.0, basePer: 13.5, baseMinutes: 14.5 },
    { id: 'mia-10', name: 'Alec Burks', teamCode: 'MIA', position: 'SG', number: 9, basePpg: 6.5, baseRpg: 2.0, baseApg: 1.2, baseFgPct: 41.5, baseTpPct: 38.0, basePer: 11.5, baseMinutes: 13.5 }
  ],
  CLE: [
    { id: 'cle-1', name: 'Donovan Mitchell', teamCode: 'CLE', position: 'SG', number: 45, basePpg: 26.5, baseRpg: 4.8, baseApg: 5.2, baseFgPct: 47.8, baseTpPct: 39.5, basePer: 24.5, baseMinutes: 34.5 },
    { id: 'cle-2', name: 'Darius Garland', teamCode: 'CLE', position: 'PG', number: 10, basePpg: 20.8, baseRpg: 2.8, baseApg: 6.8, baseFgPct: 49.0, baseTpPct: 42.0, basePer: 21.0, baseMinutes: 33.0 },
    { id: 'cle-3', name: 'Evan Mobley', teamCode: 'CLE', position: 'PF', number: 4, basePpg: 18.2, baseRpg: 9.4, baseApg: 3.2, baseFgPct: 55.5, baseTpPct: 37.0, basePer: 22.5, baseMinutes: 33.5 },
    { id: 'cle-4', name: 'Jarrett Allen', teamCode: 'CLE', position: 'C', number: 31, basePpg: 14.8, baseRpg: 10.8, baseApg: 2.0, baseFgPct: 67.5, baseTpPct: 0.0, basePer: 21.5, baseMinutes: 31.0 },
    { id: 'cle-5', name: 'Caris LeVert', teamCode: 'CLE', position: 'SG', number: 3, basePpg: 12.5, baseRpg: 3.5, baseApg: 4.2, baseFgPct: 46.0, baseTpPct: 39.0, basePer: 16.0, baseMinutes: 26.5 },
    { id: 'cle-6', name: 'Isaac Okoro', teamCode: 'CLE', position: 'SF', number: 35, basePpg: 8.5, baseRpg: 2.8, baseApg: 1.6, baseFgPct: 48.5, baseTpPct: 41.0, basePer: 12.8, baseMinutes: 24.0 },
    { id: 'cle-7', name: 'Ty Jerome', teamCode: 'CLE', position: 'PG', number: 2, basePpg: 9.8, baseRpg: 2.2, baseApg: 3.5, baseFgPct: 51.5, baseTpPct: 45.0, basePer: 16.5, baseMinutes: 19.5 },
    { id: 'cle-8', name: 'Georges Niang', teamCode: 'CLE', position: 'PF', number: 20, basePpg: 8.2, baseRpg: 3.2, baseApg: 1.2, baseFgPct: 44.0, baseTpPct: 38.5, basePer: 12.0, baseMinutes: 18.5 },
    { id: 'cle-9', name: 'Dean Wade', teamCode: 'CLE', position: 'SF', number: 32, basePpg: 6.2, baseRpg: 4.1, baseApg: 1.4, baseFgPct: 43.5, baseTpPct: 37.5, basePer: 11.5, baseMinutes: 19.0 },
    { id: 'cle-10', name: 'Sam Merrill', teamCode: 'CLE', position: 'SG', number: 5, basePpg: 6.8, baseRpg: 1.8, baseApg: 1.2, baseFgPct: 42.5, baseTpPct: 39.5, basePer: 11.8, baseMinutes: 15.0 }
  ]
};

// Generic roster factory for the other NBA teams so EVERY single one of the 30 teams has 10 authentic NBA players
const ROSTER_SEEDS: Record<string, string[]> = {
  ATL: ['Trae Young', 'Jalen Johnson', 'De\'Andre Hunter', 'Dyson Daniels', 'Clint Capela', 'Onyeka Okongwu', 'Bogdan Bogdanovic', 'Zaccharie Risacher', 'Garrison Mathews', 'Kobe Bufkin'],
  CHA: ['LaMelo Ball', 'Brandon Miller', 'Miles Bridges', 'Tre Mann', 'Mark Williams', 'Grant Williams', 'Nick Richards', 'Cody Martin', 'Seth Curry', 'Vasilije Micic'],
  CHI: ['Zach LaVine', 'Coby White', 'Nikola Vucevic', 'Josh Giddey', 'Ayo Dosunmu', 'Patrick Williams', 'Jalen Smith', 'Julian Phillips', 'Lonzo Ball', 'Matas Buzelis'],
  DET: ['Cade Cunningham', 'Jaden Ivey', 'Tobias Harris', 'Jalen Duren', 'Tim Hardaway Jr.', 'Malik Beasley', 'Simone Fontecchio', 'Ausar Thompson', 'Isaiah Stewart', 'Marcus Sasser'],
  IND: ['Tyrese Haliburton', 'Pascal Siakam', 'Myles Turner', 'Bennedict Mathurin', 'Andrew Nembhard', 'Aaron Nesmith', 'T.J. McConnell', 'Obi Toppin', 'Jarace Walker', 'Ben Sheppard'],
  MIL: ['Giannis Antetokounmpo', 'Damian Lillard', 'Khris Middleton', 'Brook Lopez', 'Bobby Portis', 'Gary Trent Jr.', 'Taurean Prince', 'Pat Connaughton', 'Andre Jackson Jr.', 'AJ Green'],
  ORL: ['Paolo Banchero', 'Franz Wagner', 'Jalen Suggs', 'Wendell Carter Jr.', 'Kentavious Caldwell-Pope', 'Cole Anthony', 'Moritz Wagner', 'Anthony Black', 'Goga Bitadze', 'Jonathan Isaac'],
  PHI: ['Joel Embiid', 'Tyrese Maxey', 'Paul George', 'Kelly Oubre Jr.', 'Caleb Martin', 'Kyle Lowry', 'Andre Drummond', 'Guerschon Yabusele', 'Eric Gordon', 'KJ Martin'],
  TOR: ['Scottie Barnes', 'RJ Barrett', 'Immanuel Quickley', 'Jakob Poeltl', 'Gradey Dick', 'Chris Boucher', 'Ochai Agbaji', 'Davion Mitchell', 'Kelly Olynyk', 'Ja\'Kobe Walter'],
  WAS: ['Jordan Poole', 'Kyle Kuzma', 'Bilal Coulibaly', 'Alex Sarr', 'Jonas Valanciunas', 'Corey Kispert', 'Bub Carrington', 'Malcolm Brogdon', 'Kyshawn George', 'Richaun Holmes'],
  HOU: ['Alperen Sengun', 'Jalen Green', 'Fred VanVleet', 'Jabari Smith Jr.', 'Dillon Brooks', 'Tari Eason', 'Amen Thompson', 'Reed Sheppard', 'Steven Adams', 'Cam Whitmore'],
  MEM: ['Ja Morant', 'Desmond Bane', 'Jaren Jackson Jr.', 'Marcus Smart', 'Zach Edey', 'Santi Aldama', 'Scotty Pippen Jr.', 'Jaylen Wells', 'Vince Williams Jr.', 'Luke Kennard'],
  NOP: ['Zion Williamson', 'Brandon Ingram', 'Dejounte Murray', 'CJ McCollum', 'Herb Jones', 'Trey Murphy III', 'Yves Missi', 'Jose Alvarado', 'Jordan Hawkins', 'Daniel Theis'],
  PHX: ['Kevin Durant', 'Devin Booker', 'Bradley Beal', 'Jusuf Nurkic', 'Tyus Jones', 'Grayson Allen', 'Royce O\'Neale', 'Mason Plumlee', 'Ryan Dunn', 'Monte Morris'],
  POR: ['Anfernee Simons', 'Jerami Grant', 'Deandre Ayton', 'Shaedon Sharpe', 'Toumani Camara', 'Scoot Henderson', 'Deny Avdija', 'Donovan Clingan', 'Robert Williams III', 'Dalano Banton'],
  SAC: ['De\'Aaron Fox', 'DeMar DeRozan', 'Domantas Sabonis', 'Keegan Murray', 'Keon Ellis', 'Malik Monk', 'Kevin Huerter', 'Trey Lyles', 'Alex Len', 'Doug McDermott'],
  UTA: ['Lauri Markkanen', 'Collin Sexton', 'John Collins', 'Keyonte George', 'Walker Kessler', 'Jordan Clarkson', 'Taylor Hendricks', 'Cody Williams', 'Brice Sensabaugh', 'Drew Eubanks'],
  LAC: ['James Harden', 'Kawhi Leonard', 'Norman Powell', 'Ivica Zubac', 'Terance Mann', 'Derrick Jones Jr.', 'Kris Dunn', 'Kevin Porter Jr.', 'Amir Coffey', 'Mo Bamba']
};

export const TRANSFERRED_PLAYERS_MAP: Record<string, {
  priorTeamCode: string;
  transferNote: string;
  priorPpg: number;
  priorRpg: number;
  priorApg: number;
  priorPer: number;
  priorMinutes: number;
  priorFgPct: number;
  priorTpPct: number;
}> = {
  'Klay Thompson': { priorTeamCode: 'GSW', transferNote: 'Traspasado desde Golden State Warriors (2024-25 en GSW)', priorPpg: 17.9, priorRpg: 3.3, priorApg: 2.3, priorPer: 15.4, priorMinutes: 29.7, priorFgPct: 43.2, priorTpPct: 38.7 },
  'Karl-Anthony Towns': { priorTeamCode: 'MIN', transferNote: 'Traspasado desde Minnesota Timberwolves (2024-25 en MIN)', priorPpg: 21.8, priorRpg: 8.3, priorApg: 3.0, priorPer: 21.4, priorMinutes: 32.2, priorFgPct: 50.4, priorTpPct: 41.6 },
  'Mikal Bridges': { priorTeamCode: 'BRK', transferNote: 'Traspasado desde Brooklyn Nets (2024-25 en BRK)', priorPpg: 19.6, priorRpg: 4.5, priorApg: 3.6, priorPer: 16.5, priorMinutes: 34.8, priorFgPct: 43.6, priorTpPct: 37.2 },
  'Julius Randle': { priorTeamCode: 'NYK', transferNote: 'Traspasado desde New York Knicks (2024-25 en NYK)', priorPpg: 24.0, priorRpg: 9.2, priorApg: 5.0, priorPer: 20.2, priorMinutes: 35.4, priorFgPct: 47.2, priorTpPct: 31.1 },
  'Donte DiVincenzo': { priorTeamCode: 'NYK', transferNote: 'Traspasado desde New York Knicks (2024-25 en NYK)', priorPpg: 15.5, priorRpg: 3.7, priorApg: 2.7, priorPer: 16.1, priorMinutes: 29.1, priorFgPct: 44.3, priorTpPct: 40.1 },
  'Paul George': { priorTeamCode: 'LAC', transferNote: 'Agente Libre desde LA Clippers (2024-25 en LAC)', priorPpg: 22.6, priorRpg: 5.2, priorApg: 3.5, priorPer: 19.5, priorMinutes: 33.8, priorFgPct: 47.1, priorTpPct: 41.3 },
  'Alex Caruso': { priorTeamCode: 'CHI', transferNote: 'Traspasado desde Chicago Bulls (2024-25 en CHI)', priorPpg: 10.1, priorRpg: 3.8, priorApg: 3.5, priorPer: 14.8, priorMinutes: 28.7, priorFgPct: 46.8, priorTpPct: 40.8 },
  'Isaiah Hartenstein': { priorTeamCode: 'NYK', transferNote: 'Agente Libre desde NY Knicks (2024-25 en NYK)', priorPpg: 7.8, priorRpg: 8.3, priorApg: 2.5, priorPer: 18.2, priorMinutes: 25.3, priorFgPct: 64.4, priorTpPct: 33.3 },
  'DeMar DeRozan': { priorTeamCode: 'CHI', transferNote: 'Sign-and-Trade desde Chicago Bulls (2024-25 en CHI)', priorPpg: 24.0, priorRpg: 4.3, priorApg: 5.3, priorPer: 20.8, priorMinutes: 37.8, priorFgPct: 48.0, priorTpPct: 33.3 },
  'Chris Paul': { priorTeamCode: 'GSW', transferNote: 'Agente Libre desde Golden State Warriors (2024-25 en GSW)', priorPpg: 9.2, priorRpg: 3.9, priorApg: 6.8, priorPer: 15.8, priorMinutes: 26.4, priorFgPct: 44.1, priorTpPct: 37.1 },
  'Harrison Barnes': { priorTeamCode: 'SAC', transferNote: 'Traspasado desde Sacramento Kings (2024-25 en SAC)', priorPpg: 12.2, priorRpg: 3.0, priorApg: 1.2, priorPer: 13.5, priorMinutes: 29.0, priorFgPct: 47.4, priorTpPct: 38.7 },
  'Buddy Hield': { priorTeamCode: 'PHI', transferNote: 'Sign-and-Trade desde Philadelphia 76ers (2024-25 en PHI)', priorPpg: 12.1, priorRpg: 3.2, priorApg: 2.8, priorPer: 14.5, priorMinutes: 25.7, priorFgPct: 43.6, priorTpPct: 38.6 },
  'Kyle Anderson': { priorTeamCode: 'MIN', transferNote: 'Traspasado desde Minnesota Timberwolves (2024-25 en MIN)', priorPpg: 6.4, priorRpg: 3.5, priorApg: 4.2, priorPer: 13.2, priorMinutes: 22.6, priorFgPct: 46.0, priorTpPct: 22.9 },
  'Russell Westbrook': { priorTeamCode: 'LAC', transferNote: 'Agente Libre desde LA Clippers (2024-25 en LAC)', priorPpg: 11.1, priorRpg: 5.0, priorApg: 4.5, priorPer: 15.1, priorMinutes: 22.5, priorFgPct: 45.4, priorTpPct: 27.3 },
  'Kentavious Caldwell-Pope': { priorTeamCode: 'DEN', transferNote: 'Agente Libre desde Denver Nuggets (2024-25 en DEN)', priorPpg: 10.1, priorRpg: 2.4, priorApg: 2.4, priorPer: 13.2, priorMinutes: 31.6, priorFgPct: 46.0, priorTpPct: 40.6 },
  'Dejounte Murray': { priorTeamCode: 'ATL', transferNote: 'Traspasado desde Atlanta Hawks (2024-25 en ATL)', priorPpg: 22.5, priorRpg: 5.3, priorApg: 6.4, priorPer: 18.8, priorMinutes: 35.7, priorFgPct: 45.9, priorTpPct: 36.3 },
  'Dalton Knecht': { priorTeamCode: 'NCAA', transferNote: 'Rookie Primera Ronda Draft 2024 (Tennessee Volunteers: 21.7 PPG)', priorPpg: 21.7, priorRpg: 4.9, priorApg: 1.8, priorPer: 18.0, priorMinutes: 30.6, priorFgPct: 45.8, priorTpPct: 39.7 },
  'Josh Giddey': { priorTeamCode: 'OKC', transferNote: 'Traspasado desde Oklahoma City Thunder por Alex Caruso', priorPpg: 12.3, priorRpg: 6.4, priorApg: 4.8, priorPer: 15.6, priorMinutes: 25.1, priorFgPct: 47.5, priorTpPct: 33.7 },
  'Jonas Valanciunas': { priorTeamCode: 'NOP', transferNote: 'Agente Libre / Sign-and-Trade desde New Orleans Pelicans', priorPpg: 12.2, priorRpg: 8.8, priorApg: 2.1, priorPer: 18.8, priorMinutes: 23.5, priorFgPct: 55.9, priorTpPct: 30.8 },
  'Tobias Harris': { priorTeamCode: 'PHI', transferNote: 'Agente Libre desde Philadelphia 76ers (Veterano en Detroit)', priorPpg: 17.2, priorRpg: 6.5, priorApg: 3.1, priorPer: 16.4, priorMinutes: 33.8, priorFgPct: 48.7, priorTpPct: 35.3 },
  'Tim Hardaway Jr.': { priorTeamCode: 'DAL', transferNote: 'Traspasado desde Dallas Mavericks (2024-25 en DAL)', priorPpg: 14.4, priorRpg: 3.2, priorApg: 1.8, priorPer: 13.8, priorMinutes: 26.8, priorFgPct: 40.2, priorTpPct: 35.3 },
  'Derrick Jones Jr.': { priorTeamCode: 'DAL', transferNote: 'Agente Libre desde Dallas Mavericks (Titular Finales 2024)', priorPpg: 8.6, priorRpg: 3.3, priorApg: 1.0, priorPer: 12.5, priorMinutes: 24.9, priorFgPct: 48.3, priorTpPct: 34.3 },
  'Tyus Jones': { priorTeamCode: 'WAS', transferNote: 'Firmado como base titular desde Washington Wizards (Líder AST/TOV)', priorPpg: 12.0, priorRpg: 2.7, priorApg: 7.3, priorPer: 17.2, priorMinutes: 29.3, priorFgPct: 48.9, priorTpPct: 41.4 },
  'Dyson Daniels': { priorTeamCode: 'NOP', transferNote: 'Traspasado desde New Orleans Pelicans (Defensa élite en ATL)', priorPpg: 5.8, priorRpg: 3.9, priorApg: 2.7, priorPer: 12.8, priorMinutes: 22.3, priorFgPct: 44.7, priorTpPct: 31.1 },
  'Deni Avdija': { priorTeamCode: 'WAS', transferNote: 'Traspasado desde Washington Wizards a Portland Trail Blazers', priorPpg: 14.7, priorRpg: 7.2, priorApg: 3.8, priorPer: 16.2, priorMinutes: 30.1, priorFgPct: 47.4, priorTpPct: 37.4 },
  'Malcolm Brogdon': { priorTeamCode: 'POR', transferNote: 'Traspasado desde Portland Trail Blazers a Washington Wizards', priorPpg: 15.7, priorRpg: 3.8, priorApg: 5.5, priorPer: 16.8, priorMinutes: 28.7, priorFgPct: 44.0, priorTpPct: 41.2 },
  'Gary Trent Jr.': { priorTeamCode: 'TOR', transferNote: 'Firmado como agente libre desde Toronto Raptors a Milwaukee', priorPpg: 13.7, priorRpg: 2.7, priorApg: 1.7, priorPer: 13.5, priorMinutes: 28.1, priorFgPct: 42.6, priorTpPct: 39.3 }
};

export function getRosterForTeam(teamCode: string): Player[] {
  let roster = NBA_ROSTERS[teamCode];
  if (!roster) {
    const names = ROSTER_SEEDS[teamCode] || [];
    const positions: Array<'PG' | 'SG' | 'SF' | 'PF' | 'C'> = ['PG', 'SG', 'SF', 'PF', 'C', 'PG', 'SG', 'SF', 'PF', 'C'];
    
    roster = names.map((name, i) => {
      const tier = i === 0 ? 1 : i < 3 ? 2 : i < 6 ? 3 : 4;
      const basePpg = tier === 1 ? 24.5 : tier === 2 ? 18.5 : tier === 3 ? 12.0 : 6.8;
      const baseRpg = positions[i] === 'C' ? 9.5 : positions[i] === 'PF' ? 6.8 : 3.8;
      const baseApg = positions[i] === 'PG' ? 6.5 : positions[i] === 'SG' ? 3.8 : 2.0;
      const baseFgPct = positions[i] === 'C' ? 58.5 : 46.2;
      const baseTpPct = positions[i] === 'C' ? 22.0 : 38.0;
      const basePer = tier === 1 ? 24.0 : tier === 2 ? 18.5 : tier === 3 ? 14.5 : 11.5;
      const baseMinutes = tier === 1 ? 34.5 : tier === 2 ? 31.0 : tier === 3 ? 24.5 : 16.0;

      return {
        id: `${teamCode.toLowerCase()}-${i + 1}`,
        name,
        teamCode,
        position: positions[i],
        number: (i * 7 + 3) % 99,
        basePpg,
        baseRpg,
        baseApg,
        baseFgPct,
        baseTpPct,
        basePer,
        baseMinutes
      };
    });
    NBA_ROSTERS[teamCode] = roster;
  }

  // Enrich every player with prior 2024-25 season stats and transfer details
  return roster.map((p) => {
    const transfer = TRANSFERRED_PLAYERS_MAP[p.name];
    if (transfer) {
      return {
        ...p,
        isTransferred: true,
        priorTeamCode: transfer.priorTeamCode,
        transferNote: transfer.transferNote,
        priorPpg: transfer.priorPpg,
        priorRpg: transfer.priorRpg,
        priorApg: transfer.priorApg,
        priorPer: transfer.priorPer,
        priorMinutes: transfer.priorMinutes,
        priorFgPct: transfer.priorFgPct,
        priorTpPct: transfer.priorTpPct
      };
    }
    return {
      ...p,
      isTransferred: false,
      priorTeamCode: p.priorTeamCode || p.teamCode,
      priorPpg: p.priorPpg ?? p.basePpg,
      priorRpg: p.priorRpg ?? p.baseRpg,
      priorApg: p.priorApg ?? p.baseApg,
      priorPer: p.priorPer ?? p.basePer,
      priorMinutes: p.priorMinutes ?? p.baseMinutes,
      priorFgPct: p.priorFgPct ?? p.baseFgPct,
      priorTpPct: p.priorTpPct ?? p.baseTpPct
    };
  });
}
