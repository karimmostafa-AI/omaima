"use server"

import { createClient } from "@/lib/supabase/server"
import { PageFormValues } from "@/components/static-page-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPage(values: PageFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("pages").insert(values)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/static-pages")
  redirect("/admin/static-pages")
}

export async function updatePage(id: string, values: PageFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("pages").update(values).eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/static-pages")
  revalidatePath(`/admin/static-pages/${id}/edit`)
  redirect("/admin/static-pages")
}

export async function deletePage(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("pages").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/static-pages")
  redirect("/admin/static-pages")
}
