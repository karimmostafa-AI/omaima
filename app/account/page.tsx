import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountProfile } from "@/components/account-profile"

export default async function AccountPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AccountProfile user={data.user} profile={profile} />
    </div>
  )
}
