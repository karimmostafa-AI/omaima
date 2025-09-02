"use client"

import { useState } from "react"
import { PostForm, PostFormValues } from "@/components/post-form"
import { createPost } from "../actions"
import { PostCategory } from "@/types/blog"
import { User } from "@/types/user"

export function NewPostPageClient({ categories, authors }: { categories: PostCategory[], authors: Partial<User>[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await createPost(values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Post</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new post to the blog.</p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <PostForm
        categories={categories}
        authors={authors}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
