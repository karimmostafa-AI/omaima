"use server"

import { createClient } from "@/lib/supabase/server"
import { ProductFormValues } from "@/components/product-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function processFormValues(values: ProductFormValues) {
  // Helper to convert comma-separated strings to arrays
  const toArray = (str: string | undefined) => str ? str.split(",").map(s => s.trim()).filter(Boolean) : []

  return {
    name: values.name,
    slug: values.slug,
    description: values.description,
    price: values.price,
    category_id: values.category_id,
    stock: values.stock,
    images: typeof values.images === 'string' ? toArray(values.images) : (values.images || []),
    sizes: Array.isArray(values.sizes) ? values.sizes : toArray(values.sizes as string),
    colors: Array.isArray(values.colors) ? values.colors : toArray(values.colors as string),
    color_images: values.color_images || {},
  }
}

export async function createProduct(values: ProductFormValues) {
  const supabase = await createClient()
  const processedValues = processFormValues(values)

  const { error } = await supabase.from("products").insert(processedValues)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: number, values: ProductFormValues) {
  const supabase = await createClient()
  const processedValues = processFormValues(values)

  const { error } = await supabase.from("products").update(processedValues).eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}/edit`)
  redirect("/admin/products")
}

export async function deleteProduct(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}
