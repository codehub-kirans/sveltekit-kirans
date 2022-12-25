import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	try {	
		const module = await import(`../../../lib/tools/${params.tool}.svelte`)
		// console.log(`Tool name is: ${params.tool}`)

		return {
			title: params.tool,
			component: module.default,
		}

	} catch(err) {
		throw error(404, err)
	}
}

