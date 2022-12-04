<script>
	import { siteTitle } from '$lib/config';

	export let data;
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content="Contact Kiran S" />
</svelte:head>

<!-- This is the README.md file in the root of the repo. It serves double duty currently as the homepage's content. TODO - Use own HTML and/or Svelte, and delete/modify everything in this file. -->
<svelte:component this={data.ReadMe} />
