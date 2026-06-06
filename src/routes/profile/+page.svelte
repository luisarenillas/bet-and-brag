<script>
  import { users, currentUserId, tips, matches, leaderboard, resetAll } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';
  import { goto } from '$app/navigation';

  const currentUser = derived([users, currentUserId], ([$u,$id]) => $u.find(u => u.id === $id));
  const myTips = derived([tips, currentUserId], ([$t, $id]) => $t.filter(t => t.userId === $id));
  const myRank = derived([leaderboard, currentUserId], ([$lb,$id]) => $lb.find(u => u.id === $id));

  $: wonTips = $myTips.filter(t => t.payout >= 30).length;
  $: tendencyTips = $myTips.filter(t => t.payout >= 20 && t.payout < 30).length;
  $: lostTips = $myTips.filter(t => t.status === 'evaluated' && t.payout === 0).length;
  $: pendingTips = $myTips.filter(t => t.status === 'pending').length;

  let showResetConfirm = false;

  function doReset() {
    resetAll();
    showResetConfirm = false;
  }
</script>

<style>
  .page { padding: 20px 16px; }

  .profile-hero {
    background: linear-gradient(135deg, #141428, #1e1e38);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 28px 20px;
    text-align: center;
    margin-bottom: 20px;
  }

  .avatar-big { font-size: 4rem; margin-bottom: 12px; display: block; }
  .profile-name { font-size: 1.4rem; font-weight: 900; margin-bottom: 6px; }
  .profile-rank {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,210,106,0.12);
    border: 1px solid rgba(0,210,106,0.3);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #00d26a;
    margin-bottom: 14px;
  }
  .gems-display {
    font-size: 2rem;
    font-weight: 900;
    color: #00d26a;
  }
  .gems-sub { color: #8888aa; font-size: 0.78rem; margin-top: 2px; }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  .stat-box {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 16px;
    text-align: center;
  }
  .stat-val { font-size: 1.6rem; font-weight: 900; margin-bottom: 4px; }
  .stat-val.green { color: #00d26a; }
  .stat-val.yellow { color: #ffc800; }
  .stat-val.red { color: #ff4444; }
  .stat-val.blue { color: #4499ff; }
  .stat-lbl { font-size: 0.68rem; color: #8888aa; text-transform: uppercase; letter-spacing: 1px; }

  .section-title {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8888aa;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .rules-card {
    background: #141428;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .rule-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.82rem;
  }
  .rule-row:last-child { border-bottom: none; }
  .rule-name { color: #cccccc; }
  .rule-val { font-weight: 700; color: #00d26a; }
  .rule-val.red { color: #ff4444; }

  .btn-reset {
    background: rgba(255,60,60,0.1);
    border: 1px solid rgba(255,60,60,0.25);
    color: #ff6666;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 13px;
    border-radius: 14px;
    width: 100%;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .btn-reset:hover { background: rgba(255,60,60,0.2); }

  .btn-confirm {
    background: #ff3333;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 800;
    padding: 13px;
    border-radius: 14px;
    width: 100%;
    margin-bottom: 8px;
  }
  .btn-cancel {
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 13px;
    border-radius: 14px;
    width: 100%;
  }

  .disclaimer {
    font-size: 0.7rem;
    color: #555577;
    text-align: center;
    line-height: 1.5;
    padding: 8px 0;
  }
</style>

<div class="page">
  {#if $currentUser}
    <div class="profile-hero">
      <span class="avatar-big">{$currentUser.avatar}</span>
      <div class="profile-name">{$currentUser.name}</div>
      <div class="profile-rank">🏅 Rang #{$myRank?.rank ?? '–'} im Leaderboard</div>
      <div class="gems-display">💎 {$currentUser.gems}</div>
      <div class="gems-sub">Football Gems</div>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-val green">{wonTips}</div>
        <div class="stat-lbl">Volltreffer</div>
      </div>
      <div class="stat-box">
        <div class="stat-val yellow">{tendencyTips}</div>
        <div class="stat-lbl">Tendenz</div>
      </div>
      <div class="stat-box">
        <div class="stat-val red">{lostTips}</div>
        <div class="stat-lbl">Verloren</div>
      </div>
      <div class="stat-box">
        <div class="stat-val blue">{pendingTips}</div>
        <div class="stat-lbl">Offen</div>
      </div>
    </div>

    <div class="section-title">⚖️ Spielregeln & Punkte</div>
    <div class="rules-card">
      <div class="rule-row">
        <span class="rule-name">🎯 Volltreffer (exaktes Ergebnis)</span>
        <span class="rule-val">+30 Gems</span>
      </div>
      <div class="rule-row">
        <span class="rule-name">✅ Tendenz richtig</span>
        <span class="rule-val">+20 Gems</span>
      </div>
      <div class="rule-row">
        <span class="rule-name">❌ Tipp falsch</span>
        <span class="rule-val red">−10 Gems</span>
      </div>
      <div class="rule-row">
        <span class="rule-name">💎 Start-Guthaben</span>
        <span class="rule-val">200 Gems</span>
      </div>
      <div class="rule-row">
        <span class="rule-name">🎰 Einsatz pro Tipp</span>
        <span class="rule-val">10 Gems</span>
      </div>
    </div>

    <div class="section-title">⚙️ App-Einstellungen</div>

    {#if !showResetConfirm}
      <button class="btn-reset" on:click={() => showResetConfirm = true}>
        🔄 App zurücksetzen (Alle Daten löschen)
      </button>
    {:else}
      <button class="btn-confirm" on:click={doReset}>✓ Ja, alles zurücksetzen!</button>
      <button class="btn-cancel" on:click={() => showResetConfirm = false}>Abbrechen</button>
    {/if}

    <p class="disclaimer">
      Bet & Brag ist eine spielerische Tipprunde ohne Echtgeld.<br>
      Football Gems sind eine fiktive In-App-Währung ohne Realwert.<br>
      Entwickelt für ZHAW Modul Prototyping · WM 2026
    </p>
  {/if}
</div>
