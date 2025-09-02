"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"
import { useState } from "react"

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product)

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
      disabled={isAdding}
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
