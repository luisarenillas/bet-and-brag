<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const match = $derived(data.match);

	let homeGoals = $state(1);
	let awayGoals = $state(1);
	let submitting = $state(false);
</script>

<div class="page">
	<a href="/spieltag" class="back">← Zurück</a>
	<h1>Tipp abgeben</h1>

	<!-- Match display -->
	<div class="match-banner">
		<div class="team">
			<span class="logo">{match.homeLogo}</span>
			<span class="name">{match.homeTeam}</span>
		</div>
		<span class="vs">VS</span>
		<div class="team">
			<span class="logo">{match.awayLogo}</span>
			<span class="name">{match.awayTeam}</span>
		</div>
	</div>
	<p class="date">📅 {match.matchDate}</p>

	{#if match.status !== 'open'}
		<div class="alert warning">
			Dieses Spiel ist bereits {match.status === 'live' ? 'live' : 'beendet'}. Tipps können nicht mehr abgegeben werden.
		</div>
	{:else}
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					update();
				};
			}}
		>
			{#if form?.error}
				<div class="alert error">{form.error}</div>
			{/if}

			<div class="field">
				<label for="userName">Dein Name</label>
				<input
					id="userName"
					name="userName"
					type="text"
					placeholder="z.B. Hans"
					required
					minlength="2"
				/>
			</div>

			<div class="score-input">
				<div class="score-team">
					<span class="score-logo">{match.homeLogo}</span>
					<span class="score-name">{match.homeTeam}</span>
					<div class="stepper">
						<button type="button" onclick={() => (homeGoals = Math.max(0, homeGoals - 1))}>−</button>
						<span class="score-val">{homeGoals}</span>
						<button type="button" onclick={() => homeGoals++}>+</button>
					</div>
					<input type="hidden" name="homeGoals" value={homeGoals} />
				</div>

				<span class="colon">:</span>

				<div class="score-team">
					<span class="score-logo">{match.awayLogo}</span>
					<span class="score-name">{match.awayTeam}</span>
					<div class="stepper">
						<button type="button" onclick={() => (awayGoals = Math.max(0, awayGoals - 1))}>−</button>
						<span class="score-val">{awayGoals}</span>
						<button type="button" onclick={() => awayGoals++}>+</button>
					</div>
					<input type="hidden" name="awayGoals" value={awayGoals} />
				</div>
			</div>

			<div class="brag-hint">
				💰 Einsatz: <strong>10 Brag-Points</strong>
			</div>

			<button type="submit" class="submit" disabled={submitting}>
				{submitting ? 'Wird gespeichert…' : '✅ Tipp speichern'}
			</button>
		</form>
	{/if}
</div>

<style>
	.page { display: flex; flex-direction: column; gap: 1.25rem; }
	.back { color: #4ade80; text-decoration: none; font-size: 0.9rem; }
	h1 { font-size: 1.5rem; font-weight: 900; }

	.match-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #16213e;
		border-radius: 16px;
		padding: 1.25rem;
	}
	.team { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex: 1; }
	.logo { font-size: 2.5rem; }
	.name { font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-align: center; }
	.vs { font-size: 1.2rem; font-weight: 800; color: #475569; }
	.date { text-align: center; font-size: 0.85rem; color: #64748b; }

	.alert {
		padding: 0.75rem 1rem;
		border-radius: 10px;
		font-size: 0.9rem;
	}
	.alert.error { background: #3f1f1f; color: #f87171; }
	.alert.warning { background: #3f2f00; color: #fbbf24; }

	.field { display: flex; flex-direction: column; gap: 0.4rem; }
	label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
	input[type='text'] {
		background: #16213e;
		border: 1px solid #1e3a5f;
		border-radius: 10px;
		padding: 0.7rem 1rem;
		color: #f1f5f9;
		font-size: 1rem;
		width: 100%;
		outline: none;
	}
	input[type='text']:focus { border-color: #4ade80; }

	.score-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		background: #16213e;
		border-radius: 16px;
		padding: 1.25rem;
	}
	.score-team { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex: 1; }
	.score-logo { font-size: 2rem; }
	.score-name { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-align: center; }
	.stepper { display: flex; align-items: center; gap: 0.75rem; }
	.stepper button {
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 50%;
		background: #0f172a;
		color: #4ade80;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}
	.score-val { font-size: 1.8rem; font-weight: 900; min-width: 2rem; text-align: center; }
	.colon { font-size: 1.5rem; font-weight: 900; color: #475569; }

	.brag-hint {
		text-align: center;
		font-size: 0.85rem;
		color: #64748b;
		background: #16213e;
		padding: 0.6rem;
		border-radius: 10px;
	}
	.brag-hint strong { color: #4ade80; }

	.submit {
		width: 100%;
		padding: 1rem;
		background: #4ade80;
		color: #0f172a;
		font-weight: 800;
		font-size: 1rem;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.submit:disabled { opacity: 0.5; cursor: not-allowed; }
	.submit:hover:not(:disabled) { opacity: 0.85; }
</style>
