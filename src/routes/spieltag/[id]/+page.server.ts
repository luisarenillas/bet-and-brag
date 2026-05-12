import { getDb } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { Match, Tip } from '$lib/types';
import type { Actions } from './$types';

export async function load({ params }) {
	const db = await getDb();

	let match: Match | null = null;
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		match = (await db.collection('matches').findOne({ _id: new ObjectId(params.id) })) as any;
	} catch {
		error(404, 'Match nicht gefunden');
	}

	if (!match) error(404, 'Match nicht gefunden');

	return {
		match: { ...match, _id: match._id?.toString() }
	};
}

export const actions: Actions = {
	default: async ({ request, params }) => {
		const db = await getDb();
		const form = await request.formData();

		const userName = (form.get('userName') as string)?.trim();
		const homeGoals = parseInt(form.get('homeGoals') as string);
		const awayGoals = parseInt(form.get('awayGoals') as string);

		if (!userName || userName.length < 2) {
			return fail(400, { error: 'Bitte gib deinen Namen ein (min. 2 Zeichen).' });
		}
		if (isNaN(homeGoals) || isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0) {
			return fail(400, { error: 'Ungültige Toranzahl.' });
		}

		const tip: Omit<Tip, '_id'> = {
			matchId: params.id,
			userName,
			homeGoals,
			awayGoals,
			createdAt: new Date().toISOString()
		};

		await db.collection('tips').updateOne(
			{ matchId: params.id, userName },
			{ $set: tip },
			{ upsert: true }
		);

		redirect(303, '/rangliste');
	}
};
