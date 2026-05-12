import { getDb } from '$lib/db';
import type { Match } from '$lib/types';

export async function load() {
	const db = await getDb();
	const matches = await db
		.collection<Match>('matches')
		.find({})
		.sort({ matchDate: 1 })
		.toArray();

	return {
		matches: matches.map((m) => ({ ...m, _id: m._id?.toString() }))
	};
}
