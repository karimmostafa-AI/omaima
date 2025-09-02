"use client"

import { useCart } from "@/context/CartContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { StripeCheckout } from "@/components/checkout-form"
import { ShippingAddress } from "@/app/actions/order"

export default function CheckoutPage() {
  const { cartItems } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
  })

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const amountInCents = Math.round(subtotal * 100)

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login?redirect=/checkout")
      } else {
        setUser(data.user)
      }
      setIsLoading(false)
    }
    getUser()
  }, [router])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-12 text-center">Redirecting to login...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Shipping & Payment Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={shippingAddress.firstName} onChange={handleShippingChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={shippingAddress.lastName} onChange={handleShippingChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={shippingAddress.address} onChange={handleShippingChange} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" value={shippingAddress.zip} onChange={handleShippingChange} required />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={shippingAddress.country} onChange={handleShippingChange} required />
            </div>
          </div>

          <div className="pt-8">
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="mt-4 border rounded-lg p-4">
                {amountInCents > 0 ? (
                  <StripeCheckout
                    amount={amountInCents}
                    shippingAddress={shippingAddress}
                    user={user}
                  />
                ) : (
                  <p className="text-muted-foreground text-center">Your cart is empty.</p>
                )}
              </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6 bg-muted/30 p-8 rounded-lg self-start top-24 sticky">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cartItems.length > 0 ? cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.images?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            )) : <p className="text-muted-foreground">No items in cart.</p>}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
