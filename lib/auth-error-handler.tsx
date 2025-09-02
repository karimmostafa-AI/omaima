"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthErrorHandler() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const handleAuthError = async (error: any) => {
      console.warn('Auth error detected:', error)
      
      // Handle all auth-related errors including refresh token issues
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('refresh_token') ||
          error?.message?.includes('Network connection failed') ||
          error?.message?.includes('Invalid Refresh Token: Already Used') ||
          error?.code === 'refresh_token_already_used' ||
          error?.name === 'AbortError') {
        
        try {
          // Force sign out to clear corrupted session
          await supabase.auth.signOut({ scope: 'local' })
          
          // Additional cleanup for refresh token issues
          if (error?.code === 'refresh_token_already_used' || 
              error?.message?.includes('Invalid Refresh Token: Already Used')) {
            
            // Clear all Supabase auth data
            if (typeof window !== 'undefined') {
              const authKeys = Object.keys(localStorage).filter(key => 
                key.includes('supabase.auth') || 
                key.includes('sb-') ||
                key.includes('auth-token')
              )
              
              authKeys.forEach(key => {
                localStorage.removeItem(key)
                sessionStorage.removeItem(key)
              })
            }
          }
        } catch (signOutError) {
          console.warn('Error during sign out:', signOutError)
          // Force clear all storage if sign out fails
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
          }
        }
        
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/account')) {
          const reason = error?.code === 'refresh_token_already_used' ? 'refresh_token_conflict' : 'session_expired'
          router.push(`/auth/login?message=session_expired&reason=${reason}`)
        }
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        await handleAuthError(new Error('Token refresh failed'))
      }
      if (event === 'SIGNED_OUT') {
        console.debug('User signed out')
      }
    })

    // Global error handler for unhandled auth errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      const errorMessage = args.join(' ')
      if ((errorMessage.includes('Failed to fetch') && errorMessage.includes('auth')) ||
          errorMessage.includes('Invalid Refresh Token: Already Used') ||
          errorMessage.includes('refresh_token_already_used') ||
          errorMessage.includes('AuthApiError')) {
        handleAuthError(new Error(errorMessage))
      }
      originalConsoleError.apply(console, args)
    }

    return () => {
      subscription.unsubscribe()
      console.error = originalConsoleError
    }
  }, [router])

  return null
}

export function useAuthErrorHandler() {
  const router = useRouter()

  const handleAuthError = async (error: any) => {
    console.warn('Handling auth error:', error)
    
    if (error?.message?.includes('Failed to fetch') || 
        error?.code === 'refresh_token_already_used' ||
        error?.message?.includes('Invalid Refresh Token: Already Used') ||
        error?.message?.includes('refresh_token')) {
      
      try {
        const supabase = createClient()
        await supabase.auth.signOut({ scope: 'local' })
        
        // Clear all auth-related storage
        if (typeof window !== 'undefined') {
          // Clear localStorage auth entries
          Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('auth')) {
              localStorage.removeItem(key)
            }
          })
          
          // Clear sessionStorage auth entries
          Object.keys(sessionStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('auth')) {
              sessionStorage.removeItem(key)
            }
          })
        }
        
        // Only redirect if on protected routes
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/account')) {
          router.push('/auth/login?message=session_expired&reason=token_refresh_failed')
        }
      } catch (signOutError) {
        console.warn('Error during cleanup:', signOutError)
        // Force reload if cleanup fails
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }
    }
  }

  return { handleAuthError }
}