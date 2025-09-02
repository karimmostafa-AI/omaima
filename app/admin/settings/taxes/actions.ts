"use server"

import { createClient } from "@/lib/supabase/server"
import { TaxFormValues } from "@/components/tax-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTax(values: TaxFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("taxes").insert(values)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/settings/taxes")
  redirect("/admin/settings/taxes")
}

export async function updateTax(id: string, values: TaxFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("taxes").update(values).eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/settings/taxes")
  revalidatePath(`/admin/settings/taxes/${id}/edit`)
  redirect("/admin/settings/taxes")
}

export async function deleteTax(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("taxes").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/settings/taxes")
  redirect("/admin/settings/taxes")
}
