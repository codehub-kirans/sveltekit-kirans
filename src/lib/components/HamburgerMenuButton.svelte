<script>
	import { isMenuOpen } from '$lib/assets/js/store'
	import HamburgerOpenSVG from './svg/HamburgerOpenSVG.svelte'
	import HamburgerCloseSVG from './svg/HamburgerCloseSVG.svelte'

	export let closeOnly = false

	const toggleIsMenuOpen = () => {
		isMenuOpen.set(!$isMenuOpen)
	}
</script>

<button
	on:click={toggleIsMenuOpen}
	aria-pressed={$isMenuOpen}
	class="menu-button"
	tabindex={($isMenuOpen || !closeOnly) ? '0' : '-1'}
>
	<span class="sr-only">Toggle hamburger menu</span>
	{#if closeOnly}
		<HamburgerCloseSVG />
	{:else}
		<HamburgerOpenSVG />
	{/if}
</button>