"use client"

import { useState } from "react"
import { ProductForm, ProductFormValues } from "@/components/product-form"
import { createProduct } from "../actions"
import { Category } from "@/types/category"

export function NewProductPageClient({ categories }: { categories: Category[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await createProduct(values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new product to your store.</p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <ProductForm
        categories={categories}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
