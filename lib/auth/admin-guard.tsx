"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requiredPermissions?: string[]
}

export function AdminGuard({ 
  children, 
  fallback,
  redirectTo = '/auth/login?redirect=/admin',
  requiredPermissions = []
}: AdminGuardProps) {
  const { user, profile, loading, hasPermission: checkHasPermission } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      // No user logged in
      if (!user) {
        router.push(redirectTo)
        return
      }

      // User exists but no profile loaded yet
      if (!profile) {
        // Give some time for profile to load
        const timeout = setTimeout(() => {
          if (!profile) {
            router.push(redirectTo)
          }
        }, 2000)
        return () => clearTimeout(timeout)
      }

      // Check user role permissions
      const hasRequiredPermissions = requiredPermissions.every(permission => checkHasPermission(permission))

      if (!hasRequiredPermissions) {
        // Redirect to appropriate page based on user role
        if (profile.role === 'customer') {
          router.push('/account')
        } else {
          router.push('/')
        }
        return
      }

      setIsChecking(false)
    }
  }, [user, profile, loading, router, redirectTo, requiredPermissions, checkHasPermission])

  // Show loading state
  if (loading || isChecking || !profile) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Check if user has required permissions
  const hasRequiredPermissions = requiredPermissions.every(permission => checkHasPermission(permission))

  if (!hasRequiredPermissions) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for page-level protection
export function withAdminGuard<T extends object>(
  Component: React.ComponentType<T>,
  options?: Omit<AdminGuardProps, 'children'>
) {
  return function AdminGuardedComponent(props: T) {
    return (
      <AdminGuard {...options}>
        <Component {...props} />
      </AdminGuard>
    )
  }
}

// Hook for checking admin permissions
export function useAdminAccess(requiredPermissions: string[] = []) {
  const { user, profile, loading, hasPermission } = useAuth()

  const hasAccess = user && profile && requiredPermissions.every(permission => hasPermission(permission))

  return {
    hasAccess,
    loading,
    user,
    profile,
    hasPermission
  }
}
