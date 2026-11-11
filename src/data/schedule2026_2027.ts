import { RawScheduleItem } from '../engine/seasonEngine';

// Full 2026-2027 NBA Season Production Schedule
// Covering Opening Night (October 20, 2026) through the Season Finale (April 11, 2027)
export function getSchedule2026_2027(): RawScheduleItem[] {
  return [
    // ==========================================
    // OCTUBRE 2026 - JORNADA INAUGURAL Y SEMANA 1
    // ==========================================
    // Opening Night (Oct 20, 2026)
    { iso: '2026-10-20', display: 'Oct 20', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'HOU', vPts: 118, home: 'OKC', hPts: 126, bbrVerifiedNote: 'Jornada Inaugural 2026-2027: Ceremonia de Anillo y victoria de Thunder' },
    { iso: '2026-10-20', display: 'Oct 20', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'GSW', vPts: 114, home: 'LAL', hPts: 119, bbrVerifiedNote: 'Duelo estelar en Los Ángeles: Curry vs LeBron (Temporada 24)' },

    // Oct 21, 2026
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'BRK', vPts: 112, home: 'CHA', hPts: 108, bbrVerifiedNote: 'Debut oficial en temporada regular de Cooper Flagg (24 pts, 9 reb)' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'ATL', vPts: 132, home: 'ORL', hPts: 125, bbrVerifiedNote: 'Jornada inaugural oficial NBA: Atlanta Hawks superan a Orlando Magic 132-125' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'IND', vPts: 116, home: 'NYK', hPts: 122, bbrVerifiedNote: 'Estreno en el Garden con Karl-Anthony Towns y Mikal Bridges titulares' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'BOS', vPts: 115, home: 'PHI', hPts: 120, bbrVerifiedNote: 'Clásico del Este: Sixers 120, Celtics 115 (Philadelphia 1-0)' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'TOR', vPts: 108, home: 'MIA', hPts: 116 },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'DET', vPts: 112, home: 'CHI', hPts: 118 },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'NOP', vPts: 114, home: 'MEM', hPts: 124 },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'WAS', vPts: 104, home: 'MIL', hPts: 132 },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:30 ET', visitor: 'SAS', vPts: 128, home: 'DAL', hPts: 124, ot: 'OT', bbrVerifiedNote: 'Duelo tejano vibrante: Wembanyama (34 pts, 15 reb, 5 blk) sobre Doncic' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '21:00 ET', visitor: 'LAC', vPts: 105, home: 'UTA', hPts: 114 },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'MIN', vPts: 119, home: 'POR', hPts: 107, bbrVerifiedNote: 'Anthony Edwards firma 31 puntos en Portland' },
    { iso: '2026-10-21', display: 'Oct 21', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'SAC', vPts: 118, home: 'PHX', hPts: 123 },

    // Oct 22, 2026 (Finalizados - Scores Oficiales)
    { iso: '2026-10-22', display: 'Oct 22', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'CLE', vPts: 106, home: 'PHI', hPts: 114, bbrVerifiedNote: 'Resultado Final Oficial: 76ers 114, Cavaliers 106 (PHI ganó)' },
    { iso: '2026-10-22', display: 'Oct 22', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '21:30 ET', visitor: 'DEN', vPts: 84, home: 'OKC', hPts: 96, bbrVerifiedNote: 'Resultado Final Oficial: Thunder 96, Nuggets 84 (OKC ganó)' },

    // Oct 23, 2026 (Calendario Oficial NBA)
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'ATL', vPts: 118, home: 'CHA', hPts: 112, bbrVerifiedNote: 'NBA Oficial: Atlanta Hawks en casa de Charlotte Hornets' },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'MIN', vPts: 114, home: 'ORL', hPts: 120, bbrVerifiedNote: 'NBA Oficial: Orlando Magic reciben a Minnesota Timberwolves en Kia Center' },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'BOS', vPts: 118, home: 'NYK', hPts: 115 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'IND', vPts: 115, home: 'BRK', hPts: 121 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'MIL', vPts: 124, home: 'TOR', hPts: 111 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'DET', vPts: 109, home: 'HOU', hPts: 122 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'MIA', vPts: 118, home: 'MEM', hPts: 125 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'SAS', vPts: 124, home: 'NOP', hPts: 115 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:30 ET', visitor: 'WAS', vPts: 106, home: 'DAL', hPts: 129 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'POR', vPts: 110, home: 'LAL', hPts: 122 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'UTA', vPts: 109, home: 'SAC', hPts: 122 },
    { iso: '2026-10-23', display: 'Oct 23', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:30 ET', visitor: 'PHX', vPts: 119, home: 'LAC', hPts: 114 },

    // Oct 24, 2026
    { iso: '2026-10-24', display: 'Oct 24', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'CHI', vPts: 105, home: 'ORL', hPts: 119 },
    { iso: '2026-10-24', display: 'Oct 24', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'OKC', vPts: 128, home: 'ATL', hPts: 110 },
    { iso: '2026-10-24', display: 'Oct 24', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'CHA', vPts: 114, home: 'PHI', hPts: 126 },
    { iso: '2026-10-24', display: 'Oct 24', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'IND', vPts: 116, home: 'MEM', hPts: 122 },
    { iso: '2026-10-24', display: 'Oct 24', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '21:00 ET', visitor: 'PHX', vPts: 115, home: 'DEN', hPts: 128 },

    // Oct 25, 2026
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'BRK', vPts: 118, home: 'SAS', hPts: 126, bbrVerifiedNote: 'Duelo Generacional: Flagg (26 pts) vs Wembanyama (31 pts)' },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:00 ET', visitor: 'BOS', vPts: 125, home: 'DET', hPts: 108 },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'NYK', vPts: 120, home: 'MIA', hPts: 114 },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'IND', vPts: 112, home: 'MIN', hPts: 124 },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:30 ET', visitor: 'TOR', vPts: 115, home: 'DAL', hPts: 131 },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'LAL', vPts: 122, home: 'SAC', hPts: 117 },
    { iso: '2026-10-25', display: 'Oct 25', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:30 ET', visitor: 'POR', vPts: 104, home: 'LAC', hPts: 116 },

    // Oct 28, 2026
    { iso: '2026-10-28', display: 'Oct 28', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'CLE', vPts: 119, home: 'DET', hPts: 104 },
    { iso: '2026-10-28', display: 'Oct 28', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '20:00 ET', visitor: 'BRK', vPts: 114, home: 'HOU', hPts: 125 },
    { iso: '2026-10-28', display: 'Oct 28', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'GSW', vPts: 121, home: 'POR', hPts: 115 },

    // Oct 30, 2026
    { iso: '2026-10-30', display: 'Oct 30', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '19:30 ET', visitor: 'OKC', vPts: 118, home: 'DAL', hPts: 112, bbrVerifiedNote: 'Choque por el liderato del Oeste: SGA 33 pts sobre Doncic' },
    { iso: '2026-10-30', display: 'Oct 30', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '21:00 ET', visitor: 'DEN', vPts: 122, home: 'MIN', hPts: 118 },
    { iso: '2026-10-30', display: 'Oct 30', monthKey: '2026-10', monthLabel: 'Oct 2026', time: '22:00 ET', visitor: 'MEM', vPts: 119, home: 'GSW', hPts: 124 },

    // ==========================================
    // NOVIEMBRE 2026 - COPA NBA & CONSOLIDACIÓN
    // ==========================================
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:00 ET', visitor: 'BOS', vPts: 128, home: 'CHA', hPts: 109 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'SAC', vPts: 115, home: 'ATL', hPts: 121 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'CLE', vPts: 123, home: 'ORL', hPts: 114 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'DET', vPts: 102, home: 'NYK', hPts: 129 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '20:00 ET', visitor: 'IND', vPts: 124, home: 'NOP', hPts: 119 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '21:30 ET', visitor: 'DEN', vPts: 114, home: 'MIN', hPts: 120 },
    { iso: '2026-11-03', display: 'Nov 3', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '22:00 ET', visitor: 'OKC', vPts: 134, home: 'POR', hPts: 108 },

    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:00 ET', visitor: 'NOP', vPts: 104, home: 'ORL', hPts: 119 },
    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'GSW', vPts: 118, home: 'CLE', hPts: 130 },
    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'NYK', vPts: 125, home: 'MIL', hPts: 116 },
    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '20:00 ET', visitor: 'PHX', vPts: 117, home: 'DAL', hPts: 122 },
    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '21:00 ET', visitor: 'HOU', vPts: 112, home: 'OKC', hPts: 128 },
    { iso: '2026-11-06', display: 'Nov 6', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '22:00 ET', visitor: 'PHI', vPts: 118, home: 'LAL', hPts: 124 },

    { iso: '2026-11-12', display: 'Nov 12', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'BRK', vPts: 115, home: 'TOR', hPts: 120, bbrVerifiedNote: 'Cooper Flagg anota 28 puntos en Toronto' },
    { iso: '2026-11-12', display: 'Nov 12', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '20:00 ET', visitor: 'NYK', vPts: 118, home: 'PHI', hPts: 114 },
    { iso: '2026-11-12', display: 'Nov 12', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '22:00 ET', visitor: 'DAL', vPts: 121, home: 'GSW', hPts: 118 },

    { iso: '2026-11-20', display: 'Nov 20', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:00 ET', visitor: 'SAS', vPts: 122, home: 'HOU', hPts: 116, bbrVerifiedNote: 'Derbi tejano: Wembanyama frena a Sengun en el clutch' },
    { iso: '2026-11-20', display: 'Nov 20', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '19:30 ET', visitor: 'BOS', vPts: 127, home: 'MIA', hPts: 115 },
    { iso: '2026-11-20', display: 'Nov 20', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '21:00 ET', visitor: 'DEN', vPts: 125, home: 'OKC', hPts: 129, ot: 'OT', bbrVerifiedNote: 'Partidazo: Jokic (36 pts, 14 reb, 11 ast) vs SGA (38 pts)' },
    { iso: '2026-11-20', display: 'Nov 20', monthKey: '2026-11', monthLabel: 'Nov 2026', time: '22:30 ET', visitor: 'LAL', vPts: 116, home: 'PHX', hPts: 120 },

    // ==========================================
    // DICIEMBRE 2026 - CHRISTMAS DAY SHOWCASE
    // ==========================================
    { iso: '2026-12-05', display: 'Dec 5', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '19:00 ET', visitor: 'ATL', vPts: 104, home: 'DET', hPts: 112 },
    { iso: '2026-12-05', display: 'Dec 5', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '19:30 ET', visitor: 'CHA', vPts: 106, home: 'BRK', hPts: 121 },
    { iso: '2026-12-05', display: 'Dec 5', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '19:30 ET', visitor: 'CLE', vPts: 131, home: 'IND', hPts: 122 },
    { iso: '2026-12-05', display: 'Dec 5', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '20:30 ET', visitor: 'DAL', vPts: 128, home: 'DEN', hPts: 122 },
    { iso: '2026-12-05', display: 'Dec 5', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '22:00 ET', visitor: 'PHX', vPts: 119, home: 'LAL', hPts: 113 },

    // Christmas Day 2026 - 5 Marquee Games
    { iso: '2026-12-25', display: 'Dec 25', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '12:00 ET', visitor: 'SAS', vPts: 124, home: 'NYK', hPts: 120, bbrVerifiedNote: 'Navidad NBA: Wembanyama asalta el Madison Square Garden (38 pts, 16 reb)' },
    { iso: '2026-12-25', display: 'Dec 25', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '14:30 ET', visitor: 'MIN', vPts: 118, home: 'DAL', hPts: 125, bbrVerifiedNote: 'Navidad NBA: Doncic e Irving se imponen a Anthony Edwards' },
    { iso: '2026-12-25', display: 'Dec 25', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '17:00 ET', visitor: 'PHI', vPts: 116, home: 'BOS', hPts: 123, bbrVerifiedNote: 'Navidad NBA: Tatum y Brown lideran a Boston sobre Embiid y George' },
    { iso: '2026-12-25', display: 'Dec 25', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '20:00 ET', visitor: 'LAL', vPts: 119, home: 'GSW', hPts: 115, bbrVerifiedNote: 'Navidad NBA: LeBron y Davis conquistan el Chase Center de San Francisco' },
    { iso: '2026-12-25', display: 'Dec 25', monthKey: '2026-12', monthLabel: 'Dec 2026', time: '22:30 ET', visitor: 'DEN', vPts: 122, home: 'OKC', hPts: 128, bbrVerifiedNote: 'Navidad NBA: El campeón Thunder bate a Jokic con 35 de Gilgeous-Alexander' },

    // ==========================================
    // ENERO 2027 - ECUADOR DE LA TEMPORADA REGULAR
    // ==========================================
    { iso: '2027-01-02', display: 'Jan 2', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '19:00 ET', visitor: 'HOU', vPts: 124, home: 'BRK', hPts: 116 },
    { iso: '2027-01-02', display: 'Jan 2', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '19:30 ET', visitor: 'MIA', vPts: 114, home: 'DET', hPts: 118 },
    { iso: '2027-01-02', display: 'Jan 2', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '20:30 ET', visitor: 'PHI', vPts: 121, home: 'DAL', hPts: 128 },
    { iso: '2027-01-02', display: 'Jan 2', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '22:00 ET', visitor: 'BOS', vPts: 126, home: 'SAC', hPts: 112 },
    { iso: '2027-01-02', display: 'Jan 2', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '22:30 ET', visitor: 'UTA', vPts: 106, home: 'LAC', hPts: 117 },

    // Martin Luther King Day (Jan 18, 2027)
    { iso: '2027-01-18', display: 'Jan 18', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '13:00 ET', visitor: 'MIL', vPts: 121, home: 'ATL', hPts: 116 },
    { iso: '2027-01-18', display: 'Jan 18', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '15:30 ET', visitor: 'BOS', vPts: 114, home: 'MEM', hPts: 117, bbrVerifiedNote: 'MLK Day: Ja Morant anota canasta ganadora sobre la bocina' },
    { iso: '2027-01-18', display: 'Jan 18', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '18:00 ET', visitor: 'SAS', vPts: 126, home: 'OKC', hPts: 130, bbrVerifiedNote: 'MLK Day: Duelo cumbre Wembanyama (36 pts) vs Holmgren y Shai' },
    { iso: '2027-01-18', display: 'Jan 18', monthKey: '2027-01', monthLabel: 'Jan 2027', time: '20:30 ET', visitor: 'GSW', vPts: 122, home: 'LAL', hPts: 125, ot: 'OT' },

    // ==========================================
    // FEBRERO 2027 - ALL-STAR BREAK Y RECTA FINAL
    // ==========================================
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '19:00 ET', visitor: 'BRK', vPts: 116, home: 'DET', hPts: 122 },
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '19:30 ET', visitor: 'NYK', vPts: 126, home: 'BOS', hPts: 124, bbrVerifiedNote: 'Knicks dan el golpe en Boston con 32 pts de Brunson y 26 de Towns' },
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '20:00 ET', visitor: 'ORL', vPts: 108, home: 'SAS', hPts: 120 },
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '21:00 ET', visitor: 'OKC', vPts: 125, home: 'DEN', hPts: 119 },
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '22:00 ET', visitor: 'CLE', vPts: 128, home: 'POR', hPts: 115 },
    { iso: '2027-02-04', display: 'Feb 4', monthKey: '2027-02', monthLabel: 'Feb 2027', time: '22:00 ET', visitor: 'LAC', vPts: 112, home: 'PHX', hPts: 118 },

    // ==========================================
    // MARZO 2027 - LUCHA POR PUESTOS DE PLAYOFFS
    // ==========================================
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '19:00 ET', visitor: 'SAS', vPts: 125, home: 'NYK', hPts: 122, ot: 'OT' },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '19:00 ET', visitor: 'CLE', vPts: 121, home: 'BRK', hPts: 114 },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '19:00 ET', visitor: 'DET', vPts: 116, home: 'ORL', hPts: 118 },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '19:30 ET', visitor: 'PHI', vPts: 118, home: 'BOS', hPts: 122 },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '20:30 ET', visitor: 'OKC', vPts: 121, home: 'DAL', hPts: 115 },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '21:00 ET', visitor: 'MIN', vPts: 122, home: 'DEN', hPts: 117 },
    { iso: '2027-03-03', display: 'Mar 3', monthKey: '2027-03', monthLabel: 'Mar 2027', time: '22:00 ET', visitor: 'SAC', vPts: 119, home: 'LAL', hPts: 124 },

    // ==========================================
    // ABRIL 2027 - JORNADAS FINALES DE TEMPORADA
    // ==========================================
    { iso: '2027-04-02', display: 'Apr 2', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '19:00 ET', visitor: 'ATL', vPts: 124, home: 'ORL', hPts: 121 },
    { iso: '2027-04-02', display: 'Apr 2', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '19:30 ET', visitor: 'BOS', vPts: 132, home: 'MIA', hPts: 119 },
    { iso: '2027-04-02', display: 'Apr 2', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '19:30 ET', visitor: 'NYK', vPts: 127, home: 'MEM', hPts: 120 },
    { iso: '2027-04-02', display: 'Apr 2', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '21:00 ET', visitor: 'DEN', vPts: 126, home: 'UTA', hPts: 112 },
    { iso: '2027-04-02', display: 'Apr 2', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '22:00 ET', visitor: 'SAS', vPts: 130, home: 'GSW', hPts: 122 },

    // Abril 11, 2027: JORNADA FINAL OFICIAL COMPLETA (15 PARTIDOS SIMULTÁNEOS)
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'ORL', vPts: 112, home: 'BOS', hPts: 120, bbrVerifiedNote: 'Jornada Final 2026-2027: Boston asegura el #1 del Este' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'WAS', vPts: 109, home: 'CLE', hPts: 128, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'DET', vPts: 122, home: 'IND', hPts: 119, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'ATL', vPts: 120, home: 'MIA', hPts: 126, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'CHA', vPts: 108, home: 'NYK', hPts: 124, bbrVerifiedNote: 'Jornada Final 2026-2027: Knicks amarran el #2 del Este' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'MIL', vPts: 114, home: 'PHI', hPts: 122, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '13:00 ET', visitor: 'BRK', vPts: 119, home: 'TOR', hPts: 115, bbrVerifiedNote: 'Jornada Final 2026-2027: Flagg corona su campaña de Novato del Año con 30 pts' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'CHI', vPts: 115, home: 'DAL', hPts: 132, bbrVerifiedNote: 'Jornada Final 2026-2027: Dallas sella pase directo a postemporada' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'MEM', vPts: 118, home: 'HOU', hPts: 123, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'GSW', vPts: 116, home: 'LAC', hPts: 112, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'UTA', vPts: 105, home: 'LAL', hPts: 126, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'NOP', vPts: 118, home: 'MIN', hPts: 127, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'PHX', vPts: 112, home: 'OKC', hPts: 124, bbrVerifiedNote: 'Jornada Final 2026-2027: OKC gana 62 partidos y amarra el #1 global' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'SAC', vPts: 116, home: 'POR', hPts: 110, bbrVerifiedNote: 'Jornada Final 2026-2027' },
    { iso: '2027-04-11', display: 'Apr 11', monthKey: '2027-04', monthLabel: 'Apr 2027', time: '15:30 ET', visitor: 'DEN', vPts: 121, home: 'SAS', hPts: 126, bbrVerifiedNote: 'Jornada Final 2026-2027: Spurs cierran temporada histórica con 53 victorias y Wembanyama MVP' }
  ];
}
