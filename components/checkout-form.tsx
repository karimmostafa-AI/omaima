"use client"

import { useEffect, useState } from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Button } from "./ui/button"
import { createPaymentIntent } from "@/app/actions/stripe"
import { createOrderInDatabase, ShippingAddress } from "@/app/actions/order"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  amount,
  user,
  shippingAddress
}: {
  amount: number,
  user: User,
  shippingAddress: ShippingAddress
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { cartItems, clearCart } = useCart()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (confirmError) {
      setMessage(confirmError.message || "An unexpected error occurred.")
      setIsLoading(false)
      return
    }

    // If payment is successful, create order in our database
    const { orderId, error: orderError } = await createOrderInDatabase(
      user.id,
      cartItems,
      shippingAddress
    )

    if (orderError) {
      setMessage(orderError)
      setIsLoading(false)
      return
    }

    // Clear cart and redirect to success page
    clearCart()
    router.push(`/order/success?order_id=${orderId}`)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6" size="lg">
        <span id="button-text">
          {isLoading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
        </span>
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
    </form>
  )
}

export function StripeCheckout({
  amount,
  user,
  shippingAddress
}: {
  amount: number,
  user: User,
  shippingAddress: ShippingAddress
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent(amount)
        .then(res => {
          if (res.clientSecret) setClientSecret(res.clientSecret)
        })
    }
  }, [amount])

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'stripe' },
  }

  return (
    <div id="checkout">
      {clientSecret && stripePromise && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm amount={amount} user={user} shippingAddress={shippingAddress} />
        </Elements>
      )}
      {!clientSecret && amount > 0 && <div>Loading payment form...</div>}
    </div>
  )
}
