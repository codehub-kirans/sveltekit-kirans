<!-- This file renders each individual post for reading. Be sure to update the svelte:head below -->
<script>
export let data

const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } = data.meta
</script>


<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content="{excerpt}">
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<!-- <meta property="og:image" content="https://www.kirans.in/images/Kiran-S-profile-pic.jpg" /> -->
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<!-- <meta name="twitter:image" content="https://mydomain.com/image_path" /> -->
</svelte:head>


<article class="post">
	<!-- Considering adding an alt frontmatter attribute. If not, leave alt blank -->
	<img
		class="cover-image"
		src="{coverImage}"
		alt=""
		style="aspect-ratio: {coverWidth} / {coverHeight};"
		width={coverWidth}
		height={coverHeight}
	/>

	<h1>{ title }</h1>
	
	<div class="meta">
		<b>Published:</b> {date}
		<br>
		<b>Updated:</b> {updated}
	</div>

	{@html data.PostContent}

	{#if categories}
		<aside class="post-footer">
			<h2>Posted in: </h2>
			<ul>
				{#each categories as category}
					<li>
						<a href="/blog/category/{category}/">
							{ category }
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</article> 