<script>
	import ToolsList from '$lib/components/ToolsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'

	export let data	
</script>

<svelte:head>
	<title>Tools</title>
	<meta data-key="description" name="description" content="Useful Utilities" />
</svelte:head>

<h1>Tools</h1>
<h2>A list of useful tools and utilities</h2>

<ToolsList tools={data.tools} />

<Pagination currentPage={1} totalTools ={data.total} />



  