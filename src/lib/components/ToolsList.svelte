<script>
	export let tools = []
</script>


<ul class="tools-list">
	{#each tools as tool}
		<li>
			<article>
				<a href="/tools/{tool.slug}">
					<h2>
						{tool.slug}
					</h2>
				</a>
			</article>
		</li>
	{/each}
</ul>