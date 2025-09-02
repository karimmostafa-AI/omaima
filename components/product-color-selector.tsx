"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Image from "next/image"
import { Product } from "@/types/product"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from "lucide-react"

// Predefined color palette with hex values (matches the admin form)
const COLOR_PALETTE = [
  { name: "Black", hex: "#000000" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Charcoal Grey", hex: "#36454F" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Burgundy", hex: "#800020" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#F5F5DC" },
  { name: "Light Grey", hex: "#D3D3D3" },
  { name: "Dark Green", hex: "#006400" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Maroon", hex: "#800000" },
  { name: "Beige", hex: "#F5F5DC" },
]

interface ProductColorSelectorProps {
  product: Product
  onColorChange?: (color: string) => void
  onSizeChange?: (size: string) => void
}

export function ProductColorSelector({ product, onColorChange, onSizeChange }: ProductColorSelectorProps) {
  const [selectedColor, setSelectedColor] = React.useState<string>(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = React.useState<string>(product.sizes?.[0] || "")
  const [currentImages, setCurrentImages] = React.useState<string[]>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)

  // Update images when color changes
  React.useEffect(() => {
    if (selectedColor && product.color_images?.[selectedColor]) {
      setCurrentImages(product.color_images[selectedColor])
    } else {
      // Fallback to general product images
      setCurrentImages(product.images || [])
    }
  }, [selectedColor, product])

  // Set initial color and notify parent
  React.useEffect(() => {
    if (product.colors?.[0] && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product.colors, selectedColor])

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName)
    onColorChange?.(colorName)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    onSizeChange?.(size)
  }

  const getColorHex = (colorName: string) => {
    return COLOR_PALETTE.find(c => c.name === colorName)?.hex || "#000000"
  }

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedImageIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <>
      {/* Left Column: Image Carousel */}
      <div className="space-y-4">
        <div className="relative">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {currentImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - ${selectedColor} - ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          {currentImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {/* Thumbnail Images */}
        {currentImages.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto">
            {currentImages.map((image, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? "border-primary" : "border-muted hover:border-primary"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${selectedColor} - ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Details */}
      <div className="space-y-8">
        {/* Product Title and Price */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-foreground">${product.price}</p>
              {selectedColor && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border" 
                    style={{ backgroundColor: getColorHex(selectedColor) }}
                  />
                  {selectedColor}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>
          <div className="text-base text-muted-foreground leading-relaxed">
            {product.description || "No description available."}
          </div>
        </div>

        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(colorName => {
                const colorHex = getColorHex(colorName)
                const isSelected = selectedColor === colorName
                const hasImages = (product.color_images?.[colorName]?.length || 0) > 0
                
                return (
                  <button
                    key={colorName}
                    onClick={() => handleColorSelect(colorName)}
                    className={`relative group flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary/30 scale-110' 
                          : 'border-muted-foreground'
                      }`}
                      style={{ backgroundColor: colorHex }}
                    />
                    <span className="text-sm font-medium">{colorName}</span>
                    {hasImages && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </button>
                )
              })}
            </div>
            {product.color_images?.[selectedColor] && (
              <p className="text-sm text-muted-foreground">
                {product.color_images[selectedColor].length} image(s) available for {selectedColor}
              </p>
            )}
          </div>
        )}

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <Button 
                  key={size} 
                  variant={selectedSize === size ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSizeSelect(size)}
                  className="min-w-[60px] h-12"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="pt-6">
          <AddToCartButton product={product} />
        </div>
      </div>
    </>
  )
}