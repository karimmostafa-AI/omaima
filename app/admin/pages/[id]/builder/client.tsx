'use client'

import { PageBuilder } from "@/components/page-builder/page-builder"
import { Page } from "@/types/page"
import { useState } from "react"
import { PageBuilderData } from "@/types/page-builder"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PageBuilderClientProps {
  page: Page
}

export default function PageBuilderClient({ page }: PageBuilderClientProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [builderData, setBuilderData] = useState<PageBuilderData>(
    page.page_builder_data || {
      version: '1.0',
      components: [],
      metadata: {}
    }
  )

  const handleBuilderSave = async (newData: PageBuilderData) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: 'builder',
          page_builder_data: newData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save page')
      }

      setBuilderData(newData)
      toast.success('Page saved successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new window
    window.open(`/pages/${page.slug}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/pages">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pages
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Editing: {page.title}</h1>
              <p className="text-sm text-gray-600">Page Builder Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-sm text-gray-600">Saving...</span>
            )}
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Page Builder */}
      <PageBuilder
        initialData={builderData}
        onSave={handleBuilderSave}
        onPreview={handlePreview}
        enablePreviewMode={true}
        autoSave={true}
        enhancedPalette={true}
        showResponsiveTester={true}
        className="min-h-[calc(100vh-80px)]"
      />
    </div>
  )
}