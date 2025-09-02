"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { ShoppingBag, Search, User, Menu } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function HeaderActions({ user }: { user: SupabaseUser | null }) {
  const { cartCount } = useCart()

  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <Search className="h-5 w-5" />
      </Button>
      {user ? (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      ) : (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/auth/login">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      )}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/cart">
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  )
}
