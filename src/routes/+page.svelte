<script>
  import { goto } from '$app/navigation';
  import { users, currentUserId, matches, tips, notification, simulateMatch, leaderboard } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';
  import { onMount } from 'svelte';

  const currentUser = derived([users, currentUserId], ([$u, $id]) => $u.find(u => u.id === $id));

  // Countdown to WM 2026 start: June 11, 2026
  const WM_START = new Date('2026-06-11T19:00:00Z');
  let now = new Date();
  $: diff = WM_START - now;
  $: days = Math.max(0, Math.floor(diff / (1000*60*60*24)));
  $: hours = Math.max(0, Math.floor((diff % (1000*60*60*24)) / (1000*60*60)));
  $: minutes = Math.max(0, Math.floor((diff % (1000*60*60)) / (1000*60)));
  $: seconds = Math.max(0, Math.floor((diff % (1000*60)) / 1000));

  let interval;
  onMount(() => {
    interval = setInterval(() => { now = new Date(); }, 1000);
    return () => clearInterval(interval);
  });

  const openMatches = derived(matches, $m => $m.filter(m => m.status === 'open'));
  const finishedMatches = derived(matches, $m => $m.filter(m => m.status === 'finished'));
  const openingMatch = derived(matches, $m => $m.find(m => m.id === 1));

  let simulating = false;

  async function runSimulation() {
    const $open = $openMatches;
    if ($open.length === 0) {
      notification.set({ type: 'saved', title: 'Keine offenen Spiele', message: 'Alle Spiele wurden bereits simuliert.', gems: null });
      return;
    }
    simulating = true;

    // Pick first open match
    const match = $open[0];
    await new Promise(r => setTimeout(r, 600));

    const outcome = simulateMatch(match.id);
    simulating = false;

    if (!outcome) return;
    const { result, myPayout } = outcome;

    if (myPayout) {
      const netGems = myPayout.payout - 10;
      if (myPayout.result === 'exact') {
        notification.set({
          type: 'win',
          title: '🎯 Volltreffer!',
          message: `${match.homeTeam} ${result.home}:${result.away} ${match.awayTeam} – Du hast das Ergebnis exakt getippt!`,
          gems: myPayout.payout,
        });
      } else if (myPayout.result === 'tendency') {
        notification.set({
          type: 'partial',
          title: 'Tendenz richtig!',
          message: `${match.homeTeam} ${result.home}:${result.away} ${match.awayTeam} – Tendenz stimmt, Ergebnis nicht ganz.`,
          gems: myPayout.payout,
        });
      } else {
        notification.set({
          type: 'loss',
          title: 'Leider verloren!',
          message: `${match.homeTeam} ${result.home}:${result.away} ${match.awayTeam} – Dein Tipp war leider falsch.`,
          gems: -10,
        });
      }
    } else {
      notification.set({
        type: 'saved',
        title: 'Spiel simuliert!',
        message: `${match.homeTeam} ${result.home}:${result.away} ${match.awayTeam} – Du hattest keinen Tipp auf dieses Spiel.`,
        gems: null,
      });
    }
  }

  const topUser = derived(leaderboard, $lb => $lb[0]);
</script>

<style>
  .page { padding: 0 0 16px; }

  /* Hero banner */
  .hero {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f2020 100%);
    padding: 28px 20px 24px;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(0,210,106,0.15);
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(0,210,106,0.08) 0%, transparent 70%);
  }

  .hero-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #00d26a;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .hero-title {
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .hero-sub { color: #8888aa; font-size: 0.85rem; }

  .world-cup-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2.8rem;
    opacity: 0.6;
  }

  /* Countdown */
  .countdown-section {
    margin: 16px 16px 0;
  }
  .countdown-card {
    background: linear-gradient(135deg, rgba(0,210,106,0.1), rgba(0,150,50,0.05));
    border: 1px solid rgba(0,210,106,0.25);
    border-radius: 18px;
    padding: 16px 20px;
  }
  .countdown-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #00d26a;
    font-weight: 700;
    margin-bottom: 12px;
    text-align: center;
  }
  .countdown-digits {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .cd-unit {
    text-align: center;
    min-width: 52px;
  }
  .cd-value {
    font-size: 2rem;
    font-weight: 900;
    color: #00d26a;
    line-height: 1;
    display: block;
  }
  .cd-sep {
    font-size: 2rem;
    font-weight: 900;
    color: #00d26a;
    align-self: flex-start;
    margin-top: 2px;
    opacity: 0.5;
  }
  .cd-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #8888aa;
    margin-top: 3px;
  }

  /* Opening match */
  .section { margin: 16px 16px 0; }
  .section-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8888aa;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .opening-card {
    background: linear-gradient(135deg, #141428 0%, #1e1e38 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .opening-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(0,210,106,0.06), transparent 70%);
    pointer-events: none;
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .match-badge {
    background: rgba(0,210,106,0.15);
    color: #00d26a;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid rgba(0,210,106,0.3);
  }
  .match-date { color: #8888aa; font-size: 0.75rem; }

  .teams-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
  }
  .team-flag { font-size: 2.4rem; }
  .team-name { font-size: 0.8rem; font-weight: 700; text-align: center; }
  .vs-divider {
    font-size: 1.2rem;
    font-weight: 900;
    color: #444466;
    padding: 0 12px;
  }

  .btn-tip-now {
    background: linear-gradient(135deg, #00d26a, #00ff88);
    color: #000;
    font-weight: 800;
    font-size: 0.9rem;
    padding: 14px;
    border-radius: 14px;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(0,210,106,0.3);
  }
  .btn-tip-now:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,210,106,0.4); }
  .btn-tip-now:active { transform: translateY(0); }

  /* Simulation section */
  .sim-section { margin: 16px 16px 0; }
  .sim-card {
    background: linear-gradient(135deg, #1a0a2e 0%, #2a1040 100%);
    border: 1px solid rgba(180, 100, 255, 0.25);
    border-radius: 18px;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .sim-icon { font-size: 2.4rem; flex-shrink: 0; }
  .sim-info { flex: 1; }
  .sim-title { font-size: 0.95rem; font-weight: 800; margin-bottom: 4px; }
  .sim-desc { color: #8888aa; font-size: 0.78rem; line-height: 1.4; }
  .btn-sim {
    background: linear-gradient(135deg, #b464ff, #7b2fff);
    color: #fff;
    font-weight: 800;
    font-size: 0.75rem;
    padding: 10px 16px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(180,100,255,0.3);
  }
  .btn-sim:disabled { opacity: 0.5; }
  .btn-sim:not(:disabled):hover { transform: scale(1.02); }

  /* Leaderboard preview */
  .lb-card {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
  }
  .lb-header {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .lb-header-title { font-size: 0.85rem; font-weight: 800; }
  .lb-see-all {
    font-size: 0.75rem;
    color: #00d26a;
    font-weight: 600;
    background: none;
    padding: 4px 0;
  }
  .lb-row {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s;
  }
  .lb-row:last-child { border-bottom: none; }
  .lb-rank {
    font-size: 0.75rem;
    font-weight: 800;
    color: #8888aa;
    width: 20px;
    text-align: center;
  }
  .lb-rank.gold { color: #ffd700; }
  .lb-rank.silver { color: #c0c0c0; }
  .lb-rank.bronze { color: #cd7f32; }
  .lb-avatar { font-size: 1.4rem; }
  .lb-name { flex: 1; font-size: 0.9rem; font-weight: 600; }
  .lb-gems { font-size: 0.85rem; font-weight: 700; color: #00d26a; }
  .lb-trend { font-size: 0.9rem; }

  /* Stats row */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 16px 16px 0;
  }
  .stat-card {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 16px;
    text-align: center;
  }
  .stat-value { font-size: 1.6rem; font-weight: 900; color: #00d26a; }
  .stat-label { font-size: 0.7rem; color: #8888aa; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

  .spin { animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>

<div class="page">
  <!-- Hero -->
  <div class="hero">
    <div class="hero-label">🏆 WM 2026 · USA / Kanada / Mexiko</div>
    <div class="hero-title">Bereit für den Anpfiff?<br>Wer wird Tippkönig?</div>
    <div class="hero-sub">Tippe auf WM-Spiele und gewinne Football Gems</div>
    <div class="world-cup-badge">🌍</div>
  </div>

  <!-- Countdown -->
  <div class="countdown-section">
    <div class="countdown-card">
      <div class="countdown-label">⚡ WM-Eröffnung startet in</div>
      <div class="countdown-digits">
        <div class="cd-unit">
          <span class="cd-value">{String(days).padStart(2,'0')}</span>
          <div class="cd-label">Tage</div>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-unit">
          <span class="cd-value">{String(hours).padStart(2,'0')}</span>
          <div class="cd-label">Std</div>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-unit">
          <span class="cd-value">{String(minutes).padStart(2,'0')}</span>
          <div class="cd-label">Min</div>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-unit">
          <span class="cd-value">{String(seconds).padStart(2,'0')}</span>
          <div class="cd-label">Sek</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Opening match -->
  {#if $openingMatch}
  <div class="section">
    <div class="section-title">🔥 Eröffnungsspiel</div>
    <div class="opening-card">
      <div class="match-header">
        <span class="match-badge">🟢 Open · Gruppe {$openingMatch.group}</span>
        <span class="match-date">{$openingMatch.date} · {$openingMatch.time}</span>
      </div>
      <div class="teams-row">
        <div class="team">
          <span class="team-flag">{$openingMatch.homeFlag}</span>
          <span class="team-name">{$openingMatch.homeTeam}</span>
        </div>
        <span class="vs-divider">VS</span>
        <div class="team">
          <span class="team-flag">{$openingMatch.awayFlag}</span>
          <span class="team-name">{$openingMatch.awayTeam}</span>
        </div>
      </div>
      <button class="btn-tip-now" on:click={() => goto('/matches')}>
        🎯 Jetzt ersten Tipp abgeben!
      </button>
    </div>
  </div>
  {/if}

  <!-- Stats -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-value">{$openMatches.length}</div>
      <div class="stat-label">Offene Spiele</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{$finishedMatches.length}</div>
      <div class="stat-label">Simuliert</div>
    </div>
  </div>

  <!-- Live Simulation Button -->
  <div class="sim-section">
    <div class="sim-card">
      <div class="sim-icon">{simulating ? '⚡' : '🎮'}</div>
      <div class="sim-info">
        <div class="sim-title">Live-Simulations-Modus</div>
        <div class="sim-desc">Simuliere ein WM-Spiel live und check sofort deine Gems!</div>
      </div>
      <button class="btn-sim" on:click={runSimulation} disabled={simulating || $openMatches.length === 0}>
        {#if simulating}<span class="spin">⚽</span> Live{:else}▶ Starten{/if}
      </button>
    </div>
  </div>

  <!-- Leaderboard Preview -->
  <div class="section">
    <div class="section-title">👑 Top Tippkönige</div>
    <div class="lb-card">
      <div class="lb-header">
        <span class="lb-header-title">Bragging Rights</span>
        <button class="lb-see-all" on:click={() => goto('/leaderboard')}>Alle anzeigen →</button>
      </div>
      {#each $leaderboard.slice(0,3) as user}
        <div class="lb-row">
          <span class="lb-rank" class:gold={user.rank===1} class:silver={user.rank===2} class:bronze={user.rank===3}>
            {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
          </span>
          <span class="lb-avatar">{user.avatar}</span>
          <span class="lb-name">{user.name}</span>
          <span class="lb-gems">💎 {user.gems}</span>
          <span class="lb-trend">
            {#if user.trend > 0}🟢{:else if user.trend < 0}🔴{:else}➖{/if}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>
