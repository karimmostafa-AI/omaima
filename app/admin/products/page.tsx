import { createClient } from "@/lib/supabase/server"
import ProductsClient from "./client"

async function getProductsForAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      stock,
      category:categories (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products for admin:", error)
    return []
  }
  return data
}

async function getCategoriesForFilter() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProductsForAdmin(),
    getCategoriesForFilter()
  ])

  return (
    <AdminGuard requiredPermissions={['manage-products']}>
      <AdminLayout>
        <ProductsClient products={products} categories={categories} />
      </AdminLayout>
    </AdminGuard>
  )
}
