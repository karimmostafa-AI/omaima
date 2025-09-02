"use client"

import * as React from "react"
import { Order } from "@/types/order"

interface InvoiceProps {
  order: Order
}

export const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black">
      <h1 className="text-2xl font-bold">Invoice for Order #{order.id}</h1>
      <p>Customer: {order.customer?.first_name} {order.customer?.last_name}</p>
      <p>Email: {order.customer?.email}</p>
      <h2 className="text-xl font-bold mt-4">Order Items</h2>
      <ul>
        {order.order_items.map(item => (
          <li key={item.id}>{item.product.name} - ${item.price} x {item.quantity}</li>
        ))}
      </ul>
      <h3 className="text-lg font-bold mt-4">Subtotal: ${order.subtotal.toFixed(2)}</h3>
      <h3 className="text-lg font-bold">Tax: ${order.tax_amount.toFixed(2)}</h3>
      <h3 className="text-lg font-bold">Total: ${order.total_amount.toFixed(2)}</h3>
    </div>
  )
});

Invoice.displayName = "Invoice";
