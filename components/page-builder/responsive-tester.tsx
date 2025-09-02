import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Maximize, 
  Settings,
  Eye
} from 'lucide-react'

interface ResponsiveTesterProps {
  viewportMode: 'desktop' | 'tablet' | 'mobile'
  onViewportChange: (mode: 'desktop' | 'tablet' | 'mobile') => void
  className?: string
}

const DEVICE_PRESETS = {
  mobile: [
    { name: 'iPhone 14 Pro', width: 393, height: 852 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'Samsung Galaxy S23', width: 360, height: 780 },
    { name: 'Google Pixel 7', width: 412, height: 915 },
  ],
  tablet: [
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'Surface Pro', width: 912, height: 1368 },
    { name: 'Galaxy Tab S8', width: 753, height: 1037 },
  ],
  desktop: [
    { name: 'MacBook Air 13"', width: 1440, height: 900 },
    { name: 'MacBook Pro 16"', width: 1728, height: 1117 },
    { name: 'iMac 24"', width: 1920, height: 1080 },
    { name: 'Dell UltraSharp', width: 2560, height: 1440 },
  ]
}

export function ResponsiveTester({ 
  viewportMode, 
  onViewportChange, 
  className 
}: ResponsiveTesterProps) {
  const [customWidth, setCustomWidth] = useState(1200)
  const [customHeight, setCustomHeight] = useState(800)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  const handlePresetSelect = (preset: typeof DEVICE_PRESETS.mobile[0]) => {
    setCustomWidth(preset.width)
    setCustomHeight(preset.height)
    setSelectedPreset(preset.name)
    setIsCustomMode(true)
  }

  const resetToDefault = () => {
    setIsCustomMode(false)
    setSelectedPreset('')
    // Reset to default viewport sizes
    switch (viewportMode) {
      case 'mobile':
        setCustomWidth(375)
        setCustomHeight(667)
        break
      case 'tablet':
        setCustomWidth(768)
        setCustomHeight(1024)
        break
      case 'desktop':
        setCustomWidth(1200)
        setCustomHeight(800)
        break
    }
  }

  const currentPresets = DEVICE_PRESETS[viewportMode]

  return (
    <Card className={cn('w-80', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Responsive Tester
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Viewport Mode Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Device Type</Label>
          <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
            <Button
              variant={viewportMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewportChange('mobile')}
              className="flex-1"
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile
            </Button>
            <Button
              variant={viewportMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewportChange('tablet')}
              className="flex-1"
            >
              <Tablet className="w-3 h-3 mr-1" />
              Tablet
            </Button>
            <Button
              variant={viewportMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewportChange('desktop')}
              className="flex-1"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Desktop
            </Button>
          </div>
        </div>

        {/* Device Presets */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Device Presets</Label>
          <Select value={selectedPreset} onValueChange={(value) => {
            const preset = currentPresets.find(p => p.name === value)
            if (preset) handlePresetSelect(preset)
          }}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Choose a device..." />
            </SelectTrigger>
            <SelectContent>
              {currentPresets.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name} ({preset.width}×{preset.height})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Dimensions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Custom Size</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefault}
              className="text-xs px-2 py-1 h-auto"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Width</Label>
              <Input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                className="text-xs"
                min="200"
                max="3000"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Height</Label>
              <Input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                className="text-xs"
                min="200"
                max="2000"
              />
            </div>
          </div>
        </div>

        {/* Width Slider */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Width: {customWidth}px</Label>
          <Slider
            value={[customWidth]}
            onValueChange={(value: number[]) => setCustomWidth(value[0])}
            max={viewportMode === 'mobile' ? 600 : viewportMode === 'tablet' ? 1200 : 3000}
            min={200}
            step={10}
            className="w-full"
          />
        </div>

        {/* Common Breakpoints Info */}
        <div className="text-xs text-gray-500 space-y-1 p-2 bg-gray-50 rounded">
          <div className="font-medium">Breakpoints:</div>
          <div>Mobile: &lt; 768px</div>
          <div>Tablet: 768px - 1024px</div>
          <div>Desktop: &gt; 1024px</div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Quick Tests</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCustomWidth(320)
                setCustomHeight(568)
                setSelectedPreset('iPhone SE')
              }}
              className="text-xs"
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Smallest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCustomWidth(1920)
                setCustomHeight(1080)
                setSelectedPreset('Full HD')
              }}
              className="text-xs"
            >
              <Maximize className="w-3 h-3 mr-1" />
              Large
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}