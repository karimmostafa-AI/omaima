import { getPageById } from "@/lib/supabase/pages"
import { PageForm } from "@/components/page-form"
import { notFound } from "next/navigation"

type EditPagePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const { id } = await params
  const page = await getPageById(parseInt(id))

  if (!page) {
    notFound()
  }

  return <PageForm page={page} mode="edit" />
}