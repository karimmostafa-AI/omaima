import React from 'react'
import { PageBuilderData, PageBuilderComponent } from '@/types/page-builder'
import { ComponentRenderer } from './component-renderer'

interface PageRendererProps {
  data: PageBuilderData
  className?: string
}

export function PageRenderer({ data, className }: PageRendererProps) {
  if (!data || !data.components || data.components.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No content to display</p>
        </div>
      </div>
    )
  }

  // Filter and sort root components (those without parentId)
  const rootComponents = data.components
    .filter(component => !component.parentId)
    .sort((a, b) => a.order - b.order)

  return (
    <div className={className}>
      {rootComponents.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          components={data.components}
          isEditing={false}
        />
      ))}
    </div>
  )
}

// Hook for fetching and rendering page data
export function usePageData(pageId: string | number) {
  // This would typically fetch from your API
  // For now, we'll return a simple structure
  return {
    data: null,
    loading: true,
    error: null,
  }
}

// Static page renderer for server-side rendering
export function StaticPageRenderer({ 
  data, 
  className 
}: { 
  data: PageBuilderData 
  className?: string 
}) {
  return <PageRenderer data={data} className={className} />
}