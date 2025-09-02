"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, roleId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("users")
    .update({ role_id: roleId })
    .eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/customers")
  return { success: true }
}
