import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

async function getPublishedPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:post_categories (name, slug),
      author:users (first_name, last_name)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching published posts:", error)
    return []
  }
  return data
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Our Blog
      </h1>
      <p className="mt-6 text-xl text-muted-foreground">
        Insights, news, and updates from our team.
      </p>
      <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
        {posts.map((post) => (
          <div key={post.id}>
            <div>
              <Link href={`/blog/${post.slug}`} className="inline-block">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {post.category?.name}
                </span>
              </Link>
            </div>
            <Link href={`/blog/${post.slug}`} className="block mt-4">
              <p className="text-xl font-semibold text-foreground">{post.title}</p>
              <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>
            </Link>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <span className="sr-only">{post.author?.first_name} {post.author?.last_name}</span>
                {/* Add author image here if available */}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">
                  {post.author?.first_name} {post.author?.last_name}
                </p>
                <div className="flex space-x-1 text-sm text-muted-foreground">
                  <time dateTime={post.published_at}>{format(new Date(post.published_at!), "PPP")}</time>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
