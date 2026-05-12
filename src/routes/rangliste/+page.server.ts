import { getDb } from '$lib/db';
import type { Match, Tip, LeaderboardEntry } from '$lib/types';

export async function load() {
	try {
		const db = await getDb();

		const matches = await db.collection<Match>('matches').find({}).toArray();
		const tips = await db.collection<Tip>('tips').find({}).toArray();

		const currentMatchday = Math.max(...matches.map((m) => m.matchday), 1);

		const pointsMap: Record<string, number> = {};
		const matchdayMap: Record<string, number> = {};
		const countMap: Record<string, number> = {};

		for (const tip of tips) {
			const pts = tip.points ?? 0;
			pointsMap[tip.userName] = (pointsMap[tip.userName] ?? 0) + pts;
			countMap[tip.userName] = (countMap[tip.userName] ?? 0) + 1;

			const match = matches.find((m) => m._id?.toString() === tip.matchId);
			if (match?.matchday === currentMatchday) {
				matchdayMap[tip.userName] = (matchdayMap[tip.userName] ?? 0) + pts;
			}
		}

		const allUsers = new Set([...Object.keys(pointsMap), ...Object.keys(countMap)]);

		const leaderboard: LeaderboardEntry[] = Array.from(allUsers)
			.map((userName) => ({
				userName,
				totalPoints: pointsMap[userName] ?? 0,
				matchdayPoints: matchdayMap[userName] ?? 0,
				rank: 0,
				trend: 'same' as const,
				tipsCount: countMap[userName] ?? 0
			}))
			.sort((a, b) => b.totalPoints - a.totalPoints)
			.map((e, i) => ({ ...e, rank: i + 1 }));

		const matchdayWinner =
			Object.entries(matchdayMap).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

		return { leaderboard, matchdayWinner, currentMatchday, dbError: null };
	} catch (e) {
		console.error('DB Error:', e);
		return { leaderboard: [], matchdayWinner: null, currentMatchday: 1, dbError: 'Datenbankverbindung fehlgeschlagen.' };
	}
}
