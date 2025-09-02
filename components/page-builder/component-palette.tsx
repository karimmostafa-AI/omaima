import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { COMPONENT_REGISTRY, ComponentDefinition } from '@/types/page-builder'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

interface ComponentPaletteProps {
  onComponentSelect?: (type: string) => void
}

export function ComponentPalette({ onComponentSelect }: ComponentPaletteProps) {
  const categories = {
    layout: 'Layout',
    content: 'Content', 
    media: 'Media',
    interactive: 'Interactive'
  }

  const groupedComponents = COMPONENT_REGISTRY.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = []
    }
    acc[component.category].push(component)
    return acc
  }, {} as Record<string, ComponentDefinition[]>)

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Components</h2>
        <p className="text-sm text-gray-600 mt-1">Drag components to the canvas</p>
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(categories).map(([categoryKey, categoryName]) => {
          const components = groupedComponents[categoryKey as keyof typeof categories] || []
          
          return (
            <div key={categoryKey} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                {categoryName}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {components.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                    onSelect={onComponentSelect}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DraggableComponentProps {
  component: ComponentDefinition
  onSelect?: (type: string) => void
}

function DraggableComponent({ component, onSelect }: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${component.type}`,
    data: {
      type: 'component',
      componentType: component.type,
      fromPalette: true,
    },
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  // Get the icon component
  const IconComponent = (Icons as any)[component.icon] || Icons.Square

  const handleClick = () => {
    if (onSelect) {
      onSelect(component.type)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'p-3 bg-white border border-gray-200 rounded-lg cursor-grab transition-all duration-200',
        'hover:border-blue-300 hover:shadow-sm',
        'active:cursor-grabbing active:scale-95',
        isDragging && 'opacity-50 shadow-lg z-50'
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
          <IconComponent className="w-4 h-4 text-blue-600" />
        </div>
        
        <div className="text-center">
          <p className="text-xs font-medium text-gray-900">{component.name}</p>
          <p className="text-xs text-gray-500 mt-1 leading-tight">
            {component.description}
          </p>
        </div>
      </div>
    </div>
  )
}