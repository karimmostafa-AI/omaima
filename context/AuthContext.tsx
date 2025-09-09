"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { UserProfile, Customer, UserRole } from '@/types/user'

import { Permission } from "@/types/role"

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  customer: Customer | null
  permissions: string[]
  loading: boolean
  error: string | null
  
  // Auth methods
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: UserProfile | null; error: any }>
  
  // Social auth
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithFacebook: () => Promise<{ error: AuthError | null }>
  
  // Role and permission checks
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  isVendor: () => boolean
  isCustomer: () => boolean
  hasPermission: (permission: string) => boolean
  
  // Profile management
  refreshProfile: () => Promise<void>
  createCustomerProfile: (customerData: Partial<Customer>) => Promise<{ data: Customer | null; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => {
    try {
      return createClient()
    } catch (error) {
      console.warn('Supabase not configured, running in demo mode')
      // Return a mock client that doesn't throw errors
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
          signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
          signOut: () => Promise.resolve({ error: null }),
          resetPasswordForEmail: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
          updateUser: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
          signInWithOAuth: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
            })
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
            })
          }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
              })
            })
          })
        })
      }
    }
  })

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
        setCustomer(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
    } catch (error: any) {
      if (error?.message?.includes('Supabase not configured')) {
        console.warn('Supabase not configured, running in demo mode')
        // Don't set this as an error in demo mode
      } else {
        console.error('Auth initialization error:', error)
        setError('Failed to initialize authentication')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile with role and permissions
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          role:roles (
            name,
            permissions ( name )
          )
        `)
        .eq('id', userId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      if (profileData.role) {
        setPermissions(profileData.role.permissions.map((p: Permission) => p.name))
      }

      // Fetch customer profile if exists
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single()

      setCustomer(customerData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      // Create user profile if signup successful
      if (data.user && !error) {
        const profileData: Partial<UserProfile> = {
          id: data.user.id,
          email: data.user.email!,
          role: 'customer',
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          phone: userData?.phone || null,
          avatar_url: userData?.avatar_url || null,
          email_verified: false,
          is_active: true,
          ...userData
        }

        await supabase
          .from('users')
          .insert(profileData)
      }

      return { user: data.user, error }
    } catch (error: any) {
      setError(error.message)
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session, error }
    } catch (error: any) {
      setError(error.message)
      return { user: null, session: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setSession(null)
        setProfile(null)
        setCustomer(null)
      }
      return { error }
    } catch (error: any) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { data: null, error: 'No user logged in' }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const hasRole = (role: UserRole): boolean => {
    if (!profile) return false
    return profile.role === role
  }

  const isAdmin = (): boolean => hasRole('admin')
  const isVendor = (): boolean => hasRole('vendor')
  const isCustomer = (): boolean => hasRole('customer')

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  const createCustomerProfile = async (customerData: Partial<Customer>) => {
    if (!user) return { data: null, error: 'No user logged in' }

    const customerProfile: Partial<Customer> = {
      user_id: user.id,
      email: user.email!,
      ...customerData
    }

    const { data, error } = await supabase
      .from('customers')
      .insert(customerProfile)
      .select()
      .single()

    if (!error && data) {
      setCustomer(data)
    }

    return { data, error }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    customer,
    permissions,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithGoogle,
    signInWithFacebook,
    hasRole,
    isAdmin,
    isVendor,
    isCustomer,
    hasPermission,
    refreshProfile,
    createCustomerProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
