export interface Match {
	_id?: string;
	homeTeam: string;
	awayTeam: string;
	matchDate: string;
	homeLogo: string;
	awayLogo: string;
	homeScore?: number;
	awayScore?: number;
	status: 'open' | 'live' | 'finished';
	matchday: number;
}

export interface Tip {
	_id?: string;
	matchId: string;
	userName: string;
	homeGoals: number;
	awayGoals: number;
	points?: number;
	createdAt: string;
}

export interface LeaderboardEntry {
	userName: string;
	totalPoints: number;
	matchdayPoints: number;
	rank: number;
	trend: 'up' | 'down' | 'same';
	tipsCount: number;
}
