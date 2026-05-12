<script lang="ts">
	let { data } = $props();
</script>

<div class="page">
	<h1>Rangliste</h1>
	<p class="matchday">Spieltag {data.currentMatchday}</p>

	<!-- Matchday Winner -->
	{#if data.matchdayWinner}
		<div class="motm">
			<div class="crown">👑</div>
			<div class="motm-label">Man of the Matchday</div>
			<div class="motm-name">{data.matchdayWinner}</div>
			<div class="motm-pts">{data.leaderboard.find(e => e.userName === data.matchdayWinner)?.matchdayPoints ?? 0} Pts diesen Spieltag</div>
		</div>
	{/if}

	<!-- Full Leaderboard -->
	{#if data.leaderboard.length === 0}
		<div class="empty">
			<span>📊</span>
			<p>Noch keine Tipps abgegeben. Sei der Erste!</p>
			<a href="/spieltag">Jetzt tippen →</a>
		</div>
	{:else}
		<div class="lb-header">
			<span class="col-rank">#</span>
			<span class="col-name">Name</span>
			<span class="col-pts">Spieltag</span>
			<span class="col-total">Total</span>
		</div>
		<div class="lb-list">
			{#each data.leaderboard as entry}
				<div class="lb-row {entry.rank <= 3 ? 'top' : ''}" style="--zone: {entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#b45309' : '#1e3a5f'}">
					<span class="col-rank rank-badge">
						{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
					</span>
					<div class="col-name name-block">
						<span class="name">{entry.userName}</span>
						<span class="tips-count">{entry.tipsCount} Tipps</span>
					</div>
					<span class="col-pts matchday-pts">
						{entry.matchdayPoints > 0 ? `+${entry.matchdayPoints}` : '—'}
					</span>
					<span class="col-total total-pts">{entry.totalPoints}</span>
				</div>
			{/each}
		</div>

		<!-- Zone Legend -->
		<div class="zones">
			<div class="zone cl">🟢 Champions League Zone (Top 3)</div>
			<div class="zone el">🟡 Europa League (Platz 4–6)</div>
			<div class="zone rel">🔴 Abstiegszone (letzte Plätze)</div>
		</div>
	{/if}
</div>

<style>
	.page { display: flex; flex-direction: column; gap: 1.25rem; }
	h1 { font-size: 1.5rem; font-weight: 900; }
	.matchday { color: #64748b; font-size: 0.85rem; margin-top: -0.75rem; }

	.motm {
		background: linear-gradient(135deg, #2a1f00, #1a1206);
		border: 1px solid #fbbf2450;
		border-radius: 16px;
		padding: 1.25rem;
		text-align: center;
	}
	.crown { font-size: 2rem; }
	.motm-label { font-size: 0.7rem; color: #fbbf24; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
	.motm-name { font-size: 1.6rem; font-weight: 900; margin: 0.2rem 0; }
	.motm-pts { font-size: 0.8rem; color: #78716c; }

	.lb-header {
		display: grid;
		grid-template-columns: 2.5rem 1fr 4rem 4rem;
		padding: 0 0.75rem;
		font-size: 0.7rem;
		color: #475569;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.lb-list { display: flex; flex-direction: column; gap: 0.4rem; }

	.lb-row {
		display: grid;
		grid-template-columns: 2.5rem 1fr 4rem 4rem;
		align-items: center;
		padding: 0.75rem;
		background: #16213e;
		border-radius: 12px;
		border-left: 3px solid var(--zone);
	}

	.rank-badge { font-size: 1.1rem; text-align: center; }
	.name-block { display: flex; flex-direction: column; }
	.name { font-weight: 700; font-size: 0.95rem; }
	.tips-count { font-size: 0.7rem; color: #475569; }

	.matchday-pts {
		text-align: center;
		font-size: 0.85rem;
		font-weight: 700;
		color: #4ade80;
	}
	.total-pts {
		text-align: center;
		font-size: 1rem;
		font-weight: 900;
		color: #f1f5f9;
	}

	.zones {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.75rem;
		background: #16213e;
		border-radius: 12px;
	}
	.zone { font-size: 0.75rem; color: #64748b; }

	.empty {
		text-align: center;
		padding: 2rem;
		color: #475569;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}
	.empty span { font-size: 2.5rem; }
	.empty a { color: #4ade80; text-decoration: none; }
</style>
