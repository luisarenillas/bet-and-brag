<script>
  import { leaderboard, currentUserId, users } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';

  let h2hUser = null;

  function closeH2H() { h2hUser = null; }

  const myRank = derived([leaderboard, currentUserId], ([$lb, $uid]) =>
    $lb.find(u => u.id === $uid)
  );

  function zoneClass(rank) {
    if (rank <= 3) return 'zone-top';
    if (rank <= 7) return 'zone-mid';
    return 'zone-bottom';
  }

  function zoneBg(rank) {
    if (rank <= 3) return 'top';
    if (rank <= 7) return 'mid';
    return 'bot';
  }
</script>

<style>
  .page { padding-bottom: 8px; }

  .page-header {
    padding: 20px 20px 12px;
    background: linear-gradient(135deg, #0d0d1a 0%, #1a1020 100%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .page-title { font-size: 1.3rem; font-weight: 900; }
  .page-sub { color: #8888aa; font-size: 0.75rem; }
  .trophy { font-size: 2rem; }

  /* My stat */
  .my-stat {
    margin: 12px 16px 0;
    background: linear-gradient(135deg, rgba(0,210,106,0.1), rgba(0,150,50,0.05));
    border: 1px solid rgba(0,210,106,0.25);
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .my-rank-big { font-size: 2rem; font-weight: 900; color: #00d26a; min-width: 50px; text-align: center; }
  .my-name { font-size: 0.95rem; font-weight: 800; }
  .my-gems { font-size: 0.82rem; color: #00d26a; font-weight: 700; }
  .my-trend { font-size: 1.2rem; margin-left: auto; }

  /* Zone labels */
  .zone-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    padding: 8px 20px 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .zone-label.top { color: #ffd700; }
  .zone-label.mid { color: #8888aa; }
  .zone-label.bot { color: #ff4444; }
  .zone-divider {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
  }

  /* Leaderboard list */
  .lb-list { padding: 0 12px; }

  .lb-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px;
    border-radius: 16px;
    margin-bottom: 6px;
    border: 1px solid transparent;
    transition: all 0.2s;
    cursor: default;
  }

  .lb-row.top { background: rgba(255,215,0,0.05); border-color: rgba(255,215,0,0.1); }
  .lb-row.mid { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); }
  .lb-row.bot { background: rgba(255,40,40,0.04); border-color: rgba(255,40,40,0.1); }
  .lb-row.me  { border-color: rgba(0,210,106,0.35) !important; box-shadow: 0 0 0 1px rgba(0,210,106,0.15); }

  .rank-cell {
    min-width: 32px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 800;
  }
  .rank-num.gold   { color: #ffd700; }
  .rank-num.silver { color: #c0c0c0; }
  .rank-num.bronze { color: #cd7f32; }
  .rank-num        { color: #8888aa; }

  .avatar { font-size: 1.5rem; }

  .user-info { flex: 1; }
  .user-name { font-size: 0.9rem; font-weight: 700; }
  .user-tips { font-size: 0.68rem; color: #666688; }

  .gems-cell {
    text-align: right;
  }
  .gems-val {
    font-size: 0.92rem;
    font-weight: 800;
    color: #00d26a;
  }
  .gems-label { font-size: 0.62rem; color: #666688; }

  .trend-cell { font-size: 1rem; min-width: 20px; text-align: center; }

  .h2h-btn {
    background: rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 5px 8px;
    font-size: 0.75rem;
    color: #8888aa;
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.15s;
  }
  .h2h-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

  /* H2H Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 500;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .h2h-sheet {
    background: #1a1a2e;
    border-radius: 24px 24px 0 0;
    padding: 28px 24px 40px;
    width: 100%;
    max-width: 480px;
    border-top: 1px solid rgba(255,255,255,0.1);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { transform: translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }

  .h2h-handle {
    width: 40px;
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
    margin: 0 auto 20px;
  }
  .h2h-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 6px; }
  .h2h-sub { color: #8888aa; font-size: 0.82rem; margin-bottom: 20px; }
  .h2h-empty { color: #666688; font-size: 0.85rem; line-height: 1.5; }

  .close-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-weight: 700;
    margin-top: 20px;
    font-size: 0.9rem;
  }

  /* Legend */
  .legend {
    display: flex;
    gap: 16px;
    padding: 10px 20px 4px;
    font-size: 0.65rem;
    color: #666688;
    flex-wrap: wrap;
  }
  .legend-item { display: flex; align-items: center; gap: 4px; }
</style>

<div class="page">
  <div class="page-header">
    <div class="header-top">
      <div>
        <div class="page-title">👑 Bragging Rights</div>
        <div class="page-sub">Leaderboard · WM 2026</div>
      </div>
      <span class="trophy">🏆</span>
    </div>
  </div>

  <!-- My position -->
  {#if $myRank}
    <div class="my-stat">
      <div class="my-rank-big">#{$myRank.rank}</div>
      <div>
        <div class="my-name">{$myRank.avatar} {$myRank.name} (Du)</div>
        <div class="my-gems">💎 {$myRank.gems} Football Gems</div>
      </div>
      <div class="my-trend">
        {#if $myRank.trend > 0}🟢 ↑{:else if $myRank.trend < 0}🔴 ↓{:else}➖{/if}
      </div>
    </div>
  {/if}

  <div class="legend">
    <span class="legend-item">🟢 ↑ Aufsteiger</span>
    <span class="legend-item">🔴 ↓ Absteiger</span>
    <span class="legend-item">➖ Gleichbleibend</span>
    <span class="legend-item">⚔️ Head-to-Head</span>
  </div>

  <!-- Zones + Rows -->
  {#each $leaderboard as user, i}
    {#if i === 0}
      <div class="zone-label top">🥇 Final-Zone (Top 3) <span class="zone-divider"></span></div>
    {:else if i === 3}
      <div class="zone-label mid">📊 Mittelfeld <span class="zone-divider"></span></div>
    {:else if i === 7}
      <div class="zone-label bot">💀 Gurken-Zone <span class="zone-divider"></span></div>
    {/if}

    <div class="lb-list">
      <div class="lb-row {zoneBg(user.rank)}" class:me={user.id === $currentUserId}>

        <div class="rank-cell">
          {#if user.rank === 1}<span class="rank-num gold">🥇</span>
          {:else if user.rank === 2}<span class="rank-num silver">🥈</span>
          {:else if user.rank === 3}<span class="rank-num bronze">🥉</span>
          {:else}<span class="rank-num">#{user.rank}</span>
          {/if}
        </div>

        <span class="avatar">{user.avatar}</span>

        <div class="user-info">
          <div class="user-name">{user.name}{user.id === $currentUserId ? ' 👈' : ''}</div>
          <div class="user-tips">{user.tipsCount} Tipps ausgewertet · {user.tipsWon} gewonnen</div>
        </div>

        <div class="gems-cell">
          <div class="gems-val">💎 {user.gems}</div>
          <div class="gems-label">Gems</div>
        </div>

        <div class="trend-cell">
          {#if user.trend > 0}🟢{:else if user.trend < 0}🔴{:else}➖{/if}
        </div>

        <button class="h2h-btn" on:click={() => h2hUser = user}>⚔️</button>
      </div>
    </div>
  {/each}
</div>

<!-- H2H Sheet -->
{#if h2hUser}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="overlay" on:click|self={closeH2H}>
    <div class="h2h-sheet">
      <div class="h2h-handle"></div>
      <div class="h2h-title">⚔️ Head-to-Head</div>
      <div class="h2h-sub">Du vs. {h2hUser.name}</div>
      <p class="h2h-empty">
        Noch keine direkten Duelle gespielt. Warte auf den WM-Start und tippe auf dieselben Spiele wie {h2hUser.name}, um den H2H-Vergleich zu aktivieren!
      </p>
      <button class="close-btn" on:click={closeH2H}>Schliessen</button>
    </div>
  </div>
{/if}
