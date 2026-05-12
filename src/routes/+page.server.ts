import { getDb } from '$lib/db';
import type { Match, Tip } from '$lib/types';

export async function load() {
	try {
		const db = await getDb();

		const matches = await db
			.collection<Match>('matches')
			.find({})
			.sort({ matchDate: 1 })
			.toArray();

		const tips = await db.collection<Tip>('tips').find({}).toArray();

		const pointsMap: Record<string, number> = {};
		const matchdayMap: Record<string, number> = {};
		const countMap: Record<string, number> = {};

		const currentMatchday = Math.max(...matches.map((m) => m.matchday), 1);

		for (const tip of tips) {
			const pts = tip.points ?? 0;
			pointsMap[tip.userName] = (pointsMap[tip.userName] ?? 0) + pts;
			countMap[tip.userName] = (countMap[tip.userName] ?? 0) + 1;

			const match = matches.find((m) => m._id?.toString() === tip.matchId);
			if (match && match.matchday === currentMatchday) {
				matchdayMap[tip.userName] = (matchdayMap[tip.userName] ?? 0) + pts;
			}
		}

		const leaderboard = Object.entries(pointsMap)
			.map(([userName, totalPoints], i) => ({
				userName,
				totalPoints,
				matchdayPoints: matchdayMap[userName] ?? 0,
				rank: i + 1,
				trend: 'same' as const,
				tipsCount: countMap[userName] ?? 0
			}))
			.sort((a, b) => b.totalPoints - a.totalPoints)
			.map((e, i) => ({ ...e, rank: i + 1 }));

		const matchdayWinner =
			Object.entries(matchdayMap).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

		const nextMatch = matches.find((m) => m.status === 'open') ?? null;

		return {
			leaderboard,
			matchdayWinner,
			nextMatch: nextMatch ? { ...nextMatch, _id: nextMatch._id?.toString() } : null,
			dbError: null
		};
	} catch (e) {
		console.error('DB Error:', e);
		return {
			leaderboard: [],
			matchdayWinner: null,
			nextMatch: null,
			dbError: 'Datenbankverbindung fehlgeschlagen.'
		};
	}
}
