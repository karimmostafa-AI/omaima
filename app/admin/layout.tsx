import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Package, ShoppingCart, Users, Tags, FileText } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login?redirect=/admin/dashboard")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // If the user has no profile or is not an admin, show a 404 page.
  if (!profile || profile.role !== "admin") {
    notFound()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 border-r p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
          Omaima Admin
        </h2>
        <nav className="flex flex-col space-y-2">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/dashboard"><Home className="mr-2 h-4 w-4" />Dashboard</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/products"><Package className="mr-2 h-4 w-4" />Products</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/categories"><Tags className="mr-2 h-4 w-4" />Categories</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/pages"><FileText className="mr-2 h-4 w-4" />Pages</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/orders"><ShoppingCart className="mr-2 h-4 w-4" />Orders</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/customers"><Users className="mr-2 h-4 w-4" />Customers</Link>
          </Button>
        </nav>
        <div className="mt-auto">
           <Button variant="outline" className="w-full" asChild>
             <Link href="/" target="_blank" rel="noopener noreferrer">Back to Site</Link>
           </Button>
        </div>
      </aside>
      <div className="flex-grow flex flex-col">
        <header className="border-b p-4">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </header>
        <main className="flex-grow p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  )
}
