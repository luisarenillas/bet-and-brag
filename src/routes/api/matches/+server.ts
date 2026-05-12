import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import type { Match } from '$lib/types';

export async function GET() {
	const db = await getDb();
	const matches = await db.collection<Match>('matches').find({}).toArray();
	return json(matches.map((m) => ({ ...m, _id: m._id?.toString() })));
}

export async function POST({ request }) {
	const db = await getDb();
	const body: Omit<Match, '_id'> = await request.json();
	const result = await db.collection('matches').insertOne(body);
	return json({ _id: result.insertedId.toString(), ...body }, { status: 201 });
}
