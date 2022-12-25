import { toolsPerPage } from '$lib/config'
import fetchTools from '$lib/assets/js/fetchTools'
import { json } from '@sveltejs/kit'

// export const prerender = true

export const GET = async () => {
  const options = {
    limit: toolsPerPage
  }

  const { tools } = await fetchTools(options)
  return json(tools)
}