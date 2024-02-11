import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

// Setup supabase
/** @type {import('@sveltejs/kit').Handle} */
async function supabase({ event, resolve }) {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  })

  // A helper function to get the admin session
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    return session
  }

  // Resolve this hook
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    }
  })
}

// Make sure to secure the admin page and redirect any user that will access it to /admin-login
/** @type {import('@sveltejs/kit').Handle} */
export async function authorization({ event, resolve }) {
  if (event.url.pathname.startsWith('/dashboard')) {
    const session = await event.locals.getSession() // Get Session
    if (!session) {
      throw redirect(303, '/admin-login') // Redirect part
    }
  }

  return resolve(event) // Resolve this hook
}

export const handle = sequence(supabase, authorization)
