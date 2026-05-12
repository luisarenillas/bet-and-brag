import type { Tip, Match } from './types';

export function calculatePoints(tip: Tip, match: Match): number {
	if (match.homeScore === undefined || match.awayScore === undefined) return 0;

	const tipTendency = Math.sign(tip.homeGoals - tip.awayGoals);
	const realTendency = Math.sign(match.homeScore - match.awayScore);

	// Exact result: 3 points
	if (tip.homeGoals === match.homeScore && tip.awayGoals === match.awayScore) {
		return 3;
	}
	// Correct tendency (win/draw/loss): 1 point
	if (tipTendency === realTendency) {
		return 1;
	}
	return 0;
}
