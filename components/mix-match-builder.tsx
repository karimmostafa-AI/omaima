"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, RotateCcw } from "lucide-react"

interface ClothingItem {
  id: string
  name: string
  category: string
  price: number
  colors: string[]
  sizes: string[]
  image: string
}

interface SelectedItem {
  item: ClothingItem
  color: string
  size: string
}

export function MixMatchBuilder() {
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({})
  const [activeCategory, setActiveCategory] = useState("blazers")

  const clothingItems: ClothingItem[] = [
    {
      id: "blazer-1",
      name: "Executive Blazer",
      category: "blazers",
      price: 199,
      colors: ["Navy", "Black", "Charcoal", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/elegant-navy-blue-business-blazer.png",
    },
    {
      id: "blazer-2",
      name: "Classic Blazer",
      category: "blazers",
      price: 179,
      colors: ["Black", "Navy", "Grey"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/elegant-navy-blue-business-blazer.png",
    },
    {
      id: "skirt-1",
      name: "Pencil Skirt",
      category: "skirts",
      price: 89,
      colors: ["Black", "Navy", "Charcoal"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/professional-pencil-skirt-suit.png",
    },
    {
      id: "skirt-2",
      name: "A-Line Skirt",
      category: "skirts",
      price: 79,
      colors: ["Navy", "Black", "Grey"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/professional-pencil-skirt-suit.png",
    },
    {
      id: "pants-1",
      name: "Straight Leg Trousers",
      category: "pants",
      price: 129,
      colors: ["Black", "Navy", "Charcoal", "Grey"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/modern-professional-pantsuit.png",
    },
    {
      id: "pants-2",
      name: "Wide Leg Trousers",
      category: "pants",
      price: 139,
      colors: ["Navy", "Black", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      image: "/modern-professional-pantsuit.png",
    },
  ]

  const categories = [
    { id: "blazers", name: "Blazers", required: true },
    { id: "skirts", name: "Skirts", required: false },
    { id: "pants", name: "Pants", required: false },
  ]

  const selectItem = (item: ClothingItem, color: string, size: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.category]: { item, color, size },
    }))
  }

  const removeItem = (category: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })
  }

  const clearAll = () => {
    setSelectedItems({})
  }

  const getTotalPrice = () => {
    return Object.values(selectedItems).reduce((total, selected) => total + selected.item.price, 0)
  }

  const getItemsByCategory = (category: string) => {
    return clothingItems.filter((item) => item.category === category)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Mix & Match Builder</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create your perfect professional look by mixing and matching our premium pieces
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="relative"
              >
                {category.name}
                {category.required && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                )}
                {selectedItems[category.id] && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {getItemsByCategory(activeCategory).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems[item.category]?.item.id === item.id}
                onSelect={selectItem}
              />
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Look
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(selectedItems).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Start building your look by selecting items</p>
              ) : (
                <>
                  {Object.entries(selectedItems).map(([category, selected]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{selected.item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {selected.color} • {selected.size}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-medium">${selected.item.price}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(category)}
                          className="h-6 px-2 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">${getTotalPrice()}</span>
                    </div>

                    <Button className="w-full" size="lg">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add Complete Look to Cart
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      Save This Look
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Style Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Style Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Mix textures and colors for a sophisticated look</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Ensure all pieces are the same size for the best fit</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Consider your workplace dress code when selecting colors</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ItemCardProps {
  item: ClothingItem
  isSelected: boolean
  onSelect: (item: ClothingItem, color: string, size: string) => void
}

function ItemCard({ item, isSelected, onSelect }: ItemCardProps) {
  const [selectedColor, setSelectedColor] = useState(item.colors[0])
  const [selectedSize, setSelectedSize] = useState(item.sizes[2]) // Default to M

  const handleSelect = () => {
    onSelect(item, selectedColor, selectedSize)
  }

  return (
    <Card className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary" : "hover:shadow-md"}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="font-bold text-lg">${item.price}</p>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {item.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSelect} variant={isSelected ? "secondary" : "default"} className="w-full" size="sm">
              {isSelected ? "Selected" : "Select This Piece"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
