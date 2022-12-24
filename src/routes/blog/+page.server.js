// Ensures all pages under this layout (which is all of them) are statically prerendered at build time 
export const prerender = false

export const load = async ({ url, fetch }) => {
	const postRes = await fetch(`${url.origin}/api/posts.json`)
	const posts = await postRes.json()

	const totalRes = await fetch(`${url.origin}/api/posts/count`)
	const total = await totalRes.json()

	return { posts, total }
}
