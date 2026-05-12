/**
 * Run with: node seed.mjs
 * Fills the MongoDB database with sample matches.
 * Set MONGODB_URI in .env before running.
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf-8');
const uri = env.match(/MONGODB_URI=(.+)/)?.[1]?.trim();
if (!uri || uri.includes('<username>')) {
	console.error('❌  Please set MONGODB_URI in .env first');
	process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db('bet-and-brag');

await db.collection('matches').deleteMany({});

const matches = [
	{
		homeTeam: 'FC Zürich',
		awayTeam: 'FC Basel',
		matchDate: 'Sa, 17.05.2025 18:00',
		homeLogo: '🔵',
		awayLogo: '🔴',
		status: 'open',
		matchday: 1
	},
	{
		homeTeam: 'YB',
		awayTeam: 'FC St. Gallen',
		matchDate: 'Sa, 17.05.2025 20:30',
		homeLogo: '🟡',
		awayLogo: '🟢',
		status: 'open',
		matchday: 1
	},
	{
		homeTeam: 'Lugano',
		awayTeam: 'Servette',
		matchDate: 'So, 18.05.2025 15:00',
		homeLogo: '⚫',
		awayLogo: '🔴',
		status: 'open',
		matchday: 1
	},
	{
		homeTeam: 'Winterthur',
		awayTeam: 'Lausanne',
		matchDate: 'So, 18.05.2025 17:30',
		homeLogo: '⚪',
		awayLogo: '🔵',
		homeScore: 2,
		awayScore: 1,
		status: 'finished',
		matchday: 1
	}
];

await db.collection('matches').insertMany(matches);
console.log(`✅  Inserted ${matches.length} matches`);
await client.close();
