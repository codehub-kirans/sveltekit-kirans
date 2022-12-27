<script>
	import ToolsList from '$lib/components/ToolsList.svelte'
	import ToolsListPagination from '$lib/components/ToolsListPagination.svelte'

	export let data	
</script>

<svelte:head>
	<title>Tools</title>
	<meta data-key="description" name="description" content="Useful Tools and Utilities" />
</svelte:head>

<h1>Tools</h1>
<h2>A list of useful tools and utilities</h2>

<ToolsList tools={data.tools} />

<ToolsListPagination currentPage={1} totalTools ={data.total} />



  