import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"

async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      category:post_categories (name, slug),
      author:users (first_name, last_name, avatar_url)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
  return data
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <Link href={`/blog/category/${post.category?.slug}`} className="text-base font-semibold text-primary hover:text-primary/80">
            {post.category?.name}
          </Link>
          <h1 className="mt-2 block text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center justify-center">
            <div className="flex-shrink-0">
              {/* Author image */}
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
        <div className="mt-8 prose prose-lg mx-auto">
          {post.content}
        </div>
      </div>
    </div>
  )
}
