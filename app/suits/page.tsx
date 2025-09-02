import { getAllProducts } from "@/lib/supabase/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default async function SuitsPage() {
  const products = await getAllProducts()
  const suitProducts = products.filter(product => 
    product.category?.slug === 'formal-suits' || 
    product.name.toLowerCase().includes('suit')
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
          Professional Suits
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover our elegant collection of professional suits designed for the modern woman. 
          From classic business attire to contemporary cuts, find the perfect suit that embodies confidence and sophistication.
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="outline" className="bg-primary text-primary-foreground">
          All Suits
        </Button>
        <Button variant="outline">
          Pencil Skirts
        </Button>
        <Button variant="outline">
          Pantsuits
        </Button>
        <Button variant="outline">
          Blazer Sets
        </Button>
      </div>

      {/* Products Grid */}
      {suitProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suitProducts.map((product) => (
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
                      Professional
                    </div>
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
                          {product.colors.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Sizes: {product.sizes.join(", ")}
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
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No suits available</h3>
          <p className="text-muted-foreground">Check back soon for our latest collection.</p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-muted/30 rounded-lg p-8">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We offer custom tailoring services to create the perfect suit for your unique style and measurements.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Get Custom Quote</Link>
        </Button>
      </div>
    </div>
  )
}