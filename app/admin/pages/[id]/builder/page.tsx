import { getPageById } from "@/lib/supabase/pages"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import PageBuilderClient from "./client"

type BuilderPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { id } = await params
  
  // Double-check admin authentication for page builder access
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/auth/login?redirect=/admin/pages")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // Only allow admin users to access the page builder
  if (!profile || profile.role !== "admin") {
    notFound()
  }
  
  // Validate that id is a number
  const pageId = parseInt(id)
  if (isNaN(pageId)) {
    notFound()
  }

  const page = await getPageById(pageId)

  if (!page) {
    notFound()
  }

  return <PageBuilderClient page={page} />
}