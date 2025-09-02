"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Page } from "@/types/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, ExternalLink } from "lucide-react"
import Link from "next/link"

interface PageFormProps {
  page?: Page
  mode: "create" | "edit"
}

export function PageForm({ page, mode }: PageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    content_type: page?.content_type || "html",
    meta_description: page?.meta_description || "",
    show_in_navigation: page?.show_in_navigation || false,
    navigation_order: page?.navigation_order || 0,
    is_published: page?.is_published ?? true,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug only when creating new page
      slug: mode === "create" ? generateSlug(title) : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = mode === "create" 
        ? "/api/admin/pages"
        : `/api/admin/pages/${page?.id}`
      
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/pages")
        router.refresh()
      } else {
        const error = await response.text()
        alert(`Failed to ${mode} page: ${error}`)
      }
    } catch (error) {
      console.error(`Error ${mode}ing page:`, error)
      alert(`Failed to ${mode} page`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Create New Page" : `Edit ${page?.title}`}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL: /pages/{formData.slug}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Input
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="Brief description for SEO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as 'html' | 'builder' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML Editor</SelectItem>
                  <SelectItem value="builder">Page Builder</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.content_type === 'builder' 
                  ? 'Use the visual page builder to create your content'
                  : 'Write HTML content directly'
                }
              </p>
            </div>

            {formData.content_type === 'html' && (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Page content (HTML supported)"
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags to format your content.
                </p>
              </div>
            )}

            {formData.content_type === 'builder' && (
              <div className="space-y-2">
                <Label>Page Builder Content</Label>
                <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Visual Page Builder
                    </h3>
                    <p className="text-xs text-gray-600">
                      Save this page first, then use the Page Builder to create your content with drag-and-drop components.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_published: !!checked }))
                  }
                />
                <Label htmlFor="is_published">Published</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_in_navigation"
                  checked={formData.show_in_navigation}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, show_in_navigation: !!checked }))
                  }
                />
                <Label htmlFor="show_in_navigation">Show in Navigation</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="navigation_order">Navigation Order</Label>
                <Input
                  id="navigation_order"
                  type="number"
                  value={formData.navigation_order}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    navigation_order: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin/pages">Cancel</Link>
              </Button>
              
              {mode === "edit" && formData.content_type === "builder" && (
                <Button variant="outline" asChild>
                  <Link href={`/admin/pages/${page?.id}/builder`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Page Builder
                  </Link>
                </Button>
              )}
              
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : mode === "create" ? "Create Page" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}