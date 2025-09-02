"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { ShoppingCart, Ruler, Palette, Scissors, Star } from 'lucide-react'
import { Product } from '@/types/product'
import { SuitCustomizationData } from '@/types/customization'

interface SuitCustomizationBuilderProps {
  product: Product
  onCustomizationChange: (customization: SuitCustomizationData) => void
  onAddToCart: (customization: SuitCustomizationData, price: number) => void
}

const fabricOptions = [
  { id: 'wool-premium', name: 'Premium Wool', price: 0, composition: '100% Wool' },
  { id: 'wool-super120', name: 'Super 120s Wool', price: 50, composition: 'Super 120s Wool' },
  { id: 'cotton-blend', name: 'Cotton Blend', price: -30, composition: '65% Cotton, 35% Polyester' },
  { id: 'silk-blend', name: 'Silk Blend', price: 80, composition: '70% Silk, 30% Wool' }
]

const colorOptions = [
  { id: 'navy', name: 'Navy Blue', hex: '#000080', price: 0 },
  { id: 'charcoal', name: 'Charcoal Grey', hex: '#36454F', price: 0 },
  { id: 'black', name: 'Black', hex: '#000000', price: 0 },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', price: 20 },
  { id: 'dark-blue', name: 'Dark Blue', hex: '#00008B', price: 0 }
]

const styleOptions = {
  jacket_style: [
    { id: 'single-breasted', name: 'Single Breasted', price: 0 },
    { id: 'double-breasted', name: 'Double Breasted', price: 30 }
  ],
  lapel_style: [
    { id: 'notched', name: 'Notched Lapel', price: 0 },
    { id: 'peaked', name: 'Peaked Lapel', price: 25 },
    { id: 'shawl', name: 'Shawl Lapel', price: 40 }
  ],
  button_count: [
    { id: '1-button', name: '1 Button', price: 0 },
    { id: '2-button', name: '2 Button', price: 0 },
    { id: '3-button', name: '3 Button', price: 15 }
  ],
  vent_style: [
    { id: 'center-vent', name: 'Center Vent', price: 0 },
    { id: 'side-vents', name: 'Side Vents', price: 20 },
    { id: 'no-vent', name: 'No Vent', price: -10 }
  ]
}

const measurementFields = [
  { id: 'chest', name: 'Chest', description: 'Around the fullest part of your chest', required: true },
  { id: 'waist', name: 'Waist', description: 'Around your natural waistline', required: true },
  { id: 'hips', name: 'Hips', description: 'Around the fullest part of your hips', required: true },
  { id: 'shoulder_width', name: 'Shoulder Width', description: 'From shoulder point to shoulder point', required: true },
  { id: 'sleeve_length', name: 'Sleeve Length', description: 'From shoulder to wrist', required: true },
  { id: 'jacket_length', name: 'Jacket Length', description: 'From neck to desired length', required: true }
]

export function SuitCustomizationBuilder({ 
  product, 
  onCustomizationChange, 
  onAddToCart 
}: SuitCustomizationBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [customization, setCustomization] = useState<SuitCustomizationData>({
    style: {
      jacket_style: 'single-breasted',
      lapel_style: 'notched',
      button_count: '2-button',
      vent_style: 'center-vent'
    },
    fabric: {
      material_id: 'wool-premium',
      color_id: 'navy'
    },
    measurements: {
      measurement_type: 'suit',
      values: {},
      unit: 'inches'
    },
    details: {},
    fit_preferences: {
      fit_type: 'regular'
    }
  })

  const [totalPrice, setTotalPrice] = useState(product.price)
  const [completionProgress, setCompletionProgress] = useState(0)

  const steps = [
    { id: 'style', title: 'Style', icon: Scissors, description: 'Choose your preferred suit style' },
    { id: 'fabric', title: 'Fabric & Color', icon: Palette, description: 'Select fabric and color' },
    { id: 'measurements', title: 'Measurements', icon: Ruler, description: 'Provide your measurements' },
    { id: 'details', title: 'Details', icon: Star, description: 'Customize final details' }
  ]

  const calculatePrice = useCallback(() => {
    let price = product.price

    // Add fabric price modifier
    const selectedFabric = fabricOptions.find(f => f.id === customization.fabric.material_id)
    if (selectedFabric) price += selectedFabric.price

    // Add color price modifier
    const selectedColor = colorOptions.find(c => c.id === customization.fabric.color_id)
    if (selectedColor) price += selectedColor.price

    // Add style modifiers
    Object.entries(customization.style).forEach(([key, value]) => {
      const option = styleOptions[key as keyof typeof styleOptions]?.find(o => o.id === value)
      if (option) price += option.price
    })

    setTotalPrice(price)
  }, [customization, product.price])

  const calculateProgress = useCallback(() => {
    let progress = 0

    // Style step
    if (Object.values(customization.style).every(v => v)) progress += 25

    // Fabric step  
    if (customization.fabric.material_id && customization.fabric.color_id) progress += 25

    // Measurements step
    const requiredMeasurements = measurementFields.filter(f => f.required)
    const providedMeasurements = requiredMeasurements.filter(f => 
      customization.measurements.values[f.id] && customization.measurements.values[f.id] > 0
    )
    if (providedMeasurements.length === requiredMeasurements.length) progress += 25

    // Details step
    if (customization.fit_preferences.fit_type) progress += 25

    setCompletionProgress(progress)
  }, [customization])

  useEffect(() => {
    calculatePrice()
    calculateProgress()
    onCustomizationChange(customization)
  }, [customization, calculatePrice, calculateProgress, onCustomizationChange])

  const updateCustomization = (section: keyof SuitCustomizationData, data: any) => {
    setCustomization(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const updateMeasurement = (fieldId: string, value: number) => {
    setCustomization(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        values: {
          ...prev.measurements.values,
          [fieldId]: value
        }
      }
    }))
  }

  const handleAddToCart = () => {
    onAddToCart(customization, totalPrice)
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Style
        return Object.values(customization.style).every(v => v)
      case 1: // Fabric
        return customization.fabric.material_id && customization.fabric.color_id
      case 2: // Measurements
        const requiredMeasurements = measurementFields.filter(f => f.required)
        return requiredMeasurements.every(f => 
          customization.measurements.values[f.id] && customization.measurements.values[f.id] > 0
        )
      case 3: // Details
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Customize Your {product.name}</h1>
        <p className="text-muted-foreground text-center mb-4">
          Create a perfectly tailored suit designed just for you
        </p>
        <div className="flex justify-center mb-6">
          <Progress value={completionProgress} className="w-64" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Step Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Customization Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : index < currentStep 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <StepIcon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-75">{step.description}</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customizations</span>
                  <span>${(totalPrice - product.price).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={completionProgress < 100}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {steps[currentStep] && (
                  <>
                    <steps[currentStep].icon className="w-5 h-5" />
                    <span>{steps[currentStep].title}</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>{steps[currentStep]?.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Jacket Style</Label>
                    <RadioGroup 
                      value={customization.style.jacket_style}
                      onValueChange={(value) => updateCustomization('style', { jacket_style: value })}
                      className="grid grid-cols-2 gap-4 mt-3"
                    >
                      {styleOptions.jacket_style.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1">
                            <div className="font-medium">{option.name}</div>
                            {option.price > 0 && (
                              <div className="text-sm text-muted-foreground">+${option.price}</div>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Lapel Style</Label>
                    <RadioGroup 
                      value={customization.style.lapel_style}
                      onValueChange={(value) => updateCustomization('style', { lapel_style: value })}
                      className="grid grid-cols-2 gap-4 mt-3"
                    >
                      {styleOptions.lapel_style.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1">
                            <div className="font-medium">{option.name}</div>
                            {option.price > 0 && (
                              <div className="text-sm text-muted-foreground">+${option.price}</div>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Choose Fabric</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {fabricOptions.map((fabric) => (
                        <Card 
                          key={fabric.id}
                          className={`cursor-pointer transition-all ${
                            customization.fabric.material_id === fabric.id 
                              ? 'ring-2 ring-primary' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => updateCustomization('fabric', { material_id: fabric.id })}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                            <h3 className="font-medium">{fabric.name}</h3>
                            <p className="text-sm text-muted-foreground">{fabric.composition}</p>
                            {fabric.price !== 0 && (
                              <Badge variant={fabric.price > 0 ? "default" : "secondary"} className="mt-2">
                                {fabric.price > 0 ? `+$${fabric.price}` : `$${fabric.price}`}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Choose Color</Label>
                    <div className="grid grid-cols-5 gap-3 mt-3">
                      {colorOptions.map((color) => (
                        <div
                          key={color.id}
                          className={`aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                            customization.fabric.color_id === color.id 
                              ? 'border-primary shadow-lg scale-105' 
                              : 'border-muted hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => updateCustomization('fabric', { color_id: color.id })}
                          title={`${color.name} ${color.price > 0 ? `(+$${color.price})` : ''}`}
                        >
                          {customization.fabric.color_id === color.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {measurementFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={field.id} className="font-medium">
                            {field.name}
                          </Label>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                        <Input
                          id={field.id}
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          value={customization.measurements.values[field.id] || ''}
                          onChange={(e) => updateMeasurement(field.id, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold">Fit Preference</Label>
                    <RadioGroup 
                      value={customization.fit_preferences.fit_type}
                      onValueChange={(value: 'slim' | 'regular' | 'relaxed') => 
                        updateCustomization('fit_preferences', { fit_type: value })
                      }
                      className="grid grid-cols-3 gap-4 mt-3"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="slim" id="slim" />
                        <Label htmlFor="slim" className="flex-1">
                          <div className="font-medium">Slim Fit</div>
                          <div className="text-sm text-muted-foreground">Tailored and fitted</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="regular" id="regular" />
                        <Label htmlFor="regular" className="flex-1">
                          <div className="font-medium">Regular Fit</div>
                          <div className="text-sm text-muted-foreground">Classic fit</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="relaxed" id="relaxed" />
                        <Label htmlFor="relaxed" className="flex-1">
                          <div className="font-medium">Relaxed Fit</div>
                          <div className="text-sm text-muted-foreground">Comfortable and loose</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="lining-color" className="text-base font-semibold">Lining Color (Optional)</Label>
                    <Select 
                      value={customization.details.lining_color}
                      onValueChange={(value) => updateCustomization('details', { lining_color: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select lining color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matching">Matching Fabric</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="burgundy">Burgundy</SelectItem>
                        <SelectItem value="navy">Navy</SelectItem>
                        <SelectItem value="grey">Grey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="special-instructions" className="text-base font-semibold">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="special-instructions"
                      placeholder="Any specific requests or modifications..."
                      value={customization.measurements.notes || ''}
                      onChange={(e) => updateCustomization('measurements', { notes: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1 || !canProceedToNext()}
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
