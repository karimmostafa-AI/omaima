import React from 'react'
import { PageBuilderComponent } from '@/types/page-builder'
import { TextRenderer } from './text-renderer'
import { ImageRenderer } from './image-renderer'
import { ButtonRenderer } from './button-renderer'
import { HeroRenderer } from './hero-renderer'
import { CardRenderer } from './card-renderer'
import { ContainerRenderer } from './container-renderer'
import { SpacerRenderer } from './spacer-renderer'

interface ComponentRendererProps {
  component: PageBuilderComponent
  components?: PageBuilderComponent[]
  isEditing?: boolean
  onEdit?: (component: PageBuilderComponent) => void
  className?: string
}

export function ComponentRenderer({ 
  component, 
  components = [],
  isEditing = false, 
  onEdit,
  className 
}: ComponentRendererProps) {
  
  // Get child components for containers
  const childComponents = components.filter(comp => comp.parentId === component.id)
  
  switch (component.type) {
    case 'text':
      return (
        <TextRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    case 'image':
      return (
        <ImageRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    case 'button':
      return (
        <ButtonRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    case 'hero':
      return (
        <HeroRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    case 'card':
      return (
        <CardRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    case 'container':
      return (
        <ContainerRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        >
          {childComponents
            .sort((a, b) => a.order - b.order)
            .map((childComponent) => (
              <ComponentRenderer
                key={childComponent.id}
                component={childComponent}
                components={components}
                isEditing={isEditing}
                onEdit={onEdit}
              />
            ))}
        </ContainerRenderer>
      )
    
    case 'spacer':
      return (
        <SpacerRenderer
          component={component}
          isEditing={isEditing}
          onEdit={onEdit}
          className={className}
        />
      )
    
    default:
      if (isEditing) {
        return (
          <div className="p-4 border-2 border-red-300 bg-red-50 text-red-600 rounded">
            Unknown component type: {(component as any).type}
          </div>
        )
      }
      return null
  }
}