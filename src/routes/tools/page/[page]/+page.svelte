<!-- This file handles any /tools/page/x route for pagination -->
<script>
	import ToolsList from '$lib/components/ToolsList.svelte'
	import ToolsListPagination from '$lib/components/ToolsListPagination.svelte'
  	import { toolsPerPage } from '$lib/config'

	export let data
	const { page, totalTools, tools } = data

	$: lowerBound = (page * toolsPerPage) - (toolsPerPage - 1) || 1
	$: upperBound = Math.min(page * toolsPerPage, totalTools)
</script>


<svelte:head>
	<title>Tools - page {page}</title>
	<meta data-key="description" name="description" content="Useful Tools and Utilities" />
</svelte:head>


<!-- TODO: this is duplicated across multiple `+page.svelte` files -->
{#if tools.length}
	<h1>Tools {lowerBound}–{upperBound} of {totalTools}</h1>
	<ToolsListPagination currentPage={page} {totalTools} />

	<ToolsList {tools} />

	<ToolsListPagination currentPage={page} {totalTools} />
{:else}
	<h1>Oops!</h1>

	<p>Sorry, no tools to show here.</p>

	<a href="tools">Back to Tools</a>
{/if}