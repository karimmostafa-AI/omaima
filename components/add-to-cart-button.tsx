"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Product, ProductVariant } from "@/types/product"
import { useState } from "react"

export function AddToCartButton({ product, variant, disabled }: { product: Product; variant?: ProductVariant | null; disabled?: boolean }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (!variant) {
      // Handle case where no variant is selected but button is clicked
      // This could be showing an error message or just disabling the button
      console.error("No variant selected")
      return
    }
    setIsAdding(true)
    addToCart(product, variant)

    // Optional: add a visual feedback delay
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
