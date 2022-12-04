# Kiran S

This is a personal website built with svelteKit.

## Uses

- ⚡️ **Super fast static site generation with hydration**. Every route is compiled down to static HTML and routed with (optional) JavaScript, thanks to the SvelteKit static adapter (pre-installed)
- 📦 **Zero-config preloading** for automatic, fast background preloading of all top-level pages
- ✍️ **Markdown support** with a pre-configured blog
	- 📑 **Pagination** included (_can customize posts per page_)
	- ✅ **Category pages** included
	- 💬 **Posts JSON API**
- 💅 **Sass** pre-installed and -configured
- 📝 **mdsvex** pre-installed--use Svelte components inside Markdown!
	- 🔗 **Rehype** plugins are included to generate unique heading IDs, for direct linking
- 📱 **Responsive and accessible defaults**; includes a "skip to content" link and accessible mobile nav menu
- 🔄 **Page transitions** (_fancy!_)
- 🔎 **Basic SEO** for blog posts (_strongly recommend checking that out for yourself, though_)
- 📰 **RSS feed** set up and ready to go (_though it could also likely benefit from some optimization_); just update `src/lib/config.js`