import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getPublishedNavigationPages } from "@/lib/supabase/pages"
import { Page } from "@/types/page"
import { HeaderActions } from "./header-actions"

export async function Header() {
  let user = null
  let navigationPages: Page[] = []
  
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
    
    // Get navigation pages
    navigationPages = await getPublishedNavigationPages()
  } catch (error) {
    console.warn('Supabase not configured, running in demo mode')
    // Continue without user authentication and navigation pages
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            <span className="font-serif text-2xl font-semibold text-foreground">Omaima</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/suits" className="text-foreground hover:text-primary transition-colors font-medium">
              Suits
            </Link>
            <Link href="/uniforms" className="text-foreground hover:text-primary transition-colors font-medium">
              Uniforms
            </Link>
            <Link href="/mix-match" className="text-foreground hover:text-primary transition-colors font-medium">
              Mix & Match
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            {/* Dynamic Navigation Pages */}
            {navigationPages.map((page) => (
              <Link 
                key={page.id} 
                href={`/pages/${page.slug}`} 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <HeaderActions user={user} />
        </div>
      </div>
    </header>
  )
}
