<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { users, currentUserId, notification } from '$lib/stores/gameStore.js';
  import { derived } from 'svelte/store';

  const currentUser = derived([users, currentUserId], ([$users, $uid]) =>
    $users.find(u => u.id === $uid)
  );

  const navItems = [
    { href: '/',            icon: '🏠', label: 'Home'      },
    { href: '/matches',     icon: '⚽', label: 'Spieltag'  },
    { href: '/bracket',     icon: '🏆', label: 'Bracket'   },
    { href: '/leaderboard', icon: '👑', label: 'Rangliste' },
    { href: '/profile',     icon: '👤', label: 'Profil'    },
  ];

  function dismiss() { notification.set(null); }
</script>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0d0d1a;
    color: #ffffff;
    min-height: 100dvh;
    overflow-x: hidden;
  }
  :global(a) { color: inherit; text-decoration: none; }
  :global(button) { cursor: pointer; border: none; outline: none; }
  :global(input::-webkit-outer-spin-button),
  :global(input::-webkit-inner-spin-button) { -webkit-appearance: none; margin: 0; }
  :global(input[type=number]) { -moz-appearance: textfield; }

  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    background: #0d0d1a;
    position: relative;
  }

  .top-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: rgba(13, 13, 26, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .logo {
    font-size: 1.1rem;
    font-weight: 800;
    background: linear-gradient(135deg, #00d26a, #00ff88);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .gems-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 210, 106, 0.12);
    border: 1px solid rgba(0, 210, 106, 0.3);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 700;
    color: #00d26a;
    transition: all 0.3s;
  }

  .gems-badge .gem-icon { font-size: 1rem; }

  .main-content {
    flex: 1;
    padding-bottom: 80px;
    overflow-y: auto;
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    background: rgba(20, 20, 40, 0.97);
    backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    z-index: 200;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 10px;
    border-radius: 12px;
    transition: all 0.2s;
    cursor: pointer;
    background: none;
    color: #666688;
    min-width: 58px;
  }

  .nav-item.active {
    color: #00d26a;
    background: rgba(0, 210, 106, 0.1);
  }

  .nav-item .nav-icon { font-size: 1.3rem; }
  .nav-item .nav-label { font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }

  /* Global notification overlay */
  .notification-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .notification-card {
    background: #1a1a2e;
    border-radius: 24px;
    padding: 36px 28px;
    text-align: center;
    max-width: 340px;
    width: 100%;
    animation: slideUp 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .notification-card.win  { border-color: rgba(0, 210, 106, 0.4); }
  .notification-card.loss { border-color: rgba(255, 60, 60, 0.4); }
  .notification-card.partial { border-color: rgba(255, 200, 0, 0.4); }
  .notification-card.saved { border-color: rgba(0, 150, 255, 0.4); }

  .notif-emoji { font-size: 3.5rem; margin-bottom: 12px; display: block; }
  .notif-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
  .notif-title.win { color: #00d26a; }
  .notif-title.loss { color: #ff3c3c; }
  .notif-title.partial { color: #ffc800; }
  .notif-title.saved { color: #0096ff; }
  .notif-msg { color: #aaaacc; font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px; }
  .notif-gems { font-size: 1.3rem; font-weight: 700; color: #00d26a; margin-bottom: 20px; }

  .btn-close {
    background: linear-gradient(135deg, #00d26a, #00ff88);
    color: #000;
    font-weight: 800;
    font-size: 0.95rem;
    padding: 14px 32px;
    border-radius: 14px;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>

<div class="app-shell">
  <header class="top-bar">
    <div class="logo">⚽ Bet & Brag</div>
    <div style="display:flex;align-items:center;gap:8px;">
      {#if $currentUserId === 1}
        <button
          on:click={() => goto('/admin')}
          style="background:rgba(255,80,80,0.12);border:1px solid rgba(255,80,80,0.3);border-radius:10px;padding:5px 10px;font-size:0.72rem;font-weight:700;color:#ff7070;"
        >⚙️ Admin</button>
      {/if}
      {#if $currentUser}
        <div class="gems-badge">
          <span class="gem-icon">💎</span>
          <span>{$currentUser.gems} Gems</span>
        </div>
      {/if}
    </div>
  </header>

  <main class="main-content">
    <slot />
  </main>

  <nav class="bottom-nav">
    {#each navItems as item}
      <button
        class="nav-item"
        class:active={$page.url.pathname === item.href}
        on:click={() => goto(item.href)}
      >
        <span class="nav-icon">{item.icon}</span>
        <span class="nav-label">{item.label}</span>
      </button>
    {/each}
  </nav>
</div>

{#if $notification}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="notification-overlay" on:click|self={dismiss}>
    <div class="notification-card {$notification.type}">
      <span class="notif-emoji">
        {#if $notification.type === 'win'}🏆{:else if $notification.type === 'partial'}🎯{:else if $notification.type === 'loss'}💸{:else}✅{/if}
      </span>
      <div class="notif-title {$notification.type}">{$notification.title}</div>
      <p class="notif-msg">{$notification.message}</p>
      {#if $notification.gems != null}
        <div class="notif-gems">
          {$notification.gems > 0 ? '+' : ''}{$notification.gems} Gems
        </div>
      {/if}
      <button class="btn-close" on:click={dismiss}>Weiter</button>
    </div>
  </div>
{/if}
