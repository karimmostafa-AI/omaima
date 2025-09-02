import { getAllProducts } from "@/lib/supabase/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

// Client component for search functionality would go here if needed
function ProductsGrid({ products }: { products: any[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <Link href={`/products/${product.slug}`}>
              <div className="relative">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {product.category?.name || 'Professional'}
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Only {product.stock} left
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
            </Link>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-xl text-foreground">${product.price}</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>

              <div className="space-y-3">
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Colors:</span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 4).map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Sizes: {product.sizes.slice(0, 3).join(", ")}
                    {product.sizes.length > 3 && " ..."}
                  </div>
                )}
              </div>

              <Button 
                className="w-full" 
                disabled={product.stock === 0}
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  {product.stock > 0 ? 'View Details' : 'Out of Stock'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProductsLoading() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-0">
            <div className="aspect-[3/4] bg-muted rounded-t-lg" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-8 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  // Get unique categories for filter
  const categories = Array.from(
    new Set(products.map(p => p.category?.name).filter(Boolean))
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
          All Products
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover our complete collection of professional wear, from elegant suits to custom uniforms. 
          Find the perfect pieces to elevate your professional wardrobe.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search products..."
                className="w-full"
              />
            </div>
            
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category?.toLowerCase() || ''}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {products.length} products
          </div>
        </div>
      </div>

      {/* Quick Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="outline" className="bg-primary text-primary-foreground">
          All Products
        </Button>
        <Button variant="outline" asChild>
          <Link href="/suits">Suits</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/uniforms">Uniforms</Link>
        </Button>
        {categories.slice(0, 4).map((category) => (
          <Button key={category} variant="outline">
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <Suspense fallback={<ProductsLoading />}>
        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </Suspense>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-primary/5 rounded-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
          Need Something Custom?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Can't find exactly what you're looking for? We offer custom design services 
          for both individual pieces and bulk uniform orders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/contact">Request Custom Quote</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/mix-match">Try Mix & Match</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}