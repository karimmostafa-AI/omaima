"use client"

import { useState } from "react"
import { StaticPageForm, PageFormValues } from "@/components/static-page-form"
import { updatePage, deletePage } from "../../actions"
import { Page } from "@/types/page"
import { Button } from "@/components/ui/button"

export function EditStaticPageClient({ page }: { page: Page }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: PageFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await updatePage(page.id, values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  const onDelete = async () => {
    if (confirm("Are you sure you want to delete this page?")) {
      await deletePage(page.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Edit Page</h1>
          <p className="text-muted-foreground">Update the details of this static page.</p>
        </div>
        <Button variant="destructive" onClick={onDelete}>Delete Page</Button>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <StaticPageForm
        page={page}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
