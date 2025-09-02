"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, cartSummary } = useCart()

  const { subtotal, tax_amount, total_amount } = cartSummary;

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-24 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.images?.[0] || "/placeholder.svg"}
                  alt={item.name}
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">
                  {/* Note: This assumes the first color/size is the one added.
                      A more complex implementation would store selected variants. */}
                  {item.colors?.[0]} / {item.sizes?.[0]}
                </p>
                <p className="font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  aria-label={`Quantity for ${item.name}`}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-20 text-center"
                />
                <Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="p-6 bg-muted/50 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-medium">${tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total_amount.toFixed(2)}</span>
            </div>
            <Button size="lg" className="w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
