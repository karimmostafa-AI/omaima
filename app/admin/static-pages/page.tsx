import { createClient } from "@/lib/supabase/server"
import StaticPagesClient from "./client"

async function getPages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pages:", error)
    return []
  }
  return data
}

export default async function AdminStaticPagesPage() {
  const pages = await getPages()
  return <StaticPagesClient pages={pages} />
}
