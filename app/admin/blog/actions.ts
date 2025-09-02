"use server"

import { createClient } from "@/lib/supabase/server"
import { PostFormValues } from "@/components/post-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPost(values: PostFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("posts").insert(values)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function updatePost(id: string, values: PostFormValues) {
  const supabase = await createClient()

  const { error } = await supabase.from("posts").update(values).eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/blog")
  revalidatePath(`/admin/blog/${id}/edit`)
  redirect("/admin/blog")
}

export async function deletePost(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}
