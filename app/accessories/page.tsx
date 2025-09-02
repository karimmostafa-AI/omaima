import { getAllProducts } from "@/lib/supabase/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default async function AccessoriesPage() {
  const allProducts = await getAllProducts()
  
  // Filter for accessories or create mock accessories if none exist
  const accessories = allProducts.filter(product => 
    product.category?.name.toLowerCase().includes('accessories') ||
    product.name.toLowerCase().includes('belt') ||
    product.name.toLowerCase().includes('bag') ||
    product.name.toLowerCase().includes('jewelry') ||
    product.name.toLowerCase().includes('scarf')
  )

  // Mock accessories data if no accessories exist in database
  const mockAccessories = [
    {
      id: 'acc-1',
      name: 'Professional Leather Belt',
      slug: 'professional-leather-belt',
      description: 'Premium genuine leather belt with sleek metal buckle. Perfect complement to any professional outfit.',
      price: 89.99,
      images: ['/accessories/leather-belt.jpg'],
      colors: ['Black', 'Brown', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 25,
      category: { name: 'Accessories' }
    },
    {
      id: 'acc-2',
      name: 'Silk Professional Scarf',
      slug: 'silk-professional-scarf',
      description: 'Luxurious silk scarf with elegant patterns. Adds a sophisticated touch to any business attire.',
      price: 129.99,
      images: ['/accessories/silk-scarf.jpg'],
      colors: ['Navy & Gold', 'Black & Silver', 'Burgundy & Cream'],
      sizes: ['One Size'],
      stock: 18,
      category: { name: 'Accessories' }
    },
    {
      id: 'acc-3',
      name: 'Executive Handbag',
      slug: 'executive-handbag',
      description: 'Structured leather handbag with multiple compartments. Designed for the modern professional woman.',
      price: 299.99,
      images: ['/accessories/executive-handbag.jpg'],
      colors: ['Black', 'Cognac', 'Navy'],
      sizes: ['One Size'],
      stock: 12,
      category: { name: 'Accessories' }
    },
    {
      id: 'acc-4',
      name: 'Pearl Statement Necklace',
      slug: 'pearl-statement-necklace',
      description: 'Classic pearl necklace with modern twist. Perfect for adding elegance to professional looks.',
      price: 189.99,
      images: ['/accessories/pearl-necklace.jpg'],
      colors: ['White Pearl', 'Cream Pearl'],
      sizes: ['One Size'],
      stock: 20,
      category: { name: 'Accessories' }
    },
    {
      id: 'acc-5',
      name: 'Gold Professional Watch',
      slug: 'gold-professional-watch',
      description: 'Minimalist gold watch with leather strap. Timeless accessory for the professional wardrobe.',
      price: 399.99,
      images: ['/accessories/gold-watch.jpg'],
      colors: ['Gold & Black', 'Gold & Brown'],
      sizes: ['One Size'],
      stock: 8,
      category: { name: 'Accessories' }
    },
    {
      id: 'acc-6',
      name: 'Professional Earring Set',
      slug: 'professional-earring-set',
      description: 'Set of three versatile earring pairs. From subtle studs to elegant drops for any occasion.',
      price: 79.99,
      images: ['/accessories/earring-set.jpg'],
      colors: ['Gold', 'Silver', 'Rose Gold'],
      sizes: ['One Size'],
      stock: 30,
      category: { name: 'Accessories' }
    }
  ]

  const displayAccessories = accessories.length > 0 ? accessories : mockAccessories

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
              Professional Accessories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your professional look with our curated collection of sophisticated accessories. 
              From statement jewelry to essential handbags, find the perfect finishing touches for your wardrobe.
            </p>
          </div>
        </div>
      </div>

      {/* Accessories Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              All Accessories ({displayAccessories.length})
            </h2>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Free Shipping on $150+</Badge>
              <Badge variant="outline">30-Day Returns</Badge>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayAccessories.map((accessory) => (
            <Card key={accessory.id} className="group border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <Link href={`/products/${accessory.slug}`}>
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                      <Image
                        src={accessory.images?.[0] || "/placeholder.svg"}
                        alt={accessory.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {accessory.category?.name || 'Accessories'}
                    </div>
                    {accessory.stock <= 5 && accessory.stock > 0 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                        Only {accessory.stock} left
                      </div>
                    )}
                    {accessory.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Link href={`/products/${accessory.slug}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {accessory.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {accessory.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-foreground">${accessory.price}</span>
                    {accessory.stock > 0 ? (
                      <span className="text-sm text-green-600">In Stock</span>
                    ) : (
                      <span className="text-sm text-red-600">Out of Stock</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {accessory.colors && accessory.colors.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Colors:</span>
                        <div className="flex space-x-1">
                          {accessory.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-border bg-muted"
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {accessory.sizes && accessory.sizes.length > 0 && accessory.sizes[0] !== 'One Size' && (
                      <div className="text-xs text-muted-foreground">
                        Sizes: {accessory.sizes.join(", ")}
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={accessory.stock === 0}
                    asChild
                  >
                    <Link href={`/products/${accessory.slug}`}>
                      {accessory.stock > 0 ? 'View Details' : 'Out of Stock'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Shop by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">👜</span>
                </div>
                <h3 className="text-lg font-semibold">Handbags & Briefcases</h3>
                <p className="text-sm text-muted-foreground">Professional bags for every occasion</p>
              </CardContent>
            </Card>
            
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-lg font-semibold">Jewelry</h3>
                <p className="text-sm text-muted-foreground">Elegant pieces to complete your look</p>
              </CardContent>
            </Card>
            
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🕒</span>
                </div>
                <h3 className="text-lg font-semibold">Watches & Belts</h3>
                <p className="text-sm text-muted-foreground">Timeless accessories for the professional</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}