<script>
	import { toolsPerPage } from '$lib/config'

	export let currentPage
	export let totalTools
	export let path = '/tools/page'
	
	let pagesAvailable
	$: pagesAvailable = Math.ceil(totalTools / toolsPerPage)

	const isCurrentPage = (page) => page == currentPage
</script>

<!-- For some reason, the pagination wasn't re-rendering properly during navigation without the #key block -->
{#key currentPage}
	{#if pagesAvailable > 1}
		<nav aria-label="Pagination navigation" class="pagination">
			<ul>
				{#each Array.from({length: pagesAvailable}, (_, i) => i + 1) as page}
					<li>
						<a href="{path}/{page}" aria-current="{isCurrentPage(page)}">
							<span class="sr-only">
								{#if isCurrentPage(page)}
									Current page: 
								{:else}
									Go to page 
								{/if}
							</span>
							{page}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
{/key}