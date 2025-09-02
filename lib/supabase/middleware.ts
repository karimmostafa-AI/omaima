import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase environment variables are properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, return early without authentication
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase') || supabaseAnonKey.includes('your_supabase')) {
    console.warn('Supabase configuration missing or incomplete. Skipping authentication middleware.')
    return supabaseResponse
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error: any) {
    // Handle authentication errors gracefully
    console.warn('Authentication error in middleware:', error?.message || error)
    
    // Clear potentially corrupted auth cookies for network-related errors
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('Network connection failed') ||
        error?.message?.includes('Invalid Refresh Token: Already Used') ||
        error?.code === 'refresh_token_already_used' ||
        error?.name === 'AbortError') {
      
      const cookieNames = [
        'sb-moldfocjoiatszpayzmr-auth-token',
        'sb-moldfocjoiatszpayzmr-auth-token.0', 
        'sb-moldfocjoiatszpayzmr-auth-token.1'
      ]
      
      cookieNames.forEach(cookieName => {
        supabaseResponse.cookies.delete(cookieName)
      })
    }
  }

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/suits") &&
    !request.nextUrl.pathname.startsWith("/uniforms") &&
    !request.nextUrl.pathname.startsWith("/mix-match") &&
    !request.nextUrl.pathname.startsWith("/about") &&
    !request.nextUrl.pathname.startsWith("/contact") &&
    !request.nextUrl.pathname.startsWith("/products") &&
    !request.nextUrl.pathname.startsWith("/accessories") &&
    !request.nextUrl.pathname.startsWith("/size-guide") &&
    !request.nextUrl.pathname.startsWith("/shipping") &&
    !request.nextUrl.pathname.startsWith("/returns") &&
    !request.nextUrl.pathname.startsWith("/privacy") &&
    !request.nextUrl.pathname.startsWith("/terms")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
