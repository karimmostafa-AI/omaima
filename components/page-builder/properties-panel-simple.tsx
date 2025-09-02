import React from 'react'
import { PageBuilderComponent } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { X, Settings } from 'lucide-react'

interface PropertiesPanelProps {
  component: PageBuilderComponent | null
  onComponentUpdate: (component: PageBuilderComponent) => void
  onClose: () => void
}

export function PropertiesPanel({ component, onComponentUpdate, onClose }: PropertiesPanelProps) {
  if (!component) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Selection</h3>
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    )
  }

  const updateComponent = (updates: Partial<PageBuilderComponent>) => {
    const updatedComponent = { ...component, ...updates }
    onComponentUpdate(updatedComponent)
  }

  const updateProperties = (updates: any) => {
    updateComponent({
      properties: { ...component.properties, ...updates }
    })
  }

  const updateStyles = (updates: Partial<typeof component.styles>) => {
    updateComponent({
      styles: { ...component.styles, ...updates }
    })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {component.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={(component.properties as any).content || ''}
                onChange={(e) => updateProperties({ content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                type="number"
                value={(component.properties as any).fontSize || 16}
                onChange={(e) => updateProperties({ fontSize: parseInt(e.target.value) || 16 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                type="color"
                value={(component.properties as any).color || '#000000'}
                onChange={(e) => updateProperties({ color: e.target.value })}
              />
            </div>
          </>
        )}

        {component.type === 'image' && (
          <>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={(component.properties as any).src || ''}
                onChange={(e) => updateProperties({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={(component.properties as any).alt || ''}
                onChange={(e) => updateProperties({ alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </>
        )}

        {component.type === 'button' && (
          <>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={(component.properties as any).text || ''}
                onChange={(e) => updateProperties({ text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={(component.properties as any).link?.url || ''}
                onChange={(e) => updateProperties({ 
                  link: { ...((component.properties as any).link || {}), url: e.target.value }
                })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={(component.properties as any).backgroundColor || '#000000'}
                onChange={(e) => updateProperties({ backgroundColor: e.target.value })}
              />
            </div>
          </>
        )}

        {component.type === 'hero' && (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={(component.properties as any).title || ''}
                onChange={(e) => updateProperties({ title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={(component.properties as any).subtitle || ''}
                onChange={(e) => updateProperties({ subtitle: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={(component.properties as any).backgroundColor || '#f8f9fa'}
                onChange={(e) => updateProperties({ backgroundColor: e.target.value })}
              />
            </div>
          </>
        )}

        {/* Spacing Controls */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Spacing</h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Margin</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Top"
                  value={component.styles.margin.top}
                  onChange={(e) => updateStyles({
                    margin: { ...component.styles.margin, top: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={component.styles.margin.right}
                  onChange={(e) => updateStyles({
                    margin: { ...component.styles.margin, right: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={component.styles.margin.bottom}
                  onChange={(e) => updateStyles({
                    margin: { ...component.styles.margin, bottom: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={component.styles.margin.left}
                  onChange={(e) => updateStyles({
                    margin: { ...component.styles.margin, left: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Top"
                  value={component.styles.padding.top}
                  onChange={(e) => updateStyles({
                    padding: { ...component.styles.padding, top: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Right"
                  value={component.styles.padding.right}
                  onChange={(e) => updateStyles({
                    padding: { ...component.styles.padding, right: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Bottom"
                  value={component.styles.padding.bottom}
                  onChange={(e) => updateStyles({
                    padding: { ...component.styles.padding, bottom: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
                <Input
                  type="number"
                  placeholder="Left"
                  value={component.styles.padding.left}
                  onChange={(e) => updateStyles({
                    padding: { ...component.styles.padding, left: parseInt(e.target.value) || 0 }
                  })}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label>Background Color</Label>
          <Input
            type="color"
            value={component.styles.backgroundColor || '#ffffff'}
            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
          />
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Input
            type="number"
            value={component.styles.borderRadius}
            onChange={(e) => updateStyles({ borderRadius: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
      </div>
    </div>
  )
}