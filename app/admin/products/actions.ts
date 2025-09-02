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
    base_price: values.base_price,
    category_id: values.category_id,
    images: typeof values.images === 'string' ? toArray(values.images) : (values.images || []),
    sizes: Array.isArray(values.sizes) ? values.sizes : toArray(values.sizes as string),
    colors: Array.isArray(values.colors) ? values.colors : toArray(values.colors as string),
    color_images: values.color_images || {},
    variants: values.variants || [],
  }
}

export async function createProduct(values: ProductFormValues) {
  const supabase = await createClient()
  const { variants, ...productData } = processFormValues(values)

  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select("id")
    .single()

  if (productError) {
    return { error: productError.message }
  }

  if (variants.length > 0) {
    const variantsToInsert = variants.map(variant => ({
      ...variant,
      product_id: newProduct.id,
    }))
    const { error: variantsError } = await supabase.from("product_variants").insert(variantsToInsert)
    if (variantsError) {
      // Optionally, delete the product if variants fail to insert
      await supabase.from("products").delete().eq("id", newProduct.id)
      return { error: `Failed to create variants: ${variantsError.message}` }
    }
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: number, values: ProductFormValues) {
  const supabase = await createClient()
  const { variants, ...productData } = processFormValues(values)

  const { error: productError } = await supabase.from("products").update(productData).eq("id", id)

  if (productError) {
    return { error: productError.message }
  }

  // Delete existing variants
  const { error: deleteError } = await supabase.from("product_variants").delete().eq("product_id", id)
  if (deleteError) {
    return { error: `Failed to update variants (delete step): ${deleteError.message}` }
  }

  // Insert new variants
  if (variants.length > 0) {
    const variantsToInsert = variants.map(variant => ({
      ...variant,
      product_id: id,
    }))
    const { error: variantsError } = await supabase.from("product_variants").insert(variantsToInsert)
    if (variantsError) {
      return { error: `Failed to update variants (insert step): ${variantsError.message}` }
    }
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
