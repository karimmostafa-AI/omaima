"use client"

import { useState } from "react"
import { TaxForm, TaxFormValues } from "@/components/tax-form"
import { createTax } from "../actions"

export function NewTaxPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: TaxFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await createTax(values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Tax</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new tax rate.</p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <TaxForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
