<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Bet & Brag</title>
</svelte:head>

<div class="app">
	<main>
		{@render children()}
	</main>
	<Nav />
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	:global(body) {
		background: #0f172a;
		color: #f1f5f9;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		min-height: 100vh;
	}
	.app {
		max-width: 480px;
		margin: 0 auto;
		min-height: 100vh;
	}
	main {
		padding: 1.5rem 1rem 6rem;
	}
</style>
