import { createClient } from "@/lib/supabase/server"
import { NewProductPageClient } from "./client"
import { Category } from "@/types/category"

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
  return data
}

export default async function NewProductPage() {
  const categories = await getCategories()
  return <NewProductPageClient categories={categories} />
}
