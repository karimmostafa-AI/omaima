import React, { useState } from 'react'
import { PageBuilderComponent, TextComponent, ImageComponent, ButtonComponent, HeroComponent } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { X, Settings, Palette, Layout, Smartphone, Tablet, Monitor } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

interface PropertiesPanelProps {
  component: PageBuilderComponent | null
  onComponentUpdate: (component: PageBuilderComponent) => void
  onClose: () => void
}

export function PropertiesPanel({ component, onComponentUpdate, onClose }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('content')
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

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

  const updateProperties = (updates: Partial<typeof component.properties>) => {
    updateComponent({
      properties: { ...component.properties, ...updates }
    })
  }

  const updateStyles = (updates: Partial<typeof component.styles>) => {
    updateComponent({
      styles: { ...component.styles, ...updates }
    })
  }

  const updateMargin = (side: keyof typeof component.styles.margin, value: number) => {
    updateStyles({
      margin: { ...component.styles.margin, [side]: value }
    })
  }

  const updatePadding = (side: keyof typeof component.styles.padding, value: number) => {
    updateStyles({
      padding: { ...component.styles.padding, [side]: value }
    })
  }

  const updateBorder = (updates: Partial<typeof component.styles.border>) => {
    updateStyles({
      border: { ...component.styles.border, ...updates }
    })
  }

  const ColorPicker = ({ color, onChange, label }: { color: string, onChange: (color: string) => void, label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(showColorPicker === label ? null : label)}
        />
        <Input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
      {showColorPicker === label && (
        <div className="relative">
          <div className="absolute top-2 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <HexColorPicker color={color} onChange={onChange} />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowColorPicker(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
          <TabsTrigger value="content" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Palette className="w-3 h-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            <Layout className="w-3 h-3 mr-1" />
            Layout
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="content" className="p-4 space-y-4 m-0">
            {renderContentTab()}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4 m-0">
            {renderStyleTab()}
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4 m-0">
            {renderLayoutTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )

  function renderContentTab() {
    if (!component) return null
    
    switch (component.type) {
      case 'text': {
        const textComponent = component as TextComponent
        return (
          <>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={textComponent.properties.content}
                onChange={(e) => updateProperties({ content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                type="number"
                value={textComponent.properties.fontSize}
                onChange={(e) => updateProperties({ fontSize: parseInt(e.target.value) || 16 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={textComponent.properties.fontWeight}
                onValueChange={(value) => updateProperties({ fontWeight: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Text Align</Label>
              <Select
                value={textComponent.properties.textAlign}
                onValueChange={(value) => updateProperties({ textAlign: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPicker
              color={textComponent.properties.color}
              onChange={(color) => updateProperties({ color })}
              label="Text Color"
            />
          </>
        )
      }

      case 'image':
        return (
          <>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={component.properties.src || ''}
                onChange={(e) => updateProperties({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={component.properties.alt}
                onChange={(e) => updateProperties({ alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Width</Label>
                <Input
                  type="number"
                  value={component.properties.width || ''}
                  onChange={(e) => updateProperties({ width: parseInt(e.target.value) || undefined })}
                  placeholder="Auto"
                />
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={component.properties.height || ''}
                  onChange={(e) => updateProperties({ height: parseInt(e.target.value) || undefined })}
                  placeholder="Auto"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Object Fit</Label>
              <Select
                value={component.properties.objectFit}
                onValueChange={(value) => updateProperties({ objectFit: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="scale-down">Scale Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case 'button':
        return (
          <>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={component.properties.text}
                onChange={(e) => updateProperties({ text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input
                value={component.properties.link.url}
                onChange={(e) => updateProperties({ 
                  link: { ...component.properties.link, url: e.target.value }
                })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Variant</Label>
              <Select
                value={component.properties.variant}
                onValueChange={(value) => updateProperties({ variant: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Select
                value={component.properties.size}
                onValueChange={(value) => updateProperties({ size: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPicker
              color={component.properties.backgroundColor}
              onChange={(color) => updateProperties({ backgroundColor: color })}
              label="Background Color"
            />
            <ColorPicker
              color={component.properties.textColor}
              onChange={(color) => updateProperties({ textColor: color })}
              label="Text Color"
            />
          </>
        )

      case 'hero':
        return (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={component.properties.title}
                onChange={(e) => updateProperties({ title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={component.properties.subtitle}
                onChange={(e) => updateProperties({ subtitle: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                value={component.properties.backgroundImage || ''}
                onChange={(e) => updateProperties({ backgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Title Size</Label>
              <Select
                value={component.properties.titleSize}
                onValueChange={(value) => updateProperties({ titleSize: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="2xl">2X Large</SelectItem>
                  <SelectItem value="3xl">3X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select
                value={component.properties.alignment}
                onValueChange={(value) => updateProperties({ alignment: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Select
                value={component.properties.height}
                onValueChange={(value) => updateProperties({ height: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="screen">Full Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPicker
              color={component.properties.backgroundColor}
              onChange={(color) => updateProperties({ backgroundColor: color })}
              label="Background Color"
            />
            <ColorPicker
              color={component.properties.textColor}
              onChange={(color) => updateProperties({ textColor: color })}
              label="Text Color"
            />
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={component.properties.cta.enabled}
                  onCheckedChange={(checked) => updateProperties({
                    cta: { ...component.properties.cta, enabled: !!checked }
                  })}
                />
                <Label>Enable Call-to-Action Button</Label>
              </div>
              
              {component.properties.cta.enabled && (
                <>
                  <Input
                    value={component.properties.cta.text}
                    onChange={(e) => updateProperties({
                      cta: { ...component.properties.cta, text: e.target.value }
                    })}
                    placeholder="Button text"
                  />
                  <Input
                    value={component.properties.cta.link}
                    onChange={(e) => updateProperties({
                      cta: { ...component.properties.cta, link: e.target.value }
                    })}
                    placeholder="Button link"
                  />
                </>
              )}
            </div>
          </>
        )

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No content options available for this component type.</p>
          </div>
        )
    }
  }

  function renderStyleTab() {
    return (
      <>
        {/* Background */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Background</h4>
          <ColorPicker
            color={component.styles.backgroundColor || '#ffffff'}
            onChange={(color) => updateStyles({ backgroundColor: color })}
            label="Background Color"
          />
        </div>

        <Separator />

        {/* Border */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Border</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                type="number"
                value={component.styles.border.width}
                onChange={(e) => updateBorder({ width: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Select
                value={component.styles.border.style}
                onValueChange={(value) => updateBorder({ style: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ColorPicker
            color={component.styles.border.color}
            onChange={(color) => updateBorder({ color })}
            label="Border Color"
          />
        </div>

        <Separator />

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

        <Separator />

        {/* Shadow */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={component.styles.shadow.enabled}
              onCheckedChange={(checked) => updateStyles({
                shadow: { ...component.styles.shadow, enabled: !!checked }
              })}
            />
            <Label>Enable Shadow</Label>
          </div>

          {component.styles.shadow.enabled && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Blur</Label>
                  <Input
                    type="number"
                    value={component.styles.shadow.blur}
                    onChange={(e) => updateStyles({
                      shadow: { ...component.styles.shadow, blur: parseInt(e.target.value) || 0 }
                    })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spread</Label>
                  <Input
                    type="number"
                    value={component.styles.shadow.spread}
                    onChange={(e) => updateStyles({
                      shadow: { ...component.styles.shadow, spread: parseInt(e.target.value) || 0 }
                    })}
                    min="0"
                  />
                </div>
              </div>
              <ColorPicker
                color={component.styles.shadow.color}
                onChange={(color) => updateStyles({
                  shadow: { ...component.styles.shadow, color }
                })}
                label="Shadow Color"
              />
              <div className="space-y-2">
                <Label>Opacity</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={component.styles.shadow.opacity}
                  onChange={(e) => updateStyles({
                    shadow: { ...component.styles.shadow, opacity: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  function renderLayoutTab() {
    return (
      <>
        {/* Margin */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Margin</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Top</Label>
              <Input
                type="number"
                value={component.styles.margin.top}
                onChange={(e) => updateMargin('top', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Right</Label>
              <Input
                type="number"
                value={component.styles.margin.right}
                onChange={(e) => updateMargin('right', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bottom</Label>
              <Input
                type="number"
                value={component.styles.margin.bottom}
                onChange={(e) => updateMargin('bottom', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Left</Label>
              <Input
                type="number"
                value={component.styles.margin.left}
                onChange={(e) => updateMargin('left', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Padding */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Padding</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Top</Label>
              <Input
                type="number"
                value={component.styles.padding.top}
                onChange={(e) => updatePadding('top', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Right</Label>
              <Input
                type="number"
                value={component.styles.padding.right}
                onChange={(e) => updatePadding('right', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bottom</Label>
              <Input
                type="number"
                value={component.styles.padding.bottom}
                onChange={(e) => updatePadding('bottom', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Left</Label>
              <Input
                type="number"
                value={component.styles.padding.left}
                onChange={(e) => updatePadding('left', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Responsive Display */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Responsive Display</h4>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <Label className="flex-1">Mobile</Label>
              <Select
                value={component.styles.responsive.mobile.display}
                onValueChange={(value) => updateStyles({
                  responsive: {
                    ...component.styles.responsive,
                    mobile: { ...component.styles.responsive.mobile, display: value as any }
                  }
                })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Show</SelectItem>
                  <SelectItem value="none">Hide</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Tablet className="w-4 h-4 text-gray-500" />
              <Label className="flex-1">Tablet</Label>
              <Select
                value={component.styles.responsive.tablet.display}
                onValueChange={(value) => updateStyles({
                  responsive: {
                    ...component.styles.responsive,
                    tablet: { ...component.styles.responsive.tablet, display: value as any }
                  }
                })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Show</SelectItem>
                  <SelectItem value="none">Hide</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-gray-500" />
              <Label className="flex-1">Desktop</Label>
              <Select
                value={component.styles.responsive.desktop.display}
                onValueChange={(value) => updateStyles({
                  responsive: {
                    ...component.styles.responsive,
                    desktop: { ...component.styles.responsive.desktop, display: value as any }
                  }
                })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Show</SelectItem>
                  <SelectItem value="none">Hide</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </>
    )
  }
}