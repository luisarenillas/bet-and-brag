<script lang="ts">
	import MatchCard from '$lib/components/MatchCard.svelte';

	let { data } = $props();
</script>

<div class="dashboard">
	<!-- Header -->
	<div class="header">
		<h1>Bet <span class="amp">&</span> Brag</h1>
		<p class="subtitle">Die private Fussball-Tipprunde</p>
	</div>

	<!-- Man of the Matchday -->
	{#if data.matchdayWinner}
		<div class="motm">
			<div class="motm-label">🏆 Man of the Matchday</div>
			<div class="motm-name">{data.matchdayWinner}</div>
			<div class="motm-sub">Aktueller Spieltags-König</div>
		</div>
	{:else}
		<div class="motm empty">
			<div class="motm-label">🏆 Man of the Matchday</div>
			<div class="motm-sub">Noch keine Tipps abgegeben</div>
		</div>
	{/if}

	<!-- Leaderboard Preview -->
	{#if data.leaderboard.length > 0}
		<section>
			<div class="section-header">
				<h2>Rangliste</h2>
				<a href="/rangliste">Alle anzeigen →</a>
			</div>
			<div class="leaderboard-preview">
				{#each data.leaderboard.slice(0, 3) as entry, i}
					<div class="lb-row {i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'}">
						<span class="lb-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
						<span class="lb-name">{entry.userName}</span>
						<span class="lb-pts">{entry.totalPoints} Pts</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Next Match -->
	{#if data.nextMatch}
		<section>
			<div class="section-header">
				<h2>Nächstes Spiel</h2>
				<a href="/spieltag">Alle Spiele →</a>
			</div>
			<MatchCard match={data.nextMatch} />
		</section>
	{:else}
		<div class="empty-state">
			<span>⚽</span>
			<p>Keine offenen Spiele</p>
			<a href="/spieltag">Alle Spiele ansehen</a>
		</div>
	{/if}
</div>

<style>
	.dashboard { display: flex; flex-direction: column; gap: 1.5rem; }

	.header { text-align: center; padding: 0.5rem 0; }
	h1 { font-size: 2rem; font-weight: 900; color: #f1f5f9; }
	.amp { color: #4ade80; }
	.subtitle { color: #64748b; font-size: 0.85rem; margin-top: 0.2rem; }

	.motm {
		background: linear-gradient(135deg, #1a3a2e, #16213e);
		border: 1px solid #4ade8040;
		border-radius: 16px;
		padding: 1.2rem;
		text-align: center;
	}
	.motm.empty { opacity: 0.6; }
	.motm-label { font-size: 0.75rem; color: #4ade80; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
	.motm-name { font-size: 1.8rem; font-weight: 900; margin: 0.3rem 0; }
	.motm-sub { font-size: 0.8rem; color: #64748b; }

	section { display: flex; flex-direction: column; gap: 0.75rem; }
	.section-header { display: flex; justify-content: space-between; align-items: center; }
	h2 { font-size: 1rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
	.section-header a { font-size: 0.8rem; color: #4ade80; text-decoration: none; }

	.leaderboard-preview { display: flex; flex-direction: column; gap: 0.5rem; }
	.lb-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		background: #16213e;
	}
	.lb-row.gold { border-left: 3px solid #fbbf24; }
	.lb-row.silver { border-left: 3px solid #94a3b8; }
	.lb-row.bronze { border-left: 3px solid #b45309; }
	.lb-rank { font-size: 1.2rem; }
	.lb-name { flex: 1; font-weight: 600; }
	.lb-pts { font-weight: 700; color: #4ade80; }

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: #475569;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}
	.empty-state span { font-size: 2.5rem; }
	.empty-state a { color: #4ade80; text-decoration: none; font-size: 0.9rem; }
</style>
