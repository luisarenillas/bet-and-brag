<script lang="ts">
	import { page } from '$app/state';
</script>

<nav>
	<a href="/" class:active={page.url.pathname === '/'}>
		<span class="icon">🏠</span>
		<span class="label">Home</span>
	</a>
	<a href="/spieltag" class:active={page.url.pathname.startsWith('/spieltag')}>
		<span class="icon">⚽</span>
		<span class="label">Spieltag</span>
	</a>
	<a href="/rangliste" class:active={page.url.pathname === '/rangliste'}>
		<span class="icon">🏆</span>
		<span class="label">Rangliste</span>
	</a>
</nav>

<style>
	nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #1a1a2e;
		border-top: 1px solid #16213e;
		display: flex;
		justify-content: space-around;
		padding: 0.5rem 0 1rem;
		z-index: 100;
	}
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		text-decoration: none;
		color: #6b7db3;
		transition: color 0.2s;
		padding: 0.3rem 1.5rem;
		border-radius: 12px;
	}
	a.active {
		color: #4ade80;
	}
	.icon {
		font-size: 1.4rem;
	}
	.label {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
