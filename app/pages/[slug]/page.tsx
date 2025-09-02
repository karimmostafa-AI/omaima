import { getPageBySlug } from "@/lib/supabase/pages"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { PageRenderer } from "@/components/page-builder/page-renderer"

type DynamicPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return {
      title: "Page Not Found"
    }
  }

  return {
    title: page.title,
    description: page.meta_description || page.title
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  // Handle page builder content
  if (page.content_type === 'builder' && page.page_builder_data) {
    return (
      <div className="min-h-screen">
        <PageRenderer 
          data={page.page_builder_data} 
          className="w-full"
        />
      </div>
    )
  }

  // Handle traditional HTML content
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">{page.title}</h1>
          <div 
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content || "" }}
          />
        </div>
      </div>
    </div>
  )
}