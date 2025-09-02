import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are properly configured
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase') || supabaseAnonKey.includes('your_supabase')) {
    throw new Error('Supabase configuration is missing or incomplete. Please check your environment variables.')
  }

  const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Auto refresh token on focus
      autoRefreshToken: true,
      // Persist session in local storage
      persistSession: true,
      // Handle token refresh failures gracefully
      detectSessionInUrl: true,
      // Add retry configuration for failed requests
      flowType: 'pkce',
      // Prevent multiple concurrent refresh attempts
      debug: process.env.NODE_ENV === 'development'
    },
    // Add global error handling for auth failures
    global: {
      headers: {
        'X-Client-Info': 'supabase-ssr-client'
      },
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000)
        }).catch((error) => {
          console.warn('Network error during Supabase request:', error)
          // If it's a network error during auth operations, handle gracefully
          if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
            throw new Error('Network connection failed. Please check your internet connection.')
          }
          throw error
        })
      }
    }
  })

  // Add error handling for auth state changes
  client.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.debug('Token refreshed successfully')
    }
    if (event === 'SIGNED_OUT') {
      console.debug('User signed out')
      // Clear any local storage or cached data
      if (typeof window !== 'undefined') {
        // Clear only auth-related data, not everything
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase.auth') || key.includes('sb-')) {
            localStorage.removeItem(key)
          }
        })
      }
    }
    // Handle refresh token errors
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.warn('Token refresh failed - no session returned')
      await client.auth.signOut({ scope: 'local' })
    }
  })

  return client
}
