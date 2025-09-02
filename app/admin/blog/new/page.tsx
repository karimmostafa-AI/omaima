import { NewPostPageClient } from "./client"
import { createClient } from "@/lib/supabase/server"
import { PostCategory } from "@/types/blog"
import { User } from "@/types/user"

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

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([getPostCategories(), getAuthors()])
  return <NewPostPageClient categories={categories} authors={authors} />
}
