"use client"

import { useState } from "react"
import { Page } from "@/types/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, Plus, Edit, Trash2, Search, Eye, EyeOff, Navigation, Paintbrush } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PagesClientProps {
  pages: Page[]
}

export default function PagesClient({ pages: initialPages }: PagesClientProps) {
  const [pages, setPages] = useState(initialPages)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPages(pages.filter(page => page.id !== id))
      } else {
        alert("Failed to delete page")
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      alert("Failed to delete page")
    }
  }

  const handleTogglePublished = async (page: Page) => {
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !page.is_published
        }),
      })

      if (response.ok) {
        const updatedPage = await response.json()
        setPages(pages.map(p => p.id === page.id ? updatedPage : p))
      } else {
        alert("Failed to update page")
      }
    } catch (error) {
      console.error("Error updating page:", error)
      alert("Failed to update page")
    }
  }

  const handleToggleNavigation = async (page: Page) => {
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          show_in_navigation: !page.show_in_navigation
        }),
      })

      if (response.ok) {
        const updatedPage = await response.json()
        setPages(pages.map(p => p.id === page.id ? updatedPage : p))
        // Refresh the page to update navigation
        router.refresh()
      } else {
        alert("Failed to update page")
      }
    } catch (error) {
      console.error("Error updating page:", error)
      alert("Failed to update page")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pages Management</h1>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Page
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>All Pages ({filteredPages.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Navigation</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      {page.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{page.slug}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublished(page)}
                        className="flex items-center space-x-1"
                      >
                        {page.is_published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span className="text-green-600">Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span className="text-gray-500">Draft</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleNavigation(page)}
                        className="flex items-center space-x-1"
                      >
                        {page.show_in_navigation ? (
                          <>
                            <Navigation className="h-3 w-3" />
                            <span className="text-blue-600">Shown</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="h-3 w-3 opacity-50" />
                            <span className="text-gray-500">Hidden</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{page.navigation_order}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(page.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/pages/${page.id}/builder`}>
                                  <Paintbrush className="h-3 w-3" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Page Builder (Drag & Drop)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/pages/${page.id}/edit`}>
                                  <Edit className="h-3 w-3" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Text Editor (HTML)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pages found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm ? "Try a different search term." : "Create your first custom page to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}