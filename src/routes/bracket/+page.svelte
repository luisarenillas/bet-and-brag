<script>
  import { matches } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';

  let activeTab = 'gruppe'; // 'gruppe' | 'bracket'

  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  const groupTeams = {
    A: [{name:'Mexiko',flag:'🇲🇽'},{name:'Tschechien',flag:'🇨🇿'},{name:'Südkorea',flag:'🇰🇷'},{name:'Südafrika',flag:'🇿🇦'}],
    B: [{name:'Kanada',flag:'🇨🇦'},{name:'Bosnien',flag:'🇧🇦'},{name:'Katar',flag:'🇶🇦'},{name:'Schweiz',flag:'🇨🇭'}],
    C: [{name:'Brasilien',flag:'🇧🇷'},{name:'Haiti',flag:'🇭🇹'},{name:'Marokko',flag:'🇲🇦'},{name:'Schottland',flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'}],
    D: [{name:'USA',flag:'🇺🇸'},{name:'Australien',flag:'🇦🇺'},{name:'Paraguay',flag:'🇵🇾'},{name:'Türkei',flag:'🇹🇷'}],
    E: [{name:'Deutschland',flag:'🇩🇪'},{name:'Curaçao',flag:'🇨🇼'},{name:'Ecuador',flag:'🇪🇨'},{name:'Elfenbeinküste',flag:'🇨🇮'}],
    F: [{name:'Japan',flag:'🇯🇵'},{name:'Niederlande',flag:'🇳🇱'},{name:'Schweden',flag:'🇸🇪'},{name:'Tunesien',flag:'🇹🇳'}],
    G: [{name:'Belgien',flag:'🇧🇪'},{name:'Ägypten',flag:'🇪🇬'},{name:'Iran',flag:'🇮🇷'},{name:'Neuseeland',flag:'🇳🇿'}],
    H: [{name:'Spanien',flag:'🇪🇸'},{name:'Kap Verde',flag:'🇨🇻'},{name:'Saudi-Arabien',flag:'🇸🇦'},{name:'Uruguay',flag:'🇺🇾'}],
    I: [{name:'Frankreich',flag:'🇫🇷'},{name:'Irak',flag:'🇮🇶'},{name:'Norwegen',flag:'🇳🇴'},{name:'Senegal',flag:'🇸🇳'}],
    J: [{name:'Argentinien',flag:'🇦🇷'},{name:'Algerien',flag:'🇩🇿'},{name:'Österreich',flag:'🇦🇹'},{name:'Jordanien',flag:'🇯🇴'}],
    K: [{name:'Portugal',flag:'🇵🇹'},{name:'Kolumbien',flag:'🇨🇴'},{name:'DR Kongo',flag:'🇨🇩'},{name:'Usbekistan',flag:'🇺🇿'}],
    L: [{name:'England',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},{name:'Kroatien',flag:'🇭🇷'},{name:'Ghana',flag:'🇬🇭'},{name:'Panama',flag:'🇵🇦'}],
  };

  // Derive live standings from finished matches
  const standings = derived(matches, $m => {
    const res = {};
    groups.forEach(g => {
      const pts = {};
      groupTeams[g].forEach(t => { pts[t.name] = { ...t, pts: 0, gd: 0, p: 0 }; });
      $m.filter(m => m.group === g && m.status === 'finished').forEach(m => {
        const h = pts[m.homeTeam], a = pts[m.awayTeam];
        if (!h || !a) return;
        h.p++; a.p++;
        h.gd += m.result.home - m.result.away;
        a.gd += m.result.away - m.result.home;
        if (m.result.home > m.result.away)       { h.pts += 3; }
        else if (m.result.home === m.result.away) { h.pts += 1; a.pts += 1; }
        else                                      { a.pts += 3; }
      });
      res[g] = Object.values(pts).sort((a, b) => b.pts - a.pts || b.gd - a.gd);
    });
    return res;
  });

  // ── K.O. BRACKET (WM 2026: R32 → R16 → QF → SF → Final) ─────────────────
  // Echte Paarungen Stand 30.06.2026
  const r32Matches = [
    { id:'r32-0',  top:{name:'Südafrika',flag:'🇿🇦'}, bot:{name:'Kanada',flag:'🇨🇦'},      result:'0:1',    winner:'bot'  },
    { id:'r32-1',  top:{name:'Deutschland',flag:'🇩🇪'}, bot:{name:'Paraguay',flag:'🇵🇾'},   result:'1:1 n.E.',winner:'bot'  },
    { id:'r32-2',  top:{name:'Niederlande',flag:'🇳🇱'}, bot:{name:'Marokko',flag:'🇲🇦'},    result:'1:1 n.E.',winner:'bot'  },
    { id:'r32-3',  top:{name:'Brasilien',flag:'🇧🇷'},   bot:{name:'Japan',flag:'🇯🇵'},       result:'2:1',    winner:'top'  },
    { id:'r32-4',  top:{name:'Elfenbeinküste',flag:'🇨🇮'}, bot:{name:'Norwegen',flag:'🇳🇴'}, result:'1:2',    winner:'bot'  },
    { id:'r32-5',  top:{name:'Frankreich',flag:'🇫🇷'}, bot:{name:'Schweden',flag:'🇸🇪'},    result:'4:1',    winner:'top'  },
    { id:'r32-6',  top:{name:'Mexiko',flag:'🇲🇽'},      bot:{name:'Ecuador',flag:'🇪🇨'},     result:null,     winner:null   },
    { id:'r32-7',  top:{name:'England',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},   bot:{name:'DR Kongo',flag:'🇨🇩'},    result:null,     winner:null   },
    { id:'r32-8',  top:{name:'USA',flag:'🇺🇸'},          bot:{name:'Bosnien',flag:'🇧🇦'},     result:null,     winner:null   },
    { id:'r32-9',  top:{name:'Belgien',flag:'🇧🇪'},     bot:{name:'Senegal',flag:'🇸🇳'},     result:null,     winner:null   },
    { id:'r32-10', top:{name:'Portugal',flag:'🇵🇹'},    bot:{name:'Kroatien',flag:'🇭🇷'},    result:null,     winner:null   },
    { id:'r32-11', top:{name:'Spanien',flag:'🇪🇸'},     bot:{name:'Österreich',flag:'🇦🇹'},  result:null,     winner:null   },
    { id:'r32-12', top:{name:'Schweiz',flag:'🇨🇭'},     bot:{name:'Algerien',flag:'🇩🇿'},    result:null,     winner:null   },
    { id:'r32-13', top:{name:'Argentinien',flag:'🇦🇷'}, bot:{name:'Kap Verde',flag:'🇨🇻'},  result:null,     winner:null   },
    { id:'r32-14', top:{name:'Kolumbien',flag:'🇨🇴'},   bot:{name:'Ghana',flag:'🇬🇭'},       result:null,     winner:null   },
    { id:'r32-15', top:{name:'Australien',flag:'🇦🇺'},  bot:{name:'Ägypten',flag:'🇪🇬'},     result:null,     winner:null   },
  ];

  // R16: 8 Spiele
  const r16Matches = [
    { id:'r16-0', top:0, bot:1  },
    { id:'r16-1', top:2, bot:3  },
    { id:'r16-2', top:4, bot:5  },
    { id:'r16-3', top:6, bot:7  },
    { id:'r16-4', top:8, bot:9  },
    { id:'r16-5', top:10, bot:11 },
    { id:'r16-6', top:12, bot:13 },
    { id:'r16-7', top:14, bot:15 },
  ];

  // QF: 4 Spiele
  const qfMatches = [
    { id:'qf-0', top:0, bot:1 },
    { id:'qf-1', top:2, bot:3 },
    { id:'qf-2', top:4, bot:5 },
    { id:'qf-3', top:6, bot:7 },
  ];

  // HF: 2 Spiele
  const sfMatches = [
    { id:'sf-0', top:0, bot:1 },
    { id:'sf-1', top:2, bot:3 },
  ];

  // Vorausgefüllte Picks für abgeschlossene Spiele
  let picks = {
    'r32-0': 'bot', 'r32-1': 'bot', 'r32-2': 'bot',
    'r32-3': 'top', 'r32-4': 'bot', 'r32-5': 'top',
  };

  function pick(id, side) {
    const m = r32Matches.find(m => m.id === id)
           || r16Matches.find(m => m.id === id)
           || qfMatches.find(m => m.id === id)
           || sfMatches.find(m => m.id === id);
    if (m?.winner) return; // abgeschlossene Spiele nicht änderbar
    picks = { ...picks, [id]: picks[id] === side ? null : side };
  }

  function getR32Team(idx, side) {
    const m = r32Matches[idx];
    if (!m) return null;
    return side === 'top' ? m.top : m.bot;
  }

  function getWinner(matchId, matchList, getTeamFn) {
    const p = picks[matchId];
    if (!p) return null;
    return getTeamFn(p);
  }

  function r32WinnerTeam(idx) {
    const m = r32Matches[idx];
    if (!m) return null;
    const p = picks[m.id];
    if (!p) return null;
    return p === 'top' ? m.top : m.bot;
  }

  function r16WinnerTeam(idx) {
    const m = r16Matches[idx];
    if (!m) return null;
    const p = picks[m.id];
    if (!p) return null;
    const r32Idx = p === 'top' ? m.top : m.bot;
    return r32WinnerTeam(r32Idx);
  }

  function qfWinnerTeam(idx) {
    const m = qfMatches[idx];
    if (!m) return null;
    const p = picks[m.id];
    if (!p) return null;
    const r16Idx = p === 'top' ? m.top : m.bot;
    return r16WinnerTeam(r16Idx);
  }

  function sfWinnerTeam(idx) {
    const m = sfMatches[idx];
    if (!m) return null;
    const p = picks[m.id];
    if (!p) return null;
    const qfIdx = p === 'top' ? m.top : m.bot;
    return qfWinnerTeam(qfIdx);
  }
</script>

<style>
  .page { background: #0d0d1a; min-height: 100%; }

  .page-header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .page-title { font-size: 1.3rem; font-weight: 900; }
  .page-sub   { color: #8888aa; font-size: 0.75rem; margin-top: 2px; }

  .tabs {
    display: flex; gap: 6px; padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .tab {
    padding: 7px 18px; border-radius: 20px; font-size: 0.75rem;
    font-weight: 700; cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.05); color: #8888aa;
    border: 1px solid transparent;
  }
  .tab.active {
    background: rgba(0,210,106,0.12); color: #00d26a;
    border-color: rgba(0,210,106,0.3);
  }

  /* ═══ GRUPPENPHASE ═══ */
  .groups-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; padding: 12px;
  }
  .gc {
    background: #141428; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; overflow: hidden;
  }
  .gc-head {
    background: rgba(255,255,255,0.04); padding: 5px 10px;
    font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1.5px; color: #8888aa;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; justify-content: space-between;
  }
  .gc-head-pts { font-size: 0.55rem; color: #555577; }
  .gc-row {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.71rem;
  }
  .gc-row:last-child { border-bottom: none; }
  .gc-row.q1 { border-left: 2px solid #00d26a; background: rgba(0,210,106,0.04); }
  .gc-row.q2 { border-left: 2px solid rgba(0,210,106,0.35); }
  .gc-row.out { opacity: 0.5; }
  .gc-pos { color: #555577; font-size: 0.6rem; font-weight: 700; width: 10px; }
  .gc-flag { font-size: 1rem; }
  .gc-name { flex: 1; font-weight: 600; color: #ddddf0; font-size: 0.65rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .gc-pts  { font-size: 0.7rem; font-weight: 800; color: #00d26a; min-width: 16px; text-align: right; }
  .gc-gd   { font-size: 0.6rem; color: #666688; min-width: 22px; text-align: right; }

  .group-legend {
    display: flex; gap: 12px; padding: 4px 12px 10px;
    font-size: 0.6rem; color: #555577; flex-wrap: wrap;
  }
  .lg-item { display: flex; align-items: center; gap: 4px; }
  .lg-bar { width: 8px; height: 8px; border-radius: 1px; }

  /* ═══ BRACKET ═══ */
  .bracket-wrap {
    overflow-x: auto; padding: 12px 8px 24px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.12) transparent;
  }
  .bracket-wrap::-webkit-scrollbar { height: 4px; }
  .bracket-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  .bracket {
    display: flex; align-items: flex-start;
    gap: 0; min-width: 1100px;
  }

  /* Round column */
  .rc {
    display: flex; flex-direction: column;
    flex: 1; min-width: 0;
  }
  .rc-label {
    text-align: center; padding: 0 4px 8px;
    font-size: 0.52rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: #666688; white-space: nowrap;
  }
  .rc-label.lbl-final { color: #ffd700; }
  .rc-matches {
    display: flex; flex-direction: column;
    justify-content: space-around; flex: 1;
    gap: 4px; padding: 0 3px;
  }

  /* Match card */
  .bm {
    background: #141428; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; overflow: hidden; cursor: default;
    transition: border-color 0.2s; position: relative;
  }
  .bm.clickable { cursor: pointer; }
  .bm.clickable:hover { border-color: rgba(255,255,255,0.18); }
  .bm.has-pick { border-color: rgba(0,210,106,0.4); box-shadow: 0 0 8px rgba(0,210,106,0.08); }
  .bm.is-final { border-color: rgba(255,215,0,0.3); box-shadow: 0 0 14px rgba(255,215,0,0.08); }

  .bt {
    display: flex; align-items: center; gap: 4px;
    padding: 5px 6px; font-size: 0.62rem; font-weight: 600;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    color: #bbbbdd; min-height: 24px; transition: background 0.15s;
    line-height: 1.1;
  }
  .bt:last-child { border-bottom: none; }
  .bt.clickable:hover { background: rgba(255,255,255,0.04); }
  .bt.winner { background: rgba(0,210,106,0.1); color: #fff; font-weight: 800; }
  .bt.loser  { opacity: 0.35; }
  .bt .tf    { font-size: 0.88rem; flex-shrink: 0; line-height: 1; }
  .bt .tn    { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bt .sc    { font-size: 0.58rem; font-weight: 900; color: #00d26a;
               background: rgba(0,210,106,0.1); padding: 1px 3px; border-radius: 3px; flex-shrink:0; }
  .bt .dot   { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.15); flex-shrink:0; }
  .grp-badge {
    font-size: 0.56rem; font-weight: 900; color: #8888aa;
    background: rgba(255,255,255,0.07); border-radius: 3px;
    padding: 1px 3px; flex-shrink: 0;
  }
  .bt.winner .grp-badge { color: #00d26a; background: rgba(0,210,106,0.15); }

  /* Connector lines */
  .conn {
    width: 14px; flex-shrink: 0;
    display: flex; flex-direction: column;
    padding-top: 22px;
  }
  .conn-group {
    flex: 1; display: flex; flex-direction: column;
    justify-content: space-around;
  }
  .cline {
    flex: 1; border-right: 1px solid rgba(255,255,255,0.09);
    min-height: 10px;
  }
  .cline.top    { border-top: 1px solid rgba(255,255,255,0.09); border-radius: 0 4px 0 0; border-bottom: none; }
  .cline.bottom { border-bottom: 1px solid rgba(255,255,255,0.09); border-radius: 0 0 4px 0; border-top: none; }
  .cmid { height: 1px; background: rgba(255,255,255,0.09); flex-shrink: 0; }

  /* Champion slot */
  .champ-col {
    width: 90px; flex-shrink: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding-top: 22px;
  }
  .trophy-icon { font-size: 1.8rem; text-align: center; }
  .champ-lbl {
    font-size: 0.5rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1px; color: #ffd700; text-align: center;
    margin: 4px 0 6px;
  }
  .champ-box {
    background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.03));
    border: 1px solid rgba(255,215,0,0.25); border-radius: 10px;
    padding: 8px 6px; text-align: center; width: 100%;
  }
  .champ-flag { font-size: 1.4rem; display: block; margin-bottom: 3px; }
  .champ-name { font-size: 0.62rem; font-weight: 800; color: #ffd700; }
  .champ-tbd  { font-size: 0.58rem; color: #555577; }

  .hint {
    padding: 10px 14px 6px;
    font-size: 0.68rem; color: #555577;
    font-style: italic;
  }
</style>

<div class="page">
  <div class="page-header">
    <div class="page-title">🏆 WM-Turnierbaum</div>
    <div class="page-sub">FIFA WM 2026 · 12 Gruppen · 48 Teams</div>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab==='gruppe'} on:click={() => activeTab='gruppe'}>
      📊 Gruppenphase
    </button>
    <button class="tab" class:active={activeTab==='bracket'} on:click={() => activeTab='bracket'}>
      🏆 K.o.-Baum
    </button>
  </div>

  <!-- ══════════ GRUPPENPHASE ══════════ -->
  {#if activeTab === 'gruppe'}
    <div class="group-legend">
      <span class="lg-item"><span class="lg-bar" style="background:#00d26a"></span> Direkt qualifiziert (Platz 1–2)</span>
      <span class="lg-item"><span class="lg-bar" style="background:rgba(255,165,0,0.6)"></span> Evt. qualifiziert (Bester Dritter)</span>
      <span class="lg-item"><span class="lg-bar" style="background:rgba(255,255,255,0.1)"></span> Ausgeschieden</span>
    </div>
    <div class="groups-grid">
      {#each groups as g}
        {@const table = $standings[g] ?? groupTeams[g].map(t => ({...t, pts:0, gd:0, p:0}))}
        <div class="gc">
          <div class="gc-head">
            <span>Gruppe {g}</span>
            <span class="gc-head-pts">Pts TD</span>
          </div>
          {#each table as team, i}
            <div class="gc-row"
                 class:q1={i===0}
                 class:q2={i===1}
                 style={i===2 ? 'border-left:2px solid rgba(255,165,0,0.4);background:rgba(255,165,0,0.03)' : ''}
                 class:out={i>=3}>
              <span class="gc-pos">{i+1}</span>
              <span class="gc-flag">{team.flag}</span>
              <span class="gc-name">{team.name}</span>
              <span class="gc-gd">{team.gd > 0 ? '+' : ''}{team.gd}</span>
              <span class="gc-pts">{team.pts}</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}

  <!-- ══════════ K.O.-BAUM ══════════ -->
  {#if activeTab === 'bracket'}
    <div class="hint">⬅ Scrolle horizontal · Klicke Teams um deinen Weltmeister zu wählen</div>
    <div class="bracket-wrap">
      <div class="bracket">

        <!-- ── RUNDE DER LETZTEN 32 ── -->
        <div class="rc">
          <div class="rc-label">Runde der 32</div>
          <div class="rc-matches">
            {#each r32Matches as m}
              {@const done = !!m.winner}
              <div class="bm" class:clickable={!done} class:has-pick={!!picks[m.id]}>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt" class:clickable={!done}
                     class:winner={picks[m.id]==='top'}
                     class:loser={picks[m.id]==='bot'}
                     on:click|stopPropagation={() => pick(m.id, 'top')}>
                  <span class="tf">{m.top.flag}</span>
                  <span class="tn">{m.top.name}</span>
                  {#if m.result}<span class="sc">{picks[m.id]==='top' ? '✓' : m.result.split(':')[0]}</span>
                  {:else if picks[m.id]==='top'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt" class:clickable={!done}
                     class:winner={picks[m.id]==='bot'}
                     class:loser={picks[m.id]==='top'}
                     on:click|stopPropagation={() => pick(m.id, 'bot')}>
                  <span class="tf">{m.bot.flag}</span>
                  <span class="tn">{m.bot.name}</span>
                  {#if m.result}<span class="sc">{picks[m.id]==='bot' ? '✓' : m.result.split(':')[1]?.split(' ')[0]}</span>
                  {:else if picks[m.id]==='bot'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- connector R32 → R16 -->
        <div class="conn">
          {#each [0,1,2,3,4,5,6,7] as _}
            <div class="conn-group">
              <div class="cline top"></div>
              <div class="cmid"></div>
              <div class="cline bottom"></div>
            </div>
          {/each}
        </div>

        <!-- ── ACHTELFINALE ── -->
        <div class="rc">
          <div class="rc-label">Achtelfinale</div>
          <div class="rc-matches">
            {#each r16Matches as m, mi}
              {@const topTeam = r32WinnerTeam(m.top)}
              {@const botTeam = r32WinnerTeam(m.bot)}
              <div class="bm clickable" class:has-pick={!!picks[m.id]}>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='top'}
                     class:loser={picks[m.id]==='bot'}
                     on:click={() => pick(m.id, 'top')}>
                  {#if topTeam}<span class="tf">{topTeam.flag}</span><span class="tn">{topTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger Sp. {m.top+1}</span>{/if}
                  {#if picks[m.id]==='top'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='bot'}
                     class:loser={picks[m.id]==='top'}
                     on:click={() => pick(m.id, 'bot')}>
                  {#if botTeam}<span class="tf">{botTeam.flag}</span><span class="tn">{botTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger Sp. {m.bot+1}</span>{/if}
                  {#if picks[m.id]==='bot'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- connector R16 → QF -->
        <div class="conn">
          {#each [0,1,2,3] as _}
            <div class="conn-group">
              <div class="cline top"></div>
              <div class="cmid"></div>
              <div class="cline bottom"></div>
            </div>
          {/each}
        </div>

        <!-- ── VIERTELFINALE ── -->
        <div class="rc">
          <div class="rc-label">Viertelfinale</div>
          <div class="rc-matches">
            {#each qfMatches as m}
              {@const topTeam = r16WinnerTeam(m.top)}
              {@const botTeam = r16WinnerTeam(m.bot)}
              <div class="bm clickable" class:has-pick={!!picks[m.id]}>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='top'}
                     class:loser={picks[m.id]==='bot'}
                     on:click={() => pick(m.id, 'top')}>
                  {#if topTeam}<span class="tf">{topTeam.flag}</span><span class="tn">{topTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger AF-{m.top+1}</span>{/if}
                  {#if picks[m.id]==='top'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='bot'}
                     class:loser={picks[m.id]==='top'}
                     on:click={() => pick(m.id, 'bot')}>
                  {#if botTeam}<span class="tf">{botTeam.flag}</span><span class="tn">{botTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger AF-{m.bot+1}</span>{/if}
                  {#if picks[m.id]==='bot'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- connector QF → SF -->
        <div class="conn">
          {#each [0,1] as _}
            <div class="conn-group">
              <div class="cline top"></div>
              <div class="cmid"></div>
              <div class="cline bottom"></div>
            </div>
          {/each}
        </div>

        <!-- ── HALBFINALE ── -->
        <div class="rc">
          <div class="rc-label">Halbfinale</div>
          <div class="rc-matches">
            {#each sfMatches as m}
              {@const topTeam = qfWinnerTeam(m.top)}
              {@const botTeam = qfWinnerTeam(m.bot)}
              <div class="bm clickable" class:has-pick={!!picks[m.id]}>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='top'}
                     class:loser={picks[m.id]==='bot'}
                     on:click={() => pick(m.id, 'top')}>
                  {#if topTeam}<span class="tf">{topTeam.flag}</span><span class="tn">{topTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger VF-{m.top+1}</span>{/if}
                  {#if picks[m.id]==='top'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div class="bt clickable"
                     class:winner={picks[m.id]==='bot'}
                     class:loser={picks[m.id]==='top'}
                     on:click={() => pick(m.id, 'bot')}>
                  {#if botTeam}<span class="tf">{botTeam.flag}</span><span class="tn">{botTeam.name}</span>
                  {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger VF-{m.bot+1}</span>{/if}
                  {#if picks[m.id]==='bot'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- connector SF → Final -->
        <div class="conn">
          <div class="conn-group">
            <div class="cline top"></div>
            <div class="cmid"></div>
            <div class="cline bottom"></div>
          </div>
        </div>

        <!-- ── FINALE ── -->
        <div class="rc">
          <div class="rc-label lbl-final">🏆 Finale</div>
          <div class="rc-matches">
            {@const ft1 = sfWinnerTeam(0)}
            {@const ft2 = sfWinnerTeam(1)}
            <div class="bm clickable is-final" class:has-pick={!!picks['final']}>
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <div class="bt clickable"
                   class:winner={picks['final']==='top'}
                   class:loser={picks['final']==='bot'}
                   on:click={() => pick('final', 'top')}>
                {#if ft1}<span class="tf">{ft1.flag}</span><span class="tn">{ft1.name}</span>
                {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger HF-1</span>{/if}
                {#if picks['final']==='top'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
              </div>
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <div class="bt clickable"
                   class:winner={picks['final']==='bot'}
                   class:loser={picks['final']==='top'}
                   on:click={() => pick('final', 'bot')}>
                {#if ft2}<span class="tf">{ft2.flag}</span><span class="tn">{ft2.name}</span>
                {:else}<span class="tf">🏳</span><span class="tn" style="color:#555577">Sieger HF-2</span>{/if}
                {#if picks['final']==='bot'}<span class="sc">✓</span>{:else}<span class="dot"></span>{/if}
              </div>
            </div>
          </div>
        </div>

        <!-- connector → Champion -->
        <div class="conn">
          <div class="conn-group">
            <div class="cline top" style="border-right:none;border-bottom:none;border-left:1px solid rgba(255,255,255,0.09)"></div>
          </div>
        </div>

        <!-- ── WELTMEISTER ── -->
        <div class="champ-col">
          <div class="trophy-icon">🏆</div>
          <div class="champ-lbl">Weltmeister</div>
          <div class="champ-box">
            {#if picks['final']}
              {@const champTeam = picks['final'] === 'top' ? sfWinnerTeam(0) : sfWinnerTeam(1)}
              {#if champTeam}
                <span class="champ-flag">{champTeam.flag}</span>
                <div class="champ-name">{champTeam.name}</div>
              {:else}
                <div class="champ-tbd">Wähle alle Runden</div>
              {/if}
            {:else}
              <span class="champ-flag">🌍</span>
              <div class="champ-tbd">Wähle deinen<br>Weltmeister</div>
            {/if}
          </div>
        </div>

      </div><!-- .bracket -->
    </div>
  {/if}
</div>
