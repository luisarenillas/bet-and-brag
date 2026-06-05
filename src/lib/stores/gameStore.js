import { writable, derived, get } from 'svelte/store';

// ── USERS ───────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id:1,  name:'Luis',    avatar:'🧔', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:2,  name:'Pablo',   avatar:'👨', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:3,  name:'Levin',  avatar:'🧑', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:4,  name:'Jasmin', avatar:'👩', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:5,  name:'Vanessa',avatar:'👱', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:6,  name:'Lorenzo',avatar:'🧔', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:7,  name:'Timon',  avatar:'👦', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:8,  name:'Sanja',  avatar:'👩', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:9,  name:'Fabio',  avatar:'🧑', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
  { id:10, name:'Silas',  avatar:'👦', gems:200, previousGems:200, trend:0, tipsWon:0, tipsTotal:0 },
];

// ── WM 2026 MATCHES ─────────────────────────────────────────────────────────
// Offizieller Spielplan · Zeiten in CET (Schweizer Zeit)
export const MATCHES = [
  // ── Group A: Mexiko, Südafrika, Südkorea, Tschechien ──────────────────────
  { id:1,  group:'A', homeTeam:'Mexiko',      homeFlag:'🇲🇽', awayTeam:'Südafrika',   awayFlag:'🇿🇦', date:'2026-06-11', time:'21:00', venue:'Estadio Azteca, Mexiko-Stadt',       status:'open', result:null },
  { id:2,  group:'A', homeTeam:'Südkorea',    homeFlag:'🇰🇷', awayTeam:'Tschechien',  awayFlag:'🇨🇿', date:'2026-06-12', time:'04:00', venue:'Estadio Akron, Guadalajara',         status:'open', result:null },
  { id:3,  group:'A', homeTeam:'Tschechien',  homeFlag:'🇨🇿', awayTeam:'Südafrika',   awayFlag:'🇿🇦', date:'2026-06-18', time:'18:00', venue:'Mercedes-Benz Stadium, Atlanta',     status:'open', result:null },
  { id:4,  group:'A', homeTeam:'Mexiko',      homeFlag:'🇲🇽', awayTeam:'Südkorea',    awayFlag:'🇰🇷', date:'2026-06-19', time:'03:00', venue:'Estadio Akron, Guadalajara',         status:'open', result:null },
  { id:5,  group:'A', homeTeam:'Tschechien',  homeFlag:'🇨🇿', awayTeam:'Mexiko',      awayFlag:'🇲🇽', date:'2026-06-25', time:'03:00', venue:'Estadio Azteca, Mexiko-Stadt',       status:'open', result:null },
  { id:6,  group:'A', homeTeam:'Südafrika',   homeFlag:'🇿🇦', awayTeam:'Südkorea',    awayFlag:'🇰🇷', date:'2026-06-25', time:'03:00', venue:'Estadio BBVA, Monterrey',            status:'open', result:null },
  // ── Group B: Kanada, Bosnien, Katar, Schweiz ──────────────────────────────
  { id:7,  group:'B', homeTeam:'Kanada',      homeFlag:'🇨🇦', awayTeam:'Bosnien',     awayFlag:'🇧🇦', date:'2026-06-12', time:'21:00', venue:'BMO Field, Toronto',                 status:'open', result:null },
  { id:8,  group:'B', homeTeam:'Katar',       homeFlag:'🇶🇦', awayTeam:'Schweiz',     awayFlag:'🇨🇭', date:'2026-06-13', time:'21:00', venue:'Levi\'s Stadium, San Francisco',     status:'open', result:null },
  { id:9,  group:'B', homeTeam:'Schweiz',     homeFlag:'🇨🇭', awayTeam:'Bosnien',     awayFlag:'🇧🇦', date:'2026-06-18', time:'21:00', venue:'SoFi Stadium, Los Angeles',          status:'open', result:null },
  { id:10, group:'B', homeTeam:'Kanada',      homeFlag:'🇨🇦', awayTeam:'Katar',       awayFlag:'🇶🇦', date:'2026-06-19', time:'00:00', venue:'BC Place, Vancouver',                status:'open', result:null },
  { id:11, group:'B', homeTeam:'Schweiz',     homeFlag:'🇨🇭', awayTeam:'Kanada',      awayFlag:'🇨🇦', date:'2026-06-24', time:'21:00', venue:'BC Place, Vancouver',                status:'open', result:null },
  { id:12, group:'B', homeTeam:'Bosnien',     homeFlag:'🇧🇦', awayTeam:'Katar',       awayFlag:'🇶🇦', date:'2026-06-24', time:'21:00', venue:'Lumen Field, Seattle',               status:'open', result:null },
  // ── Group C: Brasilien, Marokko, Haiti, Schottland ────────────────────────
  { id:13, group:'C', homeTeam:'Brasilien',   homeFlag:'🇧🇷', awayTeam:'Marokko',     awayFlag:'🇲🇦', date:'2026-06-14', time:'00:00', venue:'MetLife Stadium, New Jersey',        status:'open', result:null },
  { id:14, group:'C', homeTeam:'Haiti',       homeFlag:'🇭🇹', awayTeam:'Schottland',  awayFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', date:'2026-06-14', time:'03:00', venue:'Gillette Stadium, Boston',           status:'open', result:null },
  { id:15, group:'C', homeTeam:'Schottland',  homeFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayTeam:'Marokko',     awayFlag:'🇲🇦', date:'2026-06-20', time:'00:00', venue:'Gillette Stadium, Boston',           status:'open', result:null },
  { id:16, group:'C', homeTeam:'Brasilien',   homeFlag:'🇧🇷', awayTeam:'Haiti',       awayFlag:'🇭🇹', date:'2026-06-20', time:'03:00', venue:'Lincoln Financial Field, Philadelphia', status:'open', result:null },
  { id:17, group:'C', homeTeam:'Schottland',  homeFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayTeam:'Brasilien',   awayFlag:'🇧🇷', date:'2026-06-25', time:'00:00', venue:'Hard Rock Stadium, Miami',           status:'open', result:null },
  { id:18, group:'C', homeTeam:'Marokko',     homeFlag:'🇲🇦', awayTeam:'Haiti',       awayFlag:'🇭🇹', date:'2026-06-25', time:'00:00', venue:'Mercedes-Benz Stadium, Atlanta',     status:'open', result:null },
  // ── Group D: USA, Paraguay, Australien, Türkei ────────────────────────────
  { id:19, group:'D', homeTeam:'USA',         homeFlag:'🇺🇸', awayTeam:'Paraguay',    awayFlag:'🇵🇾', date:'2026-06-13', time:'03:00', venue:'SoFi Stadium, Los Angeles',          status:'open', result:null },
  { id:20, group:'D', homeTeam:'Australien',  homeFlag:'🇦🇺', awayTeam:'Türkei',      awayFlag:'🇹🇷', date:'2026-06-14', time:'06:00', venue:'BC Place, Vancouver',                status:'open', result:null },
  { id:21, group:'D', homeTeam:'USA',         homeFlag:'🇺🇸', awayTeam:'Australien',  awayFlag:'🇦🇺', date:'2026-06-19', time:'21:00', venue:'Lumen Field, Seattle',               status:'open', result:null },
  { id:22, group:'D', homeTeam:'Türkei',      homeFlag:'🇹🇷', awayTeam:'Paraguay',    awayFlag:'🇵🇾', date:'2026-06-20', time:'06:00', venue:'Levi\'s Stadium, San Francisco',     status:'open', result:null },
  { id:23, group:'D', homeTeam:'Türkei',      homeFlag:'🇹🇷', awayTeam:'USA',         awayFlag:'🇺🇸', date:'2026-06-26', time:'04:00', venue:'SoFi Stadium, Los Angeles',          status:'open', result:null },
  { id:24, group:'D', homeTeam:'Paraguay',    homeFlag:'🇵🇾', awayTeam:'Australien',  awayFlag:'🇦🇺', date:'2026-06-26', time:'04:00', venue:'Levi\'s Stadium, San Francisco',     status:'open', result:null },
  // ── Group E: Deutschland, Curaçao, Elfenbeinküste, Ecuador ────────────────
  { id:25, group:'E', homeTeam:'Deutschland', homeFlag:'🇩🇪', awayTeam:'Curaçao',     awayFlag:'🇨🇼', date:'2026-06-14', time:'19:00', venue:'NRG Stadium, Houston',               status:'open', result:null },
  { id:26, group:'E', homeTeam:'Elfenbeinküste', homeFlag:'🇨🇮', awayTeam:'Ecuador', awayFlag:'🇪🇨', date:'2026-06-15', time:'01:00', venue:'Lincoln Financial Field, Philadelphia', status:'open', result:null },
  { id:27, group:'E', homeTeam:'Deutschland', homeFlag:'🇩🇪', awayTeam:'Elfenbeinküste', awayFlag:'🇨🇮', date:'2026-06-20', time:'22:00', venue:'BMO Field, Toronto',             status:'open', result:null },
  { id:28, group:'E', homeTeam:'Ecuador',     homeFlag:'🇪🇨', awayTeam:'Curaçao',     awayFlag:'🇨🇼', date:'2026-06-21', time:'02:00', venue:'Arrowhead Stadium, Kansas City',     status:'open', result:null },
  { id:29, group:'E', homeTeam:'Ecuador',     homeFlag:'🇪🇨', awayTeam:'Deutschland', awayFlag:'🇩🇪', date:'2026-06-25', time:'22:00', venue:'MetLife Stadium, New Jersey',        status:'open', result:null },
  { id:30, group:'E', homeTeam:'Curaçao',     homeFlag:'🇨🇼', awayTeam:'Elfenbeinküste', awayFlag:'🇨🇮', date:'2026-06-25', time:'22:00', venue:'Lincoln Financial Field, Philadelphia', status:'open', result:null },
  // ── Group F: Niederlande, Japan, Schweden, Tunesien ───────────────────────
  { id:31, group:'F', homeTeam:'Niederlande', homeFlag:'🇳🇱', awayTeam:'Japan',       awayFlag:'🇯🇵', date:'2026-06-14', time:'22:00', venue:'AT&T Stadium, Dallas',               status:'open', result:null },
  { id:32, group:'F', homeTeam:'Schweden',    homeFlag:'🇸🇪', awayTeam:'Tunesien',    awayFlag:'🇹🇳', date:'2026-06-15', time:'04:00', venue:'Estadio BBVA, Monterrey',            status:'open', result:null },
  { id:33, group:'F', homeTeam:'Niederlande', homeFlag:'🇳🇱', awayTeam:'Schweden',    awayFlag:'🇸🇪', date:'2026-06-20', time:'19:00', venue:'NRG Stadium, Houston',               status:'open', result:null },
  { id:34, group:'F', homeTeam:'Tunesien',    homeFlag:'🇹🇳', awayTeam:'Japan',       awayFlag:'🇯🇵', date:'2026-06-21', time:'06:00', venue:'Estadio BBVA, Monterrey',            status:'open', result:null },
  { id:35, group:'F', homeTeam:'Japan',       homeFlag:'🇯🇵', awayTeam:'Schweden',    awayFlag:'🇸🇪', date:'2026-06-26', time:'01:00', venue:'AT&T Stadium, Dallas',               status:'open', result:null },
  { id:36, group:'F', homeTeam:'Tunesien',    homeFlag:'🇹🇳', awayTeam:'Niederlande', awayFlag:'🇳🇱', date:'2026-06-26', time:'01:00', venue:'Arrowhead Stadium, Kansas City',     status:'open', result:null },
  // ── Group G: Belgien, Ägypten, Iran, Neuseeland ───────────────────────────
  { id:37, group:'G', homeTeam:'Iran',        homeFlag:'🇮🇷', awayTeam:'Neuseeland',  awayFlag:'🇳🇿', date:'2026-06-16', time:'03:00', venue:'SoFi Stadium, Los Angeles',          status:'open', result:null },
  { id:38, group:'G', homeTeam:'Belgien',     homeFlag:'🇧🇪', awayTeam:'Ägypten',     awayFlag:'🇪🇬', date:'2026-06-15', time:'21:00', venue:'Lumen Field, Seattle',               status:'open', result:null },
  { id:39, group:'G', homeTeam:'Belgien',     homeFlag:'🇧🇪', awayTeam:'Iran',        awayFlag:'🇮🇷', date:'2026-06-21', time:'21:00', venue:'SoFi Stadium, Los Angeles',          status:'open', result:null },
  { id:40, group:'G', homeTeam:'Neuseeland',  homeFlag:'🇳🇿', awayTeam:'Ägypten',     awayFlag:'🇪🇬', date:'2026-06-22', time:'03:00', venue:'BC Place, Vancouver',                status:'open', result:null },
  { id:41, group:'G', homeTeam:'Ägypten',     homeFlag:'🇪🇬', awayTeam:'Iran',        awayFlag:'🇮🇷', date:'2026-06-27', time:'05:00', venue:'Lumen Field, Seattle',               status:'open', result:null },
  { id:42, group:'G', homeTeam:'Neuseeland',  homeFlag:'🇳🇿', awayTeam:'Belgien',     awayFlag:'🇧🇪', date:'2026-06-27', time:'05:00', venue:'BC Place, Vancouver',                status:'open', result:null },
  // ── Group H: Spanien, Kap Verde, Saudi-Arabien, Uruguay ───────────────────
  { id:43, group:'H', homeTeam:'Spanien',     homeFlag:'🇪🇸', awayTeam:'Kap Verde',   awayFlag:'🇨🇻', date:'2026-06-15', time:'18:00', venue:'Mercedes-Benz Stadium, Atlanta',     status:'open', result:null },
  { id:44, group:'H', homeTeam:'Saudi-Arabien', homeFlag:'🇸🇦', awayTeam:'Uruguay',   awayFlag:'🇺🇾', date:'2026-06-16', time:'00:00', venue:'Hard Rock Stadium, Miami',           status:'open', result:null },
  { id:45, group:'H', homeTeam:'Spanien',     homeFlag:'🇪🇸', awayTeam:'Saudi-Arabien', awayFlag:'🇸🇦', date:'2026-06-21', time:'18:00', venue:'Mercedes-Benz Stadium, Atlanta',   status:'open', result:null },
  { id:46, group:'H', homeTeam:'Uruguay',     homeFlag:'🇺🇾', awayTeam:'Kap Verde',   awayFlag:'🇨🇻', date:'2026-06-22', time:'00:00', venue:'Hard Rock Stadium, Miami',           status:'open', result:null },
  { id:47, group:'H', homeTeam:'Kap Verde',   homeFlag:'🇨🇻', awayTeam:'Saudi-Arabien', awayFlag:'🇸🇦', date:'2026-06-27', time:'02:00', venue:'NRG Stadium, Houston',             status:'open', result:null },
  { id:48, group:'H', homeTeam:'Uruguay',     homeFlag:'🇺🇾', awayTeam:'Spanien',     awayFlag:'🇪🇸', date:'2026-06-27', time:'02:00', venue:'Estadio Akron, Guadalajara',         status:'open', result:null },
  // ── Group I: Frankreich, Senegal, Irak, Norwegen ──────────────────────────
  { id:49, group:'I', homeTeam:'Frankreich',  homeFlag:'🇫🇷', awayTeam:'Senegal',     awayFlag:'🇸🇳', date:'2026-06-16', time:'21:00', venue:'MetLife Stadium, New Jersey',        status:'open', result:null },
  { id:50, group:'I', homeTeam:'Irak',        homeFlag:'🇮🇶', awayTeam:'Norwegen',    awayFlag:'🇳🇴', date:'2026-06-17', time:'00:00', venue:'Gillette Stadium, Boston',           status:'open', result:null },
  { id:51, group:'I', homeTeam:'Frankreich',  homeFlag:'🇫🇷', awayTeam:'Irak',        awayFlag:'🇮🇶', date:'2026-06-22', time:'23:00', venue:'Lincoln Financial Field, Philadelphia', status:'open', result:null },
  { id:52, group:'I', homeTeam:'Norwegen',    homeFlag:'🇳🇴', awayTeam:'Senegal',     awayFlag:'🇸🇳', date:'2026-06-23', time:'02:00', venue:'MetLife Stadium, New Jersey',        status:'open', result:null },
  { id:53, group:'I', homeTeam:'Norwegen',    homeFlag:'🇳🇴', awayTeam:'Frankreich',  awayFlag:'🇫🇷', date:'2026-06-26', time:'21:00', venue:'Gillette Stadium, Boston',           status:'open', result:null },
  { id:54, group:'I', homeTeam:'Senegal',     homeFlag:'🇸🇳', awayTeam:'Irak',        awayFlag:'🇮🇶', date:'2026-06-26', time:'21:00', venue:'BMO Field, Toronto',                 status:'open', result:null },
  // ── Group J: Argentinien, Algerien, Österreich, Jordanien ─────────────────
  { id:55, group:'J', homeTeam:'Argentinien', homeFlag:'🇦🇷', awayTeam:'Algerien',    awayFlag:'🇩🇿', date:'2026-06-17', time:'03:00', venue:'Arrowhead Stadium, Kansas City',     status:'open', result:null },
  { id:56, group:'J', homeTeam:'Österreich',  homeFlag:'🇦🇹', awayTeam:'Jordanien',   awayFlag:'🇯🇴', date:'2026-06-17', time:'06:00', venue:'Levi\'s Stadium, San Francisco',     status:'open', result:null },
  { id:57, group:'J', homeTeam:'Argentinien', homeFlag:'🇦🇷', awayTeam:'Österreich',  awayFlag:'🇦🇹', date:'2026-06-22', time:'19:00', venue:'AT&T Stadium, Dallas',               status:'open', result:null },
  { id:58, group:'J', homeTeam:'Jordanien',   homeFlag:'🇯🇴', awayTeam:'Algerien',    awayFlag:'🇩🇿', date:'2026-06-23', time:'05:00', venue:'Levi\'s Stadium, San Francisco',     status:'open', result:null },
  { id:59, group:'J', homeTeam:'Algerien',    homeFlag:'🇩🇿', awayTeam:'Österreich',  awayFlag:'🇦🇹', date:'2026-06-28', time:'04:00', venue:'Arrowhead Stadium, Kansas City',     status:'open', result:null },
  { id:60, group:'J', homeTeam:'Jordanien',   homeFlag:'🇯🇴', awayTeam:'Argentinien', awayFlag:'🇦🇷', date:'2026-06-28', time:'04:00', venue:'AT&T Stadium, Dallas',               status:'open', result:null },
  // ── Group K: Portugal, DR Kongo, Usbekistan, Kolumbien ────────────────────
  { id:61, group:'K', homeTeam:'Portugal',    homeFlag:'🇵🇹', awayTeam:'DR Kongo',    awayFlag:'🇨🇩', date:'2026-06-17', time:'19:00', venue:'NRG Stadium, Houston',               status:'open', result:null },
  { id:62, group:'K', homeTeam:'Usbekistan',  homeFlag:'🇺🇿', awayTeam:'Kolumbien',   awayFlag:'🇨🇴', date:'2026-06-18', time:'04:00', venue:'Estadio Azteca, Mexiko-Stadt',       status:'open', result:null },
  { id:63, group:'K', homeTeam:'Portugal',    homeFlag:'🇵🇹', awayTeam:'Usbekistan',  awayFlag:'🇺🇿', date:'2026-06-23', time:'19:00', venue:'NRG Stadium, Houston',               status:'open', result:null },
  { id:64, group:'K', homeTeam:'Kolumbien',   homeFlag:'🇨🇴', awayTeam:'DR Kongo',    awayFlag:'🇨🇩', date:'2026-06-24', time:'04:00', venue:'Estadio Akron, Guadalajara',         status:'open', result:null },
  { id:65, group:'K', homeTeam:'Kolumbien',   homeFlag:'🇨🇴', awayTeam:'Portugal',    awayFlag:'🇵🇹', date:'2026-06-28', time:'01:30', venue:'Hard Rock Stadium, Miami',           status:'open', result:null },
  { id:66, group:'K', homeTeam:'DR Kongo',    homeFlag:'🇨🇩', awayTeam:'Usbekistan',  awayFlag:'🇺🇿', date:'2026-06-28', time:'01:30', venue:'Mercedes-Benz Stadium, Atlanta',     status:'open', result:null },
  // ── Group L: England, Kroatien, Ghana, Panama ─────────────────────────────
  { id:67, group:'L', homeTeam:'England',     homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam:'Kroatien',    awayFlag:'🇭🇷', date:'2026-06-17', time:'22:00', venue:'AT&T Stadium, Dallas',               status:'open', result:null },
  { id:68, group:'L', homeTeam:'Ghana',       homeFlag:'🇬🇭', awayTeam:'Panama',      awayFlag:'🇵🇦', date:'2026-06-18', time:'01:00', venue:'BMO Field, Toronto',                 status:'open', result:null },
  { id:69, group:'L', homeTeam:'England',     homeFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam:'Ghana',       awayFlag:'🇬🇭', date:'2026-06-23', time:'22:00', venue:'Gillette Stadium, Boston',           status:'open', result:null },
  { id:70, group:'L', homeTeam:'Panama',      homeFlag:'🇵🇦', awayTeam:'Kroatien',    awayFlag:'🇭🇷', date:'2026-06-24', time:'01:00', venue:'BMO Field, Toronto',                 status:'open', result:null },
  { id:71, group:'L', homeTeam:'Panama',      homeFlag:'🇵🇦', awayTeam:'England',     awayFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', date:'2026-06-27', time:'23:00', venue:'MetLife Stadium, New Jersey',        status:'open', result:null },
  { id:72, group:'L', homeTeam:'Kroatien',    homeFlag:'🇭🇷', awayTeam:'Ghana',       awayFlag:'🇬🇭', date:'2026-06-27', time:'23:00', venue:'Lincoln Financial Field, Philadelphia', status:'open', result:null },
];

// ── HELPERS ─────────────────────────────────────────────────────────────────
function randomScore() {
  const pool = [
    [0,0],[1,0],[0,1],[1,1],[2,0],[0,2],[2,1],[1,2],[2,2],
    [3,0],[0,3],[3,1],[1,3],[3,2],[2,3],[1,0],[2,1],[1,1],[0,1],[2,0]
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getTendency(h, a) {
  if (h > a) return 'home';
  if (a > h) return 'away';
  return 'draw';
}

// ── PERSISTENCE ─────────────────────────────────────────────────────────────
function load(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, val) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function persist(key, fallback) {
  const store = writable(load(key, fallback));
  return {
    subscribe: store.subscribe,
    set(v) { store.set(v); save(key, v); },
    update(fn) { store.update(v => { const nv = fn(v); save(key, nv); return nv; }); },
    reset(initial) { const v = initial(); store.set(v); save(key, v); }
  };
}

// ── MIGRATION: sync persisted names with INITIAL_USERS ───────────────────────
if (typeof localStorage !== 'undefined') {
  try {
    const raw = localStorage.getItem('bb_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        let changed = false;
        parsed.forEach((u, i) => {
          if (INITIAL_USERS[i] && u.name !== INITIAL_USERS[i].name) {
            u.name = INITIAL_USERS[i].name;
            u.avatar = INITIAL_USERS[i].avatar;
            changed = true;
          }
        });
        if (changed) localStorage.setItem('bb_users', JSON.stringify(parsed));
      }
    }
  } catch {}
}

// ── STORES ──────────────────────────────────────────────────────────────────
export const currentUserId = writable(1);

export const users = persist('bb_users', INITIAL_USERS.map(u => ({ ...u })));
export const matches = persist('bb_matches', MATCHES.map(m => ({ ...m })));
export const tips = persist('bb_tips', []);
export const notification = writable(null);

// ── DERIVED ─────────────────────────────────────────────────────────────────
export const leaderboard = derived([users, tips], ([$users, $tips]) => {
  return [...$users]
    .sort((a, b) => b.gems - a.gems)
    .map((user, idx) => ({
      ...user,
      rank: idx + 1,
      tipsCount: $tips.filter(t => t.userId === user.id && t.status === 'evaluated').length,
    }));
});

// ── ACTIONS ─────────────────────────────────────────────────────────────────
export function saveTip(matchId, homeScore, awayScore) {
  const uid = get(currentUserId);
  const $users = get(users);
  const $tips = get(tips);
  const $matches = get(matches);

  const user = $users.find(u => u.id === uid);
  const match = $matches.find(m => m.id === matchId);

  if (!match || match.status !== 'open') return { ok: false, message: 'Spiel nicht mehr tippbar.' };

  const existing = $tips.find(t => t.userId === uid && t.matchId === matchId);

  if (existing) {
    tips.update(ts => ts.map(t =>
      t.userId === uid && t.matchId === matchId
        ? { ...t, homeScore: Number(homeScore), awayScore: Number(awayScore) }
        : t
    ));
    return { ok: true, message: 'Tipp aktualisiert!' };
  }

  if (user.gems < 10) return { ok: false, message: 'Nicht genug Football Gems (min. 10)!' };

  users.update(us => us.map(u =>
    u.id === uid ? { ...u, gems: u.gems - 10 } : u
  ));

  tips.update(ts => [
    ...ts,
    { id: Date.now(), userId: uid, matchId, homeScore: Number(homeScore), awayScore: Number(awayScore), stake: 10, status: 'pending', payout: 0 }
  ]);

  return { ok: true, message: 'Tipp gespeichert!' };
}

export function simulateMatch(matchId) {
  const $matches = get(matches);
  const $tips = get(tips);
  const $users = get(users);

  const match = $matches.find(m => m.id === matchId);
  if (!match || match.status === 'finished') return null;

  const [rHome, rAway] = randomScore();
  const resultTendency = getTendency(rHome, rAway);

  // Update match to finished
  matches.update(ms => ms.map(m =>
    m.id === matchId ? { ...m, status: 'finished', result: { home: rHome, away: rAway } } : m
  ));

  // Auto-generate tips for users who haven't tipped this match
  const autoTips = [];
  $users.forEach(user => {
    const hasTip = $tips.some(t => t.userId === user.id && t.matchId === matchId);
    if (!hasTip && user.gems >= 10) {
      const [ah, aa] = randomScore();
      autoTips.push({ id: Date.now() + user.id * 100, userId: user.id, matchId, homeScore: ah, awayScore: aa, stake: 10, status: 'pending', payout: 0 });
    }
  });

  const allMatchTips = [
    ...$tips.filter(t => t.matchId === matchId && t.status === 'pending'),
    ...autoTips
  ];

  // Evaluate each tip
  const payouts = {};
  allMatchTips.forEach(tip => {
    const tipTendency = getTendency(tip.homeScore, tip.awayScore);
    let payout = 0;
    let result = 'loss';
    if (tip.homeScore === rHome && tip.awayScore === rAway) {
      payout = tip.stake * 3; result = 'exact';
    } else if (tipTendency === resultTendency) {
      payout = tip.stake * 2; result = 'tendency';
    }
    payouts[tip.userId] = { payout, result };
  });

  // Deduct stakes from auto-tippers first, then credit payouts
  users.update(us => us.map(u => {
    const isAutoTipper = autoTips.some(at => at.userId === u.id);
    const pay = payouts[u.id];
    if (!pay) return u;
    const stakeCost = isAutoTipper ? 10 : 0; // already deducted for real tippers
    const newGems = u.gems - stakeCost + pay.payout;
    const trend = newGems > u.previousGems ? 1 : newGems < u.previousGems ? -1 : 0;
    return { ...u, gems: Math.max(0, newGems), trend, tipsTotal: u.tipsTotal + 1, tipsWon: u.tipsWon + (pay.result !== 'loss' ? 1 : 0) };
  }));

  // Persist evaluated tips (real tips updated, auto tips added)
  tips.update(ts => {
    const updated = ts.map(t =>
      t.matchId === matchId && t.status === 'pending'
        ? { ...t, status: 'evaluated', payout: payouts[t.userId]?.payout ?? 0 }
        : t
    );
    const evaldAuto = autoTips.map(at => ({ ...at, status: 'evaluated', payout: payouts[at.userId]?.payout ?? 0 }));
    return [...updated, ...evaldAuto];
  });

  // Snapshot previousGems
  users.update(us => us.map(u => ({ ...u, previousGems: u.gems })));

  const uid = get(currentUserId);
  return {
    result: { home: rHome, away: rAway },
    match,
    myPayout: payouts[uid] ?? null,
  };
}

// ── ENTER REAL RESULT (Admin) ────────────────────────────────────────────────
export function enterResult(matchId, homeScore, awayScore) {
  const $matches = get(matches);
  const $tips = get(tips);
  const $users = get(users);

  const match = $matches.find(m => m.id === matchId);
  if (!match || match.status === 'finished') return null;

  const rHome = Number(homeScore);
  const rAway = Number(awayScore);
  const resultTendency = getTendency(rHome, rAway);

  // Set match to finished with real result
  matches.update(ms => ms.map(m =>
    m.id === matchId ? { ...m, status: 'finished', result: { home: rHome, away: rAway } } : m
  ));

  // Auto-generate tips for users who haven't tipped
  const autoTips = [];
  $users.forEach(user => {
    const hasTip = $tips.some(t => t.userId === user.id && t.matchId === matchId);
    if (!hasTip && user.gems >= 10) {
      const [ah, aa] = randomScore();
      autoTips.push({ id: Date.now() + user.id * 100, userId: user.id, matchId, homeScore: ah, awayScore: aa, stake: 10, status: 'pending', payout: 0 });
    }
  });

  const allMatchTips = [
    ...$tips.filter(t => t.matchId === matchId && t.status === 'pending'),
    ...autoTips
  ];

  // Evaluate tips
  const payouts = {};
  allMatchTips.forEach(tip => {
    const tipTendency = getTendency(tip.homeScore, tip.awayScore);
    let payout = 0;
    let result = 'loss';
    if (tip.homeScore === rHome && tip.awayScore === rAway) {
      payout = tip.stake * 3; result = 'exact';
    } else if (tipTendency === resultTendency) {
      payout = tip.stake * 2; result = 'tendency';
    }
    payouts[tip.userId] = { payout, result };
  });

  users.update(us => us.map(u => {
    const isAutoTipper = autoTips.some(at => at.userId === u.id);
    const pay = payouts[u.id];
    if (!pay) return u;
    const stakeCost = isAutoTipper ? 10 : 0;
    const newGems = u.gems - stakeCost + pay.payout;
    const trend = newGems > u.previousGems ? 1 : newGems < u.previousGems ? -1 : 0;
    return { ...u, gems: Math.max(0, newGems), trend, tipsTotal: u.tipsTotal + 1, tipsWon: u.tipsWon + (pay.result !== 'loss' ? 1 : 0) };
  }));

  tips.update(ts => {
    const updated = ts.map(t =>
      t.matchId === matchId && t.status === 'pending'
        ? { ...t, status: 'evaluated', payout: payouts[t.userId]?.payout ?? 0 }
        : t
    );
    const evaldAuto = autoTips.map(at => ({ ...at, status: 'evaluated', payout: payouts[at.userId]?.payout ?? 0 }));
    return [...updated, ...evaldAuto];
  });

  users.update(us => us.map(u => ({ ...u, previousGems: u.gems })));

  const uid = get(currentUserId);
  return {
    result: { home: rHome, away: rAway },
    match,
    myPayout: payouts[uid] ?? null,
  };
}

export function getUserTip(matchId) {
  const uid = get(currentUserId);
  return get(tips).find(t => t.userId === uid && t.matchId === matchId) ?? null;
}

export function resetAll() {
  users.reset(() => INITIAL_USERS.map(u => ({ ...u })));
  matches.reset(() => MATCHES.map(m => ({ ...m })));
  tips.reset(() => []);
  notification.set(null);
}
