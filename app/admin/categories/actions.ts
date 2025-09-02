"use server"

import { createClient } from "@/lib/supabase/server"
import { CategoryFormValues } from "@/components/category-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategory(values: CategoryFormValues) {
  const supabase = await createClient()

  // Check if slug already exists
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", values.slug)
    .single()

  if (existingCategory) {
    return { error: "A category with this slug already exists" }
  }

  const { error } = await supabase.from("categories").insert({
    name: values.name,
    slug: values.slug,
    description: values.description,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(id: number, values: CategoryFormValues) {
  const supabase = await createClient()

  // Check if slug already exists (excluding current category)
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", values.slug)
    .neq("id", id)
    .single()

  if (existingCategory) {
    return { error: "A category with this slug already exists" }
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: values.name,
      slug: values.slug,
      description: values.description,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function deleteCategory(id: number) {
  const supabase = await createClient()

  // Check if category has products
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id)
    .limit(1)

  if (products && products.length > 0) {
    return { error: "Cannot delete category that contains products" }
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  return { success: true }
}