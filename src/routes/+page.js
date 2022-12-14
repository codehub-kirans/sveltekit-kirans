import { error } from '@sveltejs/kit'
import { inject } from '@vercel/analytics';

inject();

export const load = async () => {
	try {
		const ReadMeFile = await import('../../src/routes/about/+page.md')
		const ReadMe = ReadMeFile.default
		
		return {
			ReadMe
		}
	}
	catch(err) {
		throw error(500, err)
	}
}
