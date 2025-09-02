import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageBuilderComponent } from '@/types/page-builder'
import { ComponentRenderer } from './component-renderer'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Settings } from 'lucide-react'

interface SortableComponentProps {
  component: PageBuilderComponent
  allComponents: PageBuilderComponent[]
  isSelected: boolean
  onSelect: (component: PageBuilderComponent) => void
  onEdit: (component: PageBuilderComponent) => void
  onDelete?: (componentId: string) => void
  onDuplicate?: (component: PageBuilderComponent) => void
}

export function SortableComponent({
  component,
  allComponents,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      component,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSelect = () => {
    onSelect(component)
  }

  const handleEdit = () => {
    onEdit(component)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(component.id)
    }
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDuplicate) {
      onDuplicate(component)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isDragging && 'opacity-50 z-50'
      )}
      onClick={handleSelect}
    >
      {/* Component Toolbar */}
      {isSelected && (
        <div className="absolute -top-10 left-0 z-20 bg-white border border-gray-200 rounded-md shadow-sm flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleEdit}
          >
            <Settings className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleDuplicate}
          >
            <Copy className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-red-600 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          
          {/* Drag Handle */}
          <div
            className="h-8 px-2 flex items-center cursor-grab active:cursor-grabbing border-l border-gray-200"
            {...listeners}
          >
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5a2 2 0 100 4 2 2 0 000-4zM8 11a2 2 0 100 4 2 2 0 000-4zM8 17a2 2 0 100 4 2 2 0 000-4zM16 5a2 2 0 100 4 2 2 0 000-4zM16 11a2 2 0 100 4 2 2 0 000-4zM16 17a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-200',
          !isSelected && 'group-hover:bg-blue-50 group-hover:border-2 group-hover:border-blue-300 group-hover:border-dashed'
        )}
      />

      {/* Component Content */}
      <div className="relative">
        <ComponentRenderer
          component={component}
          components={allComponents}
          isEditing={true}
          onEdit={onEdit}
        />
      </div>

      {/* Component Label (shown on hover) */}
      {!isSelected && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
        </div>
      )}
    </div>
  )
}