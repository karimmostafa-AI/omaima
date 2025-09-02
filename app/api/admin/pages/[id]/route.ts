import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type PageParams = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(request: Request, context: PageParams) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("pages")
      .update(body)
      .eq("id", parseInt(id))
      .select()
      .single()

    if (error) {
      console.error("Error updating page:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in page PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: PageParams) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("pages")
      .update(body)
      .eq("id", parseInt(id))
      .select()
      .single()

    if (error) {
      console.error("Error updating page:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in page PATCH:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: PageParams) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", parseInt(id))

    if (error) {
      console.error("Error deleting page:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in page DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}