import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db';
import { ObjectId } from 'mongodb';
import type { Tip } from '$lib/types';

export async function GET({ url }) {
	const db = await getDb();
	const matchId = url.searchParams.get('matchId');
	const userName = url.searchParams.get('userName');

	const filter: Record<string, string> = {};
	if (matchId) filter.matchId = matchId;
	if (userName) filter.userName = userName;

	const tips = await db.collection<Tip>('tips').find(filter).toArray();
	return json(tips.map((t) => ({ ...t, _id: t._id?.toString() })));
}

export async function POST({ request }) {
	const db = await getDb();
	const body: Omit<Tip, '_id'> = await request.json();

	// Upsert: update if tip already exists for this user + match
	await db.collection('tips').updateOne(
		{ matchId: body.matchId, userName: body.userName },
		{ $set: { ...body, createdAt: new Date().toISOString() } },
		{ upsert: true }
	);

	return json({ success: true }, { status: 200 });
}
