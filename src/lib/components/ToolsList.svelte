<script>
	export let tools = []
</script>


<ul class="tools-list">
	{#each tools as tool}
		<li>
			<article>
				<a href="/tools/{tool.slug}">
					<h3>
						{tool.slug}
					</h3>
				</a>
			</article>
		</li>
	{/each}
</ul>