<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { matches, users, currentUserId, tips, notification, saveTip, getUserTip } from '$lib/stores/gameStore.js';
  import { derived, get } from 'svelte/store';
  import { onMount } from 'svelte';

  $: matchId = Number($page.params.matchId);
  $: match = $matches.find(m => m.id === matchId);
  $: existingTip = $tips.find(t => t.userId === $currentUserId && t.matchId === matchId);

  let homeScore = '';
  let awayScore = '';
  let saving = false;
  let inputError = '';

  onMount(() => {
    if (existingTip) {
      homeScore = String(existingTip.homeScore);
      awayScore = String(existingTip.awayScore);
    }
  });

  $: currentUser = $users.find(u => u.id === $currentUserId);

  function getTendencyLabel(h, a) {
    if (h === '' || a === '') return '';
    const hi = Number(h), ai = Number(a);
    if (hi > ai) return `Sieg ${match?.homeTeam}`;
    if (ai > hi) return `Sieg ${match?.awayTeam}`;
    return 'Unentschieden';
  }

  async function handleSave() {
    inputError = '';
    if (homeScore === '' || awayScore === '') { inputError = 'Bitte beide Scores eingeben.'; return; }
    if (Number(homeScore) < 0 || Number(awayScore) < 0) { inputError = 'Score kann nicht negativ sein.'; return; }
    if (currentUser.gems < 10 && !existingTip) { inputError = 'Nicht genug Football Gems (min. 10)!'; return; }

    saving = true;
    await new Promise(r => setTimeout(r, 400));
    const result = saveTip(matchId, Number(homeScore), Number(awayScore));
    saving = false;

    if (result.ok) {
      notification.set({
        type: 'saved',
        title: existingTip ? 'Tipp aktualisiert!' : 'Tipp gespeichert!',
        message: `${match.homeTeam} ${homeScore}:${awayScore} ${match.awayTeam}${existingTip ? ' – aktualisiert.' : ' – 10 Gems werden bei Spielende verrechnet.'}`,
        gems: existingTip ? null : -10,
      });
      setTimeout(() => goto('/leaderboard'), 100);
    } else {
      inputError = result.message;
    }
  }
</script>

<style>
  .page { padding: 20px 16px; min-height: 80vh; }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8888aa;
    font-size: 0.85rem;
    background: none;
    margin-bottom: 20px;
  }

  .match-hero {
    background: linear-gradient(135deg, #141428, #1e1e38);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 28px 20px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .match-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(0,210,106,0.06), transparent 70%);
  }

  .match-group {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #00d26a;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .teams-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 8px;
  }
  .team-block { text-align: center; }
  .team-flag-big { font-size: 3.5rem; display: block; margin-bottom: 8px; }
  .team-name-big { font-size: 0.85rem; font-weight: 800; }
  .vs-big {
    font-size: 1rem;
    font-weight: 900;
    color: #444466;
  }

  .match-meta {
    font-size: 0.72rem;
    color: #666688;
    margin-top: 12px;
  }

  /* Tip form */
  .tip-card {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .tip-card-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8888aa;
    font-weight: 700;
    margin-bottom: 18px;
    text-align: center;
  }

  .score-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .score-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .score-field .field-label { font-size: 0.7rem; color: #8888aa; font-weight: 600; }

  .score-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .score-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .score-btn:hover { background: rgba(255,255,255,0.14); }

  .score-input {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    background: rgba(255,255,255,0.06);
    border: 2px solid rgba(255,255,255,0.12);
    color: #fff;
    font-size: 2rem;
    font-weight: 900;
    text-align: center;
    transition: border-color 0.2s;
  }
  .score-input:focus {
    outline: none;
    border-color: #00d26a;
    background: rgba(0,210,106,0.05);
  }

  .colon-sep {
    font-size: 2.4rem;
    font-weight: 900;
    color: #444466;
    align-self: flex-end;
    padding-bottom: 4px;
  }

  .tendency-label {
    text-align: center;
    font-size: 0.82rem;
    font-weight: 700;
    color: #00d26a;
    min-height: 20px;
    margin-bottom: 4px;
  }

  /* Einsatz card */
  .stake-card {
    background: linear-gradient(135deg, rgba(0,210,106,0.07), rgba(0,150,50,0.04));
    border: 1px solid rgba(0,210,106,0.2);
    border-radius: 16px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .stake-label { font-size: 0.75rem; color: #8888aa; }
  .stake-amount { font-size: 1.1rem; font-weight: 800; color: #00d26a; }
  .stake-info { font-size: 0.7rem; color: #8888aa; }

  /* Payout info */
  .payout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
  .payout-item {
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .payout-val { font-size: 1rem; font-weight: 800; color: #00d26a; margin-bottom: 3px; }
  .payout-val.loss { color: #ff3c3c; }
  .payout-desc { font-size: 0.62rem; color: #8888aa; }

  .error-msg {
    background: rgba(255,60,60,0.1);
    border: 1px solid rgba(255,60,60,0.25);
    border-radius: 12px;
    padding: 10px 14px;
    color: #ff6666;
    font-size: 0.82rem;
    margin-bottom: 14px;
    text-align: center;
  }

  .btn-save {
    background: linear-gradient(135deg, #00d26a, #00ff88);
    color: #000;
    font-weight: 900;
    font-size: 1rem;
    padding: 16px;
    border-radius: 16px;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 24px rgba(0,210,106,0.35);
    transition: all 0.2s;
    margin-bottom: 10px;
  }
  .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(0,210,106,0.45); }
  .btn-save:disabled { opacity: 0.5; cursor: default; }

  .gems-balance {
    text-align: center;
    font-size: 0.78rem;
    color: #666688;
  }

  .not-found {
    text-align: center;
    padding: 60px 20px;
    color: #666688;
  }

  .finished-banner {
    background: rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 16px;
    text-align: center;
    color: #8888aa;
    font-size: 0.85rem;
    margin-bottom: 16px;
  }
</style>

<div class="page">
  <button class="back-btn" on:click={() => goto('/matches')}>
    ← Zurück zu Spieltag
  </button>

  {#if !match}
    <div class="not-found">
      <div style="font-size:3rem">🤔</div>
      <p>Spiel nicht gefunden.</p>
    </div>
  {:else}
    <!-- Match Hero -->
    <div class="match-hero">
      <div class="match-group">Gruppe {match.group} · {match.date} · {match.time}</div>
      <div class="teams-display">
        <div class="team-block">
          <span class="team-flag-big">{match.homeFlag}</span>
          <span class="team-name-big">{match.homeTeam}</span>
        </div>
        <span class="vs-big">VS</span>
        <div class="team-block">
          <span class="team-flag-big">{match.awayFlag}</span>
          <span class="team-name-big">{match.awayTeam}</span>
        </div>
      </div>
      <div class="match-meta">📍 {match.venue}</div>
    </div>

    {#if match.status === 'finished'}
      <div class="finished-banner">
        🏁 Endresultat: <strong>{match.homeTeam} {match.result.home}:{match.result.away} {match.awayTeam}</strong><br>
        Dieses Spiel wurde bereits simuliert.
      </div>
    {:else}
      <!-- Score Inputs -->
      <div class="tip-card">
        <div class="tip-card-title">Dein Tipp · Ergebnis nach 90 Minuten</div>

        <div class="score-inputs">
          <!-- Home -->
          <div class="score-field">
            <span class="field-label">{match.homeTeam}</span>
            <div class="score-input-wrap">
              <button class="score-btn" on:click={() => homeScore = String(Math.max(0, (Number(homeScore)||0) - 1))}>−</button>
              <input class="score-input" type="number" min="0" max="20" bind:value={homeScore} placeholder="0" />
              <button class="score-btn" on:click={() => homeScore = String((Number(homeScore)||0) + 1)}>+</button>
            </div>
          </div>

          <span class="colon-sep">:</span>

          <!-- Away -->
          <div class="score-field">
            <span class="field-label">{match.awayTeam}</span>
            <div class="score-input-wrap">
              <button class="score-btn" on:click={() => awayScore = String(Math.max(0, (Number(awayScore)||0) - 1))}>−</button>
              <input class="score-input" type="number" min="0" max="20" bind:value={awayScore} placeholder="0" />
              <button class="score-btn" on:click={() => awayScore = String((Number(awayScore)||0) + 1)}>+</button>
            </div>
          </div>
        </div>

        <div class="tendency-label">
          {getTendencyLabel(homeScore, awayScore)}
        </div>
      </div>

      <!-- Stake -->
      <div class="stake-card">
        <div>
          <div class="stake-label">Einsatz</div>
          <div class="stake-amount">💎 10 Football Gems</div>
        </div>
        <div class="stake-info">
          {#if existingTip}Bereits gesetzt{:else}Wird abgezogen{/if}
        </div>
      </div>

      <!-- Payout info -->
      <div class="payout-grid">
        <div class="payout-item">
          <div class="payout-val">+30 💎</div>
          <div class="payout-desc">Volltreffer<br>(exaktes Ergebnis)</div>
        </div>
        <div class="payout-item">
          <div class="payout-val">+20 💎</div>
          <div class="payout-desc">Tendenz<br>richtig</div>
        </div>
        <div class="payout-item">
          <div class="payout-val loss">−10 💎</div>
          <div class="payout-desc">Falsch<br>getippt</div>
        </div>
      </div>

      {#if inputError}
        <div class="error-msg">⚠️ {inputError}</div>
      {/if}

      <button class="btn-save" on:click={handleSave} disabled={saving || homeScore === '' || awayScore === ''}>
        {#if saving}
          ⚽ Wird gespeichert...
        {:else if existingTip}
          ✏️ Tipp aktualisieren
        {:else}
          🎯 Tipp speichern
        {/if}
      </button>

      <div class="gems-balance">💎 Dein Kontostand: {currentUser?.gems ?? 0} Football Gems</div>
    {/if}
  {/if}
</div>
