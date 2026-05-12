import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | null = null;

export async function getDb() {
	if (!client) {
		client = new MongoClient(env.MONGODB_URI, {
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000
		});
	}
	try {
		await client.connect();
	} catch {
		// Already connected, ignore
	}
	return client.db('bet-and-brag');
}
