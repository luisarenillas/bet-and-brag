<script lang="ts">
	import type { Match, Tip } from '$lib/types';

	interface Props {
		match: Match;
		tip?: Tip | null;
		showTipButton?: boolean;
	}

	let { match, tip = null, showTipButton = true }: Props = $props();

	const statusLabel: Record<string, string> = {
		open: 'Offen',
		live: 'Live',
		finished: 'Beendet'
	};
</script>

<div class="card">
	<div class="status {match.status}">
		{statusLabel[match.status]}
	</div>
	<div class="teams">
		<div class="team">
			<span class="logo">{match.homeLogo}</span>
			<span class="name">{match.homeTeam}</span>
		</div>
		<div class="score-area">
			{#if match.status === 'finished' && match.homeScore !== undefined}
				<span class="score">{match.homeScore} : {match.awayScore}</span>
			{:else if match.status === 'live' && match.homeScore !== undefined}
				<span class="score live">{match.homeScore} : {match.awayScore}</span>
			{:else}
				<span class="vs">VS</span>
			{/if}
			<span class="date">{match.matchDate}</span>
		</div>
		<div class="team">
			<span class="logo">{match.awayLogo}</span>
			<span class="name">{match.awayTeam}</span>
		</div>
	</div>

	{#if tip}
		<div class="tip-display">
			Dein Tipp: <strong>{tip.homeGoals} : {tip.awayGoals}</strong>
			{#if tip.points !== undefined}
				<span class="points">{tip.points} Punkte</span>
			{/if}
		</div>
	{/if}

	{#if showTipButton && match.status === 'open'}
		<a href="/spieltag/{match._id}" class="tip-btn">
			{tip ? 'Tipp ändern' : 'Tipp abgeben'}
		</a>
	{/if}
</div>

<style>
	.card {
		background: #16213e;
		border-radius: 16px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.status {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 0.2rem 0.6rem;
		border-radius: 20px;
		width: fit-content;
	}
	.status.open { background: #1e3a5f; color: #60a5fa; }
	.status.live { background: #3f1f1f; color: #f87171; animation: pulse 1.5s infinite; }
	.status.finished { background: #1e3a2f; color: #4ade80; }

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	.teams {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.team {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		flex: 1;
	}
	.logo { font-size: 2rem; }
	.name {
		font-size: 0.75rem;
		font-weight: 600;
		color: #94a3b8;
		text-align: center;
	}
	.score-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
	}
	.score {
		font-size: 1.5rem;
		font-weight: 800;
		color: #f1f5f9;
	}
	.score.live { color: #f87171; }
	.vs {
		font-size: 1rem;
		font-weight: 700;
		color: #475569;
	}
	.date {
		font-size: 0.7rem;
		color: #64748b;
	}
	.tip-display {
		text-align: center;
		font-size: 0.85rem;
		color: #94a3b8;
		background: #0f172a;
		padding: 0.4rem;
		border-radius: 8px;
	}
	.points {
		margin-left: 0.5rem;
		background: #4ade80;
		color: #0f172a;
		padding: 0.1rem 0.4rem;
		border-radius: 10px;
		font-weight: 700;
		font-size: 0.75rem;
	}
	.tip-btn {
		display: block;
		text-align: center;
		background: #4ade80;
		color: #0f172a;
		font-weight: 700;
		padding: 0.6rem;
		border-radius: 10px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: opacity 0.2s;
	}
	.tip-btn:hover { opacity: 0.85; }
</style>
