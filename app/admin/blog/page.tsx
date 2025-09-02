import { createClient } from "@/lib/supabase/server"
import BlogClient from "./client"

async function getPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:post_categories (name),
      author:users (first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }
  return data
}

export default async function AdminBlogPage() {
  const posts = await getPosts()
  return <BlogClient posts={posts} />
}
