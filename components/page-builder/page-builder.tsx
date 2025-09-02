import React, { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { 
  PageBuilderComponent, 
  PageBuilderData, 
  createDefaultComponent,
  generateComponentId
} from '@/types/page-builder'
import { ComponentPalette } from './component-palette'
import { EnhancedComponentPalette } from './enhanced-component-palette'
import { ResponsiveTester } from './responsive-tester'
import { BuilderCanvas } from './builder-canvas'
import { PropertiesPanel } from './properties-panel'
import { ComponentRenderer } from './component-renderer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eye, Save, Undo, Redo, Smartphone, Tablet, Monitor, Split, Maximize2, Settings2 } from 'lucide-react'

interface PageBuilderProps {
  initialData?: PageBuilderData
  onSave?: (data: PageBuilderData) => void
  onPreview?: () => void
  className?: string
  enablePreviewMode?: boolean
  autoSave?: boolean
  enhancedPalette?: boolean
  showResponsiveTester?: boolean
}

export function PageBuilder({ 
  initialData, 
  onSave, 
  onPreview,
  className,
  enablePreviewMode = true,
  autoSave = false,
  enhancedPalette = true,
  showResponsiveTester = true
}: PageBuilderProps) {
  const [components, setComponents] = useState<PageBuilderComponent[]>(
    initialData?.components || []
  )
  const [selectedComponent, setSelectedComponent] = useState<PageBuilderComponent | null>(null)
  const [draggedComponent, setDraggedComponent] = useState<PageBuilderComponent | null>(null)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [history, setHistory] = useState<PageBuilderComponent[][]>([components])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // History management
  const addToHistory = useCallback((newComponents: PageBuilderComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newComponents])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setComponents([...history[newIndex]])
      setSelectedComponent(null)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setComponents([...history[newIndex]])
      setSelectedComponent(null)
    }
  }, [history, historyIndex])

  // Component management
  const addComponent = useCallback((type: string, parentId?: string, insertIndex?: number) => {
    const newComponent = createDefaultComponent(type)
    if (!newComponent) return

    if (parentId) {
      newComponent.parentId = parentId
    }

    // Set order based on insertion position
    if (insertIndex !== undefined) {
      const siblingComponents = components.filter(comp => comp.parentId === parentId)
      newComponent.order = insertIndex
      
      // Update order of subsequent components
      const updatedComponents = components.map(comp => {
        if (comp.parentId === parentId && comp.order >= insertIndex) {
          return { ...comp, order: comp.order + 1 }
        }
        return comp
      })
      
      const newComponents = [...updatedComponents, newComponent]
      setComponents(newComponents)
      addToHistory(newComponents)
    } else {
      // Add to end
      const maxOrder = Math.max(
        ...components
          .filter(comp => comp.parentId === parentId)
          .map(comp => comp.order),
        -1
      )
      newComponent.order = maxOrder + 1
      
      const newComponents = [...components, newComponent]
      setComponents(newComponents)
      addToHistory(newComponents)
    }

    setSelectedComponent(newComponent)
  }, [components, addToHistory])

  const updateComponent = useCallback((updatedComponent: PageBuilderComponent) => {
    const newComponents = components.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    )
    setComponents(newComponents)
    setSelectedComponent(updatedComponent)
    addToHistory(newComponents)
  }, [components, addToHistory])

  const deleteComponent = useCallback((componentId: string) => {
    const newComponents = components.filter(comp => 
      comp.id !== componentId && comp.parentId !== componentId
    )
    setComponents(newComponents)
    setSelectedComponent(null)
    addToHistory(newComponents)
  }, [components, addToHistory])

  const duplicateComponent = useCallback((component: PageBuilderComponent) => {
    const newComponent = {
      ...component,
      id: generateComponentId(),
      order: component.order + 1,
    }

    // Update order of subsequent components
    const updatedComponents = components.map(comp => {
      if (comp.parentId === component.parentId && comp.order > component.order) {
        return { ...comp, order: comp.order + 1 }
      }
      return comp
    })

    const newComponents = [...updatedComponents, newComponent]
    setComponents(newComponents)
    setSelectedComponent(newComponent)
    addToHistory(newComponents)
  }, [components, addToHistory])

  const moveComponent = useCallback((activeId: string, overId: string) => {
    const activeIndex = components.findIndex(comp => comp.id === activeId)
    const overIndex = components.findIndex(comp => comp.id === overId)

    if (activeIndex === -1 || overIndex === -1) return

    const newComponents = arrayMove(components, activeIndex, overIndex).map((comp, index) => ({
      ...comp,
      order: index,
    }))

    setComponents(newComponents)
    addToHistory(newComponents)
  }, [components, addToHistory])

  // Drag and drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    
    if (active.data.current?.fromPalette) {
      const componentType = active.data.current.componentType
      const newComponent = createDefaultComponent(componentType)
      setDraggedComponent(newComponent)
    } else {
      const component = components.find(comp => comp.id === active.id)
      setDraggedComponent(component || null)
    }
  }, [components])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over logic if needed
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setDraggedComponent(null)

    if (!over) return

    // Handle dropping from palette
    if (active.data.current?.fromPalette) {
      const componentType = active.data.current.componentType
      
      if (over.id === 'canvas') {
        addComponent(componentType)
      } else {
        // Check if dropping on a container
        const targetComponent = components.find(comp => comp.id === over.id)
        if (targetComponent?.type === 'container') {
          addComponent(componentType, targetComponent.id)
        } else {
          addComponent(componentType)
        }
      }
      return
    }

    // Handle reordering existing components
    if (active.id !== over.id) {
      moveComponent(active.id as string, over.id as string)
    }
  }, [components, addComponent, moveComponent])

  // Save functionality with auto-save
  const handleSave = useCallback(async (silent = false) => {
    if (silent) setIsAutoSaving(true)
    
    const pageData: PageBuilderData = {
      version: '1.0',
      components,
      metadata: {
        lastModified: new Date().toISOString(),
      },
    }

    if (onSave) {
      try {
        await onSave(pageData)
      } catch (error) {
        console.error('Failed to save:', error)
      } finally {
        if (silent) setIsAutoSaving(false)
      }
    }
  }, [components, onSave])

  // Auto-save effect
  useEffect(() => {
    if (autoSave && components.length > 0) {
      const timer = setTimeout(() => {
        handleSave(true)
      }, 2000) // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timer)
    }
  }, [components, autoSave, handleSave])

  // Viewport mode classes
  const viewportClasses = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto',
  }

  return (
    <div className={cn('h-screen flex bg-gray-100', className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Component Palette */}
        {enhancedPalette ? (
          <EnhancedComponentPalette onComponentSelect={addComponent} />
        ) : (
          <ComponentPalette onComponentSelect={addComponent} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Undo/Redo */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={historyIndex === 0}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>

                {/* Viewport Mode */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                  <Button
                    variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewportMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {enablePreviewMode && (
                  <Button
                    variant={previewMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? <Maximize2 className="w-4 h-4 mr-2" /> : <Split className="w-4 h-4 mr-2" />}
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                )}
                <Button variant="outline" onClick={onPreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Open Preview
                </Button>
                <div className="flex items-center space-x-2">
                  {isAutoSaving && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <Settings2 className="w-3 h-3 mr-1 animate-spin" />
                      Auto-saving...
                    </span>
                  )}
                  <Button onClick={() => handleSave(false)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas and Preview */}
          <div className={cn(
            'flex-1 overflow-hidden',
            previewMode ? 'flex' : 'block'
          )}>
            {/* Builder Canvas */}
            <div className={cn(
              previewMode ? 'w-1/2 border-r border-gray-200' : 'w-full',
              viewportClasses[viewportMode]
            )}>
              <BuilderCanvas
                components={components}
                selectedComponentId={selectedComponent?.id}
                onComponentSelect={setSelectedComponent}
                onComponentEdit={setSelectedComponent}
              />
            </div>
            
            {/* Live Preview */}
            {previewMode && (
              <div className="w-1/2 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                    <div className="text-xs text-gray-500">
                      {viewportMode === 'desktop' && 'Desktop View'}
                      {viewportMode === 'tablet' && 'Tablet View'} 
                      {viewportMode === 'mobile' && 'Mobile View'}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  'min-h-full',
                  viewportClasses[viewportMode]
                )}>
                  <div className="space-y-0">
                    {components
                      .filter(comp => !comp.parentId)
                      .sort((a, b) => a.order - b.order)
                      .map((component) => (
                        <ComponentRenderer
                          key={component.id}
                          component={component}
                          components={components}
                          isEditing={false}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="flex">
          <PropertiesPanel
            component={selectedComponent}
            onComponentUpdate={updateComponent}
            onClose={() => setSelectedComponent(null)}
          />
          
          {/* Responsive Tester */}
          {showResponsiveTester && (
            <div className="border-l border-gray-200">
              <ResponsiveTester
                viewportMode={viewportMode}
                onViewportChange={setViewportMode}
              />
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedComponent && (
            <div className="opacity-75 bg-white border border-gray-300 rounded-lg shadow-lg">
              <ComponentRenderer
                component={draggedComponent}
                isEditing={false}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}