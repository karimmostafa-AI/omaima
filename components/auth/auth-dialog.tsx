'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSession } from './session-provider'
import { toast } from 'sonner'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: 'signin' | 'signup'
}

type AuthMode = 'signin' | 'signup'

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = 'signin'
}: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
    }

    setLoading(true)

    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (error) {
        toast.error(error.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`)
      } else {
        toast.success(mode === 'signin' 
          ? 'Welcome back!' 
          : 'Account created successfully! Please check your email to verify your account.'
        )
        
        if (mode === 'signin') {
          onOpenChange(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signin' 
              ? 'Welcome back! Sign in to access your saved designs.'
              : 'Create an account to save and share your custom designs.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9"
                disabled={loading}
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {mode === 'signup' && (
              <div className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </div>
            )}
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading 
              ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...')
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Button>

          <Separator />

          {/* Mode Switch */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'signin' 
                ? "Don't have an account? "
                : "Already have an account? "
              }
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  resetForm()
                }}
                disabled={loading}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>

          {/* Guest Continue */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-xs text-muted-foreground"
              disabled={loading}
            >
              Continue as guest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}