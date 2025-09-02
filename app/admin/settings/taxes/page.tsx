import { createClient } from "@/lib/supabase/server"
import TaxesClient from "./client"
import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

async function getTaxes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("taxes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching taxes:", error)
    return []
  }
  return data
}

export default async function TaxesPage() {
  const taxes = await getTaxes()
  return (
    <AdminGuard requiredPermissions={['manage-settings']}>
      <AdminLayout>
        <TaxesClient taxes={taxes} />
      </AdminLayout>
    </AdminGuard>
  )
}
