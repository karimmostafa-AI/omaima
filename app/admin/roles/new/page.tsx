import { NewRolePageClient } from "./client"
import { createClient } from "@/lib/supabase/server"
import { Permission } from "@/types/role"

async function getPermissions(): Promise<Permission[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("permissions").select("*").order("name")
  if (error) {
    console.error("Failed to fetch permissions:", error)
    return []
  }
  return data
}

export default async function NewRolePage() {
  const permissions = await getPermissions()
  return <NewRolePageClient permissions={permissions} />
}
