<script>
  import { goto } from '$app/navigation';
  import { matches, tips, currentUserId, users } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';

  let activeTab = 'gruppe';
  const tabs = [
    { id: 'gruppe', label: 'Gruppenphase' },
    { id: 'meine',  label: 'Meine Tipps'  },
    { id: 'live',   label: 'Live'          },
    { id: 'ko',     label: 'K.o.-Phase'    },
  ];

  const groups = ['A','B','C','D','E','F'];

  const userTipMap = derived([tips, currentUserId], ([$tips, $uid]) => {
    const map = {};
    $tips.filter(t => t.userId === $uid).forEach(t => { map[t.matchId] = t; });
    return map;
  });

  const myTips = derived([tips, currentUserId, matches], ([$tips, $uid, $matches]) =>
    $tips
      .filter(t => t.userId === $uid)
      .map(t => ({ ...t, match: $matches.find(m => m.id === t.matchId) }))
      .filter(t => t.match)
  );

  function formatDate(d) {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('de-CH', { weekday:'short', day:'numeric', month:'short' });
  }

  function statusLabel(m) {
    if (m.status === 'finished') return `${m.result.home}:${m.result.away}`;
    return 'OPEN';
  }
</script>

<style>
  .page { padding-bottom: 8px; }

  .page-header {
    padding: 20px 20px 0;
    background: linear-gradient(to bottom, #0d0d1a, transparent);
  }
  .page-title { font-size: 1.4rem; font-weight: 900; margin-bottom: 4px; }
  .page-sub { color: #8888aa; font-size: 0.8rem; }

  .tabs {
    display: flex;
    gap: 6px;
    padding: 14px 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }

  .tab-btn {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
    background: rgba(255,255,255,0.06);
    color: #8888aa;
    border: 1px solid transparent;
    transition: all 0.2s;
  }
  .tab-btn.active {
    background: rgba(0,210,106,0.15);
    color: #00d26a;
    border-color: rgba(0,210,106,0.3);
  }

  .matches-list { padding: 0 16px; }

  .group-header {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8888aa;
    font-weight: 700;
    padding: 12px 0 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 10px;
  }

  .match-card {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 10px;
    transition: all 0.2s;
    cursor: pointer;
  }
  .match-card:hover { border-color: rgba(0,210,106,0.2); }
  .match-card.finished { opacity: 0.7; border-color: rgba(255,255,255,0.04); }
  .match-card.tipped { border-color: rgba(0,150,255,0.3); }

  .mc-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.7rem;
    color: #666688;
  }
  .status-open {
    background: rgba(0,210,106,0.15);
    color: #00d26a;
    padding: 2px 8px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.65rem;
    letter-spacing: 1px;
  }
  .status-finished {
    background: rgba(255,255,255,0.08);
    color: #cccccc;
    padding: 2px 8px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 0.75rem;
  }
  .status-tipped {
    background: rgba(0,150,255,0.15);
    color: #0096ff;
    padding: 2px 8px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.65rem;
  }

  .mc-teams {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .mc-team {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }
  .mc-team.away { flex-direction: row-reverse; text-align: right; }
  .mc-flag { font-size: 1.8rem; }
  .mc-name { font-size: 0.88rem; font-weight: 700; }
  .mc-score-or-vs {
    font-size: 1rem;
    font-weight: 900;
    color: #8888aa;
    padding: 0 10px;
    min-width: 50px;
    text-align: center;
  }

  .mc-actions { display: flex; gap: 8px; }

  .btn-tippen {
    flex: 1;
    background: linear-gradient(135deg, #00d26a, #00ff88);
    color: #000;
    font-weight: 800;
    font-size: 0.82rem;
    padding: 11px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: transform 0.15s;
  }
  .btn-tippen:hover { transform: scale(1.01); }

  .btn-edit {
    background: rgba(0,150,255,0.15);
    color: #0096ff;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 11px 16px;
    border-radius: 12px;
    border: 1px solid rgba(0,150,255,0.3);
  }

  .my-tip-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #0096ff;
    margin-top: 8px;
  }

  .venue { font-size: 0.68rem; color: #555577; margin-top: 6px; }

  /* My tips view */
  .no-tips {
    text-align: center;
    padding: 60px 20px;
    color: #666688;
  }
  .no-tips-icon { font-size: 3rem; margin-bottom: 12px; }
  .no-tips-title { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
  .no-tips-sub { font-size: 0.82rem; line-height: 1.5; }

  .tip-result-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 600;
  }
  .tip-result-row.exact { background: rgba(0,210,106,0.1); color: #00d26a; }
  .tip-result-row.tendency { background: rgba(255,200,0,0.1); color: #ffc800; }
  .tip-result-row.loss { background: rgba(255,60,60,0.1); color: #ff3c3c; }
  .tip-result-row.pending { background: rgba(255,255,255,0.05); color: #8888aa; }
</style>

<div class="page">
  <div class="page-header">
    <div class="page-title">⚽ WM-Spieltag</div>
    <div class="page-sub">FIFA Weltmeisterschaft 2026</div>
  </div>

  <div class="tabs">
    {#each tabs as tab}
      <button class="tab-btn" class:active={activeTab === tab.id} on:click={() => activeTab = tab.id}>
        {tab.label}
      </button>
    {/each}
  </div>

  {#if activeTab === 'gruppe'}
    <div class="matches-list">
      {#each groups as g}
        {@const groupMatches = $matches.filter(m => m.group === g)}
        <div class="group-header">Gruppe {g}</div>
        {#each groupMatches as match}
          {@const myTip = $userTipMap[match.id]}
          <div class="match-card" class:finished={match.status==='finished'} class:tipped={!!myTip}>
            <div class="mc-top">
              <span>{formatDate(match.date)} · {match.time}</span>
              {#if match.status === 'finished'}
                <span class="status-finished">{match.result.home}:{match.result.away}</span>
              {:else if myTip}
                <span class="status-tipped">✓ Getippt</span>
              {:else}
                <span class="status-open">OPEN</span>
              {/if}
            </div>

            <div class="mc-teams">
              <div class="mc-team">
                <span class="mc-flag">{match.homeFlag}</span>
                <span class="mc-name">{match.homeTeam}</span>
              </div>
              <div class="mc-score-or-vs">
                {#if match.status === 'finished'}{match.result.home}:{match.result.away}{:else}VS{/if}
              </div>
              <div class="mc-team away">
                <span class="mc-flag">{match.awayFlag}</span>
                <span class="mc-name">{match.awayTeam}</span>
              </div>
            </div>

            {#if match.status === 'open'}
              <div class="mc-actions">
                {#if myTip}
                  <div class="my-tip-info" style="flex:1">
                    🎯 Dein Tipp: {myTip.homeScore}:{myTip.awayScore} · Einsatz: 10 Gems
                  </div>
                  <button class="btn-edit" on:click={() => goto(`/tip/${match.id}`)}>Bearbeiten</button>
                {:else}
                  <button class="btn-tippen" on:click={() => goto(`/tip/${match.id}`)}>⚽ Tippen</button>
                {/if}
              </div>
            {:else if myTip}
              {@const net = myTip.payout - myTip.stake}
              <div class="tip-result-row {myTip.status === 'evaluated' ? (myTip.payout >= myTip.stake*3 ? 'exact' : myTip.payout > 0 ? 'tendency' : 'loss') : 'pending'}">
                {#if myTip.status === 'evaluated'}
                  {myTip.payout >= myTip.stake*3 ? '🏆 Volltreffer!' : myTip.payout > 0 ? '✅ Tendenz richtig' : '❌ Leider verloren'}
                  · {myTip.payout >= myTip.stake*3 ? `+${myTip.payout}` : myTip.payout > 0 ? `+${myTip.payout}` : `-${myTip.stake}`} Gems
                {:else}
                  🕐 Tipp ausstehend: {myTip.homeScore}:{myTip.awayScore}
                {/if}
              </div>
            {/if}
            <div class="venue">📍 {match.venue}</div>
          </div>
        {/each}
      {/each}
    </div>

  {:else if activeTab === 'meine'}
    {#if $myTips.length === 0}
      <div class="no-tips">
        <div class="no-tips-icon">🎯</div>
        <div class="no-tips-title">Noch keine Tipps abgegeben</div>
        <div class="no-tips-sub">Tippe auf WM-Spiele und verdiene Football Gems!</div>
      </div>
    {:else}
      <div class="matches-list">
        {#each $myTips as tip}
          {@const m = tip.match}
          <div class="match-card" class:tipped={true}>
            <div class="mc-top">
              <span>{formatDate(m.date)} · {m.time}</span>
              {#if m.status === 'finished'}
                <span class="status-finished">{m.result.home}:{m.result.away}</span>
              {:else}
                <span class="status-open">OPEN</span>
              {/if}
            </div>
            <div class="mc-teams">
              <div class="mc-team">
                <span class="mc-flag">{m.homeFlag}</span>
                <span class="mc-name">{m.homeTeam}</span>
              </div>
              <div class="mc-score-or-vs">VS</div>
              <div class="mc-team away">
                <span class="mc-flag">{m.awayFlag}</span>
                <span class="mc-name">{m.awayTeam}</span>
              </div>
            </div>
            <div class="tip-result-row {tip.status === 'evaluated' ? (tip.payout >= tip.stake*3 ? 'exact' : tip.payout > 0 ? 'tendency' : 'loss') : 'pending'}">
              🎯 Dein Tipp: {tip.homeScore}:{tip.awayScore}
              {#if tip.status === 'evaluated'}
                · {tip.payout >= tip.stake*3 ? `+${tip.payout} 💎 Volltreffer!` : tip.payout > 0 ? `+${tip.payout} 💎 Tendenz!` : `-${tip.stake} 💎`}
              {:else}
                · 10 Gems Einsatz
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

  {:else if activeTab === 'live'}
    <div class="no-tips">
      <div class="no-tips-icon">📡</div>
      <div class="no-tips-title">Keine Live-Spiele gerade</div>
      <div class="no-tips-sub">Die WM startet am 11. Juni 2026. Nutze den Live-Simulations-Modus auf dem Dashboard!</div>
    </div>

  {:else if activeTab === 'ko'}
    <div class="no-tips">
      <div class="no-tips-icon">🏆</div>
      <div class="no-tips-title">K.o.-Phase noch nicht bekannt</div>
      <div class="no-tips-sub">Die K.o.-Phase beginnt nach Abschluss der Gruppenphase. Tippe jetzt auf die Gruppenspiele!</div>
    </div>
  {/if}
</div>
