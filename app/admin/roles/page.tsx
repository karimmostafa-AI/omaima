import { createClient } from "@/lib/supabase/server"
import RolesClient from "./client"

async function getRoles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("roles")
    .select("*, permissions(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching roles:", error)
    return []
  }
  return data
}

import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminRolesPage() {
  const roles = await getRoles()
  return (
    <AdminGuard requiredPermissions={['manage-roles']}>
      <AdminLayout>
        <RolesClient roles={roles} />
      </AdminLayout>
    </AdminGuard>
  )
}
