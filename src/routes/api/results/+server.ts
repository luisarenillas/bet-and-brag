import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import { ObjectId } from 'mongodb';
import type { Match } from '$lib/types';
import { calculatePoints } from '$lib/points';

export async function POST({ request }) {
	const db = await getDb();
	const { matchId, homeScore, awayScore }: { matchId: string; homeScore: number; awayScore: number } =
		await request.json();

	// Update match result
	await db.collection('matches').updateOne(
		{ _id: new ObjectId(matchId) },
		{ $set: { homeScore, awayScore, status: 'finished' } }
	);

	// Get the updated match
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const match = (await db.collection('matches').findOne({ _id: new ObjectId(matchId) })) as any as Match;
	if (!match) return json({ error: 'Match not found' }, { status: 404 });
	match._id = match._id?.toString();

	// Recalculate points for all tips of this match
	const tips = await db.collection('tips').find({ matchId }).toArray();
	for (const tip of tips) {
		const points = calculatePoints(tip as never, match);
		await db.collection('tips').updateOne({ _id: tip._id }, { $set: { points } });
	}

	return json({ success: true });
}
