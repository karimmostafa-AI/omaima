import { PageBuilderData } from './page-builder'

export interface Page {
  id: number
  title: string
  slug: string
  content: string | null
  content_type: 'html' | 'builder'
  page_builder_data: PageBuilderData | null
  meta_description: string | null
  show_in_navigation: boolean
  navigation_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CreatePageData {
  title: string
  slug: string
  content?: string
  content_type?: 'html' | 'builder'
  page_builder_data?: PageBuilderData
  meta_description?: string
  show_in_navigation?: boolean
  navigation_order?: number
  is_published?: boolean
}

export interface UpdatePageData extends Partial<CreatePageData> {
  id: number
}