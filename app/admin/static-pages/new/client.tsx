"use client"

import { useState } from "react"
import { StaticPageForm, PageFormValues } from "@/components/static-page-form"
import { createPage } from "../actions"

export function NewStaticPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: PageFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await createPage(values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Static Page</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new static page to your site.</p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <StaticPageForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
