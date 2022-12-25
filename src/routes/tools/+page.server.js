export const load = async ({ url, fetch }) => {
	const toolRes = await fetch(`${url.origin}/api/tools.json`)
	const tools = await toolRes.json()

	const totalRes = await fetch(`${url.origin}/api/tools/count`)
	const total = await totalRes.json()

	return { tools, total }
}
