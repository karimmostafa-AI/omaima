import { getAllPages } from "@/lib/supabase/pages"
import PagesClient from "./client"

export default async function AdminPagesPage() {
  const pages = await getAllPages()

  return <PagesClient pages={pages} />
}