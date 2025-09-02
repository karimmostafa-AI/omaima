"use server"

import { createClient } from "@/lib/supabase/server"
import { RoleFormValues } from "@/components/role-form"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createRole(values: RoleFormValues) {
  const supabase = await createClient()

  const { data: newRole, error: roleError } = await supabase
    .from("roles")
    .insert({ name: values.name })
    .select("id")
    .single()

  if (roleError) {
    return { error: roleError.message }
  }

  if (values.permission_ids.length > 0) {
    const permissionsToInsert = values.permission_ids.map(permissionId => ({
      role_id: newRole.id,
      permission_id: permissionId,
    }))
    const { error: permissionsError } = await supabase
      .from("role_has_permissions")
      .insert(permissionsToInsert)
    if (permissionsError) {
      // Optionally, delete the role if permissions fail to insert
      await supabase.from("roles").delete().eq("id", newRole.id)
      return { error: `Failed to assign permissions: ${permissionsError.message}` }
    }
  }

  revalidatePath("/admin/roles")
  redirect("/admin/roles")
}

export async function updateRole(id: string, values: RoleFormValues) {
  const supabase = await createClient()

  const { error: roleError } = await supabase
    .from("roles")
    .update({ name: values.name })
    .eq("id", id)

  if (roleError) {
    return { error: roleError.message }
  }

  // Delete existing permissions
  const { error: deleteError } = await supabase
    .from("role_has_permissions")
    .delete()
    .eq("role_id", id)
  if (deleteError) {
    return { error: `Failed to update permissions (delete step): ${deleteError.message}` }
  }

  // Insert new permissions
  if (values.permission_ids.length > 0) {
    const permissionsToInsert = values.permission_ids.map(permissionId => ({
      role_id: id,
      permission_id: permissionId,
    }))
    const { error: permissionsError } = await supabase
      .from("role_has_permissions")
      .insert(permissionsToInsert)
    if (permissionsError) {
      return { error: `Failed to update permissions (insert step): ${permissionsError.message}` }
    }
  }

  revalidatePath("/admin/roles")
  revalidatePath(`/admin/roles/${id}/edit`)
  redirect("/admin/roles")
}

export async function deleteRole(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("roles").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/roles")
  redirect("/admin/roles")
}
