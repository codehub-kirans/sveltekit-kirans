import { toolsPerPage } from '$lib/config'
import fetchTools from '$lib/assets/js/fetchTools'
import { redirect } from '@sveltejs/kit'

export const load = async ({ url, params, fetch }) => {
  const page = parseInt(params.page) || 1

  // Keeps from duplicationg the blog index route as page 1
  if (page <= 1) {
    throw redirect(301, '/tools')
  }
  
  let offset = (page * toolsPerPage) - toolsPerPage

  const totalToolsRes = await fetch(`${url.origin}/api/tools/count`)
  const total = await totalToolsRes.json()
  const { tools } = await fetchTools({ offset, page })
  
  return {
    tools,
    page,
    totalTools: total
  }
}
