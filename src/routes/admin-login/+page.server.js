import { AuthApiError } from '@supabase/supabase-js'
import { redirect, fail } from '@sveltejs/kit'

/** @type {import('./$types').Actions} */
export const actions = {
  // Form actions
  default: async function({ request, locals: { supabase } }) {
    const formData = await request.formData()

    const email = formData.get('email')
    const password = formData.get('password')

    // Login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // If error
    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        // Return invalid creds
        return fail(400, {
          error: 'Invalid credentials.',
          values: {
            email
          }
        })
      }

      // If not invalid creds and something else
      return fail(500, {
        error: 'Server error. Try again later.',
        values: {
          email
        }
      })
    }

    // Redirect to dashboard
    throw redirect(303, '/dashboard')
  }
}
