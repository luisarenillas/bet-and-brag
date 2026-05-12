<script lang="ts">
	import MatchCard from '$lib/components/MatchCard.svelte';

	let { data } = $props();

	let filter = $state<'all' | 'open' | 'finished'>('all');

	const filtered = $derived(
		filter === 'all' ? data.matches : data.matches.filter((m) => m.status === filter)
	);
</script>

<div class="page">
	<h1>Spieltag</h1>

	<div class="tabs">
		{#each (['all', 'open', 'finished'] as const) as tab}
			<button class:active={filter === tab} onclick={() => (filter = tab)}>
				{tab === 'all' ? 'Alle' : tab === 'open' ? 'Offen' : 'Beendet'}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<div class="empty">Keine Spiele gefunden.</div>
	{:else}
		<div class="list">
			{#each filtered as match}
				<MatchCard {match} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.page { display: flex; flex-direction: column; gap: 1.25rem; }
	h1 { font-size: 1.5rem; font-weight: 900; }

	.tabs { display: flex; gap: 0.5rem; }
	button {
		flex: 1;
		padding: 0.5rem;
		border: none;
		border-radius: 10px;
		background: #16213e;
		color: #64748b;
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}
	button.active {
		background: #4ade80;
		color: #0f172a;
	}

	.list { display: flex; flex-direction: column; gap: 0.75rem; }
	.empty { text-align: center; color: #475569; padding: 2rem; }
</style>
