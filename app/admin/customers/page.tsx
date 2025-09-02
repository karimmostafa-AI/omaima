import { createClient } from "@/lib/supabase/server"
import CustomersClient from "./client"
import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

async function getCustomersForAdmin() {
  const supabase = await createClient()
  
  // Get all profiles (customers)
  const { data: customers, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  if (!customers) {
    return []
  }

  // Get order counts for each customer
  const customersWithOrders = await Promise.all(
    customers.map(async (customer) => {
      const { count, error: countError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", customer.id)
      
      if (countError) {
        console.error("Error fetching order count for customer:", customer.id, countError)
      }
      
      return {
        ...customer,
        orders: [{ count: count || 0 }]
      }
    })
  )
  
  return customersWithOrders
}

export default async function CustomersPage() {
  const customers = await getCustomersForAdmin()

  return (
    <AdminGuard>
      <AdminLayout>
        <CustomersClient customers={customers} />
      </AdminLayout>
    </AdminGuard>
  )
}
