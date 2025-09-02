import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EditProductPageClient } from "./client"
import { Category } from "@/types/category"
import { Product } from "@/types/product"

async function getProduct(id: number): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("*, category:categories(*)").eq("id", id).single()
  if (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
  return data
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
  return data
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = parseInt(idString, 10)
  if (isNaN(id)) {
    notFound()
  }

  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return <EditProductPageClient product={product} categories={categories} />
}
