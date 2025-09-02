import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PageBuilderComponent } from '@/types/page-builder'
import { SortableComponent } from './sortable-component'
import { cn } from '@/lib/utils'

interface BuilderCanvasProps {
  components: PageBuilderComponent[]
  selectedComponentId?: string
  onComponentSelect: (component: PageBuilderComponent) => void
  onComponentEdit: (component: PageBuilderComponent) => void
  className?: string
}

export function BuilderCanvas({ 
  components, 
  selectedComponentId,
  onComponentSelect,
  onComponentEdit,
  className 
}: BuilderCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas',
      accepts: ['component'],
    },
  })

  // Filter root components (those without parentId)
  const rootComponents = components
    .filter(comp => !comp.parentId)
    .sort((a, b) => a.order - b.order)

  return (
    <div className={cn('flex-1 bg-white overflow-y-auto', className)}>
      {/* Canvas Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Page Canvas</h2>
            <p className="text-sm text-gray-600">
              {components.length} component{components.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[calc(100vh-200px)] p-6 transition-colors duration-200',
          isOver && 'bg-blue-50'
        )}
      >
        {rootComponents.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start Building Your Page
              </h3>
              <p className="text-gray-600 mb-4">
                Drag components from the left panel to start creating your page
              </p>
              <div className="text-sm text-gray-500">
                Try dragging a Container or Hero section to get started
              </div>
            </div>
          </div>
        ) : (
          <SortableContext 
            items={rootComponents.map(comp => comp.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {rootComponents.map((component) => (
                <SortableComponent
                  key={component.id}
                  component={component}
                  allComponents={components}
                  isSelected={selectedComponentId === component.id}
                  onSelect={onComponentSelect}
                  onEdit={onComponentEdit}
                />
              ))}
            </div>
          </SortableContext>
        )}
        
        {/* Drop indicator when dragging over empty canvas */}
        {isOver && rootComponents.length === 0 && (
          <div className="absolute inset-6 border-2 border-blue-400 border-dashed bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 text-center">
              <div className="text-lg font-medium mb-1">Drop component here</div>
              <div className="text-sm">Release to add component to your page</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}