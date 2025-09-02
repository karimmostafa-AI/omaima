import { createClient } from "@/lib/supabase/server"
import OrdersClient from "./client"

async function getOrdersForAdmin() {
  const supabase = await createClient()
  
  // Since orders.user_id references auth.users.id and profiles.id also references auth.users.id,
  // we need to manually join or use a different approach
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (ordersError) {
    console.error("Error fetching orders for admin:", ordersError)
    console.error("Error details:", JSON.stringify(ordersError, null, 2))
    return []
  }
  
  // Manually join with profiles and order items for each order
  const ordersWithDetails = []
  for (const order of ordersData || []) {
    let profile = null
    if (order.user_id) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, phone")
        .eq("id", order.user_id)
        .single()
      profile = profileData
    }
    
    // Fetch order items with product details
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(`
        *,
        product:products(name, sku)
      `)
      .eq("order_id", order.id)
    
    ordersWithDetails.push({
      ...order,
      profile: profile,
      order_items: orderItems || []
    })
  }
  
  return ordersWithDetails
}

import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin()

  return (
    <AdminGuard requiredPermissions={['manage-orders']}>
      <AdminLayout>
        <OrdersClient orders={orders} />
      </AdminLayout>
    </AdminGuard>
  )
}
