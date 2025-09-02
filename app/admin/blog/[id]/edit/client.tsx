"use client"

import { useState } from "react"
import { PostForm, PostFormValues } from "@/components/post-form"
import { updatePost, deletePost } from "../../actions"
import { Post, PostCategory } from "@/types/blog"
import { User } from "@/types/user"
import { Button } from "@/components/ui/button"

export function EditPostPageClient({ post, categories, authors }: { post: Post, categories: PostCategory[], authors: Partial<User>[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await updatePost(post.id, values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  const onDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(post.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Update the details of this blog post.</p>
        </div>
        <Button variant="destructive" onClick={onDelete}>Delete Post</Button>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <PostForm
        post={post}
        categories={categories}
        authors={authors}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
