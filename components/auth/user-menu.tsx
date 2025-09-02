'use client'

import { useState } from 'react'
import { 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  Package, 
  CreditCard,
  UserCircle,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AuthDialog } from './auth-dialog'
import { useSession } from './session-provider'
import { Badge } from '@/components/ui/badge'

interface UserMenuProps {
  onMyDesigns?: () => void
  onOrders?: () => void
  onSettings?: () => void
}

export function UserMenu({ 
  onMyDesigns, 
  onOrders, 
  onSettings 
}: UserMenuProps) {
  const { user, loading, signOut, isGuest } = useSession()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const openSignIn = () => {
    setAuthMode('signin')
    setAuthDialogOpen(true)
  }

  const openSignUp = () => {
    setAuthMode('signup')
    setAuthDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    )
  }

  // Guest user - show sign in button
  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          {isGuest && (
            <Badge variant="outline" className="hidden sm:flex">
              Guest Session
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Get Started</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openSignIn}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openSignUp}>
                <User className="h-4 w-4 mr-2" />
                Create Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <p className="text-xs text-muted-foreground">
                  {isGuest 
                    ? 'Sign in to save your designs permanently'
                    : 'Create an account to access all features'
                  }
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          defaultMode={authMode}
        />
      </>
    )
  }

  // Authenticated user - show user menu
  const userEmail = user.email || ''
  const userInitials = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {userInitials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onMyDesigns}>
          <Heart className="h-4 w-4 mr-2" />
          My Designs
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onOrders}>
          <Package className="h-4 w-4 mr-2" />
          Order History
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}