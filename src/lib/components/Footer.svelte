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
			<a href="https://in.linkedin.com/in/kiran-s">
				<LinkedinSvg />
			</a>
			<a href="https://github.com/codehub-kirans">
				<GithubSvg />
			</a>
			<a href="/api/rss.xml" data-sveltekit-reload>
				<RssSvg />
			</a>
		</div>
	</nav>

	<p>
		&copy; {new Date().getFullYear()} {siteAuthor}. All rights reserved. <br>
	</p>
</footer>