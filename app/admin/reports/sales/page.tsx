import { createClient } from "@/lib/supabase/server"
import SalesReportsClient from "./client"
import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

async function getSalesData() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product:products (name)
      ),
      customer:users (
        first_name,
        last_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sales data:", error)
    return []
  }
  return data
}

export default async function SalesReportsPage() {
  const salesData = await getSalesData()
  return (
    <AdminGuard requiredPermissions={['manage-reports']}>
      <AdminLayout>
        <SalesReportsClient salesData={salesData} />
      </AdminLayout>
    </AdminGuard>
  )
}
