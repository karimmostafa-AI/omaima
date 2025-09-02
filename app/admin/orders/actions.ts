"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// This should match the enum in the database migration
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'

export async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  const supabase = await createClient()

  const allowedStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'canceled']
  if (!allowedStatuses.includes(newStatus)) {
    return { error: "Invalid status value." }
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/orders")
  return { success: true }
}
