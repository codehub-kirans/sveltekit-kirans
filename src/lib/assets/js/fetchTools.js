import { toolsPerPage } from '$lib/config'

const fetchTools = async ({ offset = 0, limit = toolsPerPage } = {}) => {

	const tools = await Promise.all(
		Object.entries(import.meta.glob('$lib/tools/*.svelte')).map(async ([path, resolver]) => {
			//const { metadata } = await resolver()
			const slug = path.split('/').pop().slice(0, -7)
			return { slug }
			//return { ...metadata, slug }

		})
	)

	let sortedTools = tools.sort((a, b) => a.slug.localeCompare(b.slug))

	if (offset) {
		sortedTools = sortedTools.slice(offset)
	}
	
	if (limit && limit < sortedTools.length && limit != -1) {
		sortedTools = sortedTools.slice(0, limit)
	}

	sortedTools = sortedTools.map(tool => ({
		title: tool.slug,
		slug: tool.slug,
	}))

	return {
		tools: sortedTools
	}
}

export default fetchTools