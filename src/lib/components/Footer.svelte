<script>
	import MainNav from './MainNav.svelte'
	import { siteAuthor } from '$lib/config'
</script>

<footer>
	<MainNav />

	<nav>
		<ul>
			<li>
				<a href="/api/rss.xml" data-sveltekit-reload>RSS</a>
			</li>
			<li>
				<a href="/">Home</a>
			</li>
		</ul>
	</nav>

	<p>
		&copy; {new Date().getFullYear()} {siteAuthor}. All rights reserved. <br>
		<small><i><a href="https://in.linkedin.com/in/kiran-s">LinkedIn</a></i></small>
	</p>
</footer>