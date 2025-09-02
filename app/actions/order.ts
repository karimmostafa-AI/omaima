"use server"

import { createClient } from "@/lib/supabase/server"
import { CartItem } from "@/types/cart"

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export async function createOrderInDatabase(
  userId: string,
  cartItems: CartItem[],
  shippingAddress: ShippingAddress
): Promise<{ orderId?: number; error?: string }> {
  // Note: In a real app, you might get the Supabase client differently in server actions
  // For this context, let's assume a server client can be created like this.
  const supabase = await createClient()

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  try {
    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_price: totalPrice,
        shipping_address: shippingAddress,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    const orderId = orderData.id

    // 2. Create the order items
    const orderItemsData = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData)

    if (itemsError) {
      // In a real app, you'd implement a transaction to roll back the order creation.
      throw new Error(`Order created, but failed to add items: ${itemsError.message}`)
    }

    return { orderId: orderId }
  } catch (error) {
    console.error("Order creation failed:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return { error: errorMessage }
  }
}
