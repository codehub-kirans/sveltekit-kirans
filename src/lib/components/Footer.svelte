<script>
	import MainNav from './MainNav.svelte'
	import LinkedinSvg from './svg/LinkedinSVG.svelte'
	import GithubSvg from './svg/GithubSVG.svelte'
	import RssSvg from './svg/RssSVG.svelte'
	import { siteAuthor } from '$lib/config'
</script>

<footer>
	<MainNav />

	<nav>
		<div>
			<a href="https://in.linkedin.com/in/kiran-s" aria-label="Link to Kiran's Linked Page" alt="Kiran S @LinkedIn">
				<LinkedinSvg />
			</a>
			<a href="https://github.com/codehub-kirans" aria-label="Link to Kiran's Github Page" alt="Kiran S @Github">
				<GithubSvg />
			</a>
			<a href="/api/rss.xml" alt="RSS Feed" aria-label="Link to RSS Feed" data-sveltekit-reload>
				<RssSvg />
			</a>
		</div>
	</nav>

	<p>
		&copy; {new Date().getFullYear()} {siteAuthor}. All rights reserved. <br>
	</p>
</footer>