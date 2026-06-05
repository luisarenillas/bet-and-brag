<script>
  import { matches, currentUserId, notification, enterResult } from '$lib/stores/gameStore.js';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  // Only accessible to user ID 1 (Luis = Admin)
  $: if ($currentUserId !== 1) goto('/');

  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  // State: score inputs per matchId
  let inputs = {};
  let saving = null; // matchId currently being saved
  let filter = 'open'; // 'open' | 'finished' | 'all'

  function getInput(matchId) {
    if (!inputs[matchId]) inputs[matchId] = { home: '', away: '' };
    return inputs[matchId];
  }

  function setInput(matchId, field, val) {
    inputs = { ...inputs, [matchId]: { ...getInput(matchId), [field]: val } };
  }

  async function submit(match) {
    const inp = getInput(match.id);
    const h = parseInt(inp.home);
    const a = parseInt(inp.away);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
      alert('Bitte gültige Torezahlen eingeben (0 oder höher).');
      return;
    }
    saving = match.id;
    const res = enterResult(match.id, h, a);
    await new Promise(r => setTimeout(r, 400));
    saving = null;
    if (res) {
      const myPay = res.myPayout;
      if (myPay) {
        const type = myPay.result === 'exact' ? 'win' : myPay.result === 'tendency' ? 'partial' : 'loss';
        const titles = { win: '🎯 Volltreffer!', partial: '✅ Tendenz richtig!', loss: '💸 Daneben!' };
        notification.set({
          type,
          title: titles[type],
          message: `${match.homeTeam} ${h}:${a} ${match.awayTeam}`,
          gems: myPay.payout - (myPay.result === 'loss' ? 0 : 0)
        });
      }
    }
    inputs = { ...inputs, [match.id]: { home: '', away: '' } };
  }

  $: filteredByGroup = groups.map(g => ({
    group: g,
    matches: $matches.filter(m => m.group === g && (
      filter === 'all' ? true : filter === 'open' ? m.status === 'open' : m.status === 'finished'
    ))
  })).filter(g => g.matches.length > 0);

  $: openCount = $matches.filter(m => m.status === 'open').length;
  $: finishedCount = $matches.filter(m => m.status === 'finished').length;
</script>

<style>
  .page { padding-bottom: 20px; }

  .page-header {
    padding: 18px 20px 14px;
    background: linear-gradient(135deg, #0d0d1a 0%, #1a0d20 100%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .header-top { display: flex; align-items: center; justify-content: space-between; }
  .page-title { font-size: 1.2rem; font-weight: 900; }
  .admin-badge {
    font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1px; background: rgba(255,80,80,0.15);
    color: #ff5050; border: 1px solid rgba(255,80,80,0.3);
    border-radius: 8px; padding: 3px 8px;
  }
  .page-sub { color: #8888aa; font-size: 0.75rem; margin-top: 3px; }

  .stats-row {
    display: flex; gap: 10px; padding: 12px 16px 0;
  }
  .stat-chip {
    flex: 1; text-align: center;
    background: #141428; border-radius: 10px;
    padding: 8px 6px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .stat-val { font-size: 1.3rem; font-weight: 900; }
  .stat-val.green { color: #00d26a; }
  .stat-val.grey  { color: #8888aa; }
  .stat-lbl { font-size: 0.62rem; color: #666688; margin-top: 2px; }

  .filter-row {
    display: flex; gap: 6px; padding: 12px 16px 8px;
  }
  .fbtn {
    padding: 6px 14px; border-radius: 16px; font-size: 0.72rem; font-weight: 700;
    background: rgba(255,255,255,0.05); color: #8888aa;
    border: 1px solid transparent; cursor: pointer; transition: all 0.15s;
  }
  .fbtn.active { background: rgba(0,210,106,0.12); color: #00d26a; border-color: rgba(0,210,106,0.3); }

  .group-section { padding: 0 12px 4px; }
  .group-label {
    font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 2px; color: #555577;
    padding: 10px 4px 5px; display: flex; align-items: center; gap: 8px;
  }
  .group-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.05); }

  .match-card {
    background: #141428; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 12px 14px; margin-bottom: 8px;
    transition: border-color 0.2s;
  }
  .match-card.finished { border-color: rgba(0,210,106,0.2); opacity: 0.7; }
  .match-card.saving   { border-color: rgba(255,215,0,0.4); }

  .match-teams {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .team { display: flex; align-items: center; gap: 5px; flex: 1; }
  .team.away { justify-content: flex-end; flex-direction: row-reverse; }
  .team-flag { font-size: 1.3rem; }
  .team-name { font-size: 0.78rem; font-weight: 700; color: #ddddf0; }
  .vs { font-size: 0.72rem; color: #555577; font-weight: 700; padding: 0 6px; }

  .match-meta {
    font-size: 0.62rem; color: #555577; margin-bottom: 10px;
    display: flex; gap: 8px; flex-wrap: wrap;
  }

  /* Result display (finished) */
  .result-display {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 8px 0 2px;
  }
  .result-score {
    font-size: 1.4rem; font-weight: 900; color: #00d26a;
    background: rgba(0,210,106,0.1); border-radius: 8px;
    padding: 4px 12px;
  }
  .result-label { font-size: 0.62rem; color: #00d26a; font-weight: 700; }

  /* Score input (open) */
  .score-input-row {
    display: flex; align-items: center; gap: 8px;
  }
  .score-half {
    flex: 1; display: flex; align-items: center; gap: 6px;
  }
  .score-half.right { flex-direction: row-reverse; }
  .score-flag { font-size: 1rem; }
  .score-input {
    width: 52px; background: #0d0d1a;
    border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
    color: #fff; font-size: 1.1rem; font-weight: 800;
    text-align: center; padding: 6px 4px;
    transition: border-color 0.15s;
  }
  .score-input:focus { outline: none; border-color: rgba(0,210,106,0.5); }
  .score-sep { font-size: 1rem; color: #555577; font-weight: 900; padding: 0 2px; }

  .submit-btn {
    flex-shrink: 0; background: linear-gradient(135deg, #00d26a, #00b85a);
    color: #000; font-weight: 800; font-size: 0.75rem;
    border-radius: 10px; padding: 8px 14px;
    transition: opacity 0.15s; white-space: nowrap;
  }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .submit-btn.loading { opacity: 0.7; }

  .empty-state {
    text-align: center; padding: 40px 20px;
    color: #555577; font-size: 0.85rem;
  }

  .info-banner {
    margin: 12px 16px 4px;
    background: rgba(255,165,0,0.07);
    border: 1px solid rgba(255,165,0,0.2);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.72rem; color: #ffaa44; line-height: 1.5;
  }
</style>

<div class="page">
  <div class="page-header">
    <div class="header-top">
      <div class="page-title">⚙️ Admin-Panel</div>
      <span class="admin-badge">Nur für Luis</span>
    </div>
    <div class="page-sub">Echte Spielresultate eintragen · WM 2026</div>
  </div>

  <div class="stats-row">
    <div class="stat-chip">
      <div class="stat-val green">{openCount}</div>
      <div class="stat-lbl">Offen</div>
    </div>
    <div class="stat-chip">
      <div class="stat-val grey">{finishedCount}</div>
      <div class="stat-lbl">Eingetragen</div>
    </div>
    <div class="stat-chip">
      <div class="stat-val" style="color:#8888aa">72</div>
      <div class="stat-lbl">Total</div>
    </div>
  </div>

  <div class="info-banner">
    📋 <strong>Anleitung:</strong> Trage nach jedem echten WM-Spiel das offizielle Ergebnis ein. Die App wertet sofort alle Tipps aus und aktualisiert die Rangliste live.
  </div>

  <div class="filter-row">
    <button class="fbtn" class:active={filter==='open'} on:click={() => filter='open'}>⏳ Offen ({openCount})</button>
    <button class="fbtn" class:active={filter==='finished'} on:click={() => filter='finished'}>✅ Eingetragen ({finishedCount})</button>
    <button class="fbtn" class:active={filter==='all'} on:click={() => filter='all'}>📋 Alle</button>
  </div>

  {#if filteredByGroup.length === 0}
    <div class="empty-state">
      {#if filter === 'finished'}
        Noch keine Ergebnisse eingetragen.
      {:else}
        Alle Spiele bereits eingetragen! 🎉
      {/if}
    </div>
  {:else}
    {#each filteredByGroup as grp}
      <div class="group-section">
        <div class="group-label">Gruppe {grp.group}</div>
        {#each grp.matches as match}
          {@const inp = getInput(match.id)}
          <div class="match-card"
               class:finished={match.status==='finished'}
               class:saving={saving===match.id}>

            <div class="match-teams">
              <div class="team">
                <span class="team-flag">{match.homeFlag}</span>
                <span class="team-name">{match.homeTeam}</span>
              </div>
              <span class="vs">vs</span>
              <div class="team away">
                <span class="team-flag">{match.awayFlag}</span>
                <span class="team-name">{match.awayTeam}</span>
              </div>
            </div>

            <div class="match-meta">
              <span>📅 {match.date}</span>
              <span>🕐 {match.time}</span>
              <span>📍 {match.venue.split(',')[0]}</span>
            </div>

            {#if match.status === 'finished'}
              <div class="result-display">
                <span class="result-score">{match.result.home} : {match.result.away}</span>
                <span class="result-label">✅ Eingetragen</span>
              </div>
            {:else}
              <div class="score-input-row">
                <div class="score-half">
                  <span class="score-flag">{match.homeFlag}</span>
                  <input
                    class="score-input"
                    type="number"
                    min="0" max="20"
                    placeholder="0"
                    value={inp.home}
                    on:input={e => setInput(match.id, 'home', e.target.value)}
                  />
                </div>
                <span class="score-sep">:</span>
                <div class="score-half right">
                  <span class="score-flag">{match.awayFlag}</span>
                  <input
                    class="score-input"
                    type="number"
                    min="0" max="20"
                    placeholder="0"
                    value={inp.away}
                    on:input={e => setInput(match.id, 'away', e.target.value)}
                  />
                </div>
                <button
                  class="submit-btn"
                  class:loading={saving===match.id}
                  disabled={saving===match.id || inp.home==='' || inp.away===''}
                  on:click={() => submit(match)}
                >
                  {saving===match.id ? '⏳' : '✅ Eintragen'}
                </button>
              </div>
            {/if}

          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
