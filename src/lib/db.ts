import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export async function getDb() {
	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI is not defined');

	if (!client) {
		client = new MongoClient(uri, {
			serverSelectionTimeoutMS: 5000,
			connectTimeoutMS: 10000
		});
		await client.connect();
	}
	return client.db('bet-and-brag');
}
