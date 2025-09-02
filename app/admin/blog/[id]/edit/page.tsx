import { EditPostPageClient } from "./client"
import { createClient } from "@/lib/supabase/server"
import { Post, PostCategory } from "@/types/blog"
import { User } from "@/types/user"
import { notFound } from "next/navigation"

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()
  if (error) {
    console.error("Failed to fetch post:", error)
    return null
  }
  return data
}

async function getPostCategories(): Promise<PostCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("post_categories").select("*").order("name")
  if (error) {
    console.error("Failed to fetch post categories:", error)
    return []
  }
  return data
}

async function getAuthors(): Promise<Partial<User>[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("users").select("id, first_name, last_name").in("role", ["admin", "staff"])
    if (error) {
        console.error("Failed to fetch authors:", error)
        return []
    }
    return data
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post, categories, authors] = await Promise.all([
    getPost(params.id),
    getPostCategories(),
    getAuthors(),
  ])

  if (!post) {
    notFound()
  }

  return <EditPostPageClient post={post} categories={categories} authors={authors} />
}
