<!-- This file renders each tool -->
<script>
	export let data
	const {title, component} = data

</script>	
	
<svelte:head>
	<title>{title}</title>
	<meta data-key="description" name="description" content="{title}">
</svelte:head>

<article class="post">			
	<svelte:component this={component} />
</article> 