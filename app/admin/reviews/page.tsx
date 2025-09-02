import { createClient } from "@/lib/supabase/server"
import ReviewsClient from "./client"
import { AdminGuard } from '@/lib/auth/admin-guard'
import { AdminLayout } from '@/components/admin/AdminLayout'

async function getReviews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      product:products (name),
      user:users (first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
  return data
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()
  return (
    <AdminGuard requiredPermissions={['manage-reviews']}>
      <AdminLayout>
        <ReviewsClient reviews={reviews} />
      </AdminLayout>
    </AdminGuard>
  )
}
