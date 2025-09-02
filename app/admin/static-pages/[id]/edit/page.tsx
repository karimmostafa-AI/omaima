import { EditStaticPageClient } from "./client"
import { createClient } from "@/lib/supabase/server"
import { Page } from "@/types/page"
import { notFound } from "next/navigation"

async function getPage(id: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).single()
  if (error) {
    console.error("Failed to fetch page:", error)
    return null
  }
  return data
}

export default async function EditStaticPage({ params }: { params: { id: string } }) {
  const page = await getPage(params.id)

  if (!page) {
    notFound()
  }

  return <EditStaticPageClient page={page} />
}
