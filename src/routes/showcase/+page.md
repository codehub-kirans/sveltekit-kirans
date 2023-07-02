<svelte:head>

<title>About</title>
<meta name="description" content="A showcase of projects by Kiran S" />
</svelte:head>

<script>
	import ImageLoader from '$lib/components/ImageLoader.svelte';
    import Callout from '$lib/components/Callout.svelte';
</script>

# Showcase

- [Team Health Check](https://teamhealthcheck.kirans.in)

<Callout>
Team (Squad) health check web application is a tool for quick assessment and visualization of
how Agile teams perform in three aspects: tech health, team health, and product health. It
uses a set of behaviour anchors on relevant themes for a high performing team to discuss and
capture sentiment. For each question or theme, the team/squad discusses if they are closer to
“awesome” or closer to “bad”, which colour to choose for that indicator, and what the trend is
(stable, improving, or getting worse). For example, the theme "can we release easily?" might
elicit responses of "our releases are good/meh/bad" i.e. green, amber and red, the colours of
a traffic light.
<br><br>
<span style="color:green;"><b>GREEN</b></span>: Things are going very well. Although this does not mean that everything is perfect the team or squad is satisfied and does not see much space for improvement.
<br>
<span style="color: #ffcc00;"><b>AMBER</b></span>: There are some problems that need to be solved. However, it is not a disaster.
<br>
<span style="color: red;"><b>RED</b></span>: There is a lot going wrong. Improvements are urgently needed.
<br>
</Callout>
