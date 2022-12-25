import { json } from '@sveltejs/kit'

// export const prerender = true

export const GET = () => {
  const tools = import.meta.glob(`$lib/tools/*.svelte`)
  
  return json(Object.keys(tools).length)
}