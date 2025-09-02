import { createClient } from "@/lib/supabase/server"
import { Page, CreatePageData, UpdatePageData } from "@/types/page"

export async function getAllPages(): Promise<Page[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("navigation_order", { ascending: true })

    if (error) {
      console.error("Error fetching pages:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.warn("Supabase not configured, using empty pages")
    return []
  }
}

export async function getPublishedNavigationPages(): Promise<Page[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("is_published", true)
      .eq("show_in_navigation", true)
      .order("navigation_order", { ascending: true })

    if (error) {
      console.error("Error fetching navigation pages:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.warn("Supabase not configured, using empty navigation pages")
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      console.error(`Error fetching page with slug ${slug}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.warn("Supabase not configured, using null page")
    return null
  }
}

export async function getPageById(id: number): Promise<Page | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching page with id ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.warn("Supabase not configured, using null page")
    return null
  }
}

export async function createPage(pageData: CreatePageData): Promise<Page | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("pages")
      .insert(pageData)
      .select()
      .single()

    if (error) {
      console.error("Error creating page:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error creating page:", error)
    return null
  }
}

export async function updatePage(pageData: UpdatePageData): Promise<Page | null> {
  try {
    const supabase = await createClient()
    const { id, ...updateData } = pageData
    const { data, error } = await supabase
      .from("pages")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating page:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error updating page:", error)
    return null
  }
}

export async function deletePage(id: number): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting page:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting page:", error)
    return false
  }
}