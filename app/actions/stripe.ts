"use server"

import { Stripe } from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
})

/**
 * Creates a Stripe PaymentIntent.
 * @param amount The amount in the smallest currency unit (e.g., cents for USD).
 * @param currency The three-letter ISO currency code.
 * @returns An object containing the client secret for the PaymentIntent.
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
): Promise<{ clientSecret: string | null; error?: string }> {
  if (amount <= 0) {
    return { clientSecret: null, error: "Amount must be a positive integer." }
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("Failed to create Payment Intent:", errorMessage)
    return { clientSecret: null, error: `Failed to create payment intent: ${errorMessage}` }
  }
}
