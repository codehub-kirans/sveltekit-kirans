<!-- This page handles any error encountered by the site. -->
<script>
	import { page } from '$app/stores'
	const emojis = {
		// TODO add the rest!
		404: '🫠',
		500: '💥'
	};
</script>

<h2>{$page.status} | {$page.error.message} </h2>
<span style="font-size: 5em">
	{emojis[$page.status] ?? emojis[500]}
</span>

<p><strong>Sorry!</strong> The page you're looking for could not be found. Maybe try one of these links?</p>
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/contact">Contact</a></li>
</ul>