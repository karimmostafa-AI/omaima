import React, { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { COMPONENT_REGISTRY, ComponentDefinition } from '@/types/page-builder'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search,
  LayoutGrid,
  Type,
  Image,
  MousePointer,
  Monitor,
  Square,
  Minus,
  Star,
  Grid3X3,
  Palette
} from 'lucide-react'
import * as Icons from 'lucide-react'

interface EnhancedComponentPaletteProps {
  onComponentSelect?: (type: string) => void
}

export function EnhancedComponentPalette({ onComponentSelect }: EnhancedComponentPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = {
    all: { name: 'All Components', icon: Grid3X3, color: 'text-gray-600' },
    layout: { name: 'Layout', icon: LayoutGrid, color: 'text-blue-600' },
    content: { name: 'Content', icon: Type, color: 'text-green-600' },
    media: { name: 'Media', icon: Image, color: 'text-purple-600' },
    interactive: { name: 'Interactive', icon: MousePointer, color: 'text-orange-600' }
  }

  const popularComponents = ['hero', 'text', 'button', 'container']

  const filteredComponents = useMemo(() => {
    return COMPONENT_REGISTRY.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const groupedComponents = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredComponents }
    }
    
    return filteredComponents.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentDefinition[]>)
  }, [filteredComponents, selectedCategory])

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categories</h3>
          <div className="flex flex-wrap gap-1">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    'text-xs px-2 py-1 h-auto',
                    selectedCategory === key ? '' : category.color
                  )}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Popular Components */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popular</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {popularComponents.map((componentType) => {
                const component = COMPONENT_REGISTRY.find(c => c.type === componentType)
                if (!component) return null
                return (
                  <QuickAddComponent
                    key={component.type}
                    component={component}
                    onSelect={onComponentSelect}
                    variant="compact"
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Components List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedComponents).map(([categoryKey, components]) => {
            if (components.length === 0) return null
            
            const categoryInfo = categories[categoryKey as keyof typeof categories]
            const Icon = categoryInfo?.icon || Grid3X3
            
            return (
              <div key={categoryKey} className="space-y-3">
                {selectedCategory === 'all' && (
                  <div className="flex items-center space-x-2">
                    <Icon className={cn('w-4 h-4', categoryInfo?.color || 'text-gray-600')} />
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {categoryInfo?.name || categoryKey}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {components.length}
                    </Badge>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-2">
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
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No components found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </ScrollArea>
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

  // Get the icon component dynamically
  const IconComponent = (Icons as any)[component.icon] || Square

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200',
        'hover:bg-gray-100 hover:border-gray-300 cursor-grab active:cursor-grabbing',
        'transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg scale-105'
      )}
      onClick={() => onSelect?.(component.type)}
    >
      <div className={cn(
        'w-8 h-8 rounded-md flex items-center justify-center',
        'bg-white border border-gray-200'
      )}>
        <IconComponent className="w-4 h-4 text-gray-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {component.name}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {component.description}
        </p>
      </div>
    </div>
  )
}

interface QuickAddComponentProps {
  component: ComponentDefinition
  onSelect?: (type: string) => void
  variant?: 'default' | 'compact'
}

function QuickAddComponent({ component, onSelect, variant = 'default' }: QuickAddComponentProps) {
  const IconComponent = (Icons as any)[component.icon] || Square

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        className="h-auto p-2 flex flex-col items-center space-y-1"
        onClick={() => onSelect?.(component.type)}
      >
        <IconComponent className="w-4 h-4" />
        <span className="text-xs">{component.name}</span>
      </Button>
    )
  }

  return (
    <DraggableComponent component={component} onSelect={onSelect} />
  )
}